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
type WorkOrderCheckListItem_item$ref = any;
type WorkOrderViewOnlyCategoryChecklist_category$ref = any;
export type CellularNetworkType = "CDMA" | "GSM" | "LTE" | "WCDMA" | "%future added value";
export type CheckListItemType = "cell_scan" | "enum" | "files" | "simple" | "string" | "wifi_scan" | "yes_no" | "%future added value";
export type YesNoResponse = "NO" | "YES" | "%future added value";
import type { FragmentReference } from "relay-runtime";
declare export opaque type WorkOrderChecklistCategoryPane_category$ref: FragmentReference;
declare export opaque type WorkOrderChecklistCategoryPane_category$fragmentType: WorkOrderChecklistCategoryPane_category$ref;
export type WorkOrderChecklistCategoryPane_category = {|
  +id: string,
  +title: string,
  +description: ?string,
  +checkList: $ReadOnlyArray<{|
    +id: string,
    +index: ?number,
    +isMandatory: ?boolean,
    +type: CheckListItemType,
    +selectedEnumValues: ?string,
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
    +$fragmentRefs: WorkOrderCheckListItem_item$ref,
  |}>,
  +$fragmentRefs: WorkOrderViewOnlyCategoryChecklist_category$ref,
  +$refType: WorkOrderChecklistCategoryPane_category$ref,
|};
export type WorkOrderChecklistCategoryPane_category$data = WorkOrderChecklistCategoryPane_category;
export type WorkOrderChecklistCategoryPane_category$key = {
  +$data?: WorkOrderChecklistCategoryPane_category$data,
  +$fragmentRefs: WorkOrderChecklistCategoryPane_category$ref,
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
  "name": "timestamp",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "latitude",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "longitude",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "WorkOrderChecklistCategoryPane_category",
  "selections": [
    (v0/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "title",
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
      "concreteType": "CheckListItem",
      "kind": "LinkedField",
      "name": "checkList",
      "plural": true,
      "selections": [
        (v0/*: any*/),
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
          "name": "selectedEnumValues",
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
            (v1/*: any*/),
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
            (v2/*: any*/),
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
            (v1/*: any*/),
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
            (v2/*: any*/),
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
          ],
          "storageKey": null
        },
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "WorkOrderCheckListItem_item"
        }
      ],
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "WorkOrderViewOnlyCategoryChecklist_category"
    }
  ],
  "type": "CheckListCategory"
};
})();
// prettier-ignore
(node/*: any*/).hash = '74df3bf0b8ebc2c58457cf2ef8bcd672';

module.exports = node;
