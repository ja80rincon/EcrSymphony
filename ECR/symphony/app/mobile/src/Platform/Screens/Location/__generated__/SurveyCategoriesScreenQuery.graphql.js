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
type SurveyCategoryList_locationType$ref = any;
export type SurveyCategoriesScreenQueryVariables = {|
  locationId: string
|};
export type SurveyCategoriesScreenQueryResponse = {|
  +node: ?{|
    +id?: string,
    +name?: string,
    +locationType?: {|
      +id: string,
      +name: string,
      +$fragmentRefs: SurveyCategoryList_locationType$ref,
    |},
  |}
|};
export type SurveyCategoriesScreenQuery = {|
  variables: SurveyCategoriesScreenQueryVariables,
  response: SurveyCategoriesScreenQueryResponse,
|};
*/


/*
query SurveyCategoriesScreenQuery(
  $locationId: ID!
) {
  node(id: $locationId) {
    __typename
    ... on Location {
      id
      name
      locationType {
        id
        name
        ...SurveyCategoryList_locationType
      }
    }
    id
  }
}

fragment SurveyCategoryListItem_category on SurveyTemplateCategory {
  id
  categoryTitle
  categoryDescription
  ...SurveyQuestionList_category
  surveyTemplateQuestions {
    id
    questionTitle
  }
}

fragment SurveyCategoryList_locationType on LocationType {
  id
  surveyTemplateCategories {
    id
    ...SurveyCategoryListItem_category
    ...SurveyQuestionList_category
  }
}

fragment SurveyQuestionListItem_question on SurveyTemplateQuestion {
  id
  questionTitle
  questionDescription
  questionType
  index
}

fragment SurveyQuestionList_category on SurveyTemplateCategory {
  surveyTemplateQuestions {
    id
    questionTitle
    ...SurveyQuestionListItem_question
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
  "name": "name",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "SurveyCategoriesScreenQuery",
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
                "concreteType": "LocationType",
                "kind": "LinkedField",
                "name": "locationType",
                "plural": false,
                "selections": [
                  (v2/*: any*/),
                  (v3/*: any*/),
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "SurveyCategoryList_locationType"
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
    "name": "SurveyCategoriesScreenQuery",
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
                "concreteType": "LocationType",
                "kind": "LinkedField",
                "name": "locationType",
                "plural": false,
                "selections": [
                  (v2/*: any*/),
                  (v3/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "SurveyTemplateCategory",
                    "kind": "LinkedField",
                    "name": "surveyTemplateCategories",
                    "plural": true,
                    "selections": [
                      (v2/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "categoryTitle",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "categoryDescription",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "SurveyTemplateQuestion",
                        "kind": "LinkedField",
                        "name": "surveyTemplateQuestions",
                        "plural": true,
                        "selections": [
                          (v2/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "questionTitle",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "questionDescription",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "questionType",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "index",
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
    "name": "SurveyCategoriesScreenQuery",
    "operationKind": "query",
    "text": "query SurveyCategoriesScreenQuery(\n  $locationId: ID!\n) {\n  node(id: $locationId) {\n    __typename\n    ... on Location {\n      id\n      name\n      locationType {\n        id\n        name\n        ...SurveyCategoryList_locationType\n      }\n    }\n    id\n  }\n}\n\nfragment SurveyCategoryListItem_category on SurveyTemplateCategory {\n  id\n  categoryTitle\n  categoryDescription\n  ...SurveyQuestionList_category\n  surveyTemplateQuestions {\n    id\n    questionTitle\n  }\n}\n\nfragment SurveyCategoryList_locationType on LocationType {\n  id\n  surveyTemplateCategories {\n    id\n    ...SurveyCategoryListItem_category\n    ...SurveyQuestionList_category\n  }\n}\n\nfragment SurveyQuestionListItem_question on SurveyTemplateQuestion {\n  id\n  questionTitle\n  questionDescription\n  questionType\n  index\n}\n\nfragment SurveyQuestionList_category on SurveyTemplateCategory {\n  surveyTemplateQuestions {\n    id\n    questionTitle\n    ...SurveyQuestionListItem_question\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '9848a4a9d9a801f6b26b6675a5e92cdd';

module.exports = node;
