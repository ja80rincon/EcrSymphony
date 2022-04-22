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
declare export opaque type LocationWiFiScanCoverageMap_wifiData$ref: FragmentReference;
declare export opaque type LocationWiFiScanCoverageMap_wifiData$fragmentType: LocationWiFiScanCoverageMap_wifiData$ref;
export type LocationWiFiScanCoverageMap_wifiData = $ReadOnlyArray<{|
  +id: string,
  +latitude: ?number,
  +longitude: ?number,
  +frequency: number,
  +channel: number,
  +bssid: string,
  +ssid: ?string,
  +strength: number,
  +band: ?string,
  +$refType: LocationWiFiScanCoverageMap_wifiData$ref,
|}>;
export type LocationWiFiScanCoverageMap_wifiData$data = LocationWiFiScanCoverageMap_wifiData;
export type LocationWiFiScanCoverageMap_wifiData$key = $ReadOnlyArray<{
  +$data?: LocationWiFiScanCoverageMap_wifiData$data,
  +$fragmentRefs: LocationWiFiScanCoverageMap_wifiData$ref,
  ...
}>;
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "plural": true
  },
  "name": "LocationWiFiScanCoverageMap_wifiData",
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
      "name": "latitude",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "longitude",
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
      "name": "ssid",
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
      "name": "band",
      "storageKey": null
    }
  ],
  "type": "SurveyWiFiScan",
  "abstractKey": null
};
// prettier-ignore
(node/*: any*/).hash = 'c19f1446b6147fde7dff384c07c86b60';

module.exports = node;
