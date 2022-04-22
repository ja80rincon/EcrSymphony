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
export type AddKqiComparatorInput = {|
  kqiTargetFk: string,
  comparatorFk: string,
  number: number,
  comparatorType: string,
|};
export type AddKqiComparatorMutationVariables = {|
  input: AddKqiComparatorInput
|};
export type AddKqiComparatorMutationResponse = {|
  +addKqiComparator: {|
    +id: string,
    +number: number,
    +comparatorType: string,
    +kqiTargetFk: {|
      +id: string,
      +name: string,
    |},
    +comparatorFk: {|
      +id: string,
      +name: string,
    |},
  |}
|};
export type AddKqiComparatorMutation = {|
  variables: AddKqiComparatorMutationVariables,
  response: AddKqiComparatorMutationResponse,
|};
*/


/*
mutation AddKqiComparatorMutation(
  $input: AddKqiComparatorInput!
) {
  addKqiComparator(input: $input) {
    id
    number
    comparatorType
    kqiTargetFk {
      id
      name
    }
    comparatorFk {
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
v2 = [
  (v1/*: any*/),
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "name",
    "storageKey": null
  }
],
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
    "concreteType": "KqiComparator",
    "kind": "LinkedField",
    "name": "addKqiComparator",
    "plural": false,
    "selections": [
      (v1/*: any*/),
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "number",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "comparatorType",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "KqiTarget",
        "kind": "LinkedField",
        "name": "kqiTargetFk",
        "plural": false,
        "selections": (v2/*: any*/),
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "Comparator",
        "kind": "LinkedField",
        "name": "comparatorFk",
        "plural": false,
        "selections": (v2/*: any*/),
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
    "name": "AddKqiComparatorMutation",
    "selections": (v3/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "AddKqiComparatorMutation",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "0e5215b9a6805b88b7707e1703e0a3c6",
    "id": null,
    "metadata": {},
    "name": "AddKqiComparatorMutation",
    "operationKind": "mutation",
    "text": "mutation AddKqiComparatorMutation(\n  $input: AddKqiComparatorInput!\n) {\n  addKqiComparator(input: $input) {\n    id\n    number\n    comparatorType\n    kqiTargetFk {\n      id\n      name\n    }\n    comparatorFk {\n      id\n      name\n    }\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'c8b939e5a375ead9ecea34ccdafc94d1';

module.exports = node;
