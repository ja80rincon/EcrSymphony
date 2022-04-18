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
export type DeleteFloorPlanMutationVariables = {|
  id: string
|};
export type DeleteFloorPlanMutationResponse = {|
  +deleteFloorPlan: boolean
|};
export type DeleteFloorPlanMutation = {|
  variables: DeleteFloorPlanMutationVariables,
  response: DeleteFloorPlanMutationResponse,
|};
*/


/*
mutation DeleteFloorPlanMutation(
  $id: ID!
) {
  deleteFloorPlan(id: $id)
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
    "name": "deleteFloorPlan",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "DeleteFloorPlanMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "DeleteFloorPlanMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "ce127dc69d554c46c04e244adc40c341",
    "id": null,
    "metadata": {},
    "name": "DeleteFloorPlanMutation",
    "operationKind": "mutation",
    "text": "mutation DeleteFloorPlanMutation(\n  $id: ID!\n) {\n  deleteFloorPlan(id: $id)\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '398cf21649438ad9454a4cdcb7c81c89';

module.exports = node;
