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
export type KpiTypesQueryVariables = {||};
export type KpiTypesQueryResponse = {|
  +kpis: {|
    +edges: $ReadOnlyArray<{|
      +node: ?{|
        +id: string,
        +name: string,
        +status: boolean,
        +description: string,
        +domainFk: {|
          +id: string,
          +name: string,
        |},
        +formulaFk: ?$ReadOnlyArray<?{|
          +id: string,
          +textFormula: string,
          +status: boolean,
          +kpiFk: {|
            +id: string,
            +name: string,
          |},
          +techFk: {|
            +id: string,
            +name: string,
          |},
          +networkTypeFk: {|
            +id: string,
            +name: string,
          |},
        |}>,
        +kpiCategoryFK: {|
          +id: string,
          +name: string,
        |},
      |}
    |}>
  |},
  +thresholds: {|
    +edges: $ReadOnlyArray<{|
      +node: ?{|
        +name: string,
        +kpi: ?{|
          +name: string
        |},
      |}
    |}>
  |},
  +networkTypes: {|
    +edges: $ReadOnlyArray<{|
      +node: ?{|
        +id: string,
        +name: string,
      |}
    |}>
  |},
  +counters: {|
    +edges: $ReadOnlyArray<{|
      +node: ?{|
        +id: string,
        +name: string,
      |}
    |}>
  |},
  +formulas: {|
    +edges: $ReadOnlyArray<{|
      +node: ?{|
        +id: string,
        +networkTypeFk: {|
          +id: string,
          +name: string,
        |},
        +textFormula: string,
        +status: boolean,
        +techFk: {|
          +id: string,
          +name: string,
        |},
        +kpiFk: {|
          +id: string,
          +name: string,
        |},
      |}
    |}>
  |},
|};
export type KpiTypesQuery = {|
  variables: KpiTypesQueryVariables,
  response: KpiTypesQueryResponse,
|};
*/


/*
query KpiTypesQuery {
  kpis {
    edges {
      node {
        id
        name
        status
        description
        domainFk {
          id
          name
        }
        formulaFk {
          id
          textFormula
          status
          kpiFk {
            id
            name
          }
          techFk {
            id
            name
          }
          networkTypeFk {
            id
            name
          }
        }
        kpiCategoryFK {
          id
          name
        }
      }
    }
  }
  thresholds {
    edges {
      node {
        name
        kpi {
          name
          id
        }
        id
      }
    }
  }
  networkTypes {
    edges {
      node {
        id
        name
      }
    }
  }
  counters {
    edges {
      node {
        id
        name
      }
    }
  }
  formulas {
    edges {
      node {
        id
        networkTypeFk {
          id
          name
        }
        textFormula
        status
        techFk {
          id
          name
        }
        kpiFk {
          id
          name
        }
      }
    }
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "status",
  "storageKey": null
},
v3 = [
  (v0/*: any*/),
  (v1/*: any*/)
],
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "textFormula",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "concreteType": "Kpi",
  "kind": "LinkedField",
  "name": "kpiFk",
  "plural": false,
  "selections": (v3/*: any*/),
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "concreteType": "Tech",
  "kind": "LinkedField",
  "name": "techFk",
  "plural": false,
  "selections": (v3/*: any*/),
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "concreteType": "NetworkType",
  "kind": "LinkedField",
  "name": "networkTypeFk",
  "plural": false,
  "selections": (v3/*: any*/),
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "concreteType": "KpiConnection",
  "kind": "LinkedField",
  "name": "kpis",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "KpiEdge",
      "kind": "LinkedField",
      "name": "edges",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "Kpi",
          "kind": "LinkedField",
          "name": "node",
          "plural": false,
          "selections": [
            (v0/*: any*/),
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
              "concreteType": "Domain",
              "kind": "LinkedField",
              "name": "domainFk",
              "plural": false,
              "selections": (v3/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "Formula",
              "kind": "LinkedField",
              "name": "formulaFk",
              "plural": true,
              "selections": [
                (v0/*: any*/),
                (v4/*: any*/),
                (v2/*: any*/),
                (v5/*: any*/),
                (v6/*: any*/),
                (v7/*: any*/)
              ],
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "KpiCategory",
              "kind": "LinkedField",
              "name": "kpiCategoryFK",
              "plural": false,
              "selections": (v3/*: any*/),
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
},
v9 = {
  "alias": null,
  "args": null,
  "concreteType": "NetworkTypeConnection",
  "kind": "LinkedField",
  "name": "networkTypes",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "NetworkTypeEdge",
      "kind": "LinkedField",
      "name": "edges",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "NetworkType",
          "kind": "LinkedField",
          "name": "node",
          "plural": false,
          "selections": (v3/*: any*/),
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "concreteType": "CounterConnection",
  "kind": "LinkedField",
  "name": "counters",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "CounterEdge",
      "kind": "LinkedField",
      "name": "edges",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "Counter",
          "kind": "LinkedField",
          "name": "node",
          "plural": false,
          "selections": (v3/*: any*/),
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "concreteType": "FormulaConnection",
  "kind": "LinkedField",
  "name": "formulas",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "FormulaEdge",
      "kind": "LinkedField",
      "name": "edges",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "Formula",
          "kind": "LinkedField",
          "name": "node",
          "plural": false,
          "selections": [
            (v0/*: any*/),
            (v7/*: any*/),
            (v4/*: any*/),
            (v2/*: any*/),
            (v6/*: any*/),
            (v5/*: any*/)
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "KpiTypesQuery",
    "selections": [
      (v8/*: any*/),
      {
        "alias": null,
        "args": null,
        "concreteType": "ThresholdConnection",
        "kind": "LinkedField",
        "name": "thresholds",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "ThresholdEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Threshold",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v1/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Kpi",
                    "kind": "LinkedField",
                    "name": "kpi",
                    "plural": false,
                    "selections": [
                      (v1/*: any*/)
                    ],
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
      },
      (v9/*: any*/),
      (v10/*: any*/),
      (v11/*: any*/)
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "KpiTypesQuery",
    "selections": [
      (v8/*: any*/),
      {
        "alias": null,
        "args": null,
        "concreteType": "ThresholdConnection",
        "kind": "LinkedField",
        "name": "thresholds",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "ThresholdEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Threshold",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v1/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Kpi",
                    "kind": "LinkedField",
                    "name": "kpi",
                    "plural": false,
                    "selections": [
                      (v1/*: any*/),
                      (v0/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v0/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      (v9/*: any*/),
      (v10/*: any*/),
      (v11/*: any*/)
    ]
  },
  "params": {
    "cacheID": "0e5dd92613ab3d468632d8aa1896c7e9",
    "id": null,
    "metadata": {},
    "name": "KpiTypesQuery",
    "operationKind": "query",
    "text": "query KpiTypesQuery {\n  kpis {\n    edges {\n      node {\n        id\n        name\n        status\n        description\n        domainFk {\n          id\n          name\n        }\n        formulaFk {\n          id\n          textFormula\n          status\n          kpiFk {\n            id\n            name\n          }\n          techFk {\n            id\n            name\n          }\n          networkTypeFk {\n            id\n            name\n          }\n        }\n        kpiCategoryFK {\n          id\n          name\n        }\n      }\n    }\n  }\n  thresholds {\n    edges {\n      node {\n        name\n        kpi {\n          name\n          id\n        }\n        id\n      }\n    }\n  }\n  networkTypes {\n    edges {\n      node {\n        id\n        name\n      }\n    }\n  }\n  counters {\n    edges {\n      node {\n        id\n        name\n      }\n    }\n  }\n  formulas {\n    edges {\n      node {\n        id\n        networkTypeFk {\n          id\n          name\n        }\n        textFormula\n        status\n        techFk {\n          id\n          name\n        }\n        kpiFk {\n          id\n          name\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '5b00a31e79a5fbb6120c5e5c77b79905';

module.exports = node;
