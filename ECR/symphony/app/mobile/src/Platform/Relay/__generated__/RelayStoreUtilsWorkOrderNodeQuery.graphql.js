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
type WorkOrderChecklistCategoryNavigationListItem_category$ref = any;
export type CellularNetworkType = "CDMA" | "GSM" | "LTE" | "WCDMA" | "%future added value";
export type CheckListItemEnumSelectionMode = "multiple" | "single" | "%future added value";
export type CheckListItemType = "cell_scan" | "enum" | "files" | "simple" | "string" | "wifi_scan" | "yes_no" | "%future added value";
export type PropertyKind = "bool" | "date" | "datetime_local" | "email" | "enum" | "float" | "gps_location" | "int" | "node" | "range" | "string" | "%future added value";
export type WorkOrderPriority = "HIGH" | "LOW" | "MEDIUM" | "NONE" | "URGENT" | "%future added value";
export type WorkOrderStatus = "BLOCKED" | "CLOSED" | "DONE" | "IN_PROGRESS" | "PENDING" | "PLANNED" | "SUBMITTED" | "%future added value";
export type YesNoResponse = "NO" | "YES" | "%future added value";
export type RelayStoreUtilsWorkOrderNodeQueryVariables = {|
  workOrderId: string
|};
export type RelayStoreUtilsWorkOrderNodeQueryResponse = {|
  +node: ?({|
    +__typename: "WorkOrder",
    +id: string,
    +name: string,
    +status: WorkOrderStatus,
    +workOrderTemplate: ?{|
      +name: string
    |},
    +location: ?{|
      +id: string,
      +name: string,
      +parentCoords: ?{|
        +latitude: number,
        +longitude: number,
      |},
      +latitude: number,
      +longitude: number,
      +locationHierarchy: $ReadOnlyArray<{|
        +id: string,
        +name: string,
      |}>,
    |},
    +creationDate: any,
    +installDate: ?any,
    +description: ?string,
    +priority: WorkOrderPriority,
    +project: ?{|
      +name: string
    |},
    +assignedTo: ?{|
      +name: string
    |},
    +comments: $ReadOnlyArray<?{|
      +id: string,
      +author: {|
        +email: string
      |},
      +text: string,
      +createTime: any,
    |}>,
    +checkListCategories: $ReadOnlyArray<{|
      +__typename: string,
      +id: string,
      +title: string,
      +description: ?string,
      +checkList: $ReadOnlyArray<{|
        +id: string,
        +index: ?number,
        +title: string,
        +type: CheckListItemType,
        +helpText: ?string,
        +stringValue: ?string,
        +checked: ?boolean,
        +enumValues: ?string,
        +selectedEnumValues: ?string,
        +enumSelectionMode: ?CheckListItemEnumSelectionMode,
        +yesNoResponse: ?YesNoResponse,
        +wifiData: ?$ReadOnlyArray<{|
          +timestamp: number,
          +frequency: number,
          +channel: number,
          +bssid: string,
          +strength: number,
          +ssid: ?string,
          +band: ?string,
          +channelWidth: ?number,
          +capabilities: ?string,
          +latitude: ?number,
          +longitude: ?number,
        |}>,
        +cellData: ?$ReadOnlyArray<{|
          +networkType: CellularNetworkType,
          +signalStrength: number,
          +timestamp: ?number,
          +baseStationID: ?string,
          +networkID: ?string,
          +systemID: ?string,
          +cellID: ?string,
          +locationAreaCode: ?string,
          +mobileCountryCode: ?string,
          +mobileNetworkCode: ?string,
          +primaryScramblingCode: ?string,
          +operator: ?string,
          +arfcn: ?number,
          +physicalCellID: ?string,
          +trackingAreaCode: ?string,
          +timingAdvance: ?number,
          +earfcn: ?number,
          +uarfcn: ?number,
          +latitude: ?number,
          +longitude: ?number,
        |}>,
        +files: ?$ReadOnlyArray<{|
          +id: string,
          +fileName: string,
          +storeKey: ?string,
          +mimeType: ?string,
          +sizeInBytes: ?number,
          +modified: ?any,
          +uploaded: ?any,
        |}>,
      |}>,
      +$fragmentRefs: WorkOrderChecklistCategoryNavigationListItem_category$ref,
    |}>,
    +properties: $ReadOnlyArray<?{|
      +id: string,
      +propertyType: {|
        +id: string,
        +name: string,
        +index: ?number,
        +isInstanceProperty: ?boolean,
        +type: PropertyKind,
        +stringValue: ?string,
        +intValue: ?number,
        +floatValue: ?number,
        +booleanValue: ?boolean,
        +latitudeValue: ?number,
        +longitudeValue: ?number,
        +rangeFromValue: ?number,
        +rangeToValue: ?number,
      |},
      +stringValue: ?string,
      +intValue: ?number,
      +floatValue: ?number,
      +booleanValue: ?boolean,
      +latitudeValue: ?number,
      +longitudeValue: ?number,
      +rangeFromValue: ?number,
      +rangeToValue: ?number,
    |}>,
  |} | {|
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    +__typename: "%other"
  |})
|};
export type RelayStoreUtilsWorkOrderNodeQuery = {|
  variables: RelayStoreUtilsWorkOrderNodeQueryVariables,
  response: RelayStoreUtilsWorkOrderNodeQueryResponse,
|};
*/


/*
query RelayStoreUtilsWorkOrderNodeQuery(
  $workOrderId: ID!
) {
  node(id: $workOrderId) {
    __typename
    ... on WorkOrder {
      id
      name
      status
      workOrderTemplate {
        name
      }
      location {
        id
        name
        parentCoords {
          latitude
          longitude
        }
        latitude
        longitude
        locationHierarchy {
          id
          name
        }
      }
      creationDate
      installDate
      description
      priority
      project {
        name
        id
      }
      assignedTo {
        name
        id
      }
      comments {
        id
        author {
          email
          id
        }
        text
        createTime
      }
      checkListCategories {
        __typename
        id
        ...WorkOrderChecklistCategoryNavigationListItem_category
        title
        description
        checkList {
          id
          index
          title
          type
          helpText
          stringValue
          checked
          enumValues
          selectedEnumValues
          enumSelectionMode
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
          }
        }
      }
      properties {
        id
        propertyType {
          id
          name
          index
          isInstanceProperty
          type
          stringValue
          intValue
          floatValue
          booleanValue
          latitudeValue
          longitudeValue
          rangeFromValue
          rangeToValue
        }
        stringValue
        intValue
        floatValue
        booleanValue
        latitudeValue
        longitudeValue
        rangeFromValue
        rangeToValue
      }
    }
    id
  }
}

fragment WorkOrderChecklistCategoryNavigationListItem_category on CheckListCategory {
  id
  title
  description
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
v6 = [
  (v4/*: any*/)
],
v7 = {
  "alias": null,
  "args": null,
  "concreteType": "WorkOrderTemplate",
  "kind": "LinkedField",
  "name": "workOrderTemplate",
  "plural": false,
  "selections": (v6/*: any*/),
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
},
v10 = {
  "alias": null,
  "args": null,
  "concreteType": "Location",
  "kind": "LinkedField",
  "name": "location",
  "plural": false,
  "selections": [
    (v3/*: any*/),
    (v4/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "Coordinates",
      "kind": "LinkedField",
      "name": "parentCoords",
      "plural": false,
      "selections": [
        (v8/*: any*/),
        (v9/*: any*/)
      ],
      "storageKey": null
    },
    (v8/*: any*/),
    (v9/*: any*/),
    {
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
    }
  ],
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "creationDate",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "installDate",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "description",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "priority",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "email",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "text",
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "createTime",
  "storageKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v19 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "index",
  "storageKey": null
},
v20 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v21 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "helpText",
  "storageKey": null
},
v22 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "stringValue",
  "storageKey": null
},
v23 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "checked",
  "storageKey": null
},
v24 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "enumValues",
  "storageKey": null
},
v25 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "selectedEnumValues",
  "storageKey": null
},
v26 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "enumSelectionMode",
  "storageKey": null
},
v27 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "yesNoResponse",
  "storageKey": null
},
v28 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "timestamp",
  "storageKey": null
},
v29 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "frequency",
  "storageKey": null
},
v30 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "channel",
  "storageKey": null
},
v31 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "bssid",
  "storageKey": null
},
v32 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "strength",
  "storageKey": null
},
v33 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "ssid",
  "storageKey": null
},
v34 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "band",
  "storageKey": null
},
v35 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "channelWidth",
  "storageKey": null
},
v36 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "capabilities",
  "storageKey": null
},
v37 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "networkType",
  "storageKey": null
},
v38 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "signalStrength",
  "storageKey": null
},
v39 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "baseStationID",
  "storageKey": null
},
v40 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "networkID",
  "storageKey": null
},
v41 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "systemID",
  "storageKey": null
},
v42 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "cellID",
  "storageKey": null
},
v43 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "locationAreaCode",
  "storageKey": null
},
v44 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "mobileCountryCode",
  "storageKey": null
},
v45 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "mobileNetworkCode",
  "storageKey": null
},
v46 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "primaryScramblingCode",
  "storageKey": null
},
v47 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "operator",
  "storageKey": null
},
v48 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "arfcn",
  "storageKey": null
},
v49 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "physicalCellID",
  "storageKey": null
},
v50 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "trackingAreaCode",
  "storageKey": null
},
v51 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "timingAdvance",
  "storageKey": null
},
v52 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "earfcn",
  "storageKey": null
},
v53 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "uarfcn",
  "storageKey": null
},
v54 = {
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
    }
  ],
  "storageKey": null
},
v55 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "intValue",
  "storageKey": null
},
v56 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "floatValue",
  "storageKey": null
},
v57 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "booleanValue",
  "storageKey": null
},
v58 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "latitudeValue",
  "storageKey": null
},
v59 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "longitudeValue",
  "storageKey": null
},
v60 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "rangeFromValue",
  "storageKey": null
},
v61 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "rangeToValue",
  "storageKey": null
},
v62 = {
  "alias": null,
  "args": null,
  "concreteType": "Property",
  "kind": "LinkedField",
  "name": "properties",
  "plural": true,
  "selections": [
    (v3/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "PropertyType",
      "kind": "LinkedField",
      "name": "propertyType",
      "plural": false,
      "selections": [
        (v3/*: any*/),
        (v4/*: any*/),
        (v19/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "isInstanceProperty",
          "storageKey": null
        },
        (v20/*: any*/),
        (v22/*: any*/),
        (v55/*: any*/),
        (v56/*: any*/),
        (v57/*: any*/),
        (v58/*: any*/),
        (v59/*: any*/),
        (v60/*: any*/),
        (v61/*: any*/)
      ],
      "storageKey": null
    },
    (v22/*: any*/),
    (v55/*: any*/),
    (v56/*: any*/),
    (v57/*: any*/),
    (v58/*: any*/),
    (v59/*: any*/),
    (v60/*: any*/),
    (v61/*: any*/)
  ],
  "storageKey": null
},
v63 = [
  (v4/*: any*/),
  (v3/*: any*/)
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "RelayStoreUtilsWorkOrderNodeQuery",
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
              (v7/*: any*/),
              (v10/*: any*/),
              (v11/*: any*/),
              (v12/*: any*/),
              (v13/*: any*/),
              (v14/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Project",
                "kind": "LinkedField",
                "name": "project",
                "plural": false,
                "selections": (v6/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "User",
                "kind": "LinkedField",
                "name": "assignedTo",
                "plural": false,
                "selections": (v6/*: any*/),
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
                      (v15/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v16/*: any*/),
                  (v17/*: any*/)
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
                  (v2/*: any*/),
                  (v3/*: any*/),
                  (v18/*: any*/),
                  (v13/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "CheckListItem",
                    "kind": "LinkedField",
                    "name": "checkList",
                    "plural": true,
                    "selections": [
                      (v3/*: any*/),
                      (v19/*: any*/),
                      (v18/*: any*/),
                      (v20/*: any*/),
                      (v21/*: any*/),
                      (v22/*: any*/),
                      (v23/*: any*/),
                      (v24/*: any*/),
                      (v25/*: any*/),
                      (v26/*: any*/),
                      (v27/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "SurveyWiFiScan",
                        "kind": "LinkedField",
                        "name": "wifiData",
                        "plural": true,
                        "selections": [
                          (v28/*: any*/),
                          (v29/*: any*/),
                          (v30/*: any*/),
                          (v31/*: any*/),
                          (v32/*: any*/),
                          (v33/*: any*/),
                          (v34/*: any*/),
                          (v35/*: any*/),
                          (v36/*: any*/),
                          (v8/*: any*/),
                          (v9/*: any*/)
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
                          (v37/*: any*/),
                          (v38/*: any*/),
                          (v28/*: any*/),
                          (v39/*: any*/),
                          (v40/*: any*/),
                          (v41/*: any*/),
                          (v42/*: any*/),
                          (v43/*: any*/),
                          (v44/*: any*/),
                          (v45/*: any*/),
                          (v46/*: any*/),
                          (v47/*: any*/),
                          (v48/*: any*/),
                          (v49/*: any*/),
                          (v50/*: any*/),
                          (v51/*: any*/),
                          (v52/*: any*/),
                          (v53/*: any*/),
                          (v8/*: any*/),
                          (v9/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v54/*: any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "WorkOrderChecklistCategoryNavigationListItem_category"
                  }
                ],
                "storageKey": null
              },
              (v62/*: any*/)
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
    "name": "RelayStoreUtilsWorkOrderNodeQuery",
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
              (v7/*: any*/),
              (v10/*: any*/),
              (v11/*: any*/),
              (v12/*: any*/),
              (v13/*: any*/),
              (v14/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Project",
                "kind": "LinkedField",
                "name": "project",
                "plural": false,
                "selections": (v63/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "User",
                "kind": "LinkedField",
                "name": "assignedTo",
                "plural": false,
                "selections": (v63/*: any*/),
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
                      (v15/*: any*/),
                      (v3/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v16/*: any*/),
                  (v17/*: any*/)
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
                  (v2/*: any*/),
                  (v3/*: any*/),
                  (v18/*: any*/),
                  (v13/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "CheckListItem",
                    "kind": "LinkedField",
                    "name": "checkList",
                    "plural": true,
                    "selections": [
                      (v3/*: any*/),
                      (v19/*: any*/),
                      (v18/*: any*/),
                      (v20/*: any*/),
                      (v21/*: any*/),
                      (v22/*: any*/),
                      (v23/*: any*/),
                      (v24/*: any*/),
                      (v25/*: any*/),
                      (v26/*: any*/),
                      (v27/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "SurveyWiFiScan",
                        "kind": "LinkedField",
                        "name": "wifiData",
                        "plural": true,
                        "selections": [
                          (v28/*: any*/),
                          (v29/*: any*/),
                          (v30/*: any*/),
                          (v31/*: any*/),
                          (v32/*: any*/),
                          (v33/*: any*/),
                          (v34/*: any*/),
                          (v35/*: any*/),
                          (v36/*: any*/),
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
                          (v37/*: any*/),
                          (v38/*: any*/),
                          (v28/*: any*/),
                          (v39/*: any*/),
                          (v40/*: any*/),
                          (v41/*: any*/),
                          (v42/*: any*/),
                          (v43/*: any*/),
                          (v44/*: any*/),
                          (v45/*: any*/),
                          (v46/*: any*/),
                          (v47/*: any*/),
                          (v48/*: any*/),
                          (v49/*: any*/),
                          (v50/*: any*/),
                          (v51/*: any*/),
                          (v52/*: any*/),
                          (v53/*: any*/),
                          (v8/*: any*/),
                          (v9/*: any*/),
                          (v3/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v54/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              (v62/*: any*/)
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
    "name": "RelayStoreUtilsWorkOrderNodeQuery",
    "operationKind": "query",
    "text": "query RelayStoreUtilsWorkOrderNodeQuery(\n  $workOrderId: ID!\n) {\n  node(id: $workOrderId) {\n    __typename\n    ... on WorkOrder {\n      id\n      name\n      status\n      workOrderTemplate {\n        name\n      }\n      location {\n        id\n        name\n        parentCoords {\n          latitude\n          longitude\n        }\n        latitude\n        longitude\n        locationHierarchy {\n          id\n          name\n        }\n      }\n      creationDate\n      installDate\n      description\n      priority\n      project {\n        name\n        id\n      }\n      assignedTo {\n        name\n        id\n      }\n      comments {\n        id\n        author {\n          email\n          id\n        }\n        text\n        createTime\n      }\n      checkListCategories {\n        __typename\n        id\n        ...WorkOrderChecklistCategoryNavigationListItem_category\n        title\n        description\n        checkList {\n          id\n          index\n          title\n          type\n          helpText\n          stringValue\n          checked\n          enumValues\n          selectedEnumValues\n          enumSelectionMode\n          yesNoResponse\n          wifiData {\n            timestamp\n            frequency\n            channel\n            bssid\n            strength\n            ssid\n            band\n            channelWidth\n            capabilities\n            latitude\n            longitude\n            id\n          }\n          cellData {\n            networkType\n            signalStrength\n            timestamp\n            baseStationID\n            networkID\n            systemID\n            cellID\n            locationAreaCode\n            mobileCountryCode\n            mobileNetworkCode\n            primaryScramblingCode\n            operator\n            arfcn\n            physicalCellID\n            trackingAreaCode\n            timingAdvance\n            earfcn\n            uarfcn\n            latitude\n            longitude\n            id\n          }\n          files {\n            id\n            fileName\n            storeKey\n            mimeType\n            sizeInBytes\n            modified\n            uploaded\n          }\n        }\n      }\n      properties {\n        id\n        propertyType {\n          id\n          name\n          index\n          isInstanceProperty\n          type\n          stringValue\n          intValue\n          floatValue\n          booleanValue\n          latitudeValue\n          longitudeValue\n          rangeFromValue\n          rangeToValue\n        }\n        stringValue\n        intValue\n        floatValue\n        booleanValue\n        latitudeValue\n        longitudeValue\n        rangeFromValue\n        rangeToValue\n      }\n    }\n    id\n  }\n}\n\nfragment WorkOrderChecklistCategoryNavigationListItem_category on CheckListCategory {\n  id\n  title\n  description\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '930f96e5e15384b8fb8b3b88c5e810bb';

module.exports = node;
