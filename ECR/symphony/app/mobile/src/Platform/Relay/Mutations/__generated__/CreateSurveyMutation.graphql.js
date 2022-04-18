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
export type FileType = "FILE" | "IMAGE" | "%future added value";
export type SurveyQuestionType = "BOOL" | "CELLULAR" | "COORDS" | "DATE" | "EMAIL" | "FLOAT" | "INTEGER" | "PHONE" | "PHOTO" | "TEXT" | "TEXTAREA" | "WIFI" | "%future added value";
export type SurveyStatus = "COMPLETED" | "INPROGRESS" | "PLANNED" | "%future added value";
export type SurveyCreateData = {|
  name: string,
  ownerName?: ?string,
  creationTimestamp?: ?number,
  completionTimestamp: number,
  status?: ?SurveyStatus,
  locationID: string,
  surveyResponses: $ReadOnlyArray<SurveyQuestionResponse>,
|};
export type SurveyQuestionResponse = {|
  formName?: ?string,
  formDescription?: ?string,
  formIndex: number,
  questionFormat?: ?SurveyQuestionType,
  questionText: string,
  questionIndex: number,
  boolData?: ?boolean,
  emailData?: ?string,
  latitude?: ?number,
  longitude?: ?number,
  locationAccuracy?: ?number,
  altitude?: ?number,
  phoneData?: ?string,
  textData?: ?string,
  floatData?: ?number,
  intData?: ?number,
  dateData?: ?number,
  photoData?: ?FileInput,
  wifiData?: ?$ReadOnlyArray<SurveyWiFiScanData>,
  cellData?: ?$ReadOnlyArray<SurveyCellScanData>,
  imagesData?: ?$ReadOnlyArray<FileInput>,
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
export type CreateSurveyMutationVariables = {|
  input: SurveyCreateData
|};
export type CreateSurveyMutationResponse = {|
  +createSurvey: string
|};
export type CreateSurveyMutation = {|
  variables: CreateSurveyMutationVariables,
  response: CreateSurveyMutationResponse,
|};
*/


/*
mutation CreateSurveyMutation(
  $input: SurveyCreateData!
) {
  createSurvey(data: $input)
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input",
    "type": "SurveyCreateData!"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "data",
        "variableName": "input"
      }
    ],
    "kind": "ScalarField",
    "name": "createSurvey",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "CreateSurveyMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation"
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "CreateSurveyMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": null,
    "metadata": {},
    "name": "CreateSurveyMutation",
    "operationKind": "mutation",
    "text": "mutation CreateSurveyMutation(\n  $input: SurveyCreateData!\n) {\n  createSurvey(data: $input)\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '736bb9939ac305490c5bfdf013a7974f';

module.exports = node;
