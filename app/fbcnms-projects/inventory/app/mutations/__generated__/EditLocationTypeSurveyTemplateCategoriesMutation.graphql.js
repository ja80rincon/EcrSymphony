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
export type SurveyQuestionType = "BOOL" | "CELLULAR" | "COORDS" | "DATE" | "EMAIL" | "FLOAT" | "INTEGER" | "PHONE" | "PHOTO" | "TEXT" | "TEXTAREA" | "WIFI" | "%future added value";
export type SurveyTemplateCategoryInput = {|
  id?: ?string,
  categoryTitle: string,
  categoryDescription: string,
  surveyTemplateQuestions?: ?$ReadOnlyArray<?SurveyTemplateQuestionInput>,
|};
export type SurveyTemplateQuestionInput = {|
  id?: ?string,
  questionTitle: string,
  questionDescription: string,
  questionType: SurveyQuestionType,
  index: number,
|};
export type EditLocationTypeSurveyTemplateCategoriesMutationVariables = {|
  id: string,
  surveyTemplateCategories: $ReadOnlyArray<SurveyTemplateCategoryInput>,
|};
export type EditLocationTypeSurveyTemplateCategoriesMutationResponse = {|
  +editLocationTypeSurveyTemplateCategories: ?$ReadOnlyArray<{|
    +id: string
  |}>
|};
export type EditLocationTypeSurveyTemplateCategoriesMutation = {|
  variables: EditLocationTypeSurveyTemplateCategoriesMutationVariables,
  response: EditLocationTypeSurveyTemplateCategoriesMutationResponse,
|};
*/


/*
mutation EditLocationTypeSurveyTemplateCategoriesMutation(
  $id: ID!
  $surveyTemplateCategories: [SurveyTemplateCategoryInput!]!
) {
  editLocationTypeSurveyTemplateCategories(id: $id, surveyTemplateCategories: $surveyTemplateCategories) {
    id
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "surveyTemplateCategories"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "id",
        "variableName": "id"
      },
      {
        "kind": "Variable",
        "name": "surveyTemplateCategories",
        "variableName": "surveyTemplateCategories"
      }
    ],
    "concreteType": "SurveyTemplateCategory",
    "kind": "LinkedField",
    "name": "editLocationTypeSurveyTemplateCategories",
    "plural": true,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
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
    "name": "EditLocationTypeSurveyTemplateCategoriesMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "EditLocationTypeSurveyTemplateCategoriesMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "a59c0f8df4a12a1861f389ba3ee9f767",
    "id": null,
    "metadata": {},
    "name": "EditLocationTypeSurveyTemplateCategoriesMutation",
    "operationKind": "mutation",
    "text": "mutation EditLocationTypeSurveyTemplateCategoriesMutation(\n  $id: ID!\n  $surveyTemplateCategories: [SurveyTemplateCategoryInput!]!\n) {\n  editLocationTypeSurveyTemplateCategories(id: $id, surveyTemplateCategories: $surveyTemplateCategories) {\n    id\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'f78d5f49864462b54118081587c24ac0';

module.exports = node;
