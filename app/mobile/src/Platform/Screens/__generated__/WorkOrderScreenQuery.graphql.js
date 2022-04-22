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
type WorkOrderCommentsSection_workOrder$ref = any;
type WorkOrderDetailsSection_workOrder$ref = any;
type WorkOrderTechnicianActionBottomBar_workOrder$ref = any;
export type WorkOrderStatus = "BLOCKED" | "CLOSED" | "DONE" | "IN_PROGRESS" | "PENDING" | "PLANNED" | "SUBMITTED" | "%future added value";
export type WorkOrderScreenQueryVariables = {|
  workOrderId: string
|};
export type WorkOrderScreenQueryResponse = {|
  +node: ?({|
    +__typename: "WorkOrder",
    +id: string,
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
    +$fragmentRefs: WorkOrderDetailsSection_workOrder$ref & WorkOrderTechnicianActionBottomBar_workOrder$ref & WorkOrderCommentsSection_workOrder$ref,
  |} | {|
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    +__typename: "%other"
  |})
|};
export type WorkOrderScreenQuery = {|
  variables: WorkOrderScreenQueryVariables,
  response: WorkOrderScreenQueryResponse,
|};
*/


/*
query WorkOrderScreenQuery(
  $workOrderId: ID!
) {
  node(id: $workOrderId) {
    __typename
    ... on WorkOrder {
      id
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
    id
  }
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
    "name": "workOrderId",
    "type": "ID!"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "workOrderId"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
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
  "concreteType": "Location",
  "kind": "LinkedField",
  "name": "locationHierarchy",
  "plural": true,
  "selections": [
    (v3/*: any*/),
    (v4/*: any*/)
  ],
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "latitude",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "longitude",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "timestamp",
  "storageKey": null
},
v11 = [
  (v3/*: any*/),
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
    "name": "WorkOrderScreenQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v3/*: any*/),
              (v4/*: any*/),
              (v5/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Location",
                "kind": "LinkedField",
                "name": "location",
                "plural": false,
                "selections": [
                  (v3/*: any*/),
                  (v4/*: any*/),
                  (v6/*: any*/)
                ],
                "storageKey": null
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
            "type": "WorkOrder"
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
    "name": "WorkOrderScreenQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v4/*: any*/),
              (v5/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Location",
                "kind": "LinkedField",
                "name": "location",
                "plural": false,
                "selections": [
                  (v3/*: any*/),
                  (v4/*: any*/),
                  (v6/*: any*/),
                  (v7/*: any*/),
                  (v8/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Coordinates",
                    "kind": "LinkedField",
                    "name": "parentCoords",
                    "plural": false,
                    "selections": [
                      (v7/*: any*/),
                      (v8/*: any*/)
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
                "name": "installDate",
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
                "name": "priority",
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
                  (v4/*: any*/)
                ],
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
                  (v4/*: any*/),
                  (v3/*: any*/)
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
                  (v4/*: any*/),
                  (v3/*: any*/),
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
                  (v3/*: any*/),
                  (v9/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "CheckListItem",
                    "kind": "LinkedField",
                    "name": "checkList",
                    "plural": true,
                    "selections": [
                      (v3/*: any*/),
                      (v9/*: any*/),
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
                          (v10/*: any*/),
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
                          (v7/*: any*/),
                          (v8/*: any*/),
                          (v3/*: any*/)
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
                          (v10/*: any*/),
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
                          (v7/*: any*/),
                          (v8/*: any*/),
                          (v3/*: any*/)
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
                        "selections": (v11/*: any*/),
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
                "selections": (v11/*: any*/),
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
                  (v3/*: any*/),
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
                      (v3/*: any*/)
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
            "type": "WorkOrder"
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": null,
    "metadata": {},
    "name": "WorkOrderScreenQuery",
    "operationKind": "query",
    "text": "query WorkOrderScreenQuery(\n  $workOrderId: ID!\n) {\n  node(id: $workOrderId) {\n    __typename\n    ... on WorkOrder {\n      id\n      name\n      status\n      location {\n        id\n        name\n        locationHierarchy {\n          id\n          name\n        }\n      }\n      ...WorkOrderDetailsSection_workOrder\n      ...WorkOrderTechnicianActionBottomBar_workOrder\n      ...WorkOrderCommentsSection_workOrder\n    }\n    id\n  }\n}\n\nfragment WorkOrderAssigneeSection_workOrder on WorkOrder {\n  assignedTo {\n    name\n    id\n  }\n}\n\nfragment WorkOrderCommentListItem_comment on Comment {\n  id\n  author {\n    email\n    id\n  }\n  text\n  createTime\n}\n\nfragment WorkOrderCommentsSection_workOrder on WorkOrder {\n  id\n  comments {\n    id\n    ...WorkOrderCommentListItem_comment\n  }\n}\n\nfragment WorkOrderDatesSection_workOrder on WorkOrder {\n  creationDate\n  installDate\n}\n\nfragment WorkOrderDetailsSection_workOrder on WorkOrder {\n  id\n  creationDate\n  installDate\n  description\n  priority\n  status\n  workOrderTemplate {\n    name\n  }\n  location {\n    name\n    latitude\n    longitude\n    id\n  }\n  project {\n    name\n    id\n  }\n  assignedTo {\n    name\n    id\n  }\n  ...WorkOrderLocationSection_workOrder\n  ...WorkOrderDatesSection_workOrder\n  ...WorkOrderProjectSection_workOrder\n  ...WorkOrderAssigneeSection_workOrder\n  ...WorkOrderTemplateNameSection_workOrder\n}\n\nfragment WorkOrderLocationSection_workOrder on WorkOrder {\n  location {\n    name\n    latitude\n    longitude\n    id\n  }\n}\n\nfragment WorkOrderProjectSection_workOrder on WorkOrder {\n  project {\n    name\n    id\n  }\n}\n\nfragment WorkOrderTechnicianActionBottomBar_workOrder on WorkOrder {\n  id\n  status\n  assignedTo {\n    authID\n    id\n  }\n  location {\n    parentCoords {\n      latitude\n      longitude\n    }\n    id\n  }\n  checkListCategories {\n    id\n    title\n    checkList {\n      id\n      title\n      helpText\n      index\n      isMandatory\n      type\n      enumSelectionMode\n      selectedEnumValues\n      enumValues\n      stringValue\n      checked\n      yesNoResponse\n      wifiData {\n        timestamp\n        frequency\n        channel\n        bssid\n        strength\n        ssid\n        band\n        channelWidth\n        capabilities\n        latitude\n        longitude\n        id\n      }\n      cellData {\n        networkType\n        signalStrength\n        timestamp\n        baseStationID\n        networkID\n        systemID\n        cellID\n        locationAreaCode\n        mobileCountryCode\n        mobileNetworkCode\n        primaryScramblingCode\n        operator\n        arfcn\n        physicalCellID\n        trackingAreaCode\n        timingAdvance\n        earfcn\n        uarfcn\n        latitude\n        longitude\n        id\n      }\n      files {\n        id\n        fileName\n        storeKey\n        mimeType\n        sizeInBytes\n        modified\n        uploaded\n        annotation\n      }\n    }\n  }\n  images {\n    id\n    fileName\n    storeKey\n    mimeType\n    sizeInBytes\n    modified\n    uploaded\n    annotation\n  }\n}\n\nfragment WorkOrderTemplateNameSection_workOrder on WorkOrder {\n  workOrderTemplate {\n    name\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'e0f9b5d5c4703b532fd74de69e6d4680';

module.exports = node;
