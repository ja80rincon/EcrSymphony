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
export type EditPropertyCategoryInput = {|
  id?: ?string,
  name: string,
  index: number,
  parameterCatalogId: string,
|};
export type EditPropertyCategoryTypeMutationVariables = {|
  propertyCategories: $ReadOnlyArray<EditPropertyCategoryInput>
|};
export type EditPropertyCategoryTypeMutationResponse = {|
  +editPropertyCategories: ?$ReadOnlyArray<{|
    +id: string,
    +name: ?string,
    +index: ?number,
    +numberOfProperties: ?number,
  |}>
|};
export type EditPropertyCategoryTypeMutation = {|
  variables: EditPropertyCategoryTypeMutationVariables,
  response: EditPropertyCategoryTypeMutationResponse,
|};
*/


/*
mutation EditPropertyCategoryTypeMutation(
  $propertyCategories: [EditPropertyCategoryInput!]!
) {
  editPropertyCategories(propertyCategories: $propertyCategories) {
    id
    name
    index
    numberOfProperties
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "propertyCategories"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "propertyCategories",
        "variableName": "propertyCategories"
      }
    ],
    "concreteType": "PropertyCategory",
    "kind": "LinkedField",
    "name": "editPropertyCategories",
    "plural": true,
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
        "name": "name",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "index",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "numberOfProperties",
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
    "name": "EditPropertyCategoryTypeMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "EditPropertyCategoryTypeMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "bda00e530ccd9912ec45571bebd498e3",
    "id": null,
    "metadata": {},
    "name": "EditPropertyCategoryTypeMutation",
    "operationKind": "mutation",
    "text": "mutation EditPropertyCategoryTypeMutation(\n  $propertyCategories: [EditPropertyCategoryInput!]!\n) {\n  editPropertyCategories(propertyCategories: $propertyCategories) {\n    id\n    name\n    index\n    numberOfProperties\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'ac22a42c88fd1c3fb21a7f8eb734967a';

module.exports = node;
