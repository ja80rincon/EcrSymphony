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
export type DiscoveryMethod = "INVENTORY" | "MANUAL" | "%future added value";
import type { FragmentReference } from "relay-runtime";
declare export opaque type ServiceTypesListQuery_serviceType$ref: FragmentReference;
declare export opaque type ServiceTypesListQuery_serviceType$fragmentType: ServiceTypesListQuery_serviceType$ref;
export type ServiceTypesListQuery_serviceType = {|
  +id: string,
  +name: string,
  +discoveryMethod: DiscoveryMethod,
  +$refType: ServiceTypesListQuery_serviceType$ref,
|};
export type ServiceTypesListQuery_serviceType$data = ServiceTypesListQuery_serviceType;
export type ServiceTypesListQuery_serviceType$key = {
  +$data?: ServiceTypesListQuery_serviceType$data,
  +$fragmentRefs: ServiceTypesListQuery_serviceType$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ServiceTypesListQuery_serviceType",
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
    }
  ],
  "type": "ServiceType",
  "abstractKey": null
};
// prettier-ignore
(node/*: any*/).hash = '746b4b7d14876a363b38950f2f7ab94d';

module.exports = node;
