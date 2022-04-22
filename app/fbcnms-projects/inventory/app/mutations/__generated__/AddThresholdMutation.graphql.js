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
export type AddThresholdInput = {|
  name: string,
  description: string,
  status: boolean,
  kpi: string,
|};
export type AddThresholdMutationVariables = {|
  input: AddThresholdInput
|};
export type AddThresholdMutationResponse = {|
  +addThreshold: {|
    +id: string,
    +name: string,
    +description: string,
    +status: boolean,
    +kpi: ?{|
      +id: string,
      +name: string,
    |},
  |}
|};
export type AddThresholdMutation = {|
  variables: AddThresholdMutationVariables,
  response: AddThresholdMutationResponse,
|};
*/


/*
mutation AddThresholdMutation(
  $input: AddThresholdInput!
) {
  addThreshold(input: $input) {
    id
    name
    description
    status
    kpi {
      id
      name
    }
  }
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
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v3 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "Threshold",
    "kind": "LinkedField",
    "name": "addThreshold",
    "plural": false,
    "selections": [
      (v1/*: any*/),
      (v2/*: any*/),
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "description",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "status",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "Kpi",
        "kind": "LinkedField",
        "name": "kpi",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "AddThresholdMutation",
    "selections": (v3/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "AddThresholdMutation",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "62b86bf1deb52735367368f1b84fb8f2",
    "id": null,
    "metadata": {},
    "name": "AddThresholdMutation",
    "operationKind": "mutation",
    "text": "mutation AddThresholdMutation(\n  $input: AddThresholdInput!\n) {\n  addThreshold(input: $input) {\n    id\n    name\n    description\n    status\n    kpi {\n      id\n      name\n    }\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '322d881eb92bb52f27e70ca5bcd6d6c0';

module.exports = node;
