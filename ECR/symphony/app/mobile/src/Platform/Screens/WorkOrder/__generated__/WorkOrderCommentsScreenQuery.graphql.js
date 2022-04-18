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
type WorkOrderCommentListItem_comment$ref = any;
export type WorkOrderCommentsScreenQueryVariables = {|
  workOrderId: string
|};
export type WorkOrderCommentsScreenQueryResponse = {|
  +node: ?{|
    +id?: string,
    +comments?: $ReadOnlyArray<?{|
      +id: string,
      +$fragmentRefs: WorkOrderCommentListItem_comment$ref,
    |}>,
  |}
|};
export type WorkOrderCommentsScreenQuery = {|
  variables: WorkOrderCommentsScreenQueryVariables,
  response: WorkOrderCommentsScreenQueryResponse,
|};
*/


/*
query WorkOrderCommentsScreenQuery(
  $workOrderId: ID!
) {
  node(id: $workOrderId) {
    __typename
    ... on WorkOrder {
      id
      comments {
        id
        ...WorkOrderCommentListItem_comment
      }
    }
    id
  }
}

fragment WorkOrderCommentListItem_comment on Comment {
  id
  author {
    email
    id
  }
  text
  createTime
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
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "WorkOrderCommentsScreenQuery",
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
              {
                "alias": null,
                "args": null,
                "concreteType": "Comment",
                "kind": "LinkedField",
                "name": "comments",
                "plural": true,
                "selections": [
                  (v2/*: any*/),
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "WorkOrderCommentListItem_comment"
                  }
                ],
                "storageKey": null
              }
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
    "name": "WorkOrderCommentsScreenQuery",
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
              {
                "alias": null,
                "args": null,
                "concreteType": "Comment",
                "kind": "LinkedField",
                "name": "comments",
                "plural": true,
                "selections": [
                  (v2/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "User",
                    "kind": "LinkedField",
                    "name": "author",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "email",
                        "storageKey": null
                      },
                      (v2/*: any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "text",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "createTime",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
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
    "name": "WorkOrderCommentsScreenQuery",
    "operationKind": "query",
    "text": "query WorkOrderCommentsScreenQuery(\n  $workOrderId: ID!\n) {\n  node(id: $workOrderId) {\n    __typename\n    ... on WorkOrder {\n      id\n      comments {\n        id\n        ...WorkOrderCommentListItem_comment\n      }\n    }\n    id\n  }\n}\n\nfragment WorkOrderCommentListItem_comment on Comment {\n  id\n  author {\n    email\n    id\n  }\n  text\n  createTime\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'd37a61bdcb1a7fbcc98fef7395f6aca7';

module.exports = node;
