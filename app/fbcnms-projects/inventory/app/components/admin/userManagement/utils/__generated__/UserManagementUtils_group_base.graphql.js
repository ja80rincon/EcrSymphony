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
export type UsersGroupStatus = "ACTIVE" | "DEACTIVATED" | "%future added value";
import type { FragmentReference } from "relay-runtime";
declare export opaque type UserManagementUtils_group_base$ref: FragmentReference;
declare export opaque type UserManagementUtils_group_base$fragmentType: UserManagementUtils_group_base$ref;
export type UserManagementUtils_group_base = {|
  +id: string,
  +name: string,
  +description: ?string,
  +status: UsersGroupStatus,
  +$refType: UserManagementUtils_group_base$ref,
|};
export type UserManagementUtils_group_base$data = UserManagementUtils_group_base;
export type UserManagementUtils_group_base$key = {
  +$data?: UserManagementUtils_group_base$data,
  +$fragmentRefs: UserManagementUtils_group_base$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "UserManagementUtils_group_base",
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
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "status",
      "storageKey": null
    }
  ],
  "type": "UsersGroup",
  "abstractKey": null
};
// prettier-ignore
(node/*: any*/).hash = 'f8f72157e01583f91e7d865430b1f224';

module.exports = node;
