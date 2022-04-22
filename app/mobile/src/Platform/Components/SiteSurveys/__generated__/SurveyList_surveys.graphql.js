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
import type { FragmentReference } from "relay-runtime";
declare export opaque type SurveyList_surveys$ref: FragmentReference;
declare export opaque type SurveyList_surveys$fragmentType: SurveyList_surveys$ref;
export type SurveyList_surveys = $ReadOnlyArray<{|
  +id: string,
  +name: string,
  +completionTimestamp: number,
  +surveyResponses: $ReadOnlyArray<?{|
    +questionText: string
  |}>,
  +$refType: SurveyList_surveys$ref,
|}>;
export type SurveyList_surveys$data = SurveyList_surveys;
export type SurveyList_surveys$key = $ReadOnlyArray<{
  +$data?: SurveyList_surveys$data,
  +$fragmentRefs: SurveyList_surveys$ref,
  ...
}>;
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "plural": true
  },
  "name": "SurveyList_surveys",
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
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Survey"
};
// prettier-ignore
(node/*: any*/).hash = '155a1b892ea8248200a29323c71d24a3';

module.exports = node;
