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
export type AddKqiInput = {|
  name: string,
  description: string,
  formula: string,
  startDateTime: any,
  endDateTime: any,
  kqiCategory: string,
  kqiPerspective: string,
  kqiSource: string,
  kqiTemporalFrequency: string,
|};
export type AddKqiMutationVariables = {|
  input: AddKqiInput
|};
export type AddKqiMutationResponse = {|
  +addKqi: {|
    +id: string,
    +name: string,
    +description: string,
    +formula: string,
    +startDateTime: any,
    +endDateTime: any,
    +kqiCategory: {|
      +id: string,
      +name: string,
    |},
    +kqiPerspective: {|
      +id: string,
      +name: string,
    |},
    +kqiSource: {|
      +id: string,
      +name: string,
    |},
    +kqiTemporalFrequency: {|
      +id: string,
      +name: string,
    |},
  |}
|};
export type AddKqiMutation = {|
  variables: AddKqiMutationVariables,
  response: AddKqiMutationResponse,
|};
*/


/*
mutation AddKqiMutation(
  $input: AddKqiInput!
) {
  addKqi(input: $input) {
    id
    name
    description
    formula
    startDateTime
    endDateTime
    kqiCategory {
      id
      name
    }
    kqiPerspective {
      id
      name
    }
    kqiSource {
      id
      name
    }
    kqiTemporalFrequency {
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
  (v1/*: any*/),
  (v2/*: any*/)
],
v4 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "Kqi",
    "kind": "LinkedField",
    "name": "addKqi",
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
        "name": "formula",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "startDateTime",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "endDateTime",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "KqiCategory",
        "kind": "LinkedField",
        "name": "kqiCategory",
        "plural": false,
        "selections": (v3/*: any*/),
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "KqiPerspective",
        "kind": "LinkedField",
        "name": "kqiPerspective",
        "plural": false,
        "selections": (v3/*: any*/),
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "KqiSource",
        "kind": "LinkedField",
        "name": "kqiSource",
        "plural": false,
        "selections": (v3/*: any*/),
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "KqiTemporalFrequency",
        "kind": "LinkedField",
        "name": "kqiTemporalFrequency",
        "plural": false,
        "selections": (v3/*: any*/),
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
    "name": "AddKqiMutation",
    "selections": (v4/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "AddKqiMutation",
    "selections": (v4/*: any*/)
  },
  "params": {
    "cacheID": "4992100eb809fd4d57a6bc440b6fb210",
    "id": null,
    "metadata": {},
    "name": "AddKqiMutation",
    "operationKind": "mutation",
    "text": "mutation AddKqiMutation(\n  $input: AddKqiInput!\n) {\n  addKqi(input: $input) {\n    id\n    name\n    description\n    formula\n    startDateTime\n    endDateTime\n    kqiCategory {\n      id\n      name\n    }\n    kqiPerspective {\n      id\n      name\n    }\n    kqiSource {\n      id\n      name\n    }\n    kqiTemporalFrequency {\n      id\n      name\n    }\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'dfe35e7005d4f927b8395b95ab15ae57';

module.exports = node;
