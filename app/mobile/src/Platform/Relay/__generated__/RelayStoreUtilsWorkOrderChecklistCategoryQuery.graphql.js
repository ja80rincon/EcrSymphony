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
type WorkOrderCheckListItem_item$ref = any;
export type RelayStoreUtilsWorkOrderChecklistCategoryQueryVariables = {|
  categoryId: string
|};
export type RelayStoreUtilsWorkOrderChecklistCategoryQueryResponse = {|
  +node: ?{|
    +__typename: string,
    +id: string,
    +title?: string,
    +description?: ?string,
    +checkList?: $ReadOnlyArray<{|
      +id: string,
      +index: ?number,
      +$fragmentRefs: WorkOrderCheckListItem_item$ref,
    |}>,
  |}
|};
export type RelayStoreUtilsWorkOrderChecklistCategoryQuery = {|
  variables: RelayStoreUtilsWorkOrderChecklistCategoryQueryVariables,
  response: RelayStoreUtilsWorkOrderChecklistCategoryQueryResponse,
|};
*/


/*
query RelayStoreUtilsWorkOrderChecklistCategoryQuery(
  $categoryId: ID!
) {
  node(id: $categoryId) {
    __typename
    ... on CheckListCategory {
      __typename
      id
      title
      description
      checkList {
        id
        index
        ...WorkOrderCheckListItem_item
      }
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
    "name": "categoryId",
    "type": "ID!"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "categoryId"
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
  "name": "title",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "description",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "index",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "timestamp",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "latitude",
  "storageKey": null
},
v9 = {
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
    "name": "RelayStoreUtilsWorkOrderChecklistCategoryQuery",
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
                "concreteType": "CheckListItem",
                "kind": "LinkedField",
                "name": "checkList",
                "plural": true,
                "selections": [
                  (v3/*: any*/),
                  (v6/*: any*/),
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "WorkOrderCheckListItem_item"
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
    ],
    "type": "Query"
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "RelayStoreUtilsWorkOrderChecklistCategoryQuery",
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
                "concreteType": "CheckListItem",
                "kind": "LinkedField",
                "name": "checkList",
                "plural": true,
                "selections": [
                  (v3/*: any*/),
                  (v6/*: any*/),
                  (v4/*: any*/),
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
                      (v7/*: any*/),
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
                      (v8/*: any*/),
                      (v9/*: any*/),
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
                      (v7/*: any*/),
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
                      (v8/*: any*/),
                      (v9/*: any*/),
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
                    "selections": [
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
    "name": "RelayStoreUtilsWorkOrderChecklistCategoryQuery",
    "operationKind": "query",
    "text": "query RelayStoreUtilsWorkOrderChecklistCategoryQuery(\n  $categoryId: ID!\n) {\n  node(id: $categoryId) {\n    __typename\n    ... on CheckListCategory {\n      __typename\n      id\n      title\n      description\n      checkList {\n        id\n        index\n        ...WorkOrderCheckListItem_item\n      }\n    }\n    id\n  }\n}\n\nfragment CellScanViewOnlyCheckListItem_item on CheckListItem {\n  id\n  title\n  cellData {\n    networkType\n    signalStrength\n    timestamp\n    baseStationID\n    networkID\n    systemID\n    cellID\n    locationAreaCode\n    mobileCountryCode\n    mobileNetworkCode\n    primaryScramblingCode\n    operator\n    arfcn\n    physicalCellID\n    trackingAreaCode\n    timingAdvance\n    earfcn\n    uarfcn\n    latitude\n    longitude\n    id\n  }\n}\n\nfragment MultipleChoiceViewOnlyCheckListItem_item on CheckListItem {\n  id\n  title\n  selectedEnumValues\n}\n\nfragment PhotosViewOnlyCheckListItem_item on CheckListItem {\n  id\n  title\n  files {\n    id\n    fileName\n    storeKey\n    mimeType\n    sizeInBytes\n    modified\n    uploaded\n    annotation\n  }\n}\n\nfragment SimpleViewOnlyCheckListItem_item on CheckListItem {\n  id\n  title\n  checked\n}\n\nfragment StringViewOnlyCheckListItem_item on CheckListItem {\n  id\n  title\n  stringValue\n}\n\nfragment WiFiScanViewOnlyCheckListItem_item on CheckListItem {\n  id\n  title\n  wifiData {\n    timestamp\n    frequency\n    channel\n    bssid\n    strength\n    ssid\n    band\n    channelWidth\n    capabilities\n    latitude\n    longitude\n    id\n  }\n}\n\nfragment WorkOrderCheckListItem_item on CheckListItem {\n  id\n  title\n  type\n  isMandatory\n  ...StringViewOnlyCheckListItem_item\n  ...SimpleViewOnlyCheckListItem_item\n  ...MultipleChoiceViewOnlyCheckListItem_item\n  ...YesNoViewOnlyCheckListItem_item\n  ...WiFiScanViewOnlyCheckListItem_item\n  ...CellScanViewOnlyCheckListItem_item\n  ...PhotosViewOnlyCheckListItem_item\n}\n\nfragment YesNoViewOnlyCheckListItem_item on CheckListItem {\n  id\n  title\n  yesNoResponse\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '3037648f8976ca6c1db0930b8fab34c6';

module.exports = node;
