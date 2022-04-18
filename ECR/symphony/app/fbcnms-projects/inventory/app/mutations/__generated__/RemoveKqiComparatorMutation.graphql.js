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
export type RemoveKqiComparatorMutationVariables = {|
  id: string
|};
export type RemoveKqiComparatorMutationResponse = {|
  +removeKqiComparator: string
|};
export type RemoveKqiComparatorMutation = {|
  variables: RemoveKqiComparatorMutationVariables,
  response: RemoveKqiComparatorMutationResponse,
|};
*/


/*
mutation RemoveKqiComparatorMutation(
  $id: ID!
) {
  removeKqiComparator(id: $id)
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "id",
        "variableName": "id"
      }
    ],
    "kind": "ScalarField",
    "name": "removeKqiComparator",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "RemoveKqiComparatorMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "RemoveKqiComparatorMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "68a3c457460464496a2858471f92f948",
    "id": null,
    "metadata": {},
    "name": "RemoveKqiComparatorMutation",
    "operationKind": "mutation",
    "text": "mutation RemoveKqiComparatorMutation(\n  $id: ID!\n) {\n  removeKqiComparator(id: $id)\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'aff9fd2fc5d720052653107875dcd11e';

module.exports = node;
