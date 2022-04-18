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
import type { FragmentReference } from "relay-runtime";
declare export opaque type LocationCellScanCoverageMap_cellData$ref: FragmentReference;
declare export opaque type LocationCellScanCoverageMap_cellData$fragmentType: LocationCellScanCoverageMap_cellData$ref;
export type LocationCellScanCoverageMap_cellData = $ReadOnlyArray<{|
  +id: string,
  +latitude: ?number,
  +longitude: ?number,
  +networkType: CellularNetworkType,
  +signalStrength: number,
  +mobileCountryCode: ?string,
  +mobileNetworkCode: ?string,
  +operator: ?string,
  +$refType: LocationCellScanCoverageMap_cellData$ref,
|}>;
export type LocationCellScanCoverageMap_cellData$data = LocationCellScanCoverageMap_cellData;
export type LocationCellScanCoverageMap_cellData$key = $ReadOnlyArray<{
  +$data?: LocationCellScanCoverageMap_cellData$data,
  +$fragmentRefs: LocationCellScanCoverageMap_cellData$ref,
  ...
}>;
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "plural": true
  },
  "name": "LocationCellScanCoverageMap_cellData",
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
      "name": "operator",
      "storageKey": null
    }
  ],
  "type": "SurveyCellScan",
  "abstractKey": null
};
// prettier-ignore
(node/*: any*/).hash = 'd94c9d40f7baef9bcd50963bcb149e0e';

module.exports = node;
