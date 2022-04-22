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
export type EditRuleLimitInput = {|
  id: string,
  number: number,
  limitType: string,
  comparator: string,
  rule: string,
|};
export type EditRuleLimitMutationVariables = {|
  input: EditRuleLimitInput
|};
export type EditRuleLimitMutationResponse = {|
  +editRuleLimit: {|
    +id: string,
    +number: number,
  |}
|};
export type EditRuleLimitMutation = {|
  variables: EditRuleLimitMutationVariables,
  response: EditRuleLimitMutationResponse,
|};
*/


/*
mutation EditRuleLimitMutation(
  $input: EditRuleLimitInput!
) {
  editRuleLimit(input: $input) {
    id
    number
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
    "concreteType": "RuleLimit",
    "kind": "LinkedField",
    "name": "editRuleLimit",
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
        "name": "number",
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
    "name": "EditRuleLimitMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "EditRuleLimitMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "c597329c66ffd4da0d1fb3f94d3277db",
    "id": null,
    "metadata": {},
    "name": "EditRuleLimitMutation",
    "operationKind": "mutation",
    "text": "mutation EditRuleLimitMutation(\n  $input: EditRuleLimitInput!\n) {\n  editRuleLimit(input: $input) {\n    id\n    number\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'db952c8325d4065cd7072223fdfc0e1b';

module.exports = node;
