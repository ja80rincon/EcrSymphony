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
export type LocationsTreeQueryVariables = {||};
export type LocationsTreeQueryResponse = {|
  +locations: ?{|
    +edges: $ReadOnlyArray<{|
      +node: ?{|
        +id: string,
        +externalId: ?string,
        +name: string,
        +locationType: {|
          +id: string,
          +name: string,
        |},
        +numChildren: number,
        +siteSurveyNeeded: boolean,
      |}
    |}>
  |}
|};
export type LocationsTreeQuery = {|
  variables: LocationsTreeQueryVariables,
  response: LocationsTreeQueryResponse,
|};
*/


/*
query LocationsTreeQuery {
  locations(first: 500, onlyTopLevel: true) {
    edges {
      node {
        id
        externalId
        name
        locationType {
          id
          name
        }
        numChildren
        siteSurveyNeeded
        __typename
      }
      cursor
    }
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = {
  "kind": "Literal",
  "name": "onlyTopLevel",
  "value": true
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v3 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "LocationEdge",
    "kind": "LinkedField",
    "name": "edges",
    "plural": true,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Location",
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "externalId",
            "storageKey": null
          },
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "LocationType",
            "kind": "LinkedField",
            "name": "locationType",
            "plural": false,
            "selections": [
              (v1/*: any*/),
              (v2/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "numChildren",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "siteSurveyNeeded",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "__typename",
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "cursor",
        "storageKey": null
      }
    ],
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "concreteType": "PageInfo",
    "kind": "LinkedField",
    "name": "pageInfo",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "endCursor",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "hasNextPage",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
],
v4 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 500
  },
  (v0/*: any*/)
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "LocationsTreeQuery",
    "selections": [
      {
        "alias": "locations",
        "args": [
          (v0/*: any*/)
        ],
        "concreteType": "LocationConnection",
        "kind": "LinkedField",
        "name": "__LocationsTree_locations_connection",
        "plural": false,
        "selections": (v3/*: any*/),
        "storageKey": "__LocationsTree_locations_connection(onlyTopLevel:true)"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "LocationsTreeQuery",
    "selections": [
      {
        "alias": null,
        "args": (v4/*: any*/),
        "concreteType": "LocationConnection",
        "kind": "LinkedField",
        "name": "locations",
        "plural": false,
        "selections": (v3/*: any*/),
        "storageKey": "locations(first:500,onlyTopLevel:true)"
      },
      {
        "alias": null,
        "args": (v4/*: any*/),
        "filters": [
          "onlyTopLevel"
        ],
        "handle": "connection",
        "key": "LocationsTree_locations",
        "kind": "LinkedHandle",
        "name": "locations"
      }
    ]
  },
  "params": {
    "cacheID": "7b59bb2b09addc228e904a502c365cf9",
    "id": null,
    "metadata": {
      "connection": [
        {
          "count": null,
          "cursor": null,
          "direction": "forward",
          "path": [
            "locations"
          ]
        }
      ]
    },
    "name": "LocationsTreeQuery",
    "operationKind": "query",
    "text": "query LocationsTreeQuery {\n  locations(first: 500, onlyTopLevel: true) {\n    edges {\n      node {\n        id\n        externalId\n        name\n        locationType {\n          id\n          name\n        }\n        numChildren\n        siteSurveyNeeded\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '2517b7f9d3b38afe85f3ccd710326689';

module.exports = node;
