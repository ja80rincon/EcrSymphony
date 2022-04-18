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
export type MarkSiteSurveyNeededMutationVariables = {|
  locationId: string,
  needed: boolean,
|};
export type MarkSiteSurveyNeededMutationResponse = {|
  +markSiteSurveyNeeded: {|
    +id: string,
    +externalId: ?string,
    +name: string,
    +locationType: {|
      +id: string,
      +name: string,
    |},
    +numChildren: number,
    +siteSurveyNeeded: boolean,
  |}
|};
export type MarkSiteSurveyNeededMutation = {|
  variables: MarkSiteSurveyNeededMutationVariables,
  response: MarkSiteSurveyNeededMutationResponse,
|};
*/


/*
mutation MarkSiteSurveyNeededMutation(
  $locationId: ID!
  $needed: Boolean!
) {
  markSiteSurveyNeeded(locationId: $locationId, needed: $needed) {
    id
    externalId
    name
    locationType {
      id
      name
    }
    numChildren
    siteSurveyNeeded
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "locationId"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "needed"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v3 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "locationId",
        "variableName": "locationId"
      },
      {
        "kind": "Variable",
        "name": "needed",
        "variableName": "needed"
      }
    ],
    "concreteType": "Location",
    "kind": "LinkedField",
    "name": "markSiteSurveyNeeded",
    "plural": false,
    "selections": [
      (v1/*: any*/),
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "externalId",
        "storageKey": null
      },
      (v2/*: any*/),
      {
        "alias": null,
        "args": null,
        "concreteType": "LocationType",
        "kind": "LinkedField",
        "name": "locationType",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "numChildren",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "siteSurveyNeeded",
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
    "name": "MarkSiteSurveyNeededMutation",
    "selections": (v3/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "MarkSiteSurveyNeededMutation",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "a1e2fe82ed1621be42fdce8192e4d5b0",
    "id": null,
    "metadata": {},
    "name": "MarkSiteSurveyNeededMutation",
    "operationKind": "mutation",
    "text": "mutation MarkSiteSurveyNeededMutation(\n  $locationId: ID!\n  $needed: Boolean!\n) {\n  markSiteSurveyNeeded(locationId: $locationId, needed: $needed) {\n    id\n    externalId\n    name\n    locationType {\n      id\n      name\n    }\n    numChildren\n    siteSurveyNeeded\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'a5c70fb90bb9de415d3c763e0d8617a8';

module.exports = node;
