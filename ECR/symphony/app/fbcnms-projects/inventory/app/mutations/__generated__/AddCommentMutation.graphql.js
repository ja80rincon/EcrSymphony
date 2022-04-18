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
type TextCommentPost_comment$ref = any;
export type CommentEntity = "PROJECT" | "WORK_ORDER" | "%future added value";
export type CommentInput = {|
  entityType: CommentEntity,
  id: string,
  text: string,
|};
export type AddCommentMutationVariables = {|
  input: CommentInput
|};
export type AddCommentMutationResponse = {|
  +addComment: {|
    +$fragmentRefs: TextCommentPost_comment$ref
  |}
|};
export type AddCommentMutation = {|
  variables: AddCommentMutationVariables,
  response: AddCommentMutationResponse,
|};
*/


/*
mutation AddCommentMutation(
  $input: CommentInput!
) {
  addComment(input: $input) {
    ...TextCommentPost_comment
    id
  }
}

fragment TextCommentPost_comment on Comment {
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
    "name": "input"
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
    "name": "AddCommentMutation",
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
            "name": "TextCommentPost_comment"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "AddCommentMutation",
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
    "cacheID": "cfe5958f35680b1c235f43ad400c68c1",
    "id": null,
    "metadata": {},
    "name": "AddCommentMutation",
    "operationKind": "mutation",
    "text": "mutation AddCommentMutation(\n  $input: CommentInput!\n) {\n  addComment(input: $input) {\n    ...TextCommentPost_comment\n    id\n  }\n}\n\nfragment TextCommentPost_comment on Comment {\n  id\n  author {\n    email\n    id\n  }\n  text\n  createTime\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '18acd250d64b7a14e2d84071967d7cb9';

module.exports = node;
