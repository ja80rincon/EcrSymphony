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
export type ExportStatus = "FAILED" | "IN_PROGRESS" | "PENDING" | "SUCCEEDED" | "%future added value";
export type CSVFileExportQueryVariables = {|
  taskId: string
|};
export type CSVFileExportQueryResponse = {|
  +task: ?{|
    +id?: string,
    +status?: ExportStatus,
    +progress?: number,
  |}
|};
export type CSVFileExportQuery = {|
  variables: CSVFileExportQueryVariables,
  response: CSVFileExportQueryResponse,
|};
*/


/*
query CSVFileExportQuery(
  $taskId: ID!
) {
  task: node(id: $taskId) {
    __typename
    ... on ExportTask {
      id
      status
      progress
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
  "name": "status",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "progress",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "CSVFileExportQuery",
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
            "kind": "InlineFragment",
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/)
            ],
            "type": "ExportTask",
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
    "name": "CSVFileExportQuery",
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
          (v2/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              (v3/*: any*/),
              (v4/*: any*/)
            ],
            "type": "ExportTask",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "1ff41b814e8e70f0e471318fceece877",
    "id": null,
    "metadata": {},
    "name": "CSVFileExportQuery",
    "operationKind": "query",
    "text": "query CSVFileExportQuery(\n  $taskId: ID!\n) {\n  task: node(id: $taskId) {\n    __typename\n    ... on ExportTask {\n      id\n      status\n      progress\n    }\n    id\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '0e0cc7aeb35079d37a437ccd497243dc';

module.exports = node;
