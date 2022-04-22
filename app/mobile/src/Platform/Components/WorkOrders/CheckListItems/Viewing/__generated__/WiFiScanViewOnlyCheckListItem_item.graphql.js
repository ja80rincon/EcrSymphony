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
import type { FragmentReference } from "relay-runtime";
declare export opaque type WiFiScanViewOnlyCheckListItem_item$ref: FragmentReference;
declare export opaque type WiFiScanViewOnlyCheckListItem_item$fragmentType: WiFiScanViewOnlyCheckListItem_item$ref;
export type WiFiScanViewOnlyCheckListItem_item = {|
  +id: string,
  +title: string,
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
  +$refType: WiFiScanViewOnlyCheckListItem_item$ref,
|};
export type WiFiScanViewOnlyCheckListItem_item$data = WiFiScanViewOnlyCheckListItem_item;
export type WiFiScanViewOnlyCheckListItem_item$key = {
  +$data?: WiFiScanViewOnlyCheckListItem_item$data,
  +$fragmentRefs: WiFiScanViewOnlyCheckListItem_item$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "WiFiScanViewOnlyCheckListItem_item",
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
      "name": "title",
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
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "timestamp",
          "storageKey": null
        },
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
    }
  ],
  "type": "CheckListItem"
};
// prettier-ignore
(node/*: any*/).hash = '2151e43112449ccbc46c43aa273adfa3';

module.exports = node;
