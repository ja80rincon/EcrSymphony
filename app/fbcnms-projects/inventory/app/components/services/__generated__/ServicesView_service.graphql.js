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
type DynamicPropertiesGrid_properties$ref = any;
type DynamicPropertiesGrid_propertyTypes$ref = any;
type PropertyFormField_property$ref = any;
type PropertyTypeFormField_propertyType$ref = any;
export type DiscoveryMethod = "INVENTORY" | "MANUAL" | "%future added value";
export type ServiceStatus = "DISCONNECTED" | "IN_SERVICE" | "MAINTENANCE" | "PENDING" | "%future added value";
import type { FragmentReference } from "relay-runtime";
declare export opaque type ServicesView_service$ref: FragmentReference;
declare export opaque type ServicesView_service$fragmentType: ServicesView_service$ref;
export type ServicesView_service = $ReadOnlyArray<{|
  +id: string,
  +name: string,
  +externalId: ?string,
  +status: ServiceStatus,
  +customer: ?{|
    +id: string,
    +name: string,
  |},
  +serviceType: {|
    +id: string,
    +name: string,
    +discoveryMethod: DiscoveryMethod,
    +propertyTypes: $ReadOnlyArray<?{|
      +$fragmentRefs: PropertyTypeFormField_propertyType$ref & DynamicPropertiesGrid_propertyTypes$ref
    |}>,
  |},
  +properties: $ReadOnlyArray<?{|
    +$fragmentRefs: PropertyFormField_property$ref & DynamicPropertiesGrid_properties$ref
  |}>,
  +$refType: ServicesView_service$ref,
|}>;
export type ServicesView_service$data = ServicesView_service;
export type ServicesView_service$key = $ReadOnlyArray<{
  +$data?: ServicesView_service$data,
  +$fragmentRefs: ServicesView_service$ref,
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
  "metadata": {
    "plural": true
  },
  "name": "ServicesView_service",
  "selections": [
    (v0/*: any*/),
    (v1/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "externalId",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "status",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Customer",
      "kind": "LinkedField",
      "name": "customer",
      "plural": false,
      "selections": [
        (v0/*: any*/),
        (v1/*: any*/)
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "ServiceType",
      "kind": "LinkedField",
      "name": "serviceType",
      "plural": false,
      "selections": [
        (v0/*: any*/),
        (v1/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "discoveryMethod",
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
              "name": "PropertyTypeFormField_propertyType"
            },
            {
              "args": null,
              "kind": "FragmentSpread",
              "name": "DynamicPropertiesGrid_propertyTypes"
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Property",
      "kind": "LinkedField",
      "name": "properties",
      "plural": true,
      "selections": [
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "PropertyFormField_property"
        },
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "DynamicPropertiesGrid_properties"
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Service",
  "abstractKey": null
};
})();
// prettier-ignore
(node/*: any*/).hash = '082bbb9aa27247bc35148e31b2a04903';

module.exports = node;
