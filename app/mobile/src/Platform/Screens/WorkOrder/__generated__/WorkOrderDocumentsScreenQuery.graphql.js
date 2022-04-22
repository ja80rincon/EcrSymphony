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
export type WorkOrderDocumentsScreenQueryVariables = {|
  workOrderId: string
|};
export type WorkOrderDocumentsScreenQueryResponse = {|
  +node: ?{|
    +id?: string,
    +images?: $ReadOnlyArray<?{|
      +id: string,
      +fileName: string,
      +storeKey: ?string,
      +mimeType: ?string,
      +sizeInBytes: ?number,
      +modified: ?any,
      +uploaded: ?any,
      +annotation: ?string,
    |}>,
  |}
|};
export type WorkOrderDocumentsScreenQuery = {|
  variables: WorkOrderDocumentsScreenQueryVariables,
  response: WorkOrderDocumentsScreenQueryResponse,
|};
*/


/*
query WorkOrderDocumentsScreenQuery(
  $workOrderId: ID!
) {
  node(id: $workOrderId) {
    __typename
    ... on WorkOrder {
      id
      images {
        id
        fileName
        storeKey
        mimeType
        sizeInBytes
        modified
        uploaded
        annotation
      }
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
    "name": "workOrderId",
    "type": "ID!"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "workOrderId"
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
  "concreteType": "File",
  "kind": "LinkedField",
  "name": "images",
  "plural": true,
  "selections": [
    (v2/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "fileName",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "storeKey",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "mimeType",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "sizeInBytes",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "modified",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "uploaded",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "annotation",
      "storageKey": null
    }
  ],
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "WorkOrderDocumentsScreenQuery",
    "selections": [
      {
        "alias": null,
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
              (v3/*: any*/)
            ],
            "type": "WorkOrder"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query"
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "WorkOrderDocumentsScreenQuery",
    "selections": [
      {
        "alias": null,
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
              (v3/*: any*/)
            ],
            "type": "WorkOrder"
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": null,
    "metadata": {},
    "name": "WorkOrderDocumentsScreenQuery",
    "operationKind": "query",
    "text": "query WorkOrderDocumentsScreenQuery(\n  $workOrderId: ID!\n) {\n  node(id: $workOrderId) {\n    __typename\n    ... on WorkOrder {\n      id\n      images {\n        id\n        fileName\n        storeKey\n        mimeType\n        sizeInBytes\n        modified\n        uploaded\n        annotation\n      }\n    }\n    id\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '24f7d3ba71b619480afd73c99db9f127';

module.exports = node;
