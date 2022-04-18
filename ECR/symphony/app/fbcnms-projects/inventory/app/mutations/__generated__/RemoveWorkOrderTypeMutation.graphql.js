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
export type RemoveWorkOrderTypeMutationVariables = {|
  id: string
|};
export type RemoveWorkOrderTypeMutationResponse = {|
  +removeWorkOrderType: string
|};
export type RemoveWorkOrderTypeMutation = {|
  variables: RemoveWorkOrderTypeMutationVariables,
  response: RemoveWorkOrderTypeMutationResponse,
|};
*/


/*
mutation RemoveWorkOrderTypeMutation(
  $id: ID!
) {
  removeWorkOrderType(id: $id)
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
    "name": "removeWorkOrderType",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "RemoveWorkOrderTypeMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "RemoveWorkOrderTypeMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "75877a405e4cebc521c390abe927349d",
    "id": null,
    "metadata": {},
    "name": "RemoveWorkOrderTypeMutation",
    "operationKind": "mutation",
    "text": "mutation RemoveWorkOrderTypeMutation(\n  $id: ID!\n) {\n  removeWorkOrderType(id: $id)\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '6fec7c186557570f206537c12c607614';

module.exports = node;
