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
declare export opaque type SiteSurveyQuestionReplyWifiData_data$ref: FragmentReference;
declare export opaque type SiteSurveyQuestionReplyWifiData_data$fragmentType: SiteSurveyQuestionReplyWifiData_data$ref;
export type SiteSurveyQuestionReplyWifiData_data = {|
  +wifiData: ?$ReadOnlyArray<?{|
    +band: ?string,
    +bssid: string,
    +channel: number,
    +frequency: number,
    +strength: number,
    +ssid: ?string,
  |}>,
  +$refType: SiteSurveyQuestionReplyWifiData_data$ref,
|};
export type SiteSurveyQuestionReplyWifiData_data$data = SiteSurveyQuestionReplyWifiData_data;
export type SiteSurveyQuestionReplyWifiData_data$key = {
  +$data?: SiteSurveyQuestionReplyWifiData_data$data,
  +$fragmentRefs: SiteSurveyQuestionReplyWifiData_data$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "SiteSurveyQuestionReplyWifiData_data",
  "selections": [
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
          "name": "band",
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
          "name": "channel",
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
          "name": "strength",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "ssid",
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
(node/*: any*/).hash = '2d96d30d887d78992884a1de2ceca46c';

module.exports = node;
