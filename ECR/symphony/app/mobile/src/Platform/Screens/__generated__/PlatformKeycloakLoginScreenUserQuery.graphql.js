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
export type PlatformKeycloakLoginScreenUserQueryVariables = {||};
export type PlatformKeycloakLoginScreenUserQueryResponse = {|
  +me: ?{|
    +user: ?{|
      +id: string,
      +distanceUnit: ?DistanceUnit,
    |}
  |}
|};
export type PlatformKeycloakLoginScreenUserQuery = {|
  variables: PlatformKeycloakLoginScreenUserQueryVariables,
  response: PlatformKeycloakLoginScreenUserQueryResponse,
|};
*/


/*
query PlatformKeycloakLoginScreenUserQuery {
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
    "name": "PlatformKeycloakLoginScreenUserQuery",
    "selections": (v0/*: any*/),
    "type": "Query"
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "PlatformKeycloakLoginScreenUserQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "id": null,
    "metadata": {},
    "name": "PlatformKeycloakLoginScreenUserQuery",
    "operationKind": "query",
    "text": "query PlatformKeycloakLoginScreenUserQuery {\n  me {\n    user {\n      id\n      distanceUnit\n    }\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'bd7664e58f0a4354ae74a53816f4442e';

module.exports = node;
