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
type MyTaskListItem_location$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type TasksList_locations$ref: FragmentReference;
declare export opaque type TasksList_locations$fragmentType: TasksList_locations$ref;
export type TasksList_locations = $ReadOnlyArray<{|
  +node: ?{|
    +id: string,
    +name: string,
    +latitude: number,
    +longitude: number,
    +locationType: {|
      +surveyTemplateCategories: ?$ReadOnlyArray<?{|
        +id: string
      |}>
    |},
    +$fragmentRefs: MyTaskListItem_location$ref,
  |},
  +$refType: TasksList_locations$ref,
|}>;
export type TasksList_locations$data = TasksList_locations;
export type TasksList_locations$key = $ReadOnlyArray<{
  +$data?: TasksList_locations$data,
  +$fragmentRefs: TasksList_locations$ref,
  ...
}>;
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
  "metadata": {
    "plural": true
  },
  "name": "TasksList_locations",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "Location",
      "kind": "LinkedField",
      "name": "node",
      "plural": false,
      "selections": [
        (v0/*: any*/),
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
          "name": "latitude",
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
          "concreteType": "LocationType",
          "kind": "LinkedField",
          "name": "locationType",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "SurveyTemplateCategory",
              "kind": "LinkedField",
              "name": "surveyTemplateCategories",
              "plural": true,
              "selections": [
                (v0/*: any*/)
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        },
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "MyTaskListItem_location"
        }
      ],
      "storageKey": null
    }
  ],
  "type": "LocationEdge"
};
})();
// prettier-ignore
(node/*: any*/).hash = 'b6245778b3b85b0e3871cdd99207cfb5';

module.exports = node;
