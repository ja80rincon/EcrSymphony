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
export type MainContextMeQueryVariables = {||};
export type MainContextMeQueryResponse = {|
  +me: ?{|
    +user: ?{|
      +id: string,
      +authID: string,
      +email: string,
      +firstName: string,
      +lastName: string,
      +organizationFk: ?{|
        +id: string,
        +name: string,
        +description: string,
      |},
    |},
    +permissions: {|
      +adminPolicy: {|
        +access: {|
          +isAllowed: PermissionValue
        |}
      |},
      +inventoryPolicy: {|
        +read: {|
          +isAllowed: PermissionValue
        |},
        +location: {|
          +create: {|
            +isAllowed: PermissionValue,
            +locationTypeIds: ?$ReadOnlyArray<string>,
          |},
          +update: {|
            +isAllowed: PermissionValue,
            +locationTypeIds: ?$ReadOnlyArray<string>,
          |},
          +delete: {|
            +isAllowed: PermissionValue,
            +locationTypeIds: ?$ReadOnlyArray<string>,
          |},
        |},
        +documentCategory: {|
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
      |},
      +workforcePolicy: {|
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
            +isAllowed: PermissionValue,
            +projectTypeIds: ?$ReadOnlyArray<string>,
            +workOrderTypeIds: ?$ReadOnlyArray<string>,
          |},
          +update: {|
            +isAllowed: PermissionValue,
            +projectTypeIds: ?$ReadOnlyArray<string>,
            +workOrderTypeIds: ?$ReadOnlyArray<string>,
          |},
          +delete: {|
            +isAllowed: PermissionValue,
            +projectTypeIds: ?$ReadOnlyArray<string>,
            +workOrderTypeIds: ?$ReadOnlyArray<string>,
          |},
          +assign: {|
            +isAllowed: PermissionValue,
            +projectTypeIds: ?$ReadOnlyArray<string>,
            +workOrderTypeIds: ?$ReadOnlyArray<string>,
          |},
          +transferOwnership: {|
            +isAllowed: PermissionValue,
            +projectTypeIds: ?$ReadOnlyArray<string>,
            +workOrderTypeIds: ?$ReadOnlyArray<string>,
          |},
        |},
      |},
      +automationPolicy: {|
        +read: {|
          +isAllowed: PermissionValue
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
      |},
    |},
  |}
|};
export type MainContextMeQuery = {|
  variables: MainContextMeQueryVariables,
  response: MainContextMeQueryResponse,
|};
*/


/*
query MainContextMeQuery {
  me {
    user {
      id
      authID
      email
      firstName
      lastName
      organizationFk {
        id
        name
        description
      }
    }
    permissions {
      adminPolicy {
        access {
          isAllowed
        }
      }
      inventoryPolicy {
        read {
          isAllowed
        }
        location {
          create {
            isAllowed
            locationTypeIds
          }
          update {
            isAllowed
            locationTypeIds
          }
          delete {
            isAllowed
            locationTypeIds
          }
        }
        documentCategory {
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
      workforcePolicy {
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
            projectTypeIds
            workOrderTypeIds
          }
          update {
            isAllowed
            projectTypeIds
            workOrderTypeIds
          }
          delete {
            isAllowed
            projectTypeIds
            workOrderTypeIds
          }
          assign {
            isAllowed
            projectTypeIds
            workOrderTypeIds
          }
          transferOwnership {
            isAllowed
            projectTypeIds
            workOrderTypeIds
          }
        }
      }
      automationPolicy {
        read {
          isAllowed
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
      }
    }
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
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
  "name": "isAllowed",
  "storageKey": null
},
v2 = [
  (v1/*: any*/)
],
v3 = {
  "alias": null,
  "args": null,
  "concreteType": "BasicPermissionRule",
  "kind": "LinkedField",
  "name": "read",
  "plural": false,
  "selections": (v2/*: any*/),
  "storageKey": null
},
v4 = [
  (v1/*: any*/),
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "locationTypeIds",
    "storageKey": null
  }
],
v5 = [
  (v1/*: any*/),
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "documentCategoryIds",
    "storageKey": null
  }
],
v6 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "BasicPermissionRule",
    "kind": "LinkedField",
    "name": "create",
    "plural": false,
    "selections": (v2/*: any*/),
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "concreteType": "BasicPermissionRule",
    "kind": "LinkedField",
    "name": "update",
    "plural": false,
    "selections": (v2/*: any*/),
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "concreteType": "BasicPermissionRule",
    "kind": "LinkedField",
    "name": "delete",
    "plural": false,
    "selections": (v2/*: any*/),
    "storageKey": null
  }
],
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "projectTypeIds",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "workOrderTypeIds",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "concreteType": "CUD",
  "kind": "LinkedField",
  "name": "templates",
  "plural": false,
  "selections": (v6/*: any*/),
  "storageKey": null
},
v10 = [
  (v1/*: any*/),
  (v7/*: any*/),
  (v8/*: any*/)
],
v11 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "Viewer",
    "kind": "LinkedField",
    "name": "me",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "User",
        "kind": "LinkedField",
        "name": "user",
        "plural": false,
        "selections": [
          (v0/*: any*/),
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
            "name": "email",
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
            "concreteType": "Organization",
            "kind": "LinkedField",
            "name": "organizationFk",
            "plural": false,
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
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "PermissionSettings",
        "kind": "LinkedField",
        "name": "permissions",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "AdministrativePolicy",
            "kind": "LinkedField",
            "name": "adminPolicy",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "BasicPermissionRule",
                "kind": "LinkedField",
                "name": "access",
                "plural": false,
                "selections": (v2/*: any*/),
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "InventoryPolicy",
            "kind": "LinkedField",
            "name": "inventoryPolicy",
            "plural": false,
            "selections": [
              (v3/*: any*/),
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
                    "selections": (v4/*: any*/),
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "LocationPermissionRule",
                    "kind": "LinkedField",
                    "name": "update",
                    "plural": false,
                    "selections": (v4/*: any*/),
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "LocationPermissionRule",
                    "kind": "LinkedField",
                    "name": "delete",
                    "plural": false,
                    "selections": (v4/*: any*/),
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
                    "concreteType": "DocumentCategoryPermissionRule",
                    "kind": "LinkedField",
                    "name": "read",
                    "plural": false,
                    "selections": (v5/*: any*/),
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "DocumentCategoryPermissionRule",
                    "kind": "LinkedField",
                    "name": "create",
                    "plural": false,
                    "selections": (v5/*: any*/),
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "DocumentCategoryPermissionRule",
                    "kind": "LinkedField",
                    "name": "update",
                    "plural": false,
                    "selections": (v5/*: any*/),
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "DocumentCategoryPermissionRule",
                    "kind": "LinkedField",
                    "name": "delete",
                    "plural": false,
                    "selections": (v5/*: any*/),
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
                "selections": (v6/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "CUD",
                "kind": "LinkedField",
                "name": "equipmentType",
                "plural": false,
                "selections": (v6/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "CUD",
                "kind": "LinkedField",
                "name": "locationType",
                "plural": false,
                "selections": (v6/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "CUD",
                "kind": "LinkedField",
                "name": "portType",
                "plural": false,
                "selections": (v6/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "CUD",
                "kind": "LinkedField",
                "name": "serviceType",
                "plural": false,
                "selections": (v6/*: any*/),
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "WorkforcePolicy",
            "kind": "LinkedField",
            "name": "workforcePolicy",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "WorkforcePermissionRule",
                "kind": "LinkedField",
                "name": "read",
                "plural": false,
                "selections": [
                  (v1/*: any*/),
                  (v7/*: any*/),
                  (v8/*: any*/),
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
              (v9/*: any*/),
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
                    "selections": (v10/*: any*/),
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "WorkforcePermissionRule",
                    "kind": "LinkedField",
                    "name": "update",
                    "plural": false,
                    "selections": (v10/*: any*/),
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "WorkforcePermissionRule",
                    "kind": "LinkedField",
                    "name": "delete",
                    "plural": false,
                    "selections": (v10/*: any*/),
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "WorkforcePermissionRule",
                    "kind": "LinkedField",
                    "name": "assign",
                    "plural": false,
                    "selections": (v10/*: any*/),
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "WorkforcePermissionRule",
                    "kind": "LinkedField",
                    "name": "transferOwnership",
                    "plural": false,
                    "selections": (v10/*: any*/),
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "AutomationPolicy",
            "kind": "LinkedField",
            "name": "automationPolicy",
            "plural": false,
            "selections": [
              (v3/*: any*/),
              (v9/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "MainContextMeQuery",
    "selections": (v11/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "MainContextMeQuery",
    "selections": (v11/*: any*/)
  },
  "params": {
    "cacheID": "0745fe7d9aaffd25c6a709733de21a0a",
    "id": null,
    "metadata": {},
    "name": "MainContextMeQuery",
    "operationKind": "query",
    "text": "query MainContextMeQuery {\n  me {\n    user {\n      id\n      authID\n      email\n      firstName\n      lastName\n      organizationFk {\n        id\n        name\n        description\n      }\n    }\n    permissions {\n      adminPolicy {\n        access {\n          isAllowed\n        }\n      }\n      inventoryPolicy {\n        read {\n          isAllowed\n        }\n        location {\n          create {\n            isAllowed\n            locationTypeIds\n          }\n          update {\n            isAllowed\n            locationTypeIds\n          }\n          delete {\n            isAllowed\n            locationTypeIds\n          }\n        }\n        documentCategory {\n          read {\n            isAllowed\n            documentCategoryIds\n          }\n          create {\n            isAllowed\n            documentCategoryIds\n          }\n          update {\n            isAllowed\n            documentCategoryIds\n          }\n          delete {\n            isAllowed\n            documentCategoryIds\n          }\n        }\n        equipment {\n          create {\n            isAllowed\n          }\n          update {\n            isAllowed\n          }\n          delete {\n            isAllowed\n          }\n        }\n        equipmentType {\n          create {\n            isAllowed\n          }\n          update {\n            isAllowed\n          }\n          delete {\n            isAllowed\n          }\n        }\n        locationType {\n          create {\n            isAllowed\n          }\n          update {\n            isAllowed\n          }\n          delete {\n            isAllowed\n          }\n        }\n        portType {\n          create {\n            isAllowed\n          }\n          update {\n            isAllowed\n          }\n          delete {\n            isAllowed\n          }\n        }\n        serviceType {\n          create {\n            isAllowed\n          }\n          update {\n            isAllowed\n          }\n          delete {\n            isAllowed\n          }\n        }\n      }\n      workforcePolicy {\n        read {\n          isAllowed\n          projectTypeIds\n          workOrderTypeIds\n          organizationIds\n        }\n        templates {\n          create {\n            isAllowed\n          }\n          update {\n            isAllowed\n          }\n          delete {\n            isAllowed\n          }\n        }\n        data {\n          create {\n            isAllowed\n            projectTypeIds\n            workOrderTypeIds\n          }\n          update {\n            isAllowed\n            projectTypeIds\n            workOrderTypeIds\n          }\n          delete {\n            isAllowed\n            projectTypeIds\n            workOrderTypeIds\n          }\n          assign {\n            isAllowed\n            projectTypeIds\n            workOrderTypeIds\n          }\n          transferOwnership {\n            isAllowed\n            projectTypeIds\n            workOrderTypeIds\n          }\n        }\n      }\n      automationPolicy {\n        read {\n          isAllowed\n        }\n        templates {\n          create {\n            isAllowed\n          }\n          update {\n            isAllowed\n          }\n          delete {\n            isAllowed\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'fd54da9d9131a266f0cfa4f53639fa1c';

module.exports = node;
