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
type SurveyQuestionList_category$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type SurveyCategoryListItem_category$ref: FragmentReference;
declare export opaque type SurveyCategoryListItem_category$fragmentType: SurveyCategoryListItem_category$ref;
export type SurveyCategoryListItem_category = {|
  +id: string,
  +categoryTitle: string,
  +categoryDescription: string,
  +surveyTemplateQuestions: ?$ReadOnlyArray<?{|
    +id: string,
    +questionTitle: string,
  |}>,
  +$fragmentRefs: SurveyQuestionList_category$ref,
  +$refType: SurveyCategoryListItem_category$ref,
|};
export type SurveyCategoryListItem_category$data = SurveyCategoryListItem_category;
export type SurveyCategoryListItem_category$key = {
  +$data?: SurveyCategoryListItem_category$data,
  +$fragmentRefs: SurveyCategoryListItem_category$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "SurveyCategoryListItem_category",
  "selections": [
    (v0/*: any*/),
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
        (v0/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "questionTitle",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "SurveyQuestionList_category"
    }
  ],
  "type": "SurveyTemplateCategory"
};
})();
// prettier-ignore
(node/*: any*/).hash = 'eb73c0f7cc244c27ea34da57fc35397f';

module.exports = node;
