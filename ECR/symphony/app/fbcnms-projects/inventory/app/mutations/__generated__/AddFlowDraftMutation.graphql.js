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
export type VariableType = "DATE" | "INT" | "LOCATION" | "PROJECT" | "STRING" | "USER" | "WORK_ORDER" | "WORK_ORDER_TYPE" | "%future added value";
export type AddFlowDraftInput = {|
  name: string,
  description?: ?string,
  flowID?: ?string,
  endParamDefinitions: $ReadOnlyArray<VariableDefinitionInput>,
|};
export type VariableDefinitionInput = {|
  key: string,
  type: VariableType,
  mandatory?: ?boolean,
  multipleValues?: ?boolean,
  choices?: ?$ReadOnlyArray<string>,
  defaultValue?: ?string,
|};
export type AddFlowDraftMutationVariables = {|
  input: AddFlowDraftInput
|};
export type AddFlowDraftMutationResponse = {|
  +addFlowDraft: {|
    +id: string
  |}
|};
export type AddFlowDraftMutation = {|
  variables: AddFlowDraftMutationVariables,
  response: AddFlowDraftMutationResponse,
|};
*/


/*
mutation AddFlowDraftMutation(
  $input: AddFlowDraftInput!
) {
  addFlowDraft(input: $input) {
    id
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
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "FlowDraft",
    "kind": "LinkedField",
    "name": "addFlowDraft",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "AddFlowDraftMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "AddFlowDraftMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "f67968a869497751c53e42fb2cab3128",
    "id": null,
    "metadata": {},
    "name": "AddFlowDraftMutation",
    "operationKind": "mutation",
    "text": "mutation AddFlowDraftMutation(\n  $input: AddFlowDraftInput!\n) {\n  addFlowDraft(input: $input) {\n    id\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '2a03ddebdf4f40d66801512eda972102';

module.exports = node;
