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
type WorkOrderChecklistCategoryNavigationListItem_category$ref = any;
export type WorkOrderChecklistScreenQueryVariables = {|
  workOrderId: string
|};
export type WorkOrderChecklistScreenQueryResponse = {|
  +node: ?{|
    +checkListCategories?: $ReadOnlyArray<{|
      +id: string,
      +$fragmentRefs: WorkOrderChecklistCategoryNavigationListItem_category$ref,
    |}>
  |}
|};
export type WorkOrderChecklistScreenQuery = {|
  variables: WorkOrderChecklistScreenQueryVariables,
  response: WorkOrderChecklistScreenQueryResponse,
|};
*/


/*
query WorkOrderChecklistScreenQuery(
  $workOrderId: ID!
) {
  node(id: $workOrderId) {
    __typename
    ... on WorkOrder {
      checkListCategories {
        id
        ...WorkOrderChecklistCategoryNavigationListItem_category
      }
    }
    id
  }
}

fragment WorkOrderChecklistCategoryNavigationListItem_category on CheckListCategory {
  id
  title
  description
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
    "name": "WorkOrderChecklistScreenQuery",
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
              {
                "alias": null,
                "args": null,
                "concreteType": "CheckListCategory",
                "kind": "LinkedField",
                "name": "checkListCategories",
                "plural": true,
                "selections": [
                  (v2/*: any*/),
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "WorkOrderChecklistCategoryNavigationListItem_category"
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
    "name": "WorkOrderChecklistScreenQuery",
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
                "concreteType": "CheckListCategory",
                "kind": "LinkedField",
                "name": "checkListCategories",
                "plural": true,
                "selections": [
                  (v2/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "title",
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
    "name": "WorkOrderChecklistScreenQuery",
    "operationKind": "query",
    "text": "query WorkOrderChecklistScreenQuery(\n  $workOrderId: ID!\n) {\n  node(id: $workOrderId) {\n    __typename\n    ... on WorkOrder {\n      checkListCategories {\n        id\n        ...WorkOrderChecklistCategoryNavigationListItem_category\n      }\n    }\n    id\n  }\n}\n\nfragment WorkOrderChecklistCategoryNavigationListItem_category on CheckListCategory {\n  id\n  title\n  description\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '41a6577683633c4bc449672092aee7ee';

module.exports = node;
