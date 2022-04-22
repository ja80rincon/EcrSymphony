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
export type RemoveKpiMutationVariables = {|
  id: string
|};
export type RemoveKpiMutationResponse = {|
  +removeKpi: string
|};
export type RemoveKpiMutation = {|
  variables: RemoveKpiMutationVariables,
  response: RemoveKpiMutationResponse,
|};
*/


/*
mutation RemoveKpiMutation(
  $id: ID!
) {
  removeKpi(id: $id)
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "id",
        "variableName": "id"
      }
    ],
    "kind": "ScalarField",
    "name": "removeKpi",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "RemoveKpiMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "RemoveKpiMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "7bb47e23d0ba45fbf0a30d5398889d92",
    "id": null,
    "metadata": {},
    "name": "RemoveKpiMutation",
    "operationKind": "mutation",
    "text": "mutation RemoveKpiMutation(\n  $id: ID!\n) {\n  removeKpi(id: $id)\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'cc7d7eb95c2f8f8fb6edd0fc121c7ebb';

module.exports = node;
