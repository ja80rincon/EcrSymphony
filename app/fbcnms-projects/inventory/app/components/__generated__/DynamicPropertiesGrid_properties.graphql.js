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
type PropertyFormField_property$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type DynamicPropertiesGrid_properties$ref: FragmentReference;
declare export opaque type DynamicPropertiesGrid_properties$fragmentType: DynamicPropertiesGrid_properties$ref;
export type DynamicPropertiesGrid_properties = $ReadOnlyArray<{|
  +propertyType: {|
    +id: string,
    +index: ?number,
  |},
  +$fragmentRefs: PropertyFormField_property$ref,
  +$refType: DynamicPropertiesGrid_properties$ref,
|}>;
export type DynamicPropertiesGrid_properties$data = DynamicPropertiesGrid_properties;
export type DynamicPropertiesGrid_properties$key = $ReadOnlyArray<{
  +$data?: DynamicPropertiesGrid_properties$data,
  +$fragmentRefs: DynamicPropertiesGrid_properties$ref,
  ...
}>;
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "plural": true
  },
  "name": "DynamicPropertiesGrid_properties",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "PropertyType",
      "kind": "LinkedField",
      "name": "propertyType",
      "plural": false,
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
        }
      ],
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "PropertyFormField_property"
    }
  ],
  "type": "Property",
  "abstractKey": null
};
// prettier-ignore
(node/*: any*/).hash = '7b83547f439381a2346b2b5c487b5134';

module.exports = node;
