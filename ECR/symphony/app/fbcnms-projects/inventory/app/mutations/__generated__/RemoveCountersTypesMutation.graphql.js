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
export type RemoveCountersTypesMutationVariables = {|
  id: string
|};
export type RemoveCountersTypesMutationResponse = {|
  +removeCounter: string
|};
export type RemoveCountersTypesMutation = {|
  variables: RemoveCountersTypesMutationVariables,
  response: RemoveCountersTypesMutationResponse,
|};
*/


/*
mutation RemoveCountersTypesMutation(
  $id: ID!
) {
  removeCounter(id: $id)
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
    "name": "removeCounter",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "RemoveCountersTypesMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "RemoveCountersTypesMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "0456263d723d7e5d5e3b380eb7efce75",
    "id": null,
    "metadata": {},
    "name": "RemoveCountersTypesMutation",
    "operationKind": "mutation",
    "text": "mutation RemoveCountersTypesMutation(\n  $id: ID!\n) {\n  removeCounter(id: $id)\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'eeb5d288ee217375c00bae3f3a834e73';

module.exports = node;
