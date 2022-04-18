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
declare export opaque type ProjectsMap_projects$ref: FragmentReference;
declare export opaque type ProjectsMap_projects$fragmentType: ProjectsMap_projects$ref;
export type ProjectsMap_projects = $ReadOnlyArray<{|
  +id: string,
  +name: string,
  +location: ?{|
    +id: string,
    +name: string,
    +latitude: number,
    +longitude: number,
  |},
  +numberOfWorkOrders: number,
  +$refType: ProjectsMap_projects$ref,
|}>;
export type ProjectsMap_projects$data = ProjectsMap_projects;
export type ProjectsMap_projects$key = $ReadOnlyArray<{
  +$data?: ProjectsMap_projects$data,
  +$fragmentRefs: ProjectsMap_projects$ref,
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
  "name": "ProjectsMap_projects",
  "selections": [
    (v0/*: any*/),
    (v1/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "Location",
      "kind": "LinkedField",
      "name": "location",
      "plural": false,
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
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "numberOfWorkOrders",
      "storageKey": null
    }
  ],
  "type": "Project",
  "abstractKey": null
};
})();
// prettier-ignore
(node/*: any*/).hash = 'd43c7f541350f23d3936722943b7ca9b';

module.exports = node;
