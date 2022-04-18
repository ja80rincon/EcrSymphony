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
export type CommentEntity = "PROJECT" | "WORK_ORDER" | "%future added value";
export type CommentInput = {|
  entityType: CommentEntity,
  id: string,
  text: string,
|};
export type WorkOrderAddCommentMutationVariables = {|
  input: CommentInput
|};
export type WorkOrderAddCommentMutationResponse = {|
  +addComment: {|
    +$fragmentRefs: WorkOrderCommentListItem_comment$ref
  |}
|};
export type WorkOrderAddCommentMutation = {|
  variables: WorkOrderAddCommentMutationVariables,
  response: WorkOrderAddCommentMutationResponse,
|};
*/


/*
mutation WorkOrderAddCommentMutation(
  $input: CommentInput!
) {
  addComment(input: $input) {
    ...WorkOrderCommentListItem_comment
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
    "name": "input",
    "type": "CommentInput!"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
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
    "name": "WorkOrderAddCommentMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Comment",
        "kind": "LinkedField",
        "name": "addComment",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "WorkOrderCommentListItem_comment"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation"
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "WorkOrderAddCommentMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Comment",
        "kind": "LinkedField",
        "name": "addComment",
        "plural": false,
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
    ]
  },
  "params": {
    "id": null,
    "metadata": {},
    "name": "WorkOrderAddCommentMutation",
    "operationKind": "mutation",
    "text": "mutation WorkOrderAddCommentMutation(\n  $input: CommentInput!\n) {\n  addComment(input: $input) {\n    ...WorkOrderCommentListItem_comment\n    id\n  }\n}\n\nfragment WorkOrderCommentListItem_comment on Comment {\n  id\n  author {\n    email\n    id\n  }\n  text\n  createTime\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'fbb6a3f923559b02f23fb97f7fa43a83';

module.exports = node;
