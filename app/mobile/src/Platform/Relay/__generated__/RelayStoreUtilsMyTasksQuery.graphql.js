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
type TasksList_locations$ref = any;
export type FilterOperator = "CONTAINS" | "DATE_GREATER_OR_EQUAL_THAN" | "DATE_GREATER_THAN" | "DATE_LESS_OR_EQUAL_THAN" | "DATE_LESS_THAN" | "IS" | "IS_NOT_ONE_OF" | "IS_ONE_OF" | "%future added value";
export type PropertyKind = "bool" | "date" | "datetime_local" | "email" | "enum" | "float" | "gps_location" | "int" | "node" | "range" | "string" | "%future added value";
export type WorkOrderFilterType = "LOCATION_INST" | "LOCATION_INST_EXTERNAL_ID" | "WORK_ORDER_ASSIGNED_TO" | "WORK_ORDER_CLOSE_DATE" | "WORK_ORDER_CREATION_DATE" | "WORK_ORDER_LOCATION_INST" | "WORK_ORDER_NAME" | "WORK_ORDER_OWNED_BY" | "WORK_ORDER_PRIORITY" | "WORK_ORDER_STATUS" | "WORK_ORDER_TYPE" | "%future added value";
export type WorkOrderPriority = "HIGH" | "LOW" | "MEDIUM" | "NONE" | "URGENT" | "%future added value";
export type WorkOrderStatus = "BLOCKED" | "CLOSED" | "DONE" | "IN_PROGRESS" | "PENDING" | "PLANNED" | "SUBMITTED" | "%future added value";
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
|};
export type RelayStoreUtilsMyTasksQueryVariables = {|
  filters: $ReadOnlyArray<WorkOrderFilterInput>
|};
export type RelayStoreUtilsMyTasksQueryResponse = {|
  +locations: ?{|
    +edges: $ReadOnlyArray<{|
      +node: ?{|
        +id: string,
        +name: string,
        +parentCoords: ?{|
          +latitude: number,
          +longitude: number,
        |},
        +latitude: number,
        +longitude: number,
        +locationType: {|
          +surveyTemplateCategories: ?$ReadOnlyArray<?{|
            +id: string
          |}>,
          +id: string,
        |},
        +surveys: $ReadOnlyArray<?{|
          +id: string
        |}>,
        +locationHierarchy: $ReadOnlyArray<{|
          +id: string,
          +name: string,
        |}>,
      |},
      +$fragmentRefs: TasksList_locations$ref,
    |}>
  |},
  +workOrders: {|
    +totalCount: number,
    +__typename: string,
    +edges: $ReadOnlyArray<{|
      +node: ?{|
        +id: string,
        +name: string,
        +priority: WorkOrderPriority,
        +status: WorkOrderStatus,
        +installDate: ?any,
        +workOrderTemplate: ?{|
          +name: string
        |},
        +location: ?{|
          +id: string,
          +name: string,
          +latitude: number,
          +longitude: number,
          +locationHierarchy: $ReadOnlyArray<{|
            +id: string,
            +name: string,
          |}>,
        |},
      |}
    |}>,
  |},
|};
export type RelayStoreUtilsMyTasksQuery = {|
  variables: RelayStoreUtilsMyTasksQueryVariables,
  response: RelayStoreUtilsMyTasksQueryResponse,
|};
*/


/*
query RelayStoreUtilsMyTasksQuery(
  $filters: [WorkOrderFilterInput!]!
) {
  locations(needsSiteSurvey: true) {
    edges {
      ...TasksList_locations
      node {
        id
        name
        parentCoords {
          latitude
          longitude
        }
        latitude
        longitude
        locationType {
          surveyTemplateCategories {
            id
          }
          id
        }
        surveys {
          id
        }
        locationHierarchy {
          id
          name
        }
      }
    }
  }
  workOrders(first: 50, filterBy: $filters) {
    totalCount
    __typename
    edges {
      node {
        id
        name
        priority
        status
        installDate
        workOrderTemplate {
          name
        }
        location {
          id
          name
          latitude
          longitude
          locationHierarchy {
            id
            name
          }
        }
      }
    }
  }
}

fragment MyTaskListItem_location on Location {
  id
  name
  latitude
  longitude
  locationHierarchy {
    id
    name
  }
}

fragment TasksList_locations on LocationEdge {
  node {
    id
    name
    latitude
    longitude
    locationType {
      surveyTemplateCategories {
        id
      }
      id
    }
    ...MyTaskListItem_location
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "filters",
    "type": "[WorkOrderFilterInput!]!"
  }
],
v1 = [
  {
    "kind": "Literal",
    "name": "needsSiteSurvey",
    "value": true
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
  "name": "latitude",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "longitude",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "concreteType": "Coordinates",
  "kind": "LinkedField",
  "name": "parentCoords",
  "plural": false,
  "selections": [
    (v4/*: any*/),
    (v5/*: any*/)
  ],
  "storageKey": null
},
v7 = [
  (v2/*: any*/)
],
v8 = {
  "alias": null,
  "args": null,
  "concreteType": "LocationType",
  "kind": "LinkedField",
  "name": "locationType",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "SurveyTemplateCategory",
      "kind": "LinkedField",
      "name": "surveyTemplateCategories",
      "plural": true,
      "selections": (v7/*: any*/),
      "storageKey": null
    },
    (v2/*: any*/)
  ],
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "concreteType": "Survey",
  "kind": "LinkedField",
  "name": "surveys",
  "plural": true,
  "selections": (v7/*: any*/),
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "concreteType": "Location",
  "kind": "LinkedField",
  "name": "locationHierarchy",
  "plural": true,
  "selections": [
    (v2/*: any*/),
    (v3/*: any*/)
  ],
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": [
    {
      "kind": "Variable",
      "name": "filterBy",
      "variableName": "filters"
    },
    {
      "kind": "Literal",
      "name": "first",
      "value": 50
    }
  ],
  "concreteType": "WorkOrderConnection",
  "kind": "LinkedField",
  "name": "workOrders",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "totalCount",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "__typename",
      "storageKey": null
    },
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
            (v2/*: any*/),
            (v3/*: any*/),
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "priority",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "status",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "installDate",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "WorkOrderTemplate",
              "kind": "LinkedField",
              "name": "workOrderTemplate",
              "plural": false,
              "selections": [
                (v3/*: any*/)
              ],
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "Location",
              "kind": "LinkedField",
              "name": "location",
              "plural": false,
              "selections": [
                (v2/*: any*/),
                (v3/*: any*/),
                (v4/*: any*/),
                (v5/*: any*/),
                (v10/*: any*/)
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
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "RelayStoreUtilsMyTasksQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "LocationConnection",
        "kind": "LinkedField",
        "name": "locations",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "LocationEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Location",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v2/*: any*/),
                  (v3/*: any*/),
                  (v6/*: any*/),
                  (v4/*: any*/),
                  (v5/*: any*/),
                  (v8/*: any*/),
                  (v9/*: any*/),
                  (v10/*: any*/)
                ],
                "storageKey": null
              },
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "TasksList_locations"
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": "locations(needsSiteSurvey:true)"
      },
      (v11/*: any*/)
    ],
    "type": "Query"
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "RelayStoreUtilsMyTasksQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "LocationConnection",
        "kind": "LinkedField",
        "name": "locations",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "LocationEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Location",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v2/*: any*/),
                  (v3/*: any*/),
                  (v4/*: any*/),
                  (v5/*: any*/),
                  (v8/*: any*/),
                  (v10/*: any*/),
                  (v6/*: any*/),
                  (v9/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": "locations(needsSiteSurvey:true)"
      },
      (v11/*: any*/)
    ]
  },
  "params": {
    "id": null,
    "metadata": {},
    "name": "RelayStoreUtilsMyTasksQuery",
    "operationKind": "query",
    "text": "query RelayStoreUtilsMyTasksQuery(\n  $filters: [WorkOrderFilterInput!]!\n) {\n  locations(needsSiteSurvey: true) {\n    edges {\n      ...TasksList_locations\n      node {\n        id\n        name\n        parentCoords {\n          latitude\n          longitude\n        }\n        latitude\n        longitude\n        locationType {\n          surveyTemplateCategories {\n            id\n          }\n          id\n        }\n        surveys {\n          id\n        }\n        locationHierarchy {\n          id\n          name\n        }\n      }\n    }\n  }\n  workOrders(first: 50, filterBy: $filters) {\n    totalCount\n    __typename\n    edges {\n      node {\n        id\n        name\n        priority\n        status\n        installDate\n        workOrderTemplate {\n          name\n        }\n        location {\n          id\n          name\n          latitude\n          longitude\n          locationHierarchy {\n            id\n            name\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment MyTaskListItem_location on Location {\n  id\n  name\n  latitude\n  longitude\n  locationHierarchy {\n    id\n    name\n  }\n}\n\nfragment TasksList_locations on LocationEdge {\n  node {\n    id\n    name\n    latitude\n    longitude\n    locationType {\n      surveyTemplateCategories {\n        id\n      }\n      id\n    }\n    ...MyTaskListItem_location\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '297bb5a45e87af3b624f6f3c4fcee695';

module.exports = node;
