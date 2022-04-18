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
type PhotosSection_images$ref = any;
export type LocationDocumentsScreenDocumentsQueryVariables = {|
  locationId: string
|};
export type LocationDocumentsScreenDocumentsQueryResponse = {|
  +node: ?{|
    +images?: $ReadOnlyArray<?{|
      +$fragmentRefs: PhotosSection_images$ref
    |}>
  |}
|};
export type LocationDocumentsScreenDocumentsQuery = {|
  variables: LocationDocumentsScreenDocumentsQueryVariables,
  response: LocationDocumentsScreenDocumentsQueryResponse,
|};
*/


/*
query LocationDocumentsScreenDocumentsQuery(
  $locationId: ID!
) {
  node(id: $locationId) {
    __typename
    ... on Location {
      images {
        ...PhotosSection_images
        id
      }
    }
    id
  }
}

fragment PhotosSection_images on File {
  id
  storeKey
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "locationId",
    "type": "ID!"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "locationId"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "LocationDocumentsScreenDocumentsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "File",
                "kind": "LinkedField",
                "name": "images",
                "plural": true,
                "selections": [
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "PhotosSection_images"
                  }
                ],
                "storageKey": null
              }
            ],
            "type": "Location"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query"
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "LocationDocumentsScreenDocumentsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "__typename",
            "storageKey": null
          },
          (v2/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "File",
                "kind": "LinkedField",
                "name": "images",
                "plural": true,
                "selections": [
                  (v2/*: any*/),
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
            ],
            "type": "Location"
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": null,
    "metadata": {},
    "name": "LocationDocumentsScreenDocumentsQuery",
    "operationKind": "query",
    "text": "query LocationDocumentsScreenDocumentsQuery(\n  $locationId: ID!\n) {\n  node(id: $locationId) {\n    __typename\n    ... on Location {\n      images {\n        ...PhotosSection_images\n        id\n      }\n    }\n    id\n  }\n}\n\nfragment PhotosSection_images on File {\n  id\n  storeKey\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '1b67c3c570bc5725f112fb215045a01b';

module.exports = node;
