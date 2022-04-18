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
declare export opaque type ServiceEndpointDefinitionStaticTable_serviceEndpointDefinitions$ref: FragmentReference;
declare export opaque type ServiceEndpointDefinitionStaticTable_serviceEndpointDefinitions$fragmentType: ServiceEndpointDefinitionStaticTable_serviceEndpointDefinitions$ref;
export type ServiceEndpointDefinitionStaticTable_serviceEndpointDefinitions = $ReadOnlyArray<{|
  +id: string,
  +name: string,
  +role: ?string,
  +index: number,
  +equipmentType: {|
    +id: string,
    +name: string,
  |},
  +$refType: ServiceEndpointDefinitionStaticTable_serviceEndpointDefinitions$ref,
|}>;
export type ServiceEndpointDefinitionStaticTable_serviceEndpointDefinitions$data = ServiceEndpointDefinitionStaticTable_serviceEndpointDefinitions;
export type ServiceEndpointDefinitionStaticTable_serviceEndpointDefinitions$key = $ReadOnlyArray<{
  +$data?: ServiceEndpointDefinitionStaticTable_serviceEndpointDefinitions$data,
  +$fragmentRefs: ServiceEndpointDefinitionStaticTable_serviceEndpointDefinitions$ref,
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
  "name": "ServiceEndpointDefinitionStaticTable_serviceEndpointDefinitions",
  "selections": [
    (v0/*: any*/),
    (v1/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "role",
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
      "concreteType": "EquipmentType",
      "kind": "LinkedField",
      "name": "equipmentType",
      "plural": false,
      "selections": [
        (v0/*: any*/),
        (v1/*: any*/)
      ],
      "storageKey": null
    }
  ],
  "type": "ServiceEndpointDefinition",
  "abstractKey": null
};
})();
// prettier-ignore
(node/*: any*/).hash = '355047f79b4b79d16aa746b866d228ae';

module.exports = node;
