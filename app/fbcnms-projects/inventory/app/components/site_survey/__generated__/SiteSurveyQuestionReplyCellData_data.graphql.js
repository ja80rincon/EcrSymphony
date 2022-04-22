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
declare export opaque type SiteSurveyQuestionReplyCellData_data$ref: FragmentReference;
declare export opaque type SiteSurveyQuestionReplyCellData_data$fragmentType: SiteSurveyQuestionReplyCellData_data$ref;
export type SiteSurveyQuestionReplyCellData_data = {|
  +cellData: ?$ReadOnlyArray<?{|
    +networkType: CellularNetworkType,
    +signalStrength: number,
    +baseStationID: ?string,
    +cellID: ?string,
    +locationAreaCode: ?string,
    +mobileCountryCode: ?string,
    +mobileNetworkCode: ?string,
  |}>,
  +$refType: SiteSurveyQuestionReplyCellData_data$ref,
|};
export type SiteSurveyQuestionReplyCellData_data$data = SiteSurveyQuestionReplyCellData_data;
export type SiteSurveyQuestionReplyCellData_data$key = {
  +$data?: SiteSurveyQuestionReplyCellData_data$data,
  +$fragmentRefs: SiteSurveyQuestionReplyCellData_data$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "SiteSurveyQuestionReplyCellData_data",
  "selections": [
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
        }
      ],
      "storageKey": null
    }
  ],
  "type": "SurveyQuestion",
  "abstractKey": null
};
// prettier-ignore
(node/*: any*/).hash = '586ccb85b3fc3c5e37ce3014c2a26c0b';

module.exports = node;
