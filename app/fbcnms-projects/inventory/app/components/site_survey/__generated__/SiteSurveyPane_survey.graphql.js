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
type SiteSurveyQuestionReply_question$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type SiteSurveyPane_survey$ref: FragmentReference;
declare export opaque type SiteSurveyPane_survey$fragmentType: SiteSurveyPane_survey$ref;
export type SiteSurveyPane_survey = {|
  +name: string,
  +completionTimestamp: number,
  +surveyResponses: $ReadOnlyArray<?{|
    +id: string,
    +questionText: string,
    +formName: ?string,
    +formIndex: number,
    +questionIndex: number,
    +$fragmentRefs: SiteSurveyQuestionReply_question$ref,
  |}>,
  +$refType: SiteSurveyPane_survey$ref,
|};
export type SiteSurveyPane_survey$data = SiteSurveyPane_survey;
export type SiteSurveyPane_survey$key = {
  +$data?: SiteSurveyPane_survey$data,
  +$fragmentRefs: SiteSurveyPane_survey$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "SiteSurveyPane_survey",
  "selections": [
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
          "name": "id",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "questionText",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "formName",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "formIndex",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "questionIndex",
          "storageKey": null
        },
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "SiteSurveyQuestionReply_question"
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Survey",
  "abstractKey": null
};
// prettier-ignore
(node/*: any*/).hash = 'abb3682eadcff198afba66898e28a2a0';

module.exports = node;
