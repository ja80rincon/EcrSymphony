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
type TasksList_workOrders$ref = any;
type WorkOrderCommentsSection_workOrder$ref = any;
type WorkOrderDetailsSection_workOrder$ref = any;
type WorkOrderTechnicianActionBottomBar_workOrder$ref = any;
export type FilterOperator = "CONTAINS" | "DATE_GREATER_OR_EQUAL_THAN" | "DATE_GREATER_THAN" | "DATE_LESS_OR_EQUAL_THAN" | "DATE_LESS_THAN" | "IS" | "IS_NOT_ONE_OF" | "IS_ONE_OF" | "%future added value";
export type PropertyKind = "bool" | "date" | "datetime_local" | "email" | "enum" | "float" | "gps_location" | "int" | "node" | "range" | "string" | "%future added value";
export type WorkOrderFilterType = "LOCATION_INST" | "LOCATION_INST_EXTERNAL_ID" | "WORK_ORDER_ASSIGNED_TO" | "WORK_ORDER_CLOSE_DATE" | "WORK_ORDER_CREATION_DATE" | "WORK_ORDER_LOCATION_INST" | "WORK_ORDER_NAME" | "WORK_ORDER_OWNED_BY" | "WORK_ORDER_PRIORITY" | "WORK_ORDER_STATUS" | "WORK_ORDER_TYPE" | "%future added value";
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
export type MyTasksScreenLocationsNeedSiteSurveyQueryVariables = {|
  filters: $ReadOnlyArray<WorkOrderFilterInput>
|};
export type MyTasksScreenLocationsNeedSiteSurveyQueryResponse = {|
  +locations: ?{|
    +edges: $ReadOnlyArray<{|
      +$fragmentRefs: TasksList_locations$ref
    |}>
  |},
  +workOrders: {|
    +totalCount: number,
    +edges: $ReadOnlyArray<{|
      +node: ?{|
        +id: string,
        +installDate: ?any,
        +workOrderTemplate: ?{|
          +name: string
        |},
        +name: string,
        +status: WorkOrderStatus,
        +location: ?{|
          +id: string,
          +name: string,
          +locationHierarchy: $ReadOnlyArray<{|
            +id: string,
            +name: string,
          |}>,
        |},
        +$fragmentRefs: TasksList_workOrders$ref & WorkOrderDetailsSection_workOrder$ref & WorkOrderTechnicianActionBottomBar_workOrder$ref & WorkOrderCommentsSection_workOrder$ref,
      |}
    |}>,
  |},
|};
export type MyTasksScreenLocationsNeedSiteSurveyQuery = {|
  variables: MyTasksScreenLocationsNeedSiteSurveyQueryVariables,
  response: MyTasksScreenLocationsNeedSiteSurveyQueryResponse,
|};
*/


/*
query MyTasksScreenLocationsNeedSiteSurveyQuery(
  $filters: [WorkOrderFilterInput!]!
) {
  locations(needsSiteSurvey: true) {
    edges {
      ...TasksList_locations
    }
  }
  workOrders(first: 50, filterBy: $filters) {
    totalCount
    edges {
      node {
        id
        installDate
        workOrderTemplate {
          name
        }
        ...TasksList_workOrders
        name
        status
        location {
          id
          name
          locationHierarchy {
            id
            name
          }
        }
        ...WorkOrderDetailsSection_workOrder
        ...WorkOrderTechnicianActionBottomBar_workOrder
        ...WorkOrderCommentsSection_workOrder
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

fragment TasksList_workOrders on WorkOrder {
  id
  ...WorkOrderListItem_workOrder
}

fragment WorkOrderAssigneeSection_workOrder on WorkOrder {
  assignedTo {
    name
    id
  }
}

fragment WorkOrderCommentListItem_comment on Comment {
  id
  author {
    email
    id
  }
  text
  createTime
}

fragment WorkOrderCommentsSection_workOrder on WorkOrder {
  id
  comments {
    id
    ...WorkOrderCommentListItem_comment
  }
}

fragment WorkOrderDatesSection_workOrder on WorkOrder {
  creationDate
  installDate
}

fragment WorkOrderDetailsSection_workOrder on WorkOrder {
  id
  creationDate
  installDate
  description
  priority
  status
  workOrderTemplate {
    name
  }
  location {
    name
    latitude
    longitude
    id
  }
  project {
    name
    id
  }
  assignedTo {
    name
    id
  }
  ...WorkOrderLocationSection_workOrder
  ...WorkOrderDatesSection_workOrder
  ...WorkOrderProjectSection_workOrder
  ...WorkOrderAssigneeSection_workOrder
  ...WorkOrderTemplateNameSection_workOrder
}

fragment WorkOrderListItem_workOrder on WorkOrder {
  id
  name
  priority
  status
  location {
    ...MyTaskListItem_location
    id
  }
}

fragment WorkOrderLocationSection_workOrder on WorkOrder {
  location {
    name
    latitude
    longitude
    id
  }
}

fragment WorkOrderProjectSection_workOrder on WorkOrder {
  project {
    name
    id
  }
}

fragment WorkOrderTechnicianActionBottomBar_workOrder on WorkOrder {
  id
  status
  assignedTo {
    authID
    id
  }
  location {
    parentCoords {
      latitude
      longitude
    }
    id
  }
  checkListCategories {
    id
    title
    checkList {
      id
      title
      helpText
      index
      isMandatory
      type
      enumSelectionMode
      selectedEnumValues
      enumValues
      stringValue
      checked
      yesNoResponse
      wifiData {
        timestamp
        frequency
        channel
        bssid
        strength
        ssid
        band
        channelWidth
        capabilities
        latitude
        longitude
        id
      }
      cellData {
        networkType
        signalStrength
        timestamp
        baseStationID
        networkID
        systemID
        cellID
        locationAreaCode
        mobileCountryCode
        mobileNetworkCode
        primaryScramblingCode
        operator
        arfcn
        physicalCellID
        trackingAreaCode
        timingAdvance
        earfcn
        uarfcn
        latitude
        longitude
        id
      }
      files {
        id
        fileName
        storeKey
        mimeType
        sizeInBytes
        modified
        uploaded
        annotation
      }
    }
  }
  images {
    id
    fileName
    storeKey
    mimeType
    sizeInBytes
    modified
    uploaded
    annotation
  }
}

fragment WorkOrderTemplateNameSection_workOrder on WorkOrder {
  workOrderTemplate {
    name
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
v2 = [
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
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "totalCount",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "installDate",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "concreteType": "WorkOrderTemplate",
  "kind": "LinkedField",
  "name": "workOrderTemplate",
  "plural": false,
  "selections": [
    (v6/*: any*/)
  ],
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "status",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "concreteType": "Location",
  "kind": "LinkedField",
  "name": "locationHierarchy",
  "plural": true,
  "selections": [
    (v4/*: any*/),
    (v6/*: any*/)
  ],
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "latitude",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "longitude",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "timestamp",
  "storageKey": null
},
v14 = [
  (v4/*: any*/),
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "fileName",
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "storeKey",
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "mimeType",
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "sizeInBytes",
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "modified",
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "uploaded",
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "annotation",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "MyTasksScreenLocationsNeedSiteSurveyQuery",
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
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "WorkOrderConnection",
        "kind": "LinkedField",
        "name": "workOrders",
        "plural": false,
        "selections": [
          (v3/*: any*/),
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
                  (v4/*: any*/),
                  (v5/*: any*/),
                  (v7/*: any*/),
                  (v6/*: any*/),
                  (v8/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Location",
                    "kind": "LinkedField",
                    "name": "location",
                    "plural": false,
                    "selections": [
                      (v4/*: any*/),
                      (v6/*: any*/),
                      (v9/*: any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "TasksList_workOrders"
                  },
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "WorkOrderDetailsSection_workOrder"
                  },
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "WorkOrderTechnicianActionBottomBar_workOrder"
                  },
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "WorkOrderCommentsSection_workOrder"
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
    "type": "Query"
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "MyTasksScreenLocationsNeedSiteSurveyQuery",
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
                  (v4/*: any*/),
                  (v6/*: any*/),
                  (v10/*: any*/),
                  (v11/*: any*/),
                  {
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
                        "selections": [
                          (v4/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v4/*: any*/)
                    ],
                    "storageKey": null
                  },
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
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "WorkOrderConnection",
        "kind": "LinkedField",
        "name": "workOrders",
        "plural": false,
        "selections": [
          (v3/*: any*/),
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
                  (v4/*: any*/),
                  (v5/*: any*/),
                  (v7/*: any*/),
                  (v6/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "priority",
                    "storageKey": null
                  },
                  (v8/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Location",
                    "kind": "LinkedField",
                    "name": "location",
                    "plural": false,
                    "selections": [
                      (v4/*: any*/),
                      (v6/*: any*/),
                      (v10/*: any*/),
                      (v11/*: any*/),
                      (v9/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Coordinates",
                        "kind": "LinkedField",
                        "name": "parentCoords",
                        "plural": false,
                        "selections": [
                          (v10/*: any*/),
                          (v11/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "creationDate",
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
                    "concreteType": "Project",
                    "kind": "LinkedField",
                    "name": "project",
                    "plural": false,
                    "selections": [
                      (v6/*: any*/),
                      (v4/*: any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "User",
                    "kind": "LinkedField",
                    "name": "assignedTo",
                    "plural": false,
                    "selections": [
                      (v6/*: any*/),
                      (v4/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "authID",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "CheckListCategory",
                    "kind": "LinkedField",
                    "name": "checkListCategories",
                    "plural": true,
                    "selections": [
                      (v4/*: any*/),
                      (v12/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "CheckListItem",
                        "kind": "LinkedField",
                        "name": "checkList",
                        "plural": true,
                        "selections": [
                          (v4/*: any*/),
                          (v12/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "helpText",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "index",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "isMandatory",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "type",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "enumSelectionMode",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "selectedEnumValues",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "enumValues",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "stringValue",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "checked",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "yesNoResponse",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "SurveyWiFiScan",
                            "kind": "LinkedField",
                            "name": "wifiData",
                            "plural": true,
                            "selections": [
                              (v13/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "frequency",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "channel",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "bssid",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "strength",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "ssid",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "band",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "channelWidth",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "capabilities",
                                "storageKey": null
                              },
                              (v10/*: any*/),
                              (v11/*: any*/),
                              (v4/*: any*/)
                            ],
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "SurveyCellScan",
                            "kind": "LinkedField",
                            "name": "cellData",
                            "plural": true,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "networkType",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "signalStrength",
                                "storageKey": null
                              },
                              (v13/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "baseStationID",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "networkID",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "systemID",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "cellID",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "locationAreaCode",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "mobileCountryCode",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "mobileNetworkCode",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "primaryScramblingCode",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "operator",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "arfcn",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "physicalCellID",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "trackingAreaCode",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "timingAdvance",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "earfcn",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "uarfcn",
                                "storageKey": null
                              },
                              (v10/*: any*/),
                              (v11/*: any*/),
                              (v4/*: any*/)
                            ],
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "File",
                            "kind": "LinkedField",
                            "name": "files",
                            "plural": true,
                            "selections": (v14/*: any*/),
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
                    "concreteType": "File",
                    "kind": "LinkedField",
                    "name": "images",
                    "plural": true,
                    "selections": (v14/*: any*/),
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Comment",
                    "kind": "LinkedField",
                    "name": "comments",
                    "plural": true,
                    "selections": [
                      (v4/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "User",
                        "kind": "LinkedField",
                        "name": "author",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "email",
                            "storageKey": null
                          },
                          (v4/*: any*/)
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "text",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "createTime",
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
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": null,
    "metadata": {},
    "name": "MyTasksScreenLocationsNeedSiteSurveyQuery",
    "operationKind": "query",
    "text": "query MyTasksScreenLocationsNeedSiteSurveyQuery(\n  $filters: [WorkOrderFilterInput!]!\n) {\n  locations(needsSiteSurvey: true) {\n    edges {\n      ...TasksList_locations\n    }\n  }\n  workOrders(first: 50, filterBy: $filters) {\n    totalCount\n    edges {\n      node {\n        id\n        installDate\n        workOrderTemplate {\n          name\n        }\n        ...TasksList_workOrders\n        name\n        status\n        location {\n          id\n          name\n          locationHierarchy {\n            id\n            name\n          }\n        }\n        ...WorkOrderDetailsSection_workOrder\n        ...WorkOrderTechnicianActionBottomBar_workOrder\n        ...WorkOrderCommentsSection_workOrder\n      }\n    }\n  }\n}\n\nfragment MyTaskListItem_location on Location {\n  id\n  name\n  latitude\n  longitude\n  locationHierarchy {\n    id\n    name\n  }\n}\n\nfragment TasksList_locations on LocationEdge {\n  node {\n    id\n    name\n    latitude\n    longitude\n    locationType {\n      surveyTemplateCategories {\n        id\n      }\n      id\n    }\n    ...MyTaskListItem_location\n  }\n}\n\nfragment TasksList_workOrders on WorkOrder {\n  id\n  ...WorkOrderListItem_workOrder\n}\n\nfragment WorkOrderAssigneeSection_workOrder on WorkOrder {\n  assignedTo {\n    name\n    id\n  }\n}\n\nfragment WorkOrderCommentListItem_comment on Comment {\n  id\n  author {\n    email\n    id\n  }\n  text\n  createTime\n}\n\nfragment WorkOrderCommentsSection_workOrder on WorkOrder {\n  id\n  comments {\n    id\n    ...WorkOrderCommentListItem_comment\n  }\n}\n\nfragment WorkOrderDatesSection_workOrder on WorkOrder {\n  creationDate\n  installDate\n}\n\nfragment WorkOrderDetailsSection_workOrder on WorkOrder {\n  id\n  creationDate\n  installDate\n  description\n  priority\n  status\n  workOrderTemplate {\n    name\n  }\n  location {\n    name\n    latitude\n    longitude\n    id\n  }\n  project {\n    name\n    id\n  }\n  assignedTo {\n    name\n    id\n  }\n  ...WorkOrderLocationSection_workOrder\n  ...WorkOrderDatesSection_workOrder\n  ...WorkOrderProjectSection_workOrder\n  ...WorkOrderAssigneeSection_workOrder\n  ...WorkOrderTemplateNameSection_workOrder\n}\n\nfragment WorkOrderListItem_workOrder on WorkOrder {\n  id\n  name\n  priority\n  status\n  location {\n    ...MyTaskListItem_location\n    id\n  }\n}\n\nfragment WorkOrderLocationSection_workOrder on WorkOrder {\n  location {\n    name\n    latitude\n    longitude\n    id\n  }\n}\n\nfragment WorkOrderProjectSection_workOrder on WorkOrder {\n  project {\n    name\n    id\n  }\n}\n\nfragment WorkOrderTechnicianActionBottomBar_workOrder on WorkOrder {\n  id\n  status\n  assignedTo {\n    authID\n    id\n  }\n  location {\n    parentCoords {\n      latitude\n      longitude\n    }\n    id\n  }\n  checkListCategories {\n    id\n    title\n    checkList {\n      id\n      title\n      helpText\n      index\n      isMandatory\n      type\n      enumSelectionMode\n      selectedEnumValues\n      enumValues\n      stringValue\n      checked\n      yesNoResponse\n      wifiData {\n        timestamp\n        frequency\n        channel\n        bssid\n        strength\n        ssid\n        band\n        channelWidth\n        capabilities\n        latitude\n        longitude\n        id\n      }\n      cellData {\n        networkType\n        signalStrength\n        timestamp\n        baseStationID\n        networkID\n        systemID\n        cellID\n        locationAreaCode\n        mobileCountryCode\n        mobileNetworkCode\n        primaryScramblingCode\n        operator\n        arfcn\n        physicalCellID\n        trackingAreaCode\n        timingAdvance\n        earfcn\n        uarfcn\n        latitude\n        longitude\n        id\n      }\n      files {\n        id\n        fileName\n        storeKey\n        mimeType\n        sizeInBytes\n        modified\n        uploaded\n        annotation\n      }\n    }\n  }\n  images {\n    id\n    fileName\n    storeKey\n    mimeType\n    sizeInBytes\n    modified\n    uploaded\n    annotation\n  }\n}\n\nfragment WorkOrderTemplateNameSection_workOrder on WorkOrder {\n  workOrderTemplate {\n    name\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '215f25a1228bdfa571fa15b74f4669d0';

module.exports = node;
