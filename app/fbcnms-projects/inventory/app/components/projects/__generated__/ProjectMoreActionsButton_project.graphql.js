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
declare export opaque type ProjectMoreActionsButton_project$ref: FragmentReference;
declare export opaque type ProjectMoreActionsButton_project$fragmentType: ProjectMoreActionsButton_project$ref;
export type ProjectMoreActionsButton_project = {|
  +id: string,
  +name: string,
  +numberOfWorkOrders: number,
  +type: {|
    +id: string
  |},
  +$refType: ProjectMoreActionsButton_project$ref,
|};
export type ProjectMoreActionsButton_project$data = ProjectMoreActionsButton_project;
export type ProjectMoreActionsButton_project$key = {
  +$data?: ProjectMoreActionsButton_project$data,
  +$fragmentRefs: ProjectMoreActionsButton_project$ref,
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
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ProjectMoreActionsButton_project",
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
      "kind": "ScalarField",
      "name": "numberOfWorkOrders",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "ProjectType",
      "kind": "LinkedField",
      "name": "type",
      "plural": false,
      "selections": [
        (v0/*: any*/)
      ],
      "storageKey": null
    }
  ],
  "type": "Project",
  "abstractKey": null
};
})();
// prettier-ignore
(node/*: any*/).hash = 'fab778d2924d1e0b30c094cc7dfa5572';

module.exports = node;
