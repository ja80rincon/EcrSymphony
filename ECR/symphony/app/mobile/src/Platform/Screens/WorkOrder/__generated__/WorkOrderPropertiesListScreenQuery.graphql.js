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
type PropertiesPane_properties$ref = any;
export type WorkOrderPropertiesListScreenQueryVariables = {|
  workOrderId: string
|};
export type WorkOrderPropertiesListScreenQueryResponse = {|
  +node: ?{|
    +properties?: $ReadOnlyArray<?{|
      +$fragmentRefs: PropertiesPane_properties$ref
    |}>
  |}
|};
export type WorkOrderPropertiesListScreenQuery = {|
  variables: WorkOrderPropertiesListScreenQueryVariables,
  response: WorkOrderPropertiesListScreenQueryResponse,
|};
*/


/*
query WorkOrderPropertiesListScreenQuery(
  $workOrderId: ID!
) {
  node(id: $workOrderId) {
    __typename
    ... on WorkOrder {
      properties {
        ...PropertiesPane_properties
        id
      }
    }
    id
  }
}

fragment PropertiesPane_properties on Property {
  id
  propertyType {
    id
    name
    index
    isInstanceProperty
    type
    stringValue
    intValue
    floatValue
    booleanValue
    latitudeValue
    longitudeValue
    rangeFromValue
    rangeToValue
  }
  stringValue
  intValue
  floatValue
  booleanValue
  latitudeValue
  longitudeValue
  rangeFromValue
  rangeToValue
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "workOrderId",
    "type": "ID!"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "workOrderId"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "stringValue",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "intValue",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "floatValue",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "booleanValue",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "latitudeValue",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "longitudeValue",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "rangeFromValue",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "rangeToValue",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "WorkOrderPropertiesListScreenQuery",
    "selections": [
      {
        "alias": null,
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
                "concreteType": "Property",
                "kind": "LinkedField",
                "name": "properties",
                "plural": true,
                "selections": [
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "PropertiesPane_properties"
                  }
                ],
                "storageKey": null
              }
            ],
            "type": "WorkOrder"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query"
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "WorkOrderPropertiesListScreenQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "__typename",
            "storageKey": null
          },
          (v2/*: any*/),
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Property",
                "kind": "LinkedField",
                "name": "properties",
                "plural": true,
                "selections": [
                  (v2/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "PropertyType",
                    "kind": "LinkedField",
                    "name": "propertyType",
                    "plural": false,
                    "selections": [
                      (v2/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "name",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "index",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "isInstanceProperty",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "type",
                        "storageKey": null
                      },
                      (v3/*: any*/),
                      (v4/*: any*/),
                      (v5/*: any*/),
                      (v6/*: any*/),
                      (v7/*: any*/),
                      (v8/*: any*/),
                      (v9/*: any*/),
                      (v10/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v3/*: any*/),
                  (v4/*: any*/),
                  (v5/*: any*/),
                  (v6/*: any*/),
                  (v7/*: any*/),
                  (v8/*: any*/),
                  (v9/*: any*/),
                  (v10/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "type": "WorkOrder"
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": null,
    "metadata": {},
    "name": "WorkOrderPropertiesListScreenQuery",
    "operationKind": "query",
    "text": "query WorkOrderPropertiesListScreenQuery(\n  $workOrderId: ID!\n) {\n  node(id: $workOrderId) {\n    __typename\n    ... on WorkOrder {\n      properties {\n        ...PropertiesPane_properties\n        id\n      }\n    }\n    id\n  }\n}\n\nfragment PropertiesPane_properties on Property {\n  id\n  propertyType {\n    id\n    name\n    index\n    isInstanceProperty\n    type\n    stringValue\n    intValue\n    floatValue\n    booleanValue\n    latitudeValue\n    longitudeValue\n    rangeFromValue\n    rangeToValue\n  }\n  stringValue\n  intValue\n  floatValue\n  booleanValue\n  latitudeValue\n  longitudeValue\n  rangeFromValue\n  rangeToValue\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '6dd3342d0913575f6e78093787b62938';

module.exports = node;
