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
export type CellularNetworkType = "CDMA" | "GSM" | "LTE" | "WCDMA" | "%future added value";
export type CheckListItemEnumSelectionMode = "multiple" | "single" | "%future added value";
export type CheckListItemType = "cell_scan" | "enum" | "files" | "simple" | "string" | "wifi_scan" | "yes_no" | "%future added value";
export type ClockOutReason = "BLOCKED" | "PAUSE" | "SUBMIT" | "SUBMIT_INCOMPLETE" | "%future added value";
export type FileType = "FILE" | "IMAGE" | "%future added value";
export type WorkOrderStatus = "BLOCKED" | "CLOSED" | "DONE" | "IN_PROGRESS" | "PENDING" | "PLANNED" | "SUBMITTED" | "%future added value";
export type YesNoResponse = "NO" | "YES" | "%future added value";
export type TechnicianWorkOrderCheckOutInput = {|
  workOrderId: string,
  reason: ClockOutReason,
  checkListCategories?: ?$ReadOnlyArray<CheckListCategoryInput>,
  comment?: ?string,
  distanceMeters?: ?number,
  checkOutTime?: ?any,
|};
export type CheckListCategoryInput = {|
  id?: ?string,
  title: string,
  description?: ?string,
  checkList?: ?$ReadOnlyArray<CheckListItemInput>,
|};
export type CheckListItemInput = {|
  id?: ?string,
  title: string,
  type: CheckListItemType,
  index?: ?number,
  isMandatory?: ?boolean,
  helpText?: ?string,
  enumValues?: ?string,
  enumSelectionMode?: ?CheckListItemEnumSelectionMode,
  selectedEnumValues?: ?string,
  stringValue?: ?string,
  checked?: ?boolean,
  files?: ?$ReadOnlyArray<FileInput>,
  yesNoResponse?: ?YesNoResponse,
  wifiData?: ?$ReadOnlyArray<SurveyWiFiScanData>,
  cellData?: ?$ReadOnlyArray<SurveyCellScanData>,
|};
export type FileInput = {|
  id?: ?string,
  fileName: string,
  sizeInBytes?: ?number,
  modificationTime?: ?number,
  uploadTime?: ?number,
  fileType?: ?FileType,
  mimeType?: ?string,
  storeKey: string,
  annotation?: ?string,
|};
export type SurveyWiFiScanData = {|
  timestamp: number,
  frequency: number,
  channel: number,
  bssid: string,
  strength: number,
  ssid?: ?string,
  band?: ?string,
  channelWidth?: ?number,
  capabilities?: ?string,
  latitude?: ?number,
  longitude?: ?number,
  altitude?: ?number,
  heading?: ?number,
  rssi?: ?number,
|};
export type SurveyCellScanData = {|
  networkType: CellularNetworkType,
  signalStrength: number,
  timestamp?: ?number,
  baseStationID?: ?string,
  networkID?: ?string,
  systemID?: ?string,
  cellID?: ?string,
  locationAreaCode?: ?string,
  mobileCountryCode?: ?string,
  mobileNetworkCode?: ?string,
  primaryScramblingCode?: ?string,
  operator?: ?string,
  arfcn?: ?number,
  physicalCellID?: ?string,
  trackingAreaCode?: ?string,
  timingAdvance?: ?number,
  earfcn?: ?number,
  uarfcn?: ?number,
  latitude?: ?number,
  longitude?: ?number,
  altitude?: ?number,
  heading?: ?number,
  rssi?: ?number,
|};
export type TechnicianWorkOrderCheckOutMutationVariables = {|
  input: TechnicianWorkOrderCheckOutInput
|};
export type TechnicianWorkOrderCheckOutMutationResponse = {|
  +technicianWorkOrderCheckOut: {|
    +id: string,
    +status: WorkOrderStatus,
  |}
|};
export type TechnicianWorkOrderCheckOutMutation = {|
  variables: TechnicianWorkOrderCheckOutMutationVariables,
  response: TechnicianWorkOrderCheckOutMutationResponse,
|};
*/


/*
mutation TechnicianWorkOrderCheckOutMutation(
  $input: TechnicianWorkOrderCheckOutInput!
) {
  technicianWorkOrderCheckOut(input: $input) {
    id
    status
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input",
    "type": "TechnicianWorkOrderCheckOutInput!"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "WorkOrder",
    "kind": "LinkedField",
    "name": "technicianWorkOrderCheckOut",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "status",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "TechnicianWorkOrderCheckOutMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation"
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "TechnicianWorkOrderCheckOutMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": null,
    "metadata": {},
    "name": "TechnicianWorkOrderCheckOutMutation",
    "operationKind": "mutation",
    "text": "mutation TechnicianWorkOrderCheckOutMutation(\n  $input: TechnicianWorkOrderCheckOutInput!\n) {\n  technicianWorkOrderCheckOut(input: $input) {\n    id\n    status\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '177f813f163122378e51d0d85544a0b8';

module.exports = node;
