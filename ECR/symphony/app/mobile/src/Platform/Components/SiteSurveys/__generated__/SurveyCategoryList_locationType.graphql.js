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
type SurveyCategoryListItem_category$ref = any;
type SurveyQuestionList_category$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type SurveyCategoryList_locationType$ref: FragmentReference;
declare export opaque type SurveyCategoryList_locationType$fragmentType: SurveyCategoryList_locationType$ref;
export type SurveyCategoryList_locationType = {|
  +id: string,
  +surveyTemplateCategories: ?$ReadOnlyArray<?{|
    +id: string,
    +$fragmentRefs: SurveyCategoryListItem_category$ref & SurveyQuestionList_category$ref,
  |}>,
  +$refType: SurveyCategoryList_locationType$ref,
|};
export type SurveyCategoryList_locationType$data = SurveyCategoryList_locationType;
export type SurveyCategoryList_locationType$key = {
  +$data?: SurveyCategoryList_locationType$data,
  +$fragmentRefs: SurveyCategoryList_locationType$ref,
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
  "name": "SurveyCategoryList_locationType",
  "selections": [
    (v0/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "SurveyTemplateCategory",
      "kind": "LinkedField",
      "name": "surveyTemplateCategories",
      "plural": true,
      "selections": [
        (v0/*: any*/),
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "SurveyCategoryListItem_category"
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
};
})();
// prettier-ignore
(node/*: any*/).hash = 'ec74ea5f4a2460f6afacd0973ec92b28';

module.exports = node;
