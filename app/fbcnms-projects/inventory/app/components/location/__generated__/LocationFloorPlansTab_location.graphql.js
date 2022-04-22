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
type FileAttachment_file$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type LocationFloorPlansTab_location$ref: FragmentReference;
declare export opaque type LocationFloorPlansTab_location$fragmentType: LocationFloorPlansTab_location$ref;
export type LocationFloorPlansTab_location = {|
  +id: string,
  +floorPlans: $ReadOnlyArray<?{|
    +id: string,
    +name: string,
    +image: {|
      +$fragmentRefs: FileAttachment_file$ref
    |},
  |}>,
  +$refType: LocationFloorPlansTab_location$ref,
|};
export type LocationFloorPlansTab_location$data = LocationFloorPlansTab_location;
export type LocationFloorPlansTab_location$key = {
  +$data?: LocationFloorPlansTab_location$data,
  +$fragmentRefs: LocationFloorPlansTab_location$ref,
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
  "name": "LocationFloorPlansTab_location",
  "selections": [
    (v0/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "FloorPlan",
      "kind": "LinkedField",
      "name": "floorPlans",
      "plural": true,
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
          "concreteType": "File",
          "kind": "LinkedField",
          "name": "image",
          "plural": false,
          "selections": [
            {
              "args": null,
              "kind": "FragmentSpread",
              "name": "FileAttachment_file"
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Location",
  "abstractKey": null
};
})();
// prettier-ignore
(node/*: any*/).hash = '33ba200160169ecb72ef20fca4c58fe5';

module.exports = node;
