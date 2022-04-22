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
declare export opaque type UserManagementUtils_organization$ref: FragmentReference;
declare export opaque type UserManagementUtils_organization$fragmentType: UserManagementUtils_organization$ref;
export type UserManagementUtils_organization = {|
  +id: string,
  +name: string,
  +description: string,
  +$refType: UserManagementUtils_organization$ref,
|};
export type UserManagementUtils_organization$data = UserManagementUtils_organization;
export type UserManagementUtils_organization$key = {
  +$data?: UserManagementUtils_organization$data,
  +$fragmentRefs: UserManagementUtils_organization$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "UserManagementUtils_organization",
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
      "name": "description",
      "storageKey": null
    }
  ],
  "type": "Organization",
  "abstractKey": null
};
// prettier-ignore
(node/*: any*/).hash = '26720fc5121cc80da071d9893de50b7f';

module.exports = node;
