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
declare export opaque type LocationMenu_location$ref: FragmentReference;
declare export opaque type LocationMenu_location$fragmentType: LocationMenu_location$ref;
export type LocationMenu_location = {|
  +id: string,
  +name: string,
  +locationType: {|
    +id: string
  |},
  +parentLocation: ?{|
    +id: string
  |},
  +children: $ReadOnlyArray<?{|
    +id: string
  |}>,
  +equipments: $ReadOnlyArray<?{|
    +id: string
  |}>,
  +images: $ReadOnlyArray<?{|
    +id: string
  |}>,
  +files: $ReadOnlyArray<?{|
    +id: string
  |}>,
  +surveys: $ReadOnlyArray<?{|
    +id: string
  |}>,
  +$refType: LocationMenu_location$ref,
|};
export type LocationMenu_location$data = LocationMenu_location;
export type LocationMenu_location$key = {
  +$data?: LocationMenu_location$data,
  +$fragmentRefs: LocationMenu_location$ref,
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
v1 = [
  (v0/*: any*/)
];
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "LocationMenu_location",
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
      "concreteType": "LocationType",
      "kind": "LinkedField",
      "name": "locationType",
      "plural": false,
      "selections": (v1/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Location",
      "kind": "LinkedField",
      "name": "parentLocation",
      "plural": false,
      "selections": (v1/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Location",
      "kind": "LinkedField",
      "name": "children",
      "plural": true,
      "selections": (v1/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Equipment",
      "kind": "LinkedField",
      "name": "equipments",
      "plural": true,
      "selections": (v1/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "File",
      "kind": "LinkedField",
      "name": "images",
      "plural": true,
      "selections": (v1/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "File",
      "kind": "LinkedField",
      "name": "files",
      "plural": true,
      "selections": (v1/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Survey",
      "kind": "LinkedField",
      "name": "surveys",
      "plural": true,
      "selections": (v1/*: any*/),
      "storageKey": null
    }
  ],
  "type": "Location",
  "abstractKey": null
};
})();
// prettier-ignore
(node/*: any*/).hash = '4155d2d7cef7ceef7b79a4639755fec9';

module.exports = node;
