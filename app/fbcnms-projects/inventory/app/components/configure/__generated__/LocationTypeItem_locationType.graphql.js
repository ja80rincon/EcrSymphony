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
type DynamicPropertyTypesGrid_propertyTypes$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type LocationTypeItem_locationType$ref: FragmentReference;
declare export opaque type LocationTypeItem_locationType$fragmentType: LocationTypeItem_locationType$ref;
export type LocationTypeItem_locationType = {|
  +id: string,
  +name: string,
  +index: ?number,
  +propertyTypes: $ReadOnlyArray<?{|
    +$fragmentRefs: DynamicPropertyTypesGrid_propertyTypes$ref
  |}>,
  +numberOfLocations: number,
  +$refType: LocationTypeItem_locationType$ref,
|};
export type LocationTypeItem_locationType$data = LocationTypeItem_locationType;
export type LocationTypeItem_locationType$key = {
  +$data?: LocationTypeItem_locationType$data,
  +$fragmentRefs: LocationTypeItem_locationType$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "LocationTypeItem_locationType",
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
      "name": "index",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "PropertyType",
      "kind": "LinkedField",
      "name": "propertyTypes",
      "plural": true,
      "selections": [
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "DynamicPropertyTypesGrid_propertyTypes"
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "numberOfLocations",
      "storageKey": null
    }
  ],
  "type": "LocationType",
  "abstractKey": null
};
// prettier-ignore
(node/*: any*/).hash = 'dbc429726327dcfb05c2a80d49cfa429';

module.exports = node;
