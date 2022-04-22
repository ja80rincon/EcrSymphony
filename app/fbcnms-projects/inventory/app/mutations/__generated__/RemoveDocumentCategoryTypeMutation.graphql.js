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
export type RemoveDocumentCategoryTypeMutationVariables = {|
  id: string
|};
export type RemoveDocumentCategoryTypeMutationResponse = {|
  +removeDocumentCategory: string
|};
export type RemoveDocumentCategoryTypeMutation = {|
  variables: RemoveDocumentCategoryTypeMutationVariables,
  response: RemoveDocumentCategoryTypeMutationResponse,
|};
*/


/*
mutation RemoveDocumentCategoryTypeMutation(
  $id: ID!
) {
  removeDocumentCategory(id: $id)
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
    "name": "removeDocumentCategory",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "RemoveDocumentCategoryTypeMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "RemoveDocumentCategoryTypeMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "316e1c5689a597d70304bd1b654023ae",
    "id": null,
    "metadata": {},
    "name": "RemoveDocumentCategoryTypeMutation",
    "operationKind": "mutation",
    "text": "mutation RemoveDocumentCategoryTypeMutation(\n  $id: ID!\n) {\n  removeDocumentCategory(id: $id)\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'd75e236eab9202630c47d269fb69a9b5';

module.exports = node;
