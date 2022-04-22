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
type LocationListItem_location$ref = any;
export type LocationsScreenSitesAroundMeQueryVariables = {|
  latitude: number,
  longitude: number,
|};
export type LocationsScreenSitesAroundMeQueryResponse = {|
  +nearestSites: $ReadOnlyArray<{|
    +id: string,
    +name: string,
    +locationType: {|
      +id: string,
      +name: string,
    |},
    +distanceKm: number,
    +$fragmentRefs: LocationListItem_location$ref,
  |}>
|};
export type LocationsScreenSitesAroundMeQuery = {|
  variables: LocationsScreenSitesAroundMeQueryVariables,
  response: LocationsScreenSitesAroundMeQueryResponse,
|};
*/


/*
query LocationsScreenSitesAroundMeQuery(
  $latitude: Float!
  $longitude: Float!
) {
  nearestSites(latitude: $latitude, longitude: $longitude, first: 20) {
    id
    name
    locationType {
      id
      name
    }
    distanceKm(latitude: $latitude, longitude: $longitude)
    ...LocationListItem_location
  }
}

fragment LocationListItem_location on Location {
  id
  name
  locationHierarchy {
    id
    name
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "latitude",
    "type": "Float!"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "longitude",
    "type": "Float!"
  }
],
v1 = {
  "kind": "Variable",
  "name": "latitude",
  "variableName": "latitude"
},
v2 = {
  "kind": "Variable",
  "name": "longitude",
  "variableName": "longitude"
},
v3 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 20
  },
  (v1/*: any*/),
  (v2/*: any*/)
],
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v6 = [
  (v4/*: any*/),
  (v5/*: any*/)
],
v7 = {
  "alias": null,
  "args": null,
  "concreteType": "LocationType",
  "kind": "LinkedField",
  "name": "locationType",
  "plural": false,
  "selections": (v6/*: any*/),
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": [
    (v1/*: any*/),
    (v2/*: any*/)
  ],
  "kind": "ScalarField",
  "name": "distanceKm",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "LocationsScreenSitesAroundMeQuery",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": "Location",
        "kind": "LinkedField",
        "name": "nearestSites",
        "plural": true,
        "selections": [
          (v4/*: any*/),
          (v5/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "LocationListItem_location"
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
    "name": "LocationsScreenSitesAroundMeQuery",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": "Location",
        "kind": "LinkedField",
        "name": "nearestSites",
        "plural": true,
        "selections": [
          (v4/*: any*/),
          (v5/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Location",
            "kind": "LinkedField",
            "name": "locationHierarchy",
            "plural": true,
            "selections": (v6/*: any*/),
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": null,
    "metadata": {},
    "name": "LocationsScreenSitesAroundMeQuery",
    "operationKind": "query",
    "text": "query LocationsScreenSitesAroundMeQuery(\n  $latitude: Float!\n  $longitude: Float!\n) {\n  nearestSites(latitude: $latitude, longitude: $longitude, first: 20) {\n    id\n    name\n    locationType {\n      id\n      name\n    }\n    distanceKm(latitude: $latitude, longitude: $longitude)\n    ...LocationListItem_location\n  }\n}\n\nfragment LocationListItem_location on Location {\n  id\n  name\n  locationHierarchy {\n    id\n    name\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'cf544ca57bb117a824aa2bf8f5ac7ec8';

module.exports = node;
