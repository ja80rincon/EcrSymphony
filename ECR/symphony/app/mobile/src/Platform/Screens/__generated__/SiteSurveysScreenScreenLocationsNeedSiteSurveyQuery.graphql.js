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
export type SiteSurveysScreenScreenLocationsNeedSiteSurveyQueryVariables = {||};
export type SiteSurveysScreenScreenLocationsNeedSiteSurveyQueryResponse = {|
  +locations: ?{|
    +edges: $ReadOnlyArray<{|
      +node: ?{|
        +id: string,
        +name: string,
        +surveys: $ReadOnlyArray<?{|
          +id: string
        |}>,
        +$fragmentRefs: LocationListItem_location$ref,
      |}
    |}>
  |}
|};
export type SiteSurveysScreenScreenLocationsNeedSiteSurveyQuery = {|
  variables: SiteSurveysScreenScreenLocationsNeedSiteSurveyQueryVariables,
  response: SiteSurveysScreenScreenLocationsNeedSiteSurveyQueryResponse,
|};
*/


/*
query SiteSurveysScreenScreenLocationsNeedSiteSurveyQuery {
  locations(needsSiteSurvey: true) {
    edges {
      node {
        id
        name
        surveys {
          id
        }
        ...LocationListItem_location
      }
    }
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
    "kind": "Literal",
    "name": "needsSiteSurvey",
    "value": true
  }
],
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
v3 = {
  "alias": null,
  "args": null,
  "concreteType": "Survey",
  "kind": "LinkedField",
  "name": "surveys",
  "plural": true,
  "selections": [
    (v1/*: any*/)
  ],
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "SiteSurveysScreenScreenLocationsNeedSiteSurveyQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "LocationConnection",
        "kind": "LinkedField",
        "name": "locations",
        "plural": false,
        "selections": [
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
                  (v2/*: any*/),
                  (v3/*: any*/),
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "LocationListItem_location"
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": "locations(needsSiteSurvey:true)"
      }
    ],
    "type": "Query"
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "SiteSurveysScreenScreenLocationsNeedSiteSurveyQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "LocationConnection",
        "kind": "LinkedField",
        "name": "locations",
        "plural": false,
        "selections": [
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
                  (v2/*: any*/),
                  (v3/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Location",
                    "kind": "LinkedField",
                    "name": "locationHierarchy",
                    "plural": true,
                    "selections": [
                      (v1/*: any*/),
                      (v2/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": "locations(needsSiteSurvey:true)"
      }
    ]
  },
  "params": {
    "id": null,
    "metadata": {},
    "name": "SiteSurveysScreenScreenLocationsNeedSiteSurveyQuery",
    "operationKind": "query",
    "text": "query SiteSurveysScreenScreenLocationsNeedSiteSurveyQuery {\n  locations(needsSiteSurvey: true) {\n    edges {\n      node {\n        id\n        name\n        surveys {\n          id\n        }\n        ...LocationListItem_location\n      }\n    }\n  }\n}\n\nfragment LocationListItem_location on Location {\n  id\n  name\n  locationHierarchy {\n    id\n    name\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'a5aea7cb34f160d7f0a5ed066bc30915';

module.exports = node;
