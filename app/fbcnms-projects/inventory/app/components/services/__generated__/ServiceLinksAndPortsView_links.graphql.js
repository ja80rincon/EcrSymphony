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
declare export opaque type ServiceLinksAndPortsView_links$ref: FragmentReference;
declare export opaque type ServiceLinksAndPortsView_links$fragmentType: ServiceLinksAndPortsView_links$ref;
export type ServiceLinksAndPortsView_links = $ReadOnlyArray<{|
  +id: string,
  +ports: $ReadOnlyArray<?{|
    +parentEquipment: {|
      +id: string,
      +name: string,
    |},
    +definition: {|
      +id: string,
      +name: string,
    |},
  |}>,
  +$refType: ServiceLinksAndPortsView_links$ref,
|}>;
export type ServiceLinksAndPortsView_links$data = ServiceLinksAndPortsView_links;
export type ServiceLinksAndPortsView_links$key = $ReadOnlyArray<{
  +$data?: ServiceLinksAndPortsView_links$data,
  +$fragmentRefs: ServiceLinksAndPortsView_links$ref,
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
v1 = [
  (v0/*: any*/),
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "name",
    "storageKey": null
  }
];
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "plural": true
  },
  "name": "ServiceLinksAndPortsView_links",
  "selections": [
    (v0/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "EquipmentPort",
      "kind": "LinkedField",
      "name": "ports",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "Equipment",
          "kind": "LinkedField",
          "name": "parentEquipment",
          "plural": false,
          "selections": (v1/*: any*/),
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "EquipmentPortDefinition",
          "kind": "LinkedField",
          "name": "definition",
          "plural": false,
          "selections": (v1/*: any*/),
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Link",
  "abstractKey": null
};
})();
// prettier-ignore
(node/*: any*/).hash = 'dac279cc0466da09947a7a4de86cfa09';

module.exports = node;
