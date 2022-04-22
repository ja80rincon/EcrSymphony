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
import type { ConcreteRequest } from 'relay-runtime';
export type PermissionValue = "BY_CONDITION" | "NO" | "YES" | "%future added value";
export type UserRole = "ADMIN" | "OWNER" | "USER" | "%future added value";
export type UserStatus = "ACTIVE" | "DEACTIVATED" | "%future added value";
export type UsersGroupStatus = "ACTIVE" | "DEACTIVATED" | "%future added value";
export type PermissionsPoliciesSearchQueryVariables = {|
  policyId: string
|};
export type PermissionsPoliciesSearchQueryResponse = {|
  +policy: ?{|
    +id?: string,
    +name?: string,
    +description?: ?string,
    +isGlobal?: boolean,
    +policy?: {|
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
    +groups?: $ReadOnlyArray<{|
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
  |}
|};
export type PermissionsPoliciesSearchQuery = {|
  variables: PermissionsPoliciesSearchQueryVariables,
  response: PermissionsPoliciesSearchQueryResponse,
|};
*/


/*
query PermissionsPoliciesSearchQuery(
  $policyId: ID!
) {
  policy: node(id: $policyId) {
    __typename
    ... on PermissionsPolicy {
      id
      name
      description
      isGlobal
      policy {
        __typename
        ... on InventoryPolicy {
          read {
            isAllowed
          }
          propertyCategory {
            read {
              isAllowed
              propertyCategoryIds
            }
            create {
              isAllowed
              propertyCategoryIds
            }
            update {
              isAllowed
              propertyCategoryIds
            }
            delete {
              isAllowed
              propertyCategoryIds
            }
          }
          documentCategory {
            locationTypeID
            read {
              isAllowed
              documentCategoryIds
            }
            create {
              isAllowed
              documentCategoryIds
            }
            update {
              isAllowed
              documentCategoryIds
            }
            delete {
              isAllowed
              documentCategoryIds
            }
          }
          location {
            create {
              isAllowed
            }
            update {
              isAllowed
              locationTypeIds
            }
            delete {
              isAllowed
            }
          }
          equipment {
            create {
              isAllowed
            }
            update {
              isAllowed
            }
            delete {
              isAllowed
            }
          }
          equipmentType {
            create {
              isAllowed
            }
            update {
              isAllowed
            }
            delete {
              isAllowed
            }
          }
          locationType {
            create {
              isAllowed
            }
            update {
              isAllowed
            }
            delete {
              isAllowed
            }
          }
          portType {
            create {
              isAllowed
            }
            update {
              isAllowed
            }
            delete {
              isAllowed
            }
          }
          serviceType {
            create {
              isAllowed
            }
            update {
              isAllowed
            }
            delete {
              isAllowed
            }
          }
        }
        ... on WorkforcePolicy {
          read {
            isAllowed
            projectTypeIds
            workOrderTypeIds
            organizationIds
          }
          templates {
            create {
              isAllowed
            }
            update {
              isAllowed
            }
            delete {
              isAllowed
            }
          }
          data {
            create {
              isAllowed
            }
            update {
              isAllowed
            }
            delete {
              isAllowed
            }
            assign {
              isAllowed
            }
            transferOwnership {
              isAllowed
            }
          }
        }
      }
      groups {
        id
        name
        description
        status
        members {
          id
          authID
          firstName
          lastName
          email
          status
          role
          organizationFk {
            id
            name
            description
          }
        }
        policies {
          id
          name
          description
          isGlobal
          policy {
            __typename
            ... on InventoryPolicy {
              read {
                isAllowed
              }
              propertyCategory {
                read {
                  isAllowed
                  propertyCategoryIds
                }
                create {
                  isAllowed
                  propertyCategoryIds
                }
                update {
                  isAllowed
                  propertyCategoryIds
                }
                delete {
                  isAllowed
                  propertyCategoryIds
                }
              }
              documentCategory {
                locationTypeID
                read {
                  isAllowed
                  documentCategoryIds
                }
                create {
                  isAllowed
                  documentCategoryIds
                }
                update {
                  isAllowed
                  documentCategoryIds
                }
                delete {
                  isAllowed
                  documentCategoryIds
                }
              }
              location {
                create {
                  isAllowed
                }
                update {
                  isAllowed
                  locationTypeIds
                }
                delete {
                  isAllowed
                }
              }
              equipment {
                create {
                  isAllowed
                }
                update {
                  isAllowed
                }
                delete {
                  isAllowed
                }
              }
              equipmentType {
                create {
                  isAllowed
                }
                update {
                  isAllowed
                }
                delete {
                  isAllowed
                }
              }
              locationType {
                create {
                  isAllowed
                }
                update {
                  isAllowed
                }
                delete {
                  isAllowed
                }
              }
              portType {
                create {
                  isAllowed
                }
                update {
                  isAllowed
                }
                delete {
                  isAllowed
                }
              }
              serviceType {
                create {
                  isAllowed
                }
                update {
                  isAllowed
                }
                delete {
                  isAllowed
                }
              }
            }
            ... on WorkforcePolicy {
              read {
                isAllowed
                projectTypeIds
                workOrderTypeIds
                organizationIds
              }
              templates {
                create {
                  isAllowed
                }
                update {
                  isAllowed
                }
                delete {
                  isAllowed
                }
              }
              data {
                create {
                  isAllowed
                }
                update {
                  isAllowed
                }
                delete {
                  isAllowed
                }
                assign {
                  isAllowed
                }
                transferOwnership {
                  isAllowed
                }
              }
            }
          }
        }
      }
    }
    id
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "policyId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "policyId"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "description",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isGlobal",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isAllowed",
  "storageKey": null
},
v8 = [
  (v7/*: any*/)
],
v9 = [
  (v7/*: any*/),
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "propertyCategoryIds",
    "storageKey": null
  }
],
v10 = [
  (v7/*: any*/),
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "documentCategoryIds",
    "storageKey": null
  }
],
v11 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "BasicPermissionRule",
    "kind": "LinkedField",
    "name": "create",
    "plural": false,
    "selections": (v8/*: any*/),
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "concreteType": "BasicPermissionRule",
    "kind": "LinkedField",
    "name": "update",
    "plural": false,
    "selections": (v8/*: any*/),
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "concreteType": "BasicPermissionRule",
    "kind": "LinkedField",
    "name": "delete",
    "plural": false,
    "selections": (v8/*: any*/),
    "storageKey": null
  }
],
v12 = {
  "alias": null,
  "args": null,
  "concreteType": null,
  "kind": "LinkedField",
  "name": "policy",
  "plural": false,
  "selections": [
    (v6/*: any*/),
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
          "selections": (v8/*: any*/),
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
              "selections": (v9/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "PropertyCategoryPermissionRule",
              "kind": "LinkedField",
              "name": "create",
              "plural": false,
              "selections": (v9/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "PropertyCategoryPermissionRule",
              "kind": "LinkedField",
              "name": "update",
              "plural": false,
              "selections": (v9/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "PropertyCategoryPermissionRule",
              "kind": "LinkedField",
              "name": "delete",
              "plural": false,
              "selections": (v9/*: any*/),
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
              "selections": (v10/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "DocumentCategoryPermissionRule",
              "kind": "LinkedField",
              "name": "create",
              "plural": false,
              "selections": (v10/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "DocumentCategoryPermissionRule",
              "kind": "LinkedField",
              "name": "update",
              "plural": false,
              "selections": (v10/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "DocumentCategoryPermissionRule",
              "kind": "LinkedField",
              "name": "delete",
              "plural": false,
              "selections": (v10/*: any*/),
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
              "selections": (v8/*: any*/),
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
                (v7/*: any*/),
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
              "selections": (v8/*: any*/),
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
          "selections": (v11/*: any*/),
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "CUD",
          "kind": "LinkedField",
          "name": "equipmentType",
          "plural": false,
          "selections": (v11/*: any*/),
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "CUD",
          "kind": "LinkedField",
          "name": "locationType",
          "plural": false,
          "selections": (v11/*: any*/),
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "CUD",
          "kind": "LinkedField",
          "name": "portType",
          "plural": false,
          "selections": (v11/*: any*/),
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "CUD",
          "kind": "LinkedField",
          "name": "serviceType",
          "plural": false,
          "selections": (v11/*: any*/),
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
            (v7/*: any*/),
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
          "selections": (v11/*: any*/),
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
              "selections": (v8/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "WorkforcePermissionRule",
              "kind": "LinkedField",
              "name": "update",
              "plural": false,
              "selections": (v8/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "WorkforcePermissionRule",
              "kind": "LinkedField",
              "name": "delete",
              "plural": false,
              "selections": (v8/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "WorkforcePermissionRule",
              "kind": "LinkedField",
              "name": "assign",
              "plural": false,
              "selections": (v8/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "WorkforcePermissionRule",
              "kind": "LinkedField",
              "name": "transferOwnership",
              "plural": false,
              "selections": (v8/*: any*/),
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
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "status",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "concreteType": "UsersGroup",
  "kind": "LinkedField",
  "name": "groups",
  "plural": true,
  "selections": [
    (v2/*: any*/),
    (v3/*: any*/),
    (v4/*: any*/),
    (v13/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "User",
      "kind": "LinkedField",
      "name": "members",
      "plural": true,
      "selections": [
        (v2/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "authID",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "firstName",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "lastName",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "email",
          "storageKey": null
        },
        (v13/*: any*/),
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
          "concreteType": "Organization",
          "kind": "LinkedField",
          "name": "organizationFk",
          "plural": false,
          "selections": [
            (v2/*: any*/),
            (v3/*: any*/),
            (v4/*: any*/)
          ],
          "storageKey": null
        }
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
        (v2/*: any*/),
        (v3/*: any*/),
        (v4/*: any*/),
        (v5/*: any*/),
        (v12/*: any*/)
      ],
      "storageKey": null
    }
  ],
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "PermissionsPoliciesSearchQuery",
    "selections": [
      {
        "alias": "policy",
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          {
            "kind": "InlineFragment",
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/),
              (v12/*: any*/),
              (v14/*: any*/)
            ],
            "type": "PermissionsPolicy",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "PermissionsPoliciesSearchQuery",
    "selections": [
      {
        "alias": "policy",
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v6/*: any*/),
          (v2/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v3/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/),
              (v12/*: any*/),
              (v14/*: any*/)
            ],
            "type": "PermissionsPolicy",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "e34bf578dad7d4005c08bb951029ab41",
    "id": null,
    "metadata": {},
    "name": "PermissionsPoliciesSearchQuery",
    "operationKind": "query",
    "text": "query PermissionsPoliciesSearchQuery(\n  $policyId: ID!\n) {\n  policy: node(id: $policyId) {\n    __typename\n    ... on PermissionsPolicy {\n      id\n      name\n      description\n      isGlobal\n      policy {\n        __typename\n        ... on InventoryPolicy {\n          read {\n            isAllowed\n          }\n          propertyCategory {\n            read {\n              isAllowed\n              propertyCategoryIds\n            }\n            create {\n              isAllowed\n              propertyCategoryIds\n            }\n            update {\n              isAllowed\n              propertyCategoryIds\n            }\n            delete {\n              isAllowed\n              propertyCategoryIds\n            }\n          }\n          documentCategory {\n            locationTypeID\n            read {\n              isAllowed\n              documentCategoryIds\n            }\n            create {\n              isAllowed\n              documentCategoryIds\n            }\n            update {\n              isAllowed\n              documentCategoryIds\n            }\n            delete {\n              isAllowed\n              documentCategoryIds\n            }\n          }\n          location {\n            create {\n              isAllowed\n            }\n            update {\n              isAllowed\n              locationTypeIds\n            }\n            delete {\n              isAllowed\n            }\n          }\n          equipment {\n            create {\n              isAllowed\n            }\n            update {\n              isAllowed\n            }\n            delete {\n              isAllowed\n            }\n          }\n          equipmentType {\n            create {\n              isAllowed\n            }\n            update {\n              isAllowed\n            }\n            delete {\n              isAllowed\n            }\n          }\n          locationType {\n            create {\n              isAllowed\n            }\n            update {\n              isAllowed\n            }\n            delete {\n              isAllowed\n            }\n          }\n          portType {\n            create {\n              isAllowed\n            }\n            update {\n              isAllowed\n            }\n            delete {\n              isAllowed\n            }\n          }\n          serviceType {\n            create {\n              isAllowed\n            }\n            update {\n              isAllowed\n            }\n            delete {\n              isAllowed\n            }\n          }\n        }\n        ... on WorkforcePolicy {\n          read {\n            isAllowed\n            projectTypeIds\n            workOrderTypeIds\n            organizationIds\n          }\n          templates {\n            create {\n              isAllowed\n            }\n            update {\n              isAllowed\n            }\n            delete {\n              isAllowed\n            }\n          }\n          data {\n            create {\n              isAllowed\n            }\n            update {\n              isAllowed\n            }\n            delete {\n              isAllowed\n            }\n            assign {\n              isAllowed\n            }\n            transferOwnership {\n              isAllowed\n            }\n          }\n        }\n      }\n      groups {\n        id\n        name\n        description\n        status\n        members {\n          id\n          authID\n          firstName\n          lastName\n          email\n          status\n          role\n          organizationFk {\n            id\n            name\n            description\n          }\n        }\n        policies {\n          id\n          name\n          description\n          isGlobal\n          policy {\n            __typename\n            ... on InventoryPolicy {\n              read {\n                isAllowed\n              }\n              propertyCategory {\n                read {\n                  isAllowed\n                  propertyCategoryIds\n                }\n                create {\n                  isAllowed\n                  propertyCategoryIds\n                }\n                update {\n                  isAllowed\n                  propertyCategoryIds\n                }\n                delete {\n                  isAllowed\n                  propertyCategoryIds\n                }\n              }\n              documentCategory {\n                locationTypeID\n                read {\n                  isAllowed\n                  documentCategoryIds\n                }\n                create {\n                  isAllowed\n                  documentCategoryIds\n                }\n                update {\n                  isAllowed\n                  documentCategoryIds\n                }\n                delete {\n                  isAllowed\n                  documentCategoryIds\n                }\n              }\n              location {\n                create {\n                  isAllowed\n                }\n                update {\n                  isAllowed\n                  locationTypeIds\n                }\n                delete {\n                  isAllowed\n                }\n              }\n              equipment {\n                create {\n                  isAllowed\n                }\n                update {\n                  isAllowed\n                }\n                delete {\n                  isAllowed\n                }\n              }\n              equipmentType {\n                create {\n                  isAllowed\n                }\n                update {\n                  isAllowed\n                }\n                delete {\n                  isAllowed\n                }\n              }\n              locationType {\n                create {\n                  isAllowed\n                }\n                update {\n                  isAllowed\n                }\n                delete {\n                  isAllowed\n                }\n              }\n              portType {\n                create {\n                  isAllowed\n                }\n                update {\n                  isAllowed\n                }\n                delete {\n                  isAllowed\n                }\n              }\n              serviceType {\n                create {\n                  isAllowed\n                }\n                update {\n                  isAllowed\n                }\n                delete {\n                  isAllowed\n                }\n              }\n            }\n            ... on WorkforcePolicy {\n              read {\n                isAllowed\n                projectTypeIds\n                workOrderTypeIds\n                organizationIds\n              }\n              templates {\n                create {\n                  isAllowed\n                }\n                update {\n                  isAllowed\n                }\n                delete {\n                  isAllowed\n                }\n              }\n              data {\n                create {\n                  isAllowed\n                }\n                update {\n                  isAllowed\n                }\n                delete {\n                  isAllowed\n                }\n                assign {\n                  isAllowed\n                }\n                transferOwnership {\n                  isAllowed\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n    id\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'bf6b6cff273a4693e30470fb5595dca8';

module.exports = node;
