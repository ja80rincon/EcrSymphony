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
type SurveyList_surveys$ref = any;
export type SiteSurveyListScreenQueryVariables = {|
  locationId: string
|};
export type SiteSurveyListScreenQueryResponse = {|
  +node: ?{|
    +id?: string,
    +siteSurveyNeeded?: boolean,
    +surveys?: $ReadOnlyArray<?{|
      +$fragmentRefs: SurveyList_surveys$ref
    |}>,
  |}
|};
export type SiteSurveyListScreenQuery = {|
  variables: SiteSurveyListScreenQueryVariables,
  response: SiteSurveyListScreenQueryResponse,
|};
*/


/*
query SiteSurveyListScreenQuery(
  $locationId: ID!
) {
  node(id: $locationId) {
    __typename
    ... on Location {
      id
      siteSurveyNeeded
      surveys {
        ...SurveyList_surveys
        id
      }
    }
    id
  }
}

fragment SurveyList_surveys on Survey {
  id
  name
  completionTimestamp
  surveyResponses {
    questionText
    id
  }
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
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "siteSurveyNeeded",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "SiteSurveyListScreenQuery",
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
              (v2/*: any*/),
              (v3/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Survey",
                "kind": "LinkedField",
                "name": "surveys",
                "plural": true,
                "selections": [
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "SurveyList_surveys"
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
    "name": "SiteSurveyListScreenQuery",
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
              (v3/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Survey",
                "kind": "LinkedField",
                "name": "surveys",
                "plural": true,
                "selections": [
                  (v2/*: any*/),
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
                    "name": "completionTimestamp",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "SurveyQuestion",
                    "kind": "LinkedField",
                    "name": "surveyResponses",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "questionText",
                        "storageKey": null
                      },
                      (v2/*: any*/)
                    ],
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
    "name": "SiteSurveyListScreenQuery",
    "operationKind": "query",
    "text": "query SiteSurveyListScreenQuery(\n  $locationId: ID!\n) {\n  node(id: $locationId) {\n    __typename\n    ... on Location {\n      id\n      siteSurveyNeeded\n      surveys {\n        ...SurveyList_surveys\n        id\n      }\n    }\n    id\n  }\n}\n\nfragment SurveyList_surveys on Survey {\n  id\n  name\n  completionTimestamp\n  surveyResponses {\n    questionText\n    id\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '8ff61eca8646c78283213cd0ba0fafc8';

module.exports = node;
