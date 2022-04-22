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
import type { ReaderFragment } from 'relay-runtime';
type SurveyQuestionListItem_question$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type SurveyQuestionList_category$ref: FragmentReference;
declare export opaque type SurveyQuestionList_category$fragmentType: SurveyQuestionList_category$ref;
export type SurveyQuestionList_category = {|
  +surveyTemplateQuestions: ?$ReadOnlyArray<?{|
    +id: string,
    +questionTitle: string,
    +$fragmentRefs: SurveyQuestionListItem_question$ref,
  |}>,
  +$refType: SurveyQuestionList_category$ref,
|};
export type SurveyQuestionList_category$data = SurveyQuestionList_category;
export type SurveyQuestionList_category$key = {
  +$data?: SurveyQuestionList_category$data,
  +$fragmentRefs: SurveyQuestionList_category$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "SurveyQuestionList_category",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "SurveyTemplateQuestion",
      "kind": "LinkedField",
      "name": "surveyTemplateQuestions",
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
          "name": "questionTitle",
          "storageKey": null
        },
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "SurveyQuestionListItem_question"
        }
      ],
      "storageKey": null
    }
  ],
  "type": "SurveyTemplateCategory"
};
// prettier-ignore
(node/*: any*/).hash = '8854e74b6fe825bd0239d0a12a45533c';

module.exports = node;
