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
  WorkerTypesQuery,
  WorkerTypesQueryResponse,
} from './__generated__/WorkerTypesQuery.graphql';

import AddEditWorkerTypeCard from './AddEditWorkerTypeCard';
import Button from '@symphony/design-system/components/Button';
import EducationNote from '@symphony/design-system/illustrations/EducationNote';
import EmptyStateBackdrop from '../comparison_view/EmptyStateBackdrop';
import FormActionWithPermissions from '../../common/FormActionWithPermissions';
import InventoryView from '../InventoryViewContainer';
import React, {useMemo, useState} from 'react';
import Table from '@symphony/design-system/components/Table/Table';
import fbt from 'fbt';
import withInventoryErrorBoundary from '../../common/withInventoryErrorBoundary';
import {LogEvents, ServerLogger} from '../../common/LoggingUtils';
import {TABLE_SORT_ORDER} from '@symphony/design-system/components/Table/TableContext';
import {graphql} from 'relay-runtime';
import {makeStyles} from '@material-ui/styles';
import {useLazyLoadQuery} from 'react-relay/hooks';

const useStyles = makeStyles(() => ({
  paper: {
    flexGrow: 1,
    overflowY: 'hidden',
  },
}));

const workerTypesQuery = graphql`
  query WorkerTypesQuery {
    workerTypes(first: 500) @connection(key: "Configure_workerTypes") {
      edges {
        node {
          id
          name
          description
          ...AddEditWorkerTypeCard_workerType
        }
      }
    }
  }
`;

type WorkerTypeEdge = $ElementType<
  $ElementType<
    $NonMaybeType<$ElementType<WorkerTypesQueryResponse, 'workerTypes'>>,
    'edges',
  >,
  number,
>;

type WorkerTypeNode = $NonMaybeType<$ElementType<WorkerTypeEdge, 'node'>>;

const WorkerTypes = () => {
  const classes = useStyles();
  const {
    workerTypes,
  }: WorkerTypesQueryResponse = useLazyLoadQuery<WorkerTypesQuery>(
    workerTypesQuery,
    {},
  );
  const [dialogKey, setDialogKey] = useState(0);
  const [showAddEditCard, setShowAddEditCard] = useState(false);
  const [editingWorkerType, setEditingWorkerType] = useState<?WorkerTypeNode>(
    null,
  );

  const tableData: Array<WorkerTypeNode> = useMemo(
    () =>
      (workerTypes?.edges ?? [])
        .map((edge: WorkerTypeEdge) => edge.node)
        .filter(Boolean),
    [workerTypes],
  );

  const onClose = () => {
    setEditingWorkerType(null);
    setDialogKey(key => key + 1);
    setShowAddEditCard(false);
  };

  const saveWorker = () => {
    ServerLogger.info(LogEvents.SAVE_WORKER_TYPE_BUTTON_CLICKED);
    onClose();
  };

  const showAddEditWorkerTypeCard = (wkType: ?WorkerTypeNode) => {
    ServerLogger.info(LogEvents.ADD_WORKER_TYPE_BUTTON_CLICKED);
    setEditingWorkerType(wkType);
    setShowAddEditCard(true);
  };

  if (showAddEditCard) {
    return (
      <div className={classes.paper}>
        <AddEditWorkerTypeCard
          key={'new_worker_type@' + dialogKey}
          open={showAddEditCard}
          onClose={onClose}
          onSave={saveWorker}
          workerType={editingWorkerType}
        />
      </div>
    );
  }
  return (
    <InventoryView
      header={{
        title: <fbt desc="">Worker Templates</fbt>,
        subtitle: (
          <fbt desc="">
            Create reusable templates for worker types. Worker templates are
            used in the action blocks.
          </fbt>
        ),
        actionButtons: [
          <FormActionWithPermissions
            permissions={{
              entity: 'automationTemplate',
              action: 'create',
            }}>
            <Button onClick={() => showAddEditWorkerTypeCard(null)}>
              <fbt desc="">Create Worker Template</fbt>
            </Button>
          </FormActionWithPermissions>,
        ],
      }}
      permissions={{
        entity: 'automationTemplate',
      }}>
      <Table
        data={tableData}
        columns={[
          {
            key: 'name',
            title: 'Worker template',
            render: (row: WorkerTypeNode) => (
              <Button
                useEllipsis={true}
                variant="text"
                onClick={() => showAddEditWorkerTypeCard(row)}>
                {row.name}
              </Button>
            ),
            getSortingValue: (row: WorkerTypeNode) => row.name,
          },
          {
            key: 'description',
            title: 'Description',
            render: (row: WorkerTypeNode) => row.description ?? '',
          },
        ]}
        sortSettings={{
          columnKey: 'name',
          order: TABLE_SORT_ORDER.ascending,
        }}
      />
      {!tableData.length && (
        <EmptyStateBackdrop
          illustration={<EducationNote />}
          headingText={`${fbt('Start creating worker templates', '')}`}>
          <Button key="2" onClick={() => showAddEditWorkerTypeCard(null)}>
            <fbt desc="">Create Worker Template</fbt>
          </Button>
        </EmptyStateBackdrop>
      )}
    </InventoryView>
  );
};

export default withInventoryErrorBoundary(WorkerTypes);
