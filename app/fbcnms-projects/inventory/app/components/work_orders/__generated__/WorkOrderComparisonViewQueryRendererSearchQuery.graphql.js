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
type WorkOrdersMap_workOrders$ref = any;
type WorkOrdersView_query$ref = any;
export type FilterOperator = "CONTAINS" | "DATE_GREATER_OR_EQUAL_THAN" | "DATE_GREATER_THAN" | "DATE_LESS_OR_EQUAL_THAN" | "DATE_LESS_THAN" | "IS" | "IS_NIL" | "IS_NIL_OR_DATE_GREATER_OR_EQUAL_THAN" | "IS_NOT_ONE_OF" | "IS_ONE_OF" | "%future added value";
export type OrderDirection = "ASC" | "DESC" | "%future added value";
export type PropertyKind = "bool" | "date" | "datetime_local" | "email" | "enum" | "float" | "gps_location" | "int" | "node" | "range" | "string" | "%future added value";
export type WorkOrderFilterType = "LOCATION_INST" | "LOCATION_INST_EXTERNAL_ID" | "WORK_ORDER_ASSIGNED_TO" | "WORK_ORDER_CLOSE_DATE" | "WORK_ORDER_CREATION_DATE" | "WORK_ORDER_LOCATION_INST" | "WORK_ORDER_NAME" | "WORK_ORDER_ORGANIZATION" | "WORK_ORDER_OWNED_BY" | "WORK_ORDER_PRIORITY" | "WORK_ORDER_STATUS" | "WORK_ORDER_TYPE" | "%future added value";
export type WorkOrderOrderField = "CLOSED_AT" | "CREATED_AT" | "NAME" | "UPDATED_AT" | "%future added value";
export type WorkOrderFilterInput = {|
  filterType: WorkOrderFilterType,
  operator: FilterOperator,
  stringValue?: ?string,
  idSet?: ?$ReadOnlyArray<string>,
  stringSet?: ?$ReadOnlyArray<string>,
  propertyValue?: ?PropertyTypeInput,
  timeValue?: ?any,
  maxDepth?: ?number,
|};
export type PropertyTypeInput = {|
  id?: ?string,
  externalId?: ?string,
  name: string,
  type: PropertyKind,
  nodeType?: ?string,
  index?: ?number,
  category?: ?string,
  stringValue?: ?string,
  intValue?: ?number,
  booleanValue?: ?boolean,
  floatValue?: ?number,
  latitudeValue?: ?number,
  longitudeValue?: ?number,
  rangeFromValue?: ?number,
  rangeToValue?: ?number,
  isEditable?: ?boolean,
  isInstanceProperty?: ?boolean,
  isMandatory?: ?boolean,
  isDeleted?: ?boolean,
  propertyCategoryID?: ?string,
  isListable?: ?boolean,
|};
export type WorkOrderOrder = {|
  direction: OrderDirection,
  field?: ?WorkOrderOrderField,
|};
export type WorkOrderComparisonViewQueryRendererSearchQueryVariables = {|
  limit?: ?number,
  filters: $ReadOnlyArray<WorkOrderFilterInput>,
  orderBy?: ?WorkOrderOrder,
|};
export type WorkOrderComparisonViewQueryRendererSearchQueryResponse = {|
  +workOrdersMap: {|
    +totalCount: number,
    +edges: $ReadOnlyArray<{|
      +node: ?{|
        +$fragmentRefs: WorkOrdersMap_workOrders$ref
      |}
    |}>,
  |},
  +$fragmentRefs: WorkOrdersView_query$ref,
|};
export type WorkOrderComparisonViewQueryRendererSearchQuery = {|
  variables: WorkOrderComparisonViewQueryRendererSearchQueryVariables,
  response: WorkOrderComparisonViewQueryRendererSearchQueryResponse,
|};
*/


/*
query WorkOrderComparisonViewQueryRendererSearchQuery(
  $limit: Int
  $filters: [WorkOrderFilterInput!]!
  $orderBy: WorkOrderOrder
) {
  ...WorkOrdersView_query_10glCF
  workOrdersMap: workOrders(orderBy: $orderBy, filterBy: $filters, first: 100) {
    totalCount
    edges {
      node {
        ...WorkOrdersMap_workOrders
        id
      }
    }
  }
}

fragment WorkOrdersMap_workOrders on WorkOrder {
  id
  name
  description
  owner {
    id
    email
  }
  status
  priority
  project {
    id
    name
  }
  assignedTo {
    id
    email
  }
  installDate
  location {
    id
    name
    latitude
    longitude
  }
  lastCheckInActivity: activities(filter: {activityType: CLOCK_IN, limit: 1, orderDirection: DESC}) {
    activityType
    createTime
    clockDetails {
      distanceMeters
    }
    id
  }
  lastCheckOutActivity: activities(filter: {activityType: CLOCK_OUT, limit: 1, orderDirection: DESC}) {
    activityType
    createTime
    clockDetails {
      distanceMeters
    }
    id
  }
}

fragment WorkOrdersView_query_10glCF on Query {
  workOrders(first: $limit, orderBy: $orderBy, filterBy: $filters) {
    totalCount
    edges {
      node {
        id
        name
        description
        owner {
          id
          email
        }
        creationDate
        installDate
        status
        assignedTo {
          id
          email
        }
        location {
          id
          name
        }
        workOrderType {
          id
          name
        }
        project {
          id
          name
        }
        closeDate
        priority
        __typename
      }
      cursor
    }
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "filters"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "limit"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "orderBy"
},
v3 = {
  "kind": "Variable",
  "name": "filterBy",
  "variableName": "filters"
},
v4 = {
  "kind": "Variable",
  "name": "orderBy",
  "variableName": "orderBy"
},
v5 = [
  (v3/*: any*/),
  {
    "kind": "Literal",
    "name": "first",
    "value": 100
  },
  (v4/*: any*/)
],
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "totalCount",
  "storageKey": null
},
v7 = [
  (v3/*: any*/),
  {
    "kind": "Variable",
    "name": "first",
    "variableName": "limit"
  },
  (v4/*: any*/)
],
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "description",
  "storageKey": null
},
v11 = [
  (v8/*: any*/),
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "email",
    "storageKey": null
  }
],
v12 = {
  "alias": null,
  "args": null,
  "concreteType": "User",
  "kind": "LinkedField",
  "name": "owner",
  "plural": false,
  "selections": (v11/*: any*/),
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "installDate",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "status",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "concreteType": "User",
  "kind": "LinkedField",
  "name": "assignedTo",
  "plural": false,
  "selections": (v11/*: any*/),
  "storageKey": null
},
v16 = [
  (v8/*: any*/),
  (v9/*: any*/)
],
v17 = {
  "alias": null,
  "args": null,
  "concreteType": "Project",
  "kind": "LinkedField",
  "name": "project",
  "plural": false,
  "selections": (v16/*: any*/),
  "storageKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "priority",
  "storageKey": null
},
v19 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "activityType",
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "createTime",
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "concreteType": "ClockDetails",
    "kind": "LinkedField",
    "name": "clockDetails",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "distanceMeters",
        "storageKey": null
      }
    ],
    "storageKey": null
  },
  (v8/*: any*/)
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "WorkOrderComparisonViewQueryRendererSearchQuery",
    "selections": [
      {
        "alias": "workOrdersMap",
        "args": (v5/*: any*/),
        "concreteType": "WorkOrderConnection",
        "kind": "LinkedField",
        "name": "workOrders",
        "plural": false,
        "selections": [
          (v6/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "WorkOrderEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "WorkOrder",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "WorkOrdersMap_workOrders"
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "args": (v7/*: any*/),
        "kind": "FragmentSpread",
        "name": "WorkOrdersView_query"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Operation",
    "name": "WorkOrderComparisonViewQueryRendererSearchQuery",
    "selections": [
      {
        "alias": null,
        "args": (v7/*: any*/),
        "concreteType": "WorkOrderConnection",
        "kind": "LinkedField",
        "name": "workOrders",
        "plural": false,
        "selections": [
          (v6/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "WorkOrderEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "WorkOrder",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v8/*: any*/),
                  (v9/*: any*/),
                  (v10/*: any*/),
                  (v12/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "creationDate",
                    "storageKey": null
                  },
                  (v13/*: any*/),
                  (v14/*: any*/),
                  (v15/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Location",
                    "kind": "LinkedField",
                    "name": "location",
                    "plural": false,
                    "selections": (v16/*: any*/),
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "WorkOrderType",
                    "kind": "LinkedField",
                    "name": "workOrderType",
                    "plural": false,
                    "selections": (v16/*: any*/),
                    "storageKey": null
                  },
                  (v17/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "closeDate",
                    "storageKey": null
                  },
                  (v18/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "__typename",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "cursor",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "PageInfo",
            "kind": "LinkedField",
            "name": "pageInfo",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "endCursor",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "hasNextPage",
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
        "args": (v7/*: any*/),
        "filters": [
          "orderBy",
          "filterBy"
        ],
        "handle": "connection",
        "key": "WorkOrdersView_workOrders",
        "kind": "LinkedHandle",
        "name": "workOrders"
      },
      {
        "alias": "workOrdersMap",
        "args": (v5/*: any*/),
        "concreteType": "WorkOrderConnection",
        "kind": "LinkedField",
        "name": "workOrders",
        "plural": false,
        "selections": [
          (v6/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "WorkOrderEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "WorkOrder",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v8/*: any*/),
                  (v9/*: any*/),
                  (v10/*: any*/),
                  (v12/*: any*/),
                  (v14/*: any*/),
                  (v18/*: any*/),
                  (v17/*: any*/),
                  (v15/*: any*/),
                  (v13/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Location",
                    "kind": "LinkedField",
                    "name": "location",
                    "plural": false,
                    "selections": [
                      (v8/*: any*/),
                      (v9/*: any*/),
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
                    "alias": "lastCheckInActivity",
                    "args": [
                      {
                        "kind": "Literal",
                        "name": "filter",
                        "value": {
                          "activityType": "CLOCK_IN",
                          "limit": 1,
                          "orderDirection": "DESC"
                        }
                      }
                    ],
                    "concreteType": "Activity",
                    "kind": "LinkedField",
                    "name": "activities",
                    "plural": true,
                    "selections": (v19/*: any*/),
                    "storageKey": "activities(filter:{\"activityType\":\"CLOCK_IN\",\"limit\":1,\"orderDirection\":\"DESC\"})"
                  },
                  {
                    "alias": "lastCheckOutActivity",
                    "args": [
                      {
                        "kind": "Literal",
                        "name": "filter",
                        "value": {
                          "activityType": "CLOCK_OUT",
                          "limit": 1,
                          "orderDirection": "DESC"
                        }
                      }
                    ],
                    "concreteType": "Activity",
                    "kind": "LinkedField",
                    "name": "activities",
                    "plural": true,
                    "selections": (v19/*: any*/),
                    "storageKey": "activities(filter:{\"activityType\":\"CLOCK_OUT\",\"limit\":1,\"orderDirection\":\"DESC\"})"
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
    ]
  },
  "params": {
    "cacheID": "90e24792be6b13c8ae83db1a3d35313d",
    "id": null,
    "metadata": {},
    "name": "WorkOrderComparisonViewQueryRendererSearchQuery",
    "operationKind": "query",
    "text": "query WorkOrderComparisonViewQueryRendererSearchQuery(\n  $limit: Int\n  $filters: [WorkOrderFilterInput!]!\n  $orderBy: WorkOrderOrder\n) {\n  ...WorkOrdersView_query_10glCF\n  workOrdersMap: workOrders(orderBy: $orderBy, filterBy: $filters, first: 100) {\n    totalCount\n    edges {\n      node {\n        ...WorkOrdersMap_workOrders\n        id\n      }\n    }\n  }\n}\n\nfragment WorkOrdersMap_workOrders on WorkOrder {\n  id\n  name\n  description\n  owner {\n    id\n    email\n  }\n  status\n  priority\n  project {\n    id\n    name\n  }\n  assignedTo {\n    id\n    email\n  }\n  installDate\n  location {\n    id\n    name\n    latitude\n    longitude\n  }\n  lastCheckInActivity: activities(filter: {activityType: CLOCK_IN, limit: 1, orderDirection: DESC}) {\n    activityType\n    createTime\n    clockDetails {\n      distanceMeters\n    }\n    id\n  }\n  lastCheckOutActivity: activities(filter: {activityType: CLOCK_OUT, limit: 1, orderDirection: DESC}) {\n    activityType\n    createTime\n    clockDetails {\n      distanceMeters\n    }\n    id\n  }\n}\n\nfragment WorkOrdersView_query_10glCF on Query {\n  workOrders(first: $limit, orderBy: $orderBy, filterBy: $filters) {\n    totalCount\n    edges {\n      node {\n        id\n        name\n        description\n        owner {\n          id\n          email\n        }\n        creationDate\n        installDate\n        status\n        assignedTo {\n          id\n          email\n        }\n        location {\n          id\n          name\n        }\n        workOrderType {\n          id\n          name\n        }\n        project {\n          id\n          name\n        }\n        closeDate\n        priority\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '8babf724aba113f11a4f4013cd7a5dc3';

module.exports = node;
