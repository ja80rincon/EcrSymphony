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
type SurveyQuestionList_category$ref = any;
export type SurveyQuestionsScreenQueryVariables = {|
  locationTypeId: string
|};
export type SurveyQuestionsScreenQueryResponse = {|
  +node: ?{|
    +id?: string,
    +name?: string,
    +surveyTemplateCategories?: ?$ReadOnlyArray<?{|
      +id: string,
      +categoryTitle: string,
      +categoryDescription: string,
      +surveyTemplateQuestions: ?$ReadOnlyArray<?{|
        +id: string
      |}>,
      +$fragmentRefs: SurveyQuestionList_category$ref,
    |}>,
  |}
|};
export type SurveyQuestionsScreenQuery = {|
  variables: SurveyQuestionsScreenQueryVariables,
  response: SurveyQuestionsScreenQueryResponse,
|};
*/


/*
query SurveyQuestionsScreenQuery(
  $locationTypeId: ID!
) {
  node(id: $locationTypeId) {
    __typename
    ... on LocationType {
      id
      name
      surveyTemplateCategories {
        id
        categoryTitle
        categoryDescription
        ...SurveyQuestionList_category
        surveyTemplateQuestions {
          id
        }
      }
    }
    id
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
    "name": "locationTypeId",
    "type": "ID!"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "locationTypeId"
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
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "categoryTitle",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "categoryDescription",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "SurveyQuestionsScreenQuery",
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
                "concreteType": "SurveyTemplateCategory",
                "kind": "LinkedField",
                "name": "surveyTemplateCategories",
                "plural": true,
                "selections": [
                  (v2/*: any*/),
                  (v4/*: any*/),
                  (v5/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "SurveyTemplateQuestion",
                    "kind": "LinkedField",
                    "name": "surveyTemplateQuestions",
                    "plural": true,
                    "selections": [
                      (v2/*: any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "SurveyQuestionList_category"
                  }
                ],
                "storageKey": null
              }
            ],
            "type": "LocationType"
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
    "name": "SurveyQuestionsScreenQuery",
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
                "concreteType": "SurveyTemplateCategory",
                "kind": "LinkedField",
                "name": "surveyTemplateCategories",
                "plural": true,
                "selections": [
                  (v2/*: any*/),
                  (v4/*: any*/),
                  (v5/*: any*/),
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
            "type": "LocationType"
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": null,
    "metadata": {},
    "name": "SurveyQuestionsScreenQuery",
    "operationKind": "query",
    "text": "query SurveyQuestionsScreenQuery(\n  $locationTypeId: ID!\n) {\n  node(id: $locationTypeId) {\n    __typename\n    ... on LocationType {\n      id\n      name\n      surveyTemplateCategories {\n        id\n        categoryTitle\n        categoryDescription\n        ...SurveyQuestionList_category\n        surveyTemplateQuestions {\n          id\n        }\n      }\n    }\n    id\n  }\n}\n\nfragment SurveyQuestionListItem_question on SurveyTemplateQuestion {\n  id\n  questionTitle\n  questionDescription\n  questionType\n  index\n}\n\nfragment SurveyQuestionList_category on SurveyTemplateCategory {\n  surveyTemplateQuestions {\n    id\n    questionTitle\n    ...SurveyQuestionListItem_question\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '001be31fe88f36b3b12e6b2231a78b5a';

module.exports = node;
