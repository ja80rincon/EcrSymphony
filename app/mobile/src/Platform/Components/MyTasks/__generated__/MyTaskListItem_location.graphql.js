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
declare export opaque type MyTaskListItem_location$ref: FragmentReference;
declare export opaque type MyTaskListItem_location$fragmentType: MyTaskListItem_location$ref;
export type MyTaskListItem_location = {|
  +id: string,
  +name: string,
  +latitude: number,
  +longitude: number,
  +locationHierarchy: $ReadOnlyArray<{|
    +id: string,
    +name: string,
  |}>,
  +$refType: MyTaskListItem_location$ref,
|};
export type MyTaskListItem_location$data = MyTaskListItem_location;
export type MyTaskListItem_location$key = {
  +$data?: MyTaskListItem_location$data,
  +$fragmentRefs: MyTaskListItem_location$ref,
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
  "name": "MyTaskListItem_location",
  "selections": [
    (v0/*: any*/),
    (v1/*: any*/),
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
(node/*: any*/).hash = 'c6884f32455633bc09a33fc8657f6921';

module.exports = node;
