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
type PropertyTypeFormField_propertyType$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type DynamicPropertyTypesGrid_propertyTypes$ref: FragmentReference;
declare export opaque type DynamicPropertyTypesGrid_propertyTypes$fragmentType: DynamicPropertyTypesGrid_propertyTypes$ref;
export type DynamicPropertyTypesGrid_propertyTypes = $ReadOnlyArray<{|
  +id: string,
  +index: ?number,
  +$fragmentRefs: PropertyTypeFormField_propertyType$ref,
  +$refType: DynamicPropertyTypesGrid_propertyTypes$ref,
|}>;
export type DynamicPropertyTypesGrid_propertyTypes$data = DynamicPropertyTypesGrid_propertyTypes;
export type DynamicPropertyTypesGrid_propertyTypes$key = $ReadOnlyArray<{
  +$data?: DynamicPropertyTypesGrid_propertyTypes$data,
  +$fragmentRefs: DynamicPropertyTypesGrid_propertyTypes$ref,
  ...
}>;
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "plural": true
  },
  "name": "DynamicPropertyTypesGrid_propertyTypes",
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
      "name": "index",
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "PropertyTypeFormField_propertyType"
    }
  ],
  "type": "PropertyType",
  "abstractKey": null
};
// prettier-ignore
(node/*: any*/).hash = '199f86b427d215c1e7c8d70543451535';

module.exports = node;
