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
export type EditRuleInput = {|
  id: string,
  name: string,
  gracePeriod?: ?number,
  startDateTime?: ?any,
  endDateTime?: ?any,
  ruleType: string,
  eventTypeName?: ?string,
  specificProblem?: ?string,
  additionalInfo?: ?string,
  status: boolean,
  eventSeverity: string,
  threshold: string,
|};
export type EditRuleMutationVariables = {|
  input: EditRuleInput
|};
export type EditRuleMutationResponse = {|
  +editRule: {|
    +id: string,
    +name: string,
  |}
|};
export type EditRuleMutation = {|
  variables: EditRuleMutationVariables,
  response: EditRuleMutationResponse,
|};
*/


/*
mutation EditRuleMutation(
  $input: EditRuleInput!
) {
  editRule(input: $input) {
    id
    name
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
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "Rule",
    "kind": "LinkedField",
    "name": "editRule",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "id",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "name",
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
    "name": "EditRuleMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "EditRuleMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "d30b48c5db711000cd7ee07ae9f124a9",
    "id": null,
    "metadata": {},
    "name": "EditRuleMutation",
    "operationKind": "mutation",
    "text": "mutation EditRuleMutation(\n  $input: EditRuleInput!\n) {\n  editRule(input: $input) {\n    id\n    name\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '75428291d5582725d5d9afa78d41c456';

module.exports = node;
