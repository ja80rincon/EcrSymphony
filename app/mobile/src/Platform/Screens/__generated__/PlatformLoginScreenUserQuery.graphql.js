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
export type DistanceUnit = "KILOMETER" | "MILE" | "%future added value";
export type PlatformLoginScreenUserQueryVariables = {||};
export type PlatformLoginScreenUserQueryResponse = {|
  +me: ?{|
    +user: ?{|
      +id: string,
      +distanceUnit: ?DistanceUnit,
    |}
  |}
|};
export type PlatformLoginScreenUserQuery = {|
  variables: PlatformLoginScreenUserQueryVariables,
  response: PlatformLoginScreenUserQueryResponse,
|};
*/


/*
query PlatformLoginScreenUserQuery {
  me {
    user {
      id
      distanceUnit
    }
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "Viewer",
    "kind": "LinkedField",
    "name": "me",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "User",
        "kind": "LinkedField",
        "name": "user",
        "plural": false,
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
            "name": "distanceUnit",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "PlatformLoginScreenUserQuery",
    "selections": (v0/*: any*/),
    "type": "Query"
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "PlatformLoginScreenUserQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "id": null,
    "metadata": {},
    "name": "PlatformLoginScreenUserQuery",
    "operationKind": "query",
    "text": "query PlatformLoginScreenUserQuery {\n  me {\n    user {\n      id\n      distanceUnit\n    }\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '05534487ccdcdaa9b5380637be582a59';

module.exports = node;
