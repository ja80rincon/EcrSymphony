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
export type CSVFileExportKeyQueryVariables = {|
  taskId: string
|};
export type CSVFileExportKeyQueryResponse = {|
  +task: ?{|
    +storeKey?: string
  |}
|};
export type CSVFileExportKeyQuery = {|
  variables: CSVFileExportKeyQueryVariables,
  response: CSVFileExportKeyQueryResponse,
|};
*/


/*
query CSVFileExportKeyQuery(
  $taskId: ID!
) {
  task: node(id: $taskId) {
    __typename
    ... on ExportTask {
      storeKey
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
    "name": "taskId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "taskId"
  }
],
v2 = {
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "storeKey",
      "storageKey": null
    }
  ],
  "type": "ExportTask",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "CSVFileExportKeyQuery",
    "selections": [
      {
        "alias": "task",
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v2/*: any*/)
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
    "name": "CSVFileExportKeyQuery",
    "selections": [
      {
        "alias": "task",
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
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          },
          (v2/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "94eb1a753a790247febf70b9747df3b6",
    "id": null,
    "metadata": {},
    "name": "CSVFileExportKeyQuery",
    "operationKind": "query",
    "text": "query CSVFileExportKeyQuery(\n  $taskId: ID!\n) {\n  task: node(id: $taskId) {\n    __typename\n    ... on ExportTask {\n      storeKey\n    }\n    id\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '791a7ac59b00b79408ba2d34a184914f';

module.exports = node;
