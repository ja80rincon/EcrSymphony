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
export type RemoveWorkOrderMutationVariables = {|
  id: string
|};
export type RemoveWorkOrderMutationResponse = {|
  +removeWorkOrder: string
|};
export type RemoveWorkOrderMutation = {|
  variables: RemoveWorkOrderMutationVariables,
  response: RemoveWorkOrderMutationResponse,
|};
*/


/*
mutation RemoveWorkOrderMutation(
  $id: ID!
) {
  removeWorkOrder(id: $id)
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
    "name": "removeWorkOrder",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "RemoveWorkOrderMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "RemoveWorkOrderMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "9275f281fe4faed77067df0bc4400140",
    "id": null,
    "metadata": {},
    "name": "RemoveWorkOrderMutation",
    "operationKind": "mutation",
    "text": "mutation RemoveWorkOrderMutation(\n  $id: ID!\n) {\n  removeWorkOrder(id: $id)\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '48a499f7eec8a47bc7b909821951fe45';

module.exports = node;
