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
type LocationEquipmentTopology_equipment$ref = any;
type LocationEquipmentTopology_topology$ref = any;
export type LocationNetworkMapTabQueryVariables = {|
  locationId: string
|};
export type LocationNetworkMapTabQueryResponse = {|
  +location: ?{|
    +equipments?: $ReadOnlyArray<?{|
      +$fragmentRefs: LocationEquipmentTopology_equipment$ref
    |}>,
    +topology?: {|
      +$fragmentRefs: LocationEquipmentTopology_topology$ref
    |},
  |}
|};
export type LocationNetworkMapTabQuery = {|
  variables: LocationNetworkMapTabQueryVariables,
  response: LocationNetworkMapTabQueryResponse,
|};
*/


/*
query LocationNetworkMapTabQuery(
  $locationId: ID!
) {
  location: node(id: $locationId) {
    __typename
    ... on Location {
      equipments {
        ...LocationEquipmentTopology_equipment
        id
      }
      topology {
        ...LocationEquipmentTopology_topology
      }
    }
    id
  }
}

fragment ForceNetworkTopology_topology on NetworkTopology {
  nodes {
    __typename
    id
  }
  links {
    source {
      __typename
      id
    }
    target {
      __typename
      id
    }
  }
}

fragment LocationEquipmentTopology_equipment on Equipment {
  id
}

fragment LocationEquipmentTopology_topology on NetworkTopology {
  nodes {
    __typename
    ... on Equipment {
      id
      name
    }
    id
  }
  ...ForceNetworkTopology_topology
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "locationId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "locationId"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v4 = [
  (v2/*: any*/),
  (v3/*: any*/)
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "LocationNetworkMapTabQuery",
    "selections": [
      {
        "alias": "location",
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Equipment",
                "kind": "LinkedField",
                "name": "equipments",
                "plural": true,
                "selections": [
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "LocationEquipmentTopology_equipment"
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "NetworkTopology",
                "kind": "LinkedField",
                "name": "topology",
                "plural": false,
                "selections": [
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "LocationEquipmentTopology_topology"
                  }
                ],
                "storageKey": null
              }
            ],
            "type": "Location",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "LocationNetworkMapTabQuery",
    "selections": [
      {
        "alias": "location",
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Equipment",
                "kind": "LinkedField",
                "name": "equipments",
                "plural": true,
                "selections": [
                  (v3/*: any*/)
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "NetworkTopology",
                "kind": "LinkedField",
                "name": "topology",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": null,
                    "kind": "LinkedField",
                    "name": "nodes",
                    "plural": true,
                    "selections": [
                      (v2/*: any*/),
                      (v3/*: any*/),
                      {
                        "kind": "InlineFragment",
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "name",
                            "storageKey": null
                          }
                        ],
                        "type": "Equipment",
                        "abstractKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "TopologyLink",
                    "kind": "LinkedField",
                    "name": "links",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": null,
                        "kind": "LinkedField",
                        "name": "source",
                        "plural": false,
                        "selections": (v4/*: any*/),
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": null,
                        "kind": "LinkedField",
                        "name": "target",
                        "plural": false,
                        "selections": (v4/*: any*/),
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "type": "Location",
            "abstractKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "d06efbd6194ee52ab89d10053b5ad79e",
    "id": null,
    "metadata": {},
    "name": "LocationNetworkMapTabQuery",
    "operationKind": "query",
    "text": "query LocationNetworkMapTabQuery(\n  $locationId: ID!\n) {\n  location: node(id: $locationId) {\n    __typename\n    ... on Location {\n      equipments {\n        ...LocationEquipmentTopology_equipment\n        id\n      }\n      topology {\n        ...LocationEquipmentTopology_topology\n      }\n    }\n    id\n  }\n}\n\nfragment ForceNetworkTopology_topology on NetworkTopology {\n  nodes {\n    __typename\n    id\n  }\n  links {\n    source {\n      __typename\n      id\n    }\n    target {\n      __typename\n      id\n    }\n  }\n}\n\nfragment LocationEquipmentTopology_equipment on Equipment {\n  id\n}\n\nfragment LocationEquipmentTopology_topology on NetworkTopology {\n  nodes {\n    __typename\n    ... on Equipment {\n      id\n      name\n    }\n    id\n  }\n  ...ForceNetworkTopology_topology\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'f90e103b70337af4c1df59192964fdb0';

module.exports = node;
