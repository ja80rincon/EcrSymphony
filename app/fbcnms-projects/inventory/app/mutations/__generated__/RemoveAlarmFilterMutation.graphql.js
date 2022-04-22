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
export type RemoveAlarmFilterMutationVariables = {|
  id: string
|};
export type RemoveAlarmFilterMutationResponse = {|
  +removeAlarmFilter: string
|};
export type RemoveAlarmFilterMutation = {|
  variables: RemoveAlarmFilterMutationVariables,
  response: RemoveAlarmFilterMutationResponse,
|};
*/


/*
mutation RemoveAlarmFilterMutation(
  $id: ID!
) {
  removeAlarmFilter(id: $id)
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
    "name": "removeAlarmFilter",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "RemoveAlarmFilterMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "RemoveAlarmFilterMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "a63bb57ca246f0b31d38f82b154f41b3",
    "id": null,
    "metadata": {},
    "name": "RemoveAlarmFilterMutation",
    "operationKind": "mutation",
    "text": "mutation RemoveAlarmFilterMutation(\n  $id: ID!\n) {\n  removeAlarmFilter(id: $id)\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'e8a235cbfd33583725253244ec9ddd94';

module.exports = node;
