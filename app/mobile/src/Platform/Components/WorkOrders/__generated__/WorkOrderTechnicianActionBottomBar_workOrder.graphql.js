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
export type CellularNetworkType = "CDMA" | "GSM" | "LTE" | "WCDMA" | "%future added value";
export type CheckListItemEnumSelectionMode = "multiple" | "single" | "%future added value";
export type CheckListItemType = "cell_scan" | "enum" | "files" | "simple" | "string" | "wifi_scan" | "yes_no" | "%future added value";
export type WorkOrderStatus = "BLOCKED" | "CLOSED" | "DONE" | "IN_PROGRESS" | "PENDING" | "PLANNED" | "SUBMITTED" | "%future added value";
export type YesNoResponse = "NO" | "YES" | "%future added value";
import type { FragmentReference } from "relay-runtime";
declare export opaque type WorkOrderTechnicianActionBottomBar_workOrder$ref: FragmentReference;
declare export opaque type WorkOrderTechnicianActionBottomBar_workOrder$fragmentType: WorkOrderTechnicianActionBottomBar_workOrder$ref;
export type WorkOrderTechnicianActionBottomBar_workOrder = {|
  +id: string,
  +status: WorkOrderStatus,
  +assignedTo: ?{|
    +authID: string
  |},
  +location: ?{|
    +parentCoords: ?{|
      +latitude: number,
      +longitude: number,
    |}
  |},
  +checkListCategories: $ReadOnlyArray<{|
    +id: string,
    +title: string,
    +checkList: $ReadOnlyArray<{|
      +id: string,
      +title: string,
      +helpText: ?string,
      +index: ?number,
      +isMandatory: ?boolean,
      +type: CheckListItemType,
      +enumSelectionMode: ?CheckListItemEnumSelectionMode,
      +selectedEnumValues: ?string,
      +enumValues: ?string,
      +stringValue: ?string,
      +checked: ?boolean,
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
        +annotation: ?string,
      |}>,
    |}>,
  |}>,
  +images: $ReadOnlyArray<?{|
    +id: string,
    +fileName: string,
    +storeKey: ?string,
    +mimeType: ?string,
    +sizeInBytes: ?number,
    +modified: ?any,
    +uploaded: ?any,
    +annotation: ?string,
  |}>,
  +$refType: WorkOrderTechnicianActionBottomBar_workOrder$ref,
|};
export type WorkOrderTechnicianActionBottomBar_workOrder$data = WorkOrderTechnicianActionBottomBar_workOrder;
export type WorkOrderTechnicianActionBottomBar_workOrder$key = {
  +$data?: WorkOrderTechnicianActionBottomBar_workOrder$data,
  +$fragmentRefs: WorkOrderTechnicianActionBottomBar_workOrder$ref,
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
  "name": "latitude",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "longitude",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "timestamp",
  "storageKey": null
},
v5 = [
  (v0/*: any*/),
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
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "WorkOrderTechnicianActionBottomBar_workOrder",
  "selections": [
    (v0/*: any*/),
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
        }
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
        {
          "alias": null,
          "args": null,
          "concreteType": "Coordinates",
          "kind": "LinkedField",
          "name": "parentCoords",
          "plural": false,
          "selections": [
            (v1/*: any*/),
            (v2/*: any*/)
          ],
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
        (v0/*: any*/),
        (v3/*: any*/),
        {
          "alias": null,
          "args": null,
          "concreteType": "CheckListItem",
          "kind": "LinkedField",
          "name": "checkList",
          "plural": true,
          "selections": [
            (v0/*: any*/),
            (v3/*: any*/),
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
                (v4/*: any*/),
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
                (v1/*: any*/),
                (v2/*: any*/)
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
                (v4/*: any*/),
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
                (v1/*: any*/),
                (v2/*: any*/)
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
              "selections": (v5/*: any*/),
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
      "selections": (v5/*: any*/),
      "storageKey": null
    }
  ],
  "type": "WorkOrder"
};
})();
// prettier-ignore
(node/*: any*/).hash = '12c8046e977a9b79c253aa07a00b4628';

module.exports = node;
