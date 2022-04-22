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
export type CellScanPaneMutationVariables = {|
  data: $ReadOnlyArray<?SurveyCellScanData>,
  location: string,
|};
export type CellScanPaneMutationResponse = {|
  +addCellScans: ?$ReadOnlyArray<?{|
    +id: string
  |}>
|};
export type CellScanPaneMutation = {|
  variables: CellScanPaneMutationVariables,
  response: CellScanPaneMutationResponse,
|};
*/


/*
mutation CellScanPaneMutation(
  $data: [SurveyCellScanData]!
  $location: ID!
) {
  addCellScans(data: $data, locationID: $location) {
    id
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "data",
    "type": "[SurveyCellScanData]!"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "location",
    "type": "ID!"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "data",
        "variableName": "data"
      },
      {
        "kind": "Variable",
        "name": "locationID",
        "variableName": "location"
      }
    ],
    "concreteType": "SurveyCellScan",
    "kind": "LinkedField",
    "name": "addCellScans",
    "plural": true,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
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
    "name": "CellScanPaneMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation"
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "CellScanPaneMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": null,
    "metadata": {},
    "name": "CellScanPaneMutation",
    "operationKind": "mutation",
    "text": "mutation CellScanPaneMutation(\n  $data: [SurveyCellScanData]!\n  $location: ID!\n) {\n  addCellScans(data: $data, locationID: $location) {\n    id\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '3bd6f8501cdc5d72527ddf735dbfc94c';

module.exports = node;
