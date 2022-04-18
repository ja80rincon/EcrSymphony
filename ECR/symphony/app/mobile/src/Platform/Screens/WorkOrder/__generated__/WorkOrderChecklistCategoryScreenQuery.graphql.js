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
type WorkOrderChecklistCategoryPane_category$ref = any;
type WorkOrderChecklistCategoryPane_workOrder$ref = any;
export type WorkOrderChecklistCategoryScreenQueryVariables = {|
  workOrderId: string,
  categoryId: string,
|};
export type WorkOrderChecklistCategoryScreenQueryResponse = {|
  +workOrder: ?({|
    +__typename: "WorkOrder",
    +$fragmentRefs: WorkOrderChecklistCategoryPane_workOrder$ref,
  |} | {|
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    +__typename: "%other"
  |}),
  +category: ?({|
    +__typename: "CheckListCategory",
    +$fragmentRefs: WorkOrderChecklistCategoryPane_category$ref,
  |} | {|
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    +__typename: "%other"
  |}),
|};
export type WorkOrderChecklistCategoryScreenQuery = {|
  variables: WorkOrderChecklistCategoryScreenQueryVariables,
  response: WorkOrderChecklistCategoryScreenQueryResponse,
|};
*/


/*
query WorkOrderChecklistCategoryScreenQuery(
  $workOrderId: ID!
  $categoryId: ID!
) {
  workOrder: node(id: $workOrderId) {
    __typename
    ... on WorkOrder {
      __typename
      ...WorkOrderChecklistCategoryPane_workOrder
    }
    id
  }
  category: node(id: $categoryId) {
    __typename
    ... on CheckListCategory {
      __typename
      ...WorkOrderChecklistCategoryPane_category
    }
    id
  }
}

fragment CellScanViewOnlyCheckListItem_item on CheckListItem {
  id
  title
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
}

fragment MultipleChoiceViewOnlyCheckListItem_item on CheckListItem {
  id
  title
  selectedEnumValues
}

fragment PhotosViewOnlyCheckListItem_item on CheckListItem {
  id
  title
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

fragment SimpleViewOnlyCheckListItem_item on CheckListItem {
  id
  title
  checked
}

fragment StringViewOnlyCheckListItem_item on CheckListItem {
  id
  title
  stringValue
}

fragment WiFiScanViewOnlyCheckListItem_item on CheckListItem {
  id
  title
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
}

fragment WorkOrderCheckListItem_item on CheckListItem {
  id
  title
  type
  isMandatory
  ...StringViewOnlyCheckListItem_item
  ...SimpleViewOnlyCheckListItem_item
  ...MultipleChoiceViewOnlyCheckListItem_item
  ...YesNoViewOnlyCheckListItem_item
  ...WiFiScanViewOnlyCheckListItem_item
  ...CellScanViewOnlyCheckListItem_item
  ...PhotosViewOnlyCheckListItem_item
}

fragment WorkOrderChecklistCategoryPane_category on CheckListCategory {
  id
  title
  description
  ...WorkOrderViewOnlyCategoryChecklist_category
  checkList {
    id
    index
    isMandatory
    type
    selectedEnumValues
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
    ...WorkOrderCheckListItem_item
  }
}

fragment WorkOrderChecklistCategoryPane_workOrder on WorkOrder {
  id
  status
  assignedTo {
    authID
    id
  }
}

fragment WorkOrderViewOnlyCategoryChecklist_category on CheckListCategory {
  checkList {
    id
    index
    ...WorkOrderCheckListItem_item
  }
}

fragment YesNoViewOnlyCheckListItem_item on CheckListItem {
  id
  title
  yesNoResponse
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "workOrderId",
    "type": "ID!"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "categoryId",
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
v3 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "categoryId"
  }
],
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
  "name": "title",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "timestamp",
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
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "WorkOrderChecklistCategoryScreenQuery",
    "selections": [
      {
        "alias": "workOrder",
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
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "WorkOrderChecklistCategoryPane_workOrder"
              }
            ],
            "type": "WorkOrder"
          }
        ],
        "storageKey": null
      },
      {
        "alias": "category",
        "args": (v3/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          {
            "kind": "InlineFragment",
            "selections": [
              (v2/*: any*/),
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "WorkOrderChecklistCategoryPane_category"
              }
            ],
            "type": "CheckListCategory"
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
    "name": "WorkOrderChecklistCategoryScreenQuery",
    "selections": [
      {
        "alias": "workOrder",
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v4/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v2/*: any*/),
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
                "concreteType": "User",
                "kind": "LinkedField",
                "name": "assignedTo",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "authID",
                    "storageKey": null
                  },
                  (v4/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "type": "WorkOrder"
          }
        ],
        "storageKey": null
      },
      {
        "alias": "category",
        "args": (v3/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v4/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v2/*: any*/),
              (v5/*: any*/),
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
                "concreteType": "CheckListItem",
                "kind": "LinkedField",
                "name": "checkList",
                "plural": true,
                "selections": [
                  (v4/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "index",
                    "storageKey": null
                  },
                  (v5/*: any*/),
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
                    "name": "isMandatory",
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
                    "name": "selectedEnumValues",
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
                      (v6/*: any*/),
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
                      (v6/*: any*/),
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
                    "selections": [
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
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "type": "CheckListCategory"
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": null,
    "metadata": {},
    "name": "WorkOrderChecklistCategoryScreenQuery",
    "operationKind": "query",
    "text": "query WorkOrderChecklistCategoryScreenQuery(\n  $workOrderId: ID!\n  $categoryId: ID!\n) {\n  workOrder: node(id: $workOrderId) {\n    __typename\n    ... on WorkOrder {\n      __typename\n      ...WorkOrderChecklistCategoryPane_workOrder\n    }\n    id\n  }\n  category: node(id: $categoryId) {\n    __typename\n    ... on CheckListCategory {\n      __typename\n      ...WorkOrderChecklistCategoryPane_category\n    }\n    id\n  }\n}\n\nfragment CellScanViewOnlyCheckListItem_item on CheckListItem {\n  id\n  title\n  cellData {\n    networkType\n    signalStrength\n    timestamp\n    baseStationID\n    networkID\n    systemID\n    cellID\n    locationAreaCode\n    mobileCountryCode\n    mobileNetworkCode\n    primaryScramblingCode\n    operator\n    arfcn\n    physicalCellID\n    trackingAreaCode\n    timingAdvance\n    earfcn\n    uarfcn\n    latitude\n    longitude\n    id\n  }\n}\n\nfragment MultipleChoiceViewOnlyCheckListItem_item on CheckListItem {\n  id\n  title\n  selectedEnumValues\n}\n\nfragment PhotosViewOnlyCheckListItem_item on CheckListItem {\n  id\n  title\n  files {\n    id\n    fileName\n    storeKey\n    mimeType\n    sizeInBytes\n    modified\n    uploaded\n    annotation\n  }\n}\n\nfragment SimpleViewOnlyCheckListItem_item on CheckListItem {\n  id\n  title\n  checked\n}\n\nfragment StringViewOnlyCheckListItem_item on CheckListItem {\n  id\n  title\n  stringValue\n}\n\nfragment WiFiScanViewOnlyCheckListItem_item on CheckListItem {\n  id\n  title\n  wifiData {\n    timestamp\n    frequency\n    channel\n    bssid\n    strength\n    ssid\n    band\n    channelWidth\n    capabilities\n    latitude\n    longitude\n    id\n  }\n}\n\nfragment WorkOrderCheckListItem_item on CheckListItem {\n  id\n  title\n  type\n  isMandatory\n  ...StringViewOnlyCheckListItem_item\n  ...SimpleViewOnlyCheckListItem_item\n  ...MultipleChoiceViewOnlyCheckListItem_item\n  ...YesNoViewOnlyCheckListItem_item\n  ...WiFiScanViewOnlyCheckListItem_item\n  ...CellScanViewOnlyCheckListItem_item\n  ...PhotosViewOnlyCheckListItem_item\n}\n\nfragment WorkOrderChecklistCategoryPane_category on CheckListCategory {\n  id\n  title\n  description\n  ...WorkOrderViewOnlyCategoryChecklist_category\n  checkList {\n    id\n    index\n    isMandatory\n    type\n    selectedEnumValues\n    stringValue\n    checked\n    yesNoResponse\n    wifiData {\n      timestamp\n      frequency\n      channel\n      bssid\n      strength\n      ssid\n      band\n      channelWidth\n      capabilities\n      latitude\n      longitude\n      id\n    }\n    cellData {\n      networkType\n      signalStrength\n      timestamp\n      baseStationID\n      networkID\n      systemID\n      cellID\n      locationAreaCode\n      mobileCountryCode\n      mobileNetworkCode\n      primaryScramblingCode\n      operator\n      arfcn\n      physicalCellID\n      trackingAreaCode\n      timingAdvance\n      earfcn\n      uarfcn\n      latitude\n      longitude\n      id\n    }\n    files {\n      id\n      fileName\n      storeKey\n      mimeType\n      sizeInBytes\n      modified\n      uploaded\n      annotation\n    }\n    ...WorkOrderCheckListItem_item\n  }\n}\n\nfragment WorkOrderChecklistCategoryPane_workOrder on WorkOrder {\n  id\n  status\n  assignedTo {\n    authID\n    id\n  }\n}\n\nfragment WorkOrderViewOnlyCategoryChecklist_category on CheckListCategory {\n  checkList {\n    id\n    index\n    ...WorkOrderCheckListItem_item\n  }\n}\n\nfragment YesNoViewOnlyCheckListItem_item on CheckListItem {\n  id\n  title\n  yesNoResponse\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '19049bc42253700ba0630d70df174e92';

module.exports = node;
