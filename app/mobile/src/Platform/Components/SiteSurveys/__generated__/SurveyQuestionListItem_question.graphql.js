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
export type SurveyQuestionType = "BOOL" | "CELLULAR" | "COORDS" | "DATE" | "EMAIL" | "FLOAT" | "INTEGER" | "PHONE" | "PHOTO" | "TEXT" | "TEXTAREA" | "WIFI" | "%future added value";
import type { FragmentReference } from "relay-runtime";
declare export opaque type SurveyQuestionListItem_question$ref: FragmentReference;
declare export opaque type SurveyQuestionListItem_question$fragmentType: SurveyQuestionListItem_question$ref;
export type SurveyQuestionListItem_question = {|
  +id: string,
  +questionTitle: string,
  +questionDescription: string,
  +questionType: SurveyQuestionType,
  +index: number,
  +$refType: SurveyQuestionListItem_question$ref,
|};
export type SurveyQuestionListItem_question$data = SurveyQuestionListItem_question;
export type SurveyQuestionListItem_question$key = {
  +$data?: SurveyQuestionListItem_question$data,
  +$fragmentRefs: SurveyQuestionListItem_question$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "SurveyQuestionListItem_question",
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
  "type": "SurveyTemplateQuestion"
};
// prettier-ignore
(node/*: any*/).hash = '44b1da18e17492d738dbb52c1d386950';

module.exports = node;
