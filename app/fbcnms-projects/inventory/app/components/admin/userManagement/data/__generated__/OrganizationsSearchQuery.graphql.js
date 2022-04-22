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
export type OrganizationsSearchQueryVariables = {|
  orgId: string
|};
export type OrganizationsSearchQueryResponse = {|
  +organization: ?{|
    +id?: string,
    +name?: string,
    +description?: string,
  |}
|};
export type OrganizationsSearchQuery = {|
  variables: OrganizationsSearchQueryVariables,
  response: OrganizationsSearchQueryResponse,
|};
*/


/*
query OrganizationsSearchQuery(
  $orgId: ID!
) {
  organization: node(id: $orgId) {
    __typename
    ... on Organization {
      id
      name
      description
    }
    id
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "orgId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "orgId"
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
  "name": "name",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "description",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "OrganizationsSearchQuery",
    "selections": [
      {
        "alias": "organization",
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          {
            "kind": "InlineFragment",
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/)
            ],
            "type": "Organization",
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
    "name": "OrganizationsSearchQuery",
    "selections": [
      {
        "alias": "organization",
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
              (v3/*: any*/),
              (v4/*: any*/)
            ],
            "type": "Organization",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "2b0bb7ce88aa980fe5b426a45debb53b",
    "id": null,
    "metadata": {},
    "name": "OrganizationsSearchQuery",
    "operationKind": "query",
    "text": "query OrganizationsSearchQuery(\n  $orgId: ID!\n) {\n  organization: node(id: $orgId) {\n    __typename\n    ... on Organization {\n      id\n      name\n      description\n    }\n    id\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'b9a14b8ebf873d4397a2bc10e6b59e4d';

module.exports = node;
