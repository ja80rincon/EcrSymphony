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
export type RemoveProjectMutationVariables = {|
  id: string
|};
export type RemoveProjectMutationResponse = {|
  +deleteProject: boolean
|};
export type RemoveProjectMutation = {|
  variables: RemoveProjectMutationVariables,
  response: RemoveProjectMutationResponse,
|};
*/


/*
mutation RemoveProjectMutation(
  $id: ID!
) {
  deleteProject(id: $id)
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
    "name": "deleteProject",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "RemoveProjectMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "RemoveProjectMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "c843a2d8671a62e56fe15c9435d570b7",
    "id": null,
    "metadata": {},
    "name": "RemoveProjectMutation",
    "operationKind": "mutation",
    "text": "mutation RemoveProjectMutation(\n  $id: ID!\n) {\n  deleteProject(id: $id)\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '7424ca24008e15a923f89b3fbc822395';

module.exports = node;
