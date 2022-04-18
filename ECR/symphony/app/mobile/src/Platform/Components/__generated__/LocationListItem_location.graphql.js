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
declare export opaque type LocationListItem_location$ref: FragmentReference;
declare export opaque type LocationListItem_location$fragmentType: LocationListItem_location$ref;
export type LocationListItem_location = {|
  +id: string,
  +name: string,
  +locationHierarchy: $ReadOnlyArray<{|
    +id: string,
    +name: string,
  |}>,
  +$refType: LocationListItem_location$ref,
|};
export type LocationListItem_location$data = LocationListItem_location;
export type LocationListItem_location$key = {
  +$data?: LocationListItem_location$data,
  +$fragmentRefs: LocationListItem_location$ref,
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
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "LocationListItem_location",
  "selections": [
    (v0/*: any*/),
    (v1/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "Location",
      "kind": "LinkedField",
      "name": "locationHierarchy",
      "plural": true,
      "selections": [
        (v0/*: any*/),
        (v1/*: any*/)
      ],
      "storageKey": null
    }
  ],
  "type": "Location"
};
})();
// prettier-ignore
(node/*: any*/).hash = 'dc202a31bab3831371336798d8c08ac9';

module.exports = node;
