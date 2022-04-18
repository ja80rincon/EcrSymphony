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
export type PermissionValue = "BY_CONDITION" | "NO" | "YES" | "%future added value";
export type UserRole = "ADMIN" | "OWNER" | "USER" | "%future added value";
export type UserStatus = "ACTIVE" | "DEACTIVATED" | "%future added value";
export type UsersGroupStatus = "ACTIVE" | "DEACTIVATED" | "%future added value";
import type { FragmentReference } from "relay-runtime";
declare export opaque type UserManagementUtils_user$ref: FragmentReference;
declare export opaque type UserManagementUtils_user$fragmentType: UserManagementUtils_user$ref;
export type UserManagementUtils_user = {|
  +id: string,
  +authID: string,
  +firstName: string,
  +lastName: string,
  +email: string,
  +status: UserStatus,
  +role: UserRole,
  +organizationFk: ?{|
    +id: string,
    +name: string,
    +description: string,
  |},
  +groups: $ReadOnlyArray<?{|
    +id: string,
    +name: string,
    +description: ?string,
    +status: UsersGroupStatus,
    +members: $ReadOnlyArray<{|
      +id: string,
      +authID: string,
      +firstName: string,
      +lastName: string,
      +email: string,
      +status: UserStatus,
      +role: UserRole,
      +organizationFk: ?{|
        +id: string,
        +name: string,
        +description: string,
      |},
    |}>,
    +policies: $ReadOnlyArray<{|
      +id: string,
      +name: string,
      +description: ?string,
      +isGlobal: boolean,
      +policy: {|
        +__typename: "InventoryPolicy",
        +read: {|
          +isAllowed: PermissionValue
        |},
        +propertyCategory: {|
          +read: ?{|
            +isAllowed: PermissionValue,
            +propertyCategoryIds: ?$ReadOnlyArray<string>,
          |},
          +create: ?{|
            +isAllowed: PermissionValue,
            +propertyCategoryIds: ?$ReadOnlyArray<string>,
          |},
          +update: ?{|
            +isAllowed: PermissionValue,
            +propertyCategoryIds: ?$ReadOnlyArray<string>,
          |},
          +delete: ?{|
            +isAllowed: PermissionValue,
            +propertyCategoryIds: ?$ReadOnlyArray<string>,
          |},
        |},
        +documentCategory: {|
          +locationTypeID: ?number,
          +read: ?{|
            +isAllowed: PermissionValue,
            +documentCategoryIds: ?$ReadOnlyArray<string>,
          |},
          +create: ?{|
            +isAllowed: PermissionValue,
            +documentCategoryIds: ?$ReadOnlyArray<string>,
          |},
          +update: ?{|
            +isAllowed: PermissionValue,
            +documentCategoryIds: ?$ReadOnlyArray<string>,
          |},
          +delete: ?{|
            +isAllowed: PermissionValue,
            +documentCategoryIds: ?$ReadOnlyArray<string>,
          |},
        |},
        +location: {|
          +create: {|
            +isAllowed: PermissionValue
          |},
          +update: {|
            +isAllowed: PermissionValue,
            +locationTypeIds: ?$ReadOnlyArray<string>,
          |},
          +delete: {|
            +isAllowed: PermissionValue
          |},
        |},
        +equipment: {|
          +create: {|
            +isAllowed: PermissionValue
          |},
          +update: {|
            +isAllowed: PermissionValue
          |},
          +delete: {|
            +isAllowed: PermissionValue
          |},
        |},
        +equipmentType: {|
          +create: {|
            +isAllowed: PermissionValue
          |},
          +update: {|
            +isAllowed: PermissionValue
          |},
          +delete: {|
            +isAllowed: PermissionValue
          |},
        |},
        +locationType: {|
          +create: {|
            +isAllowed: PermissionValue
          |},
          +update: {|
            +isAllowed: PermissionValue
          |},
          +delete: {|
            +isAllowed: PermissionValue
          |},
        |},
        +portType: {|
          +create: {|
            +isAllowed: PermissionValue
          |},
          +update: {|
            +isAllowed: PermissionValue
          |},
          +delete: {|
            +isAllowed: PermissionValue
          |},
        |},
        +serviceType: {|
          +create: {|
            +isAllowed: PermissionValue
          |},
          +update: {|
            +isAllowed: PermissionValue
          |},
          +delete: {|
            +isAllowed: PermissionValue
          |},
        |},
      |} | {|
        +__typename: "WorkforcePolicy",
        +read: {|
          +isAllowed: PermissionValue,
          +projectTypeIds: ?$ReadOnlyArray<string>,
          +workOrderTypeIds: ?$ReadOnlyArray<string>,
          +organizationIds: ?$ReadOnlyArray<string>,
        |},
        +templates: {|
          +create: {|
            +isAllowed: PermissionValue
          |},
          +update: {|
            +isAllowed: PermissionValue
          |},
          +delete: {|
            +isAllowed: PermissionValue
          |},
        |},
        +data: {|
          +create: {|
            +isAllowed: PermissionValue
          |},
          +update: {|
            +isAllowed: PermissionValue
          |},
          +delete: {|
            +isAllowed: PermissionValue
          |},
          +assign: {|
            +isAllowed: PermissionValue
          |},
          +transferOwnership: {|
            +isAllowed: PermissionValue
          |},
        |},
      |} | {|
        // This will never be '%other', but we need some
        // value in case none of the concrete values match.
        +__typename: "%other"
      |},
    |}>,
  |}>,
  +$refType: UserManagementUtils_user$ref,
|};
export type UserManagementUtils_user$data = UserManagementUtils_user;
export type UserManagementUtils_user$key = {
  +$data?: UserManagementUtils_user$data,
  +$fragmentRefs: UserManagementUtils_user$ref,
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
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "authID",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "firstName",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "lastName",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "email",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "status",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "role",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "description",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "concreteType": "Organization",
  "kind": "LinkedField",
  "name": "organizationFk",
  "plural": false,
  "selections": [
    (v0/*: any*/),
    (v7/*: any*/),
    (v8/*: any*/)
  ],
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isAllowed",
  "storageKey": null
},
v11 = [
  (v10/*: any*/)
],
v12 = [
  (v10/*: any*/),
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "propertyCategoryIds",
    "storageKey": null
  }
],
v13 = [
  (v10/*: any*/),
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "documentCategoryIds",
    "storageKey": null
  }
],
v14 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "BasicPermissionRule",
    "kind": "LinkedField",
    "name": "create",
    "plural": false,
    "selections": (v11/*: any*/),
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "concreteType": "BasicPermissionRule",
    "kind": "LinkedField",
    "name": "update",
    "plural": false,
    "selections": (v11/*: any*/),
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "concreteType": "BasicPermissionRule",
    "kind": "LinkedField",
    "name": "delete",
    "plural": false,
    "selections": (v11/*: any*/),
    "storageKey": null
  }
];
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "UserManagementUtils_user",
  "selections": [
    (v0/*: any*/),
    (v1/*: any*/),
    (v2/*: any*/),
    (v3/*: any*/),
    (v4/*: any*/),
    (v5/*: any*/),
    (v6/*: any*/),
    (v9/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "UsersGroup",
      "kind": "LinkedField",
      "name": "groups",
      "plural": true,
      "selections": [
        (v0/*: any*/),
        (v7/*: any*/),
        (v8/*: any*/),
        (v5/*: any*/),
        {
          "alias": null,
          "args": null,
          "concreteType": "User",
          "kind": "LinkedField",
          "name": "members",
          "plural": true,
          "selections": [
            (v0/*: any*/),
            (v1/*: any*/),
            (v2/*: any*/),
            (v3/*: any*/),
            (v4/*: any*/),
            (v5/*: any*/),
            (v6/*: any*/),
            (v9/*: any*/)
          ],
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "PermissionsPolicy",
          "kind": "LinkedField",
          "name": "policies",
          "plural": true,
          "selections": [
            (v0/*: any*/),
            (v7/*: any*/),
            (v8/*: any*/),
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "isGlobal",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": null,
              "kind": "LinkedField",
              "name": "policy",
              "plural": false,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "__typename",
                  "storageKey": null
                },
                {
                  "kind": "InlineFragment",
                  "selections": [
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "BasicPermissionRule",
                      "kind": "LinkedField",
                      "name": "read",
                      "plural": false,
                      "selections": (v11/*: any*/),
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "PropertyCategoryCUD",
                      "kind": "LinkedField",
                      "name": "propertyCategory",
                      "plural": false,
                      "selections": [
                        {
                          "alias": null,
                          "args": null,
                          "concreteType": "PropertyCategoryPermissionRule",
                          "kind": "LinkedField",
                          "name": "read",
                          "plural": false,
                          "selections": (v12/*: any*/),
                          "storageKey": null
                        },
                        {
                          "alias": null,
                          "args": null,
                          "concreteType": "PropertyCategoryPermissionRule",
                          "kind": "LinkedField",
                          "name": "create",
                          "plural": false,
                          "selections": (v12/*: any*/),
                          "storageKey": null
                        },
                        {
                          "alias": null,
                          "args": null,
                          "concreteType": "PropertyCategoryPermissionRule",
                          "kind": "LinkedField",
                          "name": "update",
                          "plural": false,
                          "selections": (v12/*: any*/),
                          "storageKey": null
                        },
                        {
                          "alias": null,
                          "args": null,
                          "concreteType": "PropertyCategoryPermissionRule",
                          "kind": "LinkedField",
                          "name": "delete",
                          "plural": false,
                          "selections": (v12/*: any*/),
                          "storageKey": null
                        }
                      ],
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "DocumentCategoryCUD",
                      "kind": "LinkedField",
                      "name": "documentCategory",
                      "plural": false,
                      "selections": [
                        {
                          "alias": null,
                          "args": null,
                          "kind": "ScalarField",
                          "name": "locationTypeID",
                          "storageKey": null
                        },
                        {
                          "alias": null,
                          "args": null,
                          "concreteType": "DocumentCategoryPermissionRule",
                          "kind": "LinkedField",
                          "name": "read",
                          "plural": false,
                          "selections": (v13/*: any*/),
                          "storageKey": null
                        },
                        {
                          "alias": null,
                          "args": null,
                          "concreteType": "DocumentCategoryPermissionRule",
                          "kind": "LinkedField",
                          "name": "create",
                          "plural": false,
                          "selections": (v13/*: any*/),
                          "storageKey": null
                        },
                        {
                          "alias": null,
                          "args": null,
                          "concreteType": "DocumentCategoryPermissionRule",
                          "kind": "LinkedField",
                          "name": "update",
                          "plural": false,
                          "selections": (v13/*: any*/),
                          "storageKey": null
                        },
                        {
                          "alias": null,
                          "args": null,
                          "concreteType": "DocumentCategoryPermissionRule",
                          "kind": "LinkedField",
                          "name": "delete",
                          "plural": false,
                          "selections": (v13/*: any*/),
                          "storageKey": null
                        }
                      ],
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "LocationCUD",
                      "kind": "LinkedField",
                      "name": "location",
                      "plural": false,
                      "selections": [
                        {
                          "alias": null,
                          "args": null,
                          "concreteType": "LocationPermissionRule",
                          "kind": "LinkedField",
                          "name": "create",
                          "plural": false,
                          "selections": (v11/*: any*/),
                          "storageKey": null
                        },
                        {
                          "alias": null,
                          "args": null,
                          "concreteType": "LocationPermissionRule",
                          "kind": "LinkedField",
                          "name": "update",
                          "plural": false,
                          "selections": [
                            (v10/*: any*/),
                            {
                              "alias": null,
                              "args": null,
                              "kind": "ScalarField",
                              "name": "locationTypeIds",
                              "storageKey": null
                            }
                          ],
                          "storageKey": null
                        },
                        {
                          "alias": null,
                          "args": null,
                          "concreteType": "LocationPermissionRule",
                          "kind": "LinkedField",
                          "name": "delete",
                          "plural": false,
                          "selections": (v11/*: any*/),
                          "storageKey": null
                        }
                      ],
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "CUD",
                      "kind": "LinkedField",
                      "name": "equipment",
                      "plural": false,
                      "selections": (v14/*: any*/),
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "CUD",
                      "kind": "LinkedField",
                      "name": "equipmentType",
                      "plural": false,
                      "selections": (v14/*: any*/),
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "CUD",
                      "kind": "LinkedField",
                      "name": "locationType",
                      "plural": false,
                      "selections": (v14/*: any*/),
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "CUD",
                      "kind": "LinkedField",
                      "name": "portType",
                      "plural": false,
                      "selections": (v14/*: any*/),
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "CUD",
                      "kind": "LinkedField",
                      "name": "serviceType",
                      "plural": false,
                      "selections": (v14/*: any*/),
                      "storageKey": null
                    }
                  ],
                  "type": "InventoryPolicy",
                  "abstractKey": null
                },
                {
                  "kind": "InlineFragment",
                  "selections": [
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "WorkforcePermissionRule",
                      "kind": "LinkedField",
                      "name": "read",
                      "plural": false,
                      "selections": [
                        (v10/*: any*/),
                        {
                          "alias": null,
                          "args": null,
                          "kind": "ScalarField",
                          "name": "projectTypeIds",
                          "storageKey": null
                        },
                        {
                          "alias": null,
                          "args": null,
                          "kind": "ScalarField",
                          "name": "workOrderTypeIds",
                          "storageKey": null
                        },
                        {
                          "alias": null,
                          "args": null,
                          "kind": "ScalarField",
                          "name": "organizationIds",
                          "storageKey": null
                        }
                      ],
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "CUD",
                      "kind": "LinkedField",
                      "name": "templates",
                      "plural": false,
                      "selections": (v14/*: any*/),
                      "storageKey": null
                    },
                    {
                      "alias": null,
                      "args": null,
                      "concreteType": "WorkforceCUD",
                      "kind": "LinkedField",
                      "name": "data",
                      "plural": false,
                      "selections": [
                        {
                          "alias": null,
                          "args": null,
                          "concreteType": "WorkforcePermissionRule",
                          "kind": "LinkedField",
                          "name": "create",
                          "plural": false,
                          "selections": (v11/*: any*/),
                          "storageKey": null
                        },
                        {
                          "alias": null,
                          "args": null,
                          "concreteType": "WorkforcePermissionRule",
                          "kind": "LinkedField",
                          "name": "update",
                          "plural": false,
                          "selections": (v11/*: any*/),
                          "storageKey": null
                        },
                        {
                          "alias": null,
                          "args": null,
                          "concreteType": "WorkforcePermissionRule",
                          "kind": "LinkedField",
                          "name": "delete",
                          "plural": false,
                          "selections": (v11/*: any*/),
                          "storageKey": null
                        },
                        {
                          "alias": null,
                          "args": null,
                          "concreteType": "WorkforcePermissionRule",
                          "kind": "LinkedField",
                          "name": "assign",
                          "plural": false,
                          "selections": (v11/*: any*/),
                          "storageKey": null
                        },
                        {
                          "alias": null,
                          "args": null,
                          "concreteType": "WorkforcePermissionRule",
                          "kind": "LinkedField",
                          "name": "transferOwnership",
                          "plural": false,
                          "selections": (v11/*: any*/),
                          "storageKey": null
                        }
                      ],
                      "storageKey": null
                    }
                  ],
                  "type": "WorkforcePolicy",
                  "abstractKey": null
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "User",
  "abstractKey": null
};
})();
// prettier-ignore
(node/*: any*/).hash = '2e1894aed9fc5d8a679dc0cda813fefc';

module.exports = node;
