/**
 * @generated
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 **/

 /**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type ActionTypeId = "update_inventory" | "update_workforce" | "work_order" | "worker" | "%future added value";
export type EntryPointRole = "DEFAULT" | "%future added value";
export type ExitPointRole = "DECISION" | "DEFAULT" | "%future added value";
export type TriggerTypeId = "work_order" | "%future added value";
export type VariableExpressionType = "ChekListItemDefinition" | "DecisionDefinition" | "PropertyTypeDefinition" | "VariableDefinition" | "%future added value";
export type VariableType = "DATE" | "INT" | "LOCATION" | "PROJECT" | "STRING" | "USER" | "WORK_ORDER" | "WORK_ORDER_TYPE" | "%future added value";
export type ImportFlowDraftInput = {|
  id: string,
  name: string,
  description?: ?string,
  endParamDefinitions: $ReadOnlyArray<VariableDefinitionInput>,
  startBlock?: ?StartBlockInput,
  endBlocks?: ?$ReadOnlyArray<EndBlockInput>,
  decisionBlocks?: ?$ReadOnlyArray<DecisionBlockInput>,
  gotoBlocks?: ?$ReadOnlyArray<GotoBlockInput>,
  subflowBlocks?: ?$ReadOnlyArray<SubflowBlockInput>,
  triggerBlocks?: ?$ReadOnlyArray<TriggerBlockInput>,
  actionBlocks?: ?$ReadOnlyArray<ActionBlockInput>,
  trueFalseBlocks?: ?$ReadOnlyArray<TrueFalseBlockInput>,
  connectors?: ?$ReadOnlyArray<ConnectorInput>,
|};
export type VariableDefinitionInput = {|
  key: string,
  type: VariableType,
  mandatory?: ?boolean,
  multipleValues?: ?boolean,
  choices?: ?$ReadOnlyArray<string>,
  defaultValue?: ?string,
|};
export type StartBlockInput = {|
  cid: string,
  paramDefinitions: $ReadOnlyArray<VariableDefinitionInput>,
  uiRepresentation?: ?BlockUIRepresentationInput,
|};
export type BlockUIRepresentationInput = {|
  name: string,
  xPosition: number,
  yPosition: number,
|};
export type EndBlockInput = {|
  cid: string,
  params: $ReadOnlyArray<VariableExpressionInput>,
  uiRepresentation?: ?BlockUIRepresentationInput,
|};
export type VariableExpressionInput = {|
  type: VariableExpressionType,
  variableDefinitionKey?: ?string,
  propertyTypeId?: ?number,
  expression: string,
  blockVariables?: ?$ReadOnlyArray<BlockVariableInput>,
|};
export type BlockVariableInput = {|
  blockCid: string,
  type: VariableExpressionType,
  variableDefinitionKey?: ?string,
  propertyTypeId?: ?number,
  checkListItemDefinitionId?: ?number,
|};
export type DecisionBlockInput = {|
  cid: string,
  routes?: ?$ReadOnlyArray<DecisionRouteInput>,
  uiRepresentation?: ?BlockUIRepresentationInput,
|};
export type DecisionRouteInput = {|
  cid?: ?string,
  condition: VariableExpressionInput,
|};
export type GotoBlockInput = {|
  cid: string,
  targetBlockCid?: ?string,
  uiRepresentation?: ?BlockUIRepresentationInput,
|};
export type SubflowBlockInput = {|
  cid: string,
  flowId: string,
  params: $ReadOnlyArray<VariableExpressionInput>,
  uiRepresentation?: ?BlockUIRepresentationInput,
|};
export type TriggerBlockInput = {|
  cid: string,
  triggerType: TriggerTypeId,
  params: $ReadOnlyArray<VariableExpressionInput>,
  uiRepresentation?: ?BlockUIRepresentationInput,
|};
export type ActionBlockInput = {|
  cid: string,
  actionType: ActionTypeId,
  params: $ReadOnlyArray<VariableExpressionInput>,
  uiRepresentation?: ?BlockUIRepresentationInput,
|};
export type TrueFalseBlockInput = {|
  cid: string,
  uiRepresentation?: ?BlockUIRepresentationInput,
|};
export type ConnectorInput = {|
  sourceBlockCid: string,
  sourcePoint?: ?ExitPointInput,
  targetBlockCid: string,
  targetPoint?: ?EntryPointInput,
|};
export type ExitPointInput = {|
  role?: ?ExitPointRole,
  cid?: ?string,
|};
export type EntryPointInput = {|
  role?: ?EntryPointRole,
  cid?: ?string,
|};
export type ImportFlowDraftMutationVariables = {|
  input: ImportFlowDraftInput
|};
export type ImportFlowDraftMutationResponse = {|
  +importFlowDraft: {|
    +id: string,
    +name: string,
    +description: ?string,
    +blocks: $ReadOnlyArray<{|
      +cid: string,
      +details: {|
        +__typename: string
      |},
      +uiRepresentation: ?{|
        +name: string,
        +xPosition: number,
        +yPosition: number,
      |},
      +nextBlocks: $ReadOnlyArray<{|
        +cid: string,
        +uiRepresentation: ?{|
          +name: string,
          +xPosition: number,
          +yPosition: number,
        |},
      |}>,
    |}>,
  |}
|};
export type ImportFlowDraftMutation = {|
  variables: ImportFlowDraftMutationVariables,
  response: ImportFlowDraftMutationResponse,
|};
*/


/*
mutation ImportFlowDraftMutation(
  $input: ImportFlowDraftInput!
) {
  importFlowDraft(input: $input) {
    id
    name
    description
    blocks {
      cid
      details {
        __typename
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
        id
      }
      id
    }
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "description",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "cid",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "concreteType": null,
  "kind": "LinkedField",
  "name": "details",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "__typename",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "concreteType": "BlockUIRepresentation",
  "kind": "LinkedField",
  "name": "uiRepresentation",
  "plural": false,
  "selections": [
    (v3/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "xPosition",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "yPosition",
      "storageKey": null
    }
  ],
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ImportFlowDraftMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "FlowDraft",
        "kind": "LinkedField",
        "name": "importFlowDraft",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Block",
            "kind": "LinkedField",
            "name": "blocks",
            "plural": true,
            "selections": [
              (v5/*: any*/),
              (v6/*: any*/),
              (v7/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Block",
                "kind": "LinkedField",
                "name": "nextBlocks",
                "plural": true,
                "selections": [
                  (v5/*: any*/),
                  (v7/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ImportFlowDraftMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "FlowDraft",
        "kind": "LinkedField",
        "name": "importFlowDraft",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Block",
            "kind": "LinkedField",
            "name": "blocks",
            "plural": true,
            "selections": [
              (v5/*: any*/),
              (v6/*: any*/),
              (v7/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Block",
                "kind": "LinkedField",
                "name": "nextBlocks",
                "plural": true,
                "selections": [
                  (v5/*: any*/),
                  (v7/*: any*/),
                  (v2/*: any*/)
                ],
                "storageKey": null
              },
              (v2/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "d28e64343e27ecf670fe4e5086428f20",
    "id": null,
    "metadata": {},
    "name": "ImportFlowDraftMutation",
    "operationKind": "mutation",
    "text": "mutation ImportFlowDraftMutation(\n  $input: ImportFlowDraftInput!\n) {\n  importFlowDraft(input: $input) {\n    id\n    name\n    description\n    blocks {\n      cid\n      details {\n        __typename\n      }\n      uiRepresentation {\n        name\n        xPosition\n        yPosition\n      }\n      nextBlocks {\n        cid\n        uiRepresentation {\n          name\n          xPosition\n          yPosition\n        }\n        id\n      }\n      id\n    }\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '90f6f56a4c3591dacbc2f112b5a59c34';

module.exports = node;
