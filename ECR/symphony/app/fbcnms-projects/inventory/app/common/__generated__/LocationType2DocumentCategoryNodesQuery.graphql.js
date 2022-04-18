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
export type LocationType2DocumentCategoryNodesQueryVariables = {|
  ltID?: ?string
|};
export type LocationType2DocumentCategoryNodesQueryResponse = {|
  +documentCategories: ?{|
    +totalCount: number,
    +edges: $ReadOnlyArray<{|
      +node: ?{|
        +id: string,
        +name: ?string,
      |}
    |}>,
  |}
|};
export type LocationType2DocumentCategoryNodesQuery = {|
  variables: LocationType2DocumentCategoryNodesQueryVariables,
  response: LocationType2DocumentCategoryNodesQueryResponse,
|};
*/


/*
query LocationType2DocumentCategoryNodesQuery(
  $ltID: ID
) {
  documentCategories(locationTypeID: $ltID) {
    totalCount
    edges {
      node {
        id
        name
      }
    }
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "ltID"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "locationTypeID",
        "variableName": "ltID"
      }
    ],
    "concreteType": "DocumentCategoryConnection",
    "kind": "LinkedField",
    "name": "documentCategories",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "totalCount",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "DocumentCategoryEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "DocumentCategory",
            "kind": "LinkedField",
            "name": "node",
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
                "name": "name",
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
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
    "name": "LocationType2DocumentCategoryNodesQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "LocationType2DocumentCategoryNodesQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "0c7ffc29cd65eed21907e60ef5bacded",
    "id": null,
    "metadata": {},
    "name": "LocationType2DocumentCategoryNodesQuery",
    "operationKind": "query",
    "text": "query LocationType2DocumentCategoryNodesQuery(\n  $ltID: ID\n) {\n  documentCategories(locationTypeID: $ltID) {\n    totalCount\n    edges {\n      node {\n        id\n        name\n      }\n    }\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '0525eaabd8426d0297d331351b4ef4c1';

module.exports = node;
