/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {
  FlowDataContext_FlowDraftQuery,
  FlowDataContext_FlowDraftQueryResponse,
} from './__generated__/FlowDataContext_FlowDraftQuery.graphql';
import type {FragmentReference} from 'relay-runtime';
import type {
  ImportFlowDraftInput,
  ImportFlowDraftMutationResponse,
} from '../../../../mutations/__generated__/ImportFlowDraftMutation.graphql';
import type {
  PublishFlowInput,
  PublishFlowMutationResponse,
} from '../../../../mutations/__generated__/PublishFlowMutation.graphql';

import * as React from 'react';
import BaseBlock from '../builder/canvas/graph/shapes/blocks/BaseBlock.js';
import fbt from 'fbt';
import withInventoryErrorBoundary from '../../../../common/withInventoryErrorBoundary';
import {
  ACTION_TYPE_ID as CreateWorkorderActionTypeID,
  TYPE as CreateWorkorderType,
} from '../builder/canvas/graph/facades/shapes/vertexes/actions/CreateWorkorder';
import {TYPE as DecisionType} from '../builder/canvas/graph/facades/shapes/vertexes/logic/Decision';
import {TYPE as EndType} from '../builder/canvas/graph/facades/shapes/vertexes/administrative/End';
import {Events} from '../builder/canvas/graph/facades/Helpers.js';
import {TYPE as GoToType} from '../builder/canvas/graph/facades/shapes/vertexes/logic/GoTo';
import {InventoryAPIUrls} from '../../../../common/InventoryAPI';
import {LogEvents, ServerLogger} from '../../../../common/LoggingUtils';
import {TYPE as ManualStartType} from '../builder/canvas/graph/facades/shapes/vertexes/administrative/ManualStart';
import {
  TYPE as TriggerWorkforceBlockType,
  TRIGGER_TYPE_ID as TriggerWorkforceTriggerTypeID,
} from '../builder/canvas/graph/facades/shapes/vertexes/triggers/TriggerWorkforce';
import {TYPE as TrueFalseType} from '../builder/canvas/graph/facades/shapes/vertexes/logic/TrueFalse';
import {
  ACTION_TYPE_ID as UpdateInventoryActionTypeID,
  TYPE as UpdateInventoryBlockType,
} from '../builder/canvas/graph/facades/shapes/vertexes/actions/UpdateInventory';
import {
  ACTION_TYPE_ID as UpdateWorkforceActionTypeID,
  TYPE as UpdateWorkforceBlockType,
} from '../builder/canvas/graph/facades/shapes/vertexes/actions/UpdateWorkforce';
import {
  getActionType,
  getTriggerType,
} from '../builder/canvas/graph/facades/shapes/vertexes/actions/utils';
import {graphql} from 'react-relay';
import {
  hasMeaningfulChanges,
  mapActionBlocksForSave,
  mapConnectorsForSave,
  mapDecisionBlockForSave,
  mapEndBlockForSave,
  mapGoToBlockForSave,
  mapStartBlockForSave,
  mapTriggerBlocksForSave,
  mapTrueFalseBlockForSave,
  publishFlow,
  saveFlowDraft,
} from './flowDataUtils';
import {useCallback, useContext, useEffect} from 'react';
import {useEnqueueSnackbar} from '@fbcnms/ui/hooks/useSnackbar';
import {useGraph} from '../builder/canvas/graph/graphAPIContext/GraphContext';
import {useHistory} from 'react-router-dom';
import {useLazyLoadQuery} from 'react-relay/hooks';
import {useRef, useState} from 'react';

type FlowDraftResponse = $ElementType<
  FlowDataContext_FlowDraftQueryResponse,
  'flowDraft',
>;

type FlowSettingsUpdateType = ?{
  name?: ?string,
  description?: ?string,
};

export type FlowDataContextType = $ReadOnly<{|
  flowDraft: FlowDraftResponse,
  hasChanges: boolean,
  save: (
    flowSettingsUpdate?: FlowSettingsUpdateType,
  ) => Promise<ImportFlowDraftMutationResponse>,
  publish: () => Promise<PublishFlowMutationResponse>,
|}>;

const FlowDataContextDefaults = {
  flowDraft: null,
  hasChanges: false,
  save: () => Promise.reject(),
  publish: () => Promise.reject(),
};

const FlowDataContext = React.createContext<FlowDataContextType>(
  FlowDataContextDefaults,
);

const flowQuery = graphql`
  query FlowDataContext_FlowDraftQuery($flowId: ID!) {
    flowDraft: node(id: $flowId) {
      ... on FlowDraft {
        id
        name
        description
        blocks {
          cid
          details {
            __typename
            ... on ActionBlock {
              actionType {
                id
              }
            }
            ... on TriggerBlock {
              triggerType {
                id
              }
            }
          }
          uiRepresentation {
            name
            xPosition
            yPosition
          }
          nextBlocks {
            cid
            uiRepresentation {
              name
              xPosition
              yPosition
            }
          }
        }
        ...FlowHeader_flowDraft
      }
    }
  }
`;
type Props = $ReadOnly<{|
  flowId: ?string,
  children: React.Node,
|}>;

function FlowDataContextProviderComponent(props: Props) {
  const {flowId} = props;
  const [hasChanges, setHasChanges] = useState(false);
  const {flowDraft} = useLazyLoadQuery<FlowDataContext_FlowDraftQuery>(
    flowQuery,
    {
      flowId: flowId ?? '',
    },
  );

  const enqueueSnackbar = useEnqueueSnackbar();
  const handleError = useCallback(
    (error: string) => {
      enqueueSnackbar(error, {variant: 'error'});
    },
    [enqueueSnackbar],
  );

  const history = useHistory();
  const flow = useGraph();

  useEffect(() => {
    if (flowId != null && flowDraft == null) {
      handleError(
        `${fbt(
          `Flow with id ${fbt.param(
            'flow id url param',
            flowId,
          )} does not exist.`,
          '',
        )}`,
      );
      history.replace(InventoryAPIUrls.flows());
    }
  }, [flowId, flowDraft, handleError, history]);

  const loadBlocksIntoGraph = useCallback(
    blocks => {
      const errors: Array<{id: string, name: string}> = [];
      blocks.forEach(block => {
        const createdBlock = createBlock(block, flow);
        if (!(createdBlock instanceof BaseBlock)) {
          errors.push({
            id: block.cid,
            name: block.uiRepresentation?.name ?? '',
          });
        }
      });

      const {logMessage, clientMessage} = getErrorMessages(errors, blocks);

      if (errors.length > 0) {
        ServerLogger.error(LogEvents.LOAD_BLOCK_ERROR, {
          message: logMessage,
        });
        enqueueSnackbar(clientMessage, {
          variant: 'error',
        });
      }
    },
    [flow, enqueueSnackbar],
  );

  const loadConnectorsIntoGraph = useCallback(
    blocks => {
      blocks.forEach(block => {
        block.nextBlocks.forEach(nextBlock => {
          const source = flow.getBlock(block.cid);
          const target = flow.getBlock(nextBlock.cid);
          if (source == null || target == null) {
            return;
          }
          flow.addConnector(source, target);
        });
      });
    },
    [flow],
  );

  const isLoaded = useRef(false);
  useEffect(() => {
    if (isLoaded.current) {
      return;
    }

    flow.clearGraph();

    if (flowDraft?.blocks == null) {
      return;
    }

    const blocks = [...flowDraft.blocks];
    loadBlocksIntoGraph(blocks);
    loadConnectorsIntoGraph(blocks);

    isLoaded.current = true;

    return flow.onGraphEvent(Events.Graph.OnChange, shape => {
      if (!hasMeaningfulChanges(shape)) {
        return;
      }
      setHasChanges(true);
    });
  }, [flow, flowDraft, loadBlocksIntoGraph, loadConnectorsIntoGraph]);

  const save = useCallback(
    (flowSettingsUpdate: FlowSettingsUpdateType) => {
      if (flowDraft == null) {
        return Promise.reject('There was not flowDraftData to save.');
      }

      const flowData: ImportFlowDraftInput = {
        id: flowDraft.id ?? '',
        name:
          flowSettingsUpdate?.name != null
            ? flowSettingsUpdate.name
            : flowDraft.name ?? '',
        description:
          flowSettingsUpdate?.description != null
            ? flowSettingsUpdate.description
            : flowDraft.description ?? '',
        endParamDefinitions: [],
      };

      const connectors = flow.getConnectors().map(mapConnectorsForSave);
      const startBlocks = flow
        .getBlocksByType(ManualStartType)
        .map(mapStartBlockForSave);
      const decisionBlocks = flow
        .getBlocksByType(DecisionType)
        .map(mapDecisionBlockForSave);
      const gotoBlocks = flow
        .getBlocksByType(GoToType)
        .map(mapGoToBlockForSave);
      const trueFalseBlocks = flow
        .getBlocksByType(TrueFalseType)
        .map(mapTrueFalseBlockForSave);

      // Action Blocks
      const updateInventoryBlocks = flow
        .getBlocksByType(UpdateInventoryBlockType)
        .map(block =>
          mapActionBlocksForSave(block, UpdateInventoryActionTypeID),
        );
      const updateWorkforceBlocks = flow
        .getBlocksByType(UpdateWorkforceBlockType)
        .map(block =>
          mapActionBlocksForSave(block, UpdateWorkforceActionTypeID),
        );
      const createWorkOrderBlocks = flow
        .getBlocksByType(CreateWorkorderType)
        .map(block =>
          mapActionBlocksForSave(block, CreateWorkorderActionTypeID),
        );

      const actionBlocks = [
        ...createWorkOrderBlocks,
        ...updateInventoryBlocks,
        ...updateWorkforceBlocks,
      ];

      // TriggerBlocks
      const triggerWorkforceBlocks = flow
        .getBlocksByType(TriggerWorkforceBlockType)
        .map(block =>
          mapTriggerBlocksForSave(block, TriggerWorkforceTriggerTypeID),
        );

      const triggerBlocks = [...triggerWorkforceBlocks];
      const endBlocks = flow.getBlocksByType(EndType).map(mapEndBlockForSave);

      if (startBlocks.length > 0) {
        flowData.startBlock = startBlocks[0];
      }

      if (endBlocks.length > 0) {
        flowData.endBlocks = endBlocks;
      }

      if (actionBlocks.length > 0) {
        flowData.actionBlocks = actionBlocks;
      }

      if (triggerBlocks.length > 0) {
        flowData.triggerBlocks = triggerBlocks;
      }

      if (decisionBlocks.length > 0) {
        flowData.decisionBlocks = decisionBlocks;
      }

      if (gotoBlocks.length > 0) {
        flowData.gotoBlocks = gotoBlocks;
      }

      if (trueFalseBlocks.length > 0) {
        flowData.trueFalseBlocks = trueFalseBlocks;
      }

      if (connectors.length > 0) {
        flowData.connectors = connectors;
      }

      const savePromise = saveFlowDraft(flowData);

      savePromise.then(() => setHasChanges(false));

      return savePromise;
    },
    [flow, flowDraft],
  );

  const publish = useCallback(() => {
    if (flowDraft == null) {
      return Promise.reject('There was no flowDraft to publish.');
    }
    const flowData: PublishFlowInput = {
      flowDraftID: flowDraft.id ?? '',
      flowInstancesPolicy: 'ENABLED',
    };
    return publishFlow(flowData);
  }, [flowDraft]);

  return (
    <FlowDataContext.Provider value={{flowDraft, hasChanges, save, publish}}>
      {props.children}
    </FlowDataContext.Provider>
  );
}

export const FlowDataContextProvider = withInventoryErrorBoundary(
  FlowDataContextProviderComponent,
);

export function useFlowData() {
  return useContext(FlowDataContext);
}

type ComponentProps<T> = {|
  flowDraft: ?FlowDraftResponse,
  ...T,
|};

export function withFlowData<
  TComponent: React.ComponentType<ComponentProps<*>>,
>(Component: TComponent): React.ComponentType<React.ElementConfig<TComponent>> {
  return class extends React.Component<React.ElementConfig<TComponent>> {
    render(): React.Node {
      return (
        <FlowDataContext.Consumer>
          {data => <Component {...this.props} flowDraft={data.flowDraft} />}
        </FlowDataContext.Consumer>
      );
    }
  };
}

export type WithFlowData<T: {+$refType: FragmentReference}> = {
  flowDraft?: T,
};

export default FlowDataContext;

function createBlock(block, flow) {
  let blockType = block.details.__typename;

  if (block.details.actionType) {
    blockType = getActionType(block.details.actionType.id);
  }

  if (block.details.triggerType) {
    blockType = getTriggerType(block.details.triggerType.id);
  }

  return flow.addBlock(blockType, {
    id: block.cid,
    text: block.uiRepresentation?.name ?? '',
    position: {
      x: block.uiRepresentation?.xPosition ?? 0,
      y: block.uiRepresentation?.yPosition ?? 0,
    },
  });
}

function getErrorMessages(errors, blocks) {
  let logMessage = '';
  let clientMessage = '';
  if (errors.length === 1) {
    logMessage = `Failed loading Block cid: ${errors[0].id}.`;
    clientMessage = `Failed loading Block: ${errors[0].name}.`;
  } else if (errors.length > 1) {
    if (errors.length === blocks.length) {
      logMessage = `failed to load flow Blocks.`;
      clientMessage = 'Flow Blocks failed to get loaded.';
    } else {
      logMessage = `Blocks with cids ${errors
        .map(el => el.id)
        .toString()} failed to load.`;
      clientMessage = 'Some Blocks failed to get loaded.';
    }
  }

  return {logMessage, clientMessage};
}
