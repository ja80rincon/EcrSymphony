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
export type ImageEntity = "CHECKLIST_ITEM" | "EQUIPMENT" | "LOCATION" | "SITE_SURVEY" | "USER" | "WORK_ORDER" | "%future added value";
export type AddImageInput = {|
  entityType: ImageEntity,
  entityId: string,
  imgKey: string,
  fileName: string,
  fileSize: number,
  modified: any,
  contentType: string,
  category?: ?string,
  annotation?: ?string,
|};
export type AddImageMutationVariables = {|
  input: AddImageInput
|};
export type AddImageMutationResponse = {|
  +addImage: {|
    +id: string,
    +storeKey: ?string,
  |}
|};
export type AddImageMutation = {|
  variables: AddImageMutationVariables,
  response: AddImageMutationResponse,
|};
*/


/*
mutation AddImageMutation(
  $input: AddImageInput!
) {
  addImage(input: $input) {
    id
    storeKey
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input",
    "type": "AddImageInput!"
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
    "concreteType": "File",
    "kind": "LinkedField",
    "name": "addImage",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "storeKey",
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
    "name": "AddImageMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation"
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "AddImageMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": null,
    "metadata": {},
    "name": "AddImageMutation",
    "operationKind": "mutation",
    "text": "mutation AddImageMutation(\n  $input: AddImageInput!\n) {\n  addImage(input: $input) {\n    id\n    storeKey\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '616dec9625f7c43759f074f3f680df11';

module.exports = node;
