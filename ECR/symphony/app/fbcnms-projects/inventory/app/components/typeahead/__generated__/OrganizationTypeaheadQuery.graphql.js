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
export type FilterOperator = "CONTAINS" | "DATE_GREATER_OR_EQUAL_THAN" | "DATE_GREATER_THAN" | "DATE_LESS_OR_EQUAL_THAN" | "DATE_LESS_THAN" | "IS" | "IS_NIL" | "IS_NIL_OR_DATE_GREATER_OR_EQUAL_THAN" | "IS_NOT_ONE_OF" | "IS_ONE_OF" | "%future added value";
export type OrganizationFilterType = "DESCRIPTION" | "ID" | "NAME" | "%future added value";
export type OrganizationFilterInput = {|
  filterType: OrganizationFilterType,
  operator: FilterOperator,
  stringValue?: ?string,
  idSet?: ?$ReadOnlyArray<string>,
  maxDepth?: ?number,
  stringSet?: ?$ReadOnlyArray<string>,
|};
export type OrganizationTypeaheadQueryVariables = {|
  filters: $ReadOnlyArray<OrganizationFilterInput>,
  limit?: ?number,
|};
export type OrganizationTypeaheadQueryResponse = {|
  +organizations: {|
    +edges: $ReadOnlyArray<{|
      +node: ?{|
        +id: string,
        +name: string,
        +description: string,
      |}
    |}>
  |}
|};
export type OrganizationTypeaheadQuery = {|
  variables: OrganizationTypeaheadQueryVariables,
  response: OrganizationTypeaheadQueryResponse,
|};
*/


/*
query OrganizationTypeaheadQuery(
  $filters: [OrganizationFilterInput!]!
  $limit: Int
) {
  organizations(filterBy: $filters, first: $limit) {
    edges {
      node {
        id
        name
        description
      }
    }
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "filters"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "limit"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "filterBy",
        "variableName": "filters"
      },
      {
        "kind": "Variable",
        "name": "first",
        "variableName": "limit"
      }
    ],
    "concreteType": "OrganizationConnection",
    "kind": "LinkedField",
    "name": "organizations",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "OrganizationEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Organization",
            "kind": "LinkedField",
            "name": "node",
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
                "name": "name",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "description",
                "storageKey": null
              }
            ],
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "OrganizationTypeaheadQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "OrganizationTypeaheadQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "a936437d20ba9ca4302df2a7e168c3f0",
    "id": null,
    "metadata": {},
    "name": "OrganizationTypeaheadQuery",
    "operationKind": "query",
    "text": "query OrganizationTypeaheadQuery(\n  $filters: [OrganizationFilterInput!]!\n  $limit: Int\n) {\n  organizations(filterBy: $filters, first: $limit) {\n    edges {\n      node {\n        id\n        name\n        description\n      }\n    }\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '436b67cd01bac0f3051e5f3edb4ce21f';

module.exports = node;
