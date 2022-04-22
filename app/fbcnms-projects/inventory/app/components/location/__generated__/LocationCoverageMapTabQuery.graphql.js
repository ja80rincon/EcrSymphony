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
type LocationCellScanCoverageMap_cellData$ref = any;
type LocationWiFiScanCoverageMap_wifiData$ref = any;
export type LocationCoverageMapTabQueryVariables = {|
  locationId: string
|};
export type LocationCoverageMapTabQueryResponse = {|
  +location: ?{|
    +cellData?: $ReadOnlyArray<?{|
      +$fragmentRefs: LocationCellScanCoverageMap_cellData$ref
    |}>,
    +wifiData?: $ReadOnlyArray<?{|
      +$fragmentRefs: LocationWiFiScanCoverageMap_wifiData$ref
    |}>,
  |}
|};
export type LocationCoverageMapTabQuery = {|
  variables: LocationCoverageMapTabQueryVariables,
  response: LocationCoverageMapTabQueryResponse,
|};
*/


/*
query LocationCoverageMapTabQuery(
  $locationId: ID!
) {
  location: node(id: $locationId) {
    __typename
    ... on Location {
      cellData {
        ...LocationCellScanCoverageMap_cellData
        id
      }
      wifiData {
        ...LocationWiFiScanCoverageMap_wifiData
        id
      }
    }
    id
  }
}

fragment LocationCellScanCoverageMap_cellData on SurveyCellScan {
  id
  latitude
  longitude
  networkType
  signalStrength
  mobileCountryCode
  mobileNetworkCode
  operator
}

fragment LocationWiFiScanCoverageMap_wifiData on SurveyWiFiScan {
  id
  latitude
  longitude
  frequency
  channel
  bssid
  ssid
  strength
  band
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "locationId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "locationId"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "latitude",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "longitude",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "LocationCoverageMapTabQuery",
    "selections": [
      {
        "alias": "location",
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          {
            "kind": "InlineFragment",
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
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "LocationCellScanCoverageMap_cellData"
                  }
                ],
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
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "LocationWiFiScanCoverageMap_wifiData"
                  }
                ],
                "storageKey": null
              }
            ],
            "type": "Location",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "LocationCoverageMapTabQuery",
    "selections": [
      {
        "alias": "location",
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "__typename",
            "storageKey": null
          },
          (v2/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "SurveyCellScan",
                "kind": "LinkedField",
                "name": "cellData",
                "plural": true,
                "selections": [
                  (v2/*: any*/),
                  (v3/*: any*/),
                  (v4/*: any*/),
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
                  (v2/*: any*/),
                  (v3/*: any*/),
                  (v4/*: any*/),
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
                "storageKey": null
              }
            ],
            "type": "Location",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "04d57b75c838f99279a1361c2bdbac1d",
    "id": null,
    "metadata": {},
    "name": "LocationCoverageMapTabQuery",
    "operationKind": "query",
    "text": "query LocationCoverageMapTabQuery(\n  $locationId: ID!\n) {\n  location: node(id: $locationId) {\n    __typename\n    ... on Location {\n      cellData {\n        ...LocationCellScanCoverageMap_cellData\n        id\n      }\n      wifiData {\n        ...LocationWiFiScanCoverageMap_wifiData\n        id\n      }\n    }\n    id\n  }\n}\n\nfragment LocationCellScanCoverageMap_cellData on SurveyCellScan {\n  id\n  latitude\n  longitude\n  networkType\n  signalStrength\n  mobileCountryCode\n  mobileNetworkCode\n  operator\n}\n\nfragment LocationWiFiScanCoverageMap_wifiData on SurveyWiFiScan {\n  id\n  latitude\n  longitude\n  frequency\n  channel\n  bssid\n  ssid\n  strength\n  band\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '16ca9fb7b04e14fdb62144f24b5ab0e5';

module.exports = node;
