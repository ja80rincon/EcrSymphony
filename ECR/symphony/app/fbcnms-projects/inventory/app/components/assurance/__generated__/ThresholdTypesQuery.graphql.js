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
export type ThresholdTypesQueryVariables = {||};
export type ThresholdTypesQueryResponse = {|
  +thresholds: {|
    +edges: $ReadOnlyArray<{|
      +node: ?{|
        +id: string,
        +name: string,
        +description: string,
        +status: boolean,
        +kpi: ?{|
          +id: string,
          +name: string,
        |},
        +rule: ?$ReadOnlyArray<{|
          +id: string,
          +name: string,
          +status: boolean,
          +gracePeriod: ?number,
          +additionalInfo: ?string,
          +specificProblem: ?string,
          +eventTypeName: ?string,
          +startDateTime: ?any,
          +endDateTime: ?any,
          +ruleType: {|
            +id: string,
            +name: string,
          |},
          +ruleLimit: ?$ReadOnlyArray<{|
            +comparator: {|
              +id: string,
              +name: string,
            |},
            +id: string,
            +number: number,
            +limitType: string,
          |}>,
          +eventSeverity: {|
            +id: string,
            +name: string,
          |},
          +threshold: {|
            +id: string,
            +name: string,
          |},
        |}>,
      |}
    |}>
  |}
|};
export type ThresholdTypesQuery = {|
  variables: ThresholdTypesQueryVariables,
  response: ThresholdTypesQueryResponse,
|};
*/


/*
query ThresholdTypesQuery {
  thresholds {
    edges {
      node {
        id
        name
        description
        status
        kpi {
          id
          name
        }
        rule {
          id
          name
          status
          gracePeriod
          additionalInfo
          specificProblem
          eventTypeName
          startDateTime
          endDateTime
          ruleType {
            id
            name
          }
          ruleLimit {
            comparator {
              id
              name
            }
            id
            number
            limitType
          }
          eventSeverity {
            id
            name
          }
          threshold {
            id
            name
          }
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
v4 = [
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
              (v0/*: any*/),
              (v1/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "description",
                "storageKey": null
              },
              (v2/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Kpi",
                "kind": "LinkedField",
                "name": "kpi",
                "plural": false,
                "selections": (v3/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "Rule",
                "kind": "LinkedField",
                "name": "rule",
                "plural": true,
                "selections": [
                  (v0/*: any*/),
                  (v1/*: any*/),
                  (v2/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "gracePeriod",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "additionalInfo",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "specificProblem",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "eventTypeName",
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
                    "concreteType": "RuleType",
                    "kind": "LinkedField",
                    "name": "ruleType",
                    "plural": false,
                    "selections": (v3/*: any*/),
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "RuleLimit",
                    "kind": "LinkedField",
                    "name": "ruleLimit",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Comparator",
                        "kind": "LinkedField",
                        "name": "comparator",
                        "plural": false,
                        "selections": (v3/*: any*/),
                        "storageKey": null
                      },
                      (v0/*: any*/),
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
                        "name": "limitType",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "EventSeverity",
                    "kind": "LinkedField",
                    "name": "eventSeverity",
                    "plural": false,
                    "selections": (v3/*: any*/),
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Threshold",
                    "kind": "LinkedField",
                    "name": "threshold",
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
    "name": "ThresholdTypesQuery",
    "selections": (v4/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "ThresholdTypesQuery",
    "selections": (v4/*: any*/)
  },
  "params": {
    "cacheID": "1a51584190fe02457a758e472493460b",
    "id": null,
    "metadata": {},
    "name": "ThresholdTypesQuery",
    "operationKind": "query",
    "text": "query ThresholdTypesQuery {\n  thresholds {\n    edges {\n      node {\n        id\n        name\n        description\n        status\n        kpi {\n          id\n          name\n        }\n        rule {\n          id\n          name\n          status\n          gracePeriod\n          additionalInfo\n          specificProblem\n          eventTypeName\n          startDateTime\n          endDateTime\n          ruleType {\n            id\n            name\n          }\n          ruleLimit {\n            comparator {\n              id\n              name\n            }\n            id\n            number\n            limitType\n          }\n          eventSeverity {\n            id\n            name\n          }\n          threshold {\n            id\n            name\n          }\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'a21c0c1b751bacf8a7f0247d42320156';

module.exports = node;
