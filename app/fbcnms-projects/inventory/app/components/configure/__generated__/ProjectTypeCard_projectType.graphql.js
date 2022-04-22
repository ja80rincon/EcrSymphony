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
declare export opaque type ProjectTypeCard_projectType$ref: FragmentReference;
declare export opaque type ProjectTypeCard_projectType$fragmentType: ProjectTypeCard_projectType$ref;
export type ProjectTypeCard_projectType = {|
  +id: string,
  +name: string,
  +description: ?string,
  +numberOfProjects: number,
  +workOrders: $ReadOnlyArray<?{|
    +id: string
  |}>,
  +$refType: ProjectTypeCard_projectType$ref,
|};
export type ProjectTypeCard_projectType$data = ProjectTypeCard_projectType;
export type ProjectTypeCard_projectType$key = {
  +$data?: ProjectTypeCard_projectType$data,
  +$fragmentRefs: ProjectTypeCard_projectType$ref,
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
  "name": "ProjectTypeCard_projectType",
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
      "name": "description",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "numberOfProjects",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "WorkOrderDefinition",
      "kind": "LinkedField",
      "name": "workOrders",
      "plural": true,
      "selections": [
        (v0/*: any*/)
      ],
      "storageKey": null
    }
  ],
  "type": "ProjectType",
  "abstractKey": null
};
})();
// prettier-ignore
(node/*: any*/).hash = 'a0ed06d279a9e96ad0fbb45c505ad5e8';

module.exports = node;
