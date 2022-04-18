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
type SiteSurveyQuestionReplyCellData_data$ref = any;
type SiteSurveyQuestionReplyWifiData_data$ref = any;
export type SurveyQuestionType = "BOOL" | "CELLULAR" | "COORDS" | "DATE" | "EMAIL" | "FLOAT" | "INTEGER" | "PHONE" | "PHOTO" | "TEXT" | "TEXTAREA" | "WIFI" | "%future added value";
import type { FragmentReference } from "relay-runtime";
declare export opaque type SiteSurveyQuestionReply_question$ref: FragmentReference;
declare export opaque type SiteSurveyQuestionReply_question$fragmentType: SiteSurveyQuestionReply_question$ref;
export type SiteSurveyQuestionReply_question = {|
  +questionFormat: ?SurveyQuestionType,
  +longitude: ?number,
  +latitude: ?number,
  +boolData: ?boolean,
  +textData: ?string,
  +emailData: ?string,
  +phoneData: ?string,
  +floatData: ?number,
  +intData: ?number,
  +dateData: ?number,
  +photoData: ?{|
    +storeKey: ?string
  |},
  +$fragmentRefs: SiteSurveyQuestionReplyWifiData_data$ref & SiteSurveyQuestionReplyCellData_data$ref,
  +$refType: SiteSurveyQuestionReply_question$ref,
|};
export type SiteSurveyQuestionReply_question$data = SiteSurveyQuestionReply_question;
export type SiteSurveyQuestionReply_question$key = {
  +$data?: SiteSurveyQuestionReply_question$data,
  +$fragmentRefs: SiteSurveyQuestionReply_question$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "SiteSurveyQuestionReply_question",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "questionFormat",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "longitude",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "latitude",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "boolData",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "textData",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "emailData",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "phoneData",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "floatData",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "intData",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "dateData",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "File",
      "kind": "LinkedField",
      "name": "photoData",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "storeKey",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "SiteSurveyQuestionReplyWifiData_data"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "SiteSurveyQuestionReplyCellData_data"
    }
  ],
  "type": "SurveyQuestion",
  "abstractKey": null
};
// prettier-ignore
(node/*: any*/).hash = '4d9d45828bc4b9296fdd9b8347017e18';

module.exports = node;
