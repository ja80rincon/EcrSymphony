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
export type RemoveProjectTypeMutationVariables = {|
  id: string
|};
export type RemoveProjectTypeMutationResponse = {|
  +deleteProjectType: boolean
|};
export type RemoveProjectTypeMutation = {|
  variables: RemoveProjectTypeMutationVariables,
  response: RemoveProjectTypeMutationResponse,
|};
*/


/*
mutation RemoveProjectTypeMutation(
  $id: ID!
) {
  deleteProjectType(id: $id)
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
    "name": "deleteProjectType",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "RemoveProjectTypeMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "RemoveProjectTypeMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "07de65e94f933fc5d83aa32e8d83e6f2",
    "id": null,
    "metadata": {},
    "name": "RemoveProjectTypeMutation",
    "operationKind": "mutation",
    "text": "mutation RemoveProjectTypeMutation(\n  $id: ID!\n) {\n  deleteProjectType(id: $id)\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '9ef2120c80fef6893e62a26dce1feb23';

module.exports = node;
