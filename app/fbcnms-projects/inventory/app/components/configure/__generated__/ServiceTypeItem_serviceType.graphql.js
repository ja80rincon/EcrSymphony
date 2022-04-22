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
type ServiceEndpointDefinitionStaticTable_serviceEndpointDefinitions$ref = any;
export type DiscoveryMethod = "INVENTORY" | "MANUAL" | "%future added value";
import type { FragmentReference } from "relay-runtime";
declare export opaque type ServiceTypeItem_serviceType$ref: FragmentReference;
declare export opaque type ServiceTypeItem_serviceType$fragmentType: ServiceTypeItem_serviceType$ref;
export type ServiceTypeItem_serviceType = {|
  +id: string,
  +name: string,
  +discoveryMethod: DiscoveryMethod,
  +propertyTypes: $ReadOnlyArray<?{|
    +$fragmentRefs: PropertyTypeFormField_propertyType$ref
  |}>,
  +endpointDefinitions: $ReadOnlyArray<{|
    +$fragmentRefs: ServiceEndpointDefinitionStaticTable_serviceEndpointDefinitions$ref
  |}>,
  +numberOfServices: number,
  +$refType: ServiceTypeItem_serviceType$ref,
|};
export type ServiceTypeItem_serviceType$data = ServiceTypeItem_serviceType;
export type ServiceTypeItem_serviceType$key = {
  +$data?: ServiceTypeItem_serviceType$data,
  +$fragmentRefs: ServiceTypeItem_serviceType$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ServiceTypeItem_serviceType",
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
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "ServiceEndpointDefinition",
      "kind": "LinkedField",
      "name": "endpointDefinitions",
      "plural": true,
      "selections": [
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "ServiceEndpointDefinitionStaticTable_serviceEndpointDefinitions"
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "numberOfServices",
      "storageKey": null
    }
  ],
  "type": "ServiceType",
  "abstractKey": null
};
// prettier-ignore
(node/*: any*/).hash = 'bdd10c4d5e7ee31784df58baac76728d';

module.exports = node;
