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
declare export opaque type WifiScanCheckListItem_item$ref: FragmentReference;
declare export opaque type WifiScanCheckListItem_item$fragmentType: WifiScanCheckListItem_item$ref;
export type WifiScanCheckListItem_item = {|
  +id: string,
  +title: string,
  +helpText: ?string,
  +isMandatory: ?boolean,
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
  +$refType: WifiScanCheckListItem_item$ref,
|};
export type WifiScanCheckListItem_item$data = WifiScanCheckListItem_item;
export type WifiScanCheckListItem_item$key = {
  +$data?: WifiScanCheckListItem_item$data,
  +$fragmentRefs: WifiScanCheckListItem_item$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "WifiScanCheckListItem_item",
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
      "kind": "ScalarField",
      "name": "helpText",
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
(node/*: any*/).hash = 'd57623499fae9f16f06f1a92f73a036e';

module.exports = node;
