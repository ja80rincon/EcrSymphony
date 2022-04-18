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
export type PowerSearchPortDefinitionFilterQueryVariables = {||};
export type PowerSearchPortDefinitionFilterQueryResponse = {|
  +equipmentPortDefinitions: {|
    +edges: $ReadOnlyArray<{|
      +node: ?{|
        +id: string,
        +name: string,
      |}
    |}>
  |}
|};
export type PowerSearchPortDefinitionFilterQuery = {|
  variables: PowerSearchPortDefinitionFilterQueryVariables,
  response: PowerSearchPortDefinitionFilterQueryResponse,
|};
*/


/*
query PowerSearchPortDefinitionFilterQuery {
  equipmentPortDefinitions {
    edges {
      node {
        id
        name
      }
    }
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "EquipmentPortDefinitionConnection",
    "kind": "LinkedField",
    "name": "equipmentPortDefinitions",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "EquipmentPortDefinitionEdge",
        "kind": "LinkedField",
        "name": "edges",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "EquipmentPortDefinition",
            "kind": "LinkedField",
            "name": "node",
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
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "PowerSearchPortDefinitionFilterQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "PowerSearchPortDefinitionFilterQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "7782693fc5c570c3013d6bbdc9108c1b",
    "id": null,
    "metadata": {},
    "name": "PowerSearchPortDefinitionFilterQuery",
    "operationKind": "query",
    "text": "query PowerSearchPortDefinitionFilterQuery {\n  equipmentPortDefinitions {\n    edges {\n      node {\n        id\n        name\n      }\n    }\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '7e8942b0ece87929d960954bb040fc3a';

module.exports = node;
