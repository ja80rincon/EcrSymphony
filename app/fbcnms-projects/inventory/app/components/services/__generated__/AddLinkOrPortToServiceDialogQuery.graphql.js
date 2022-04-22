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
type AvailableLinksAndPortsTable_links$ref = any;
type AvailableLinksAndPortsTable_ports$ref = any;
export type FilterOperator = "CONTAINS" | "DATE_GREATER_OR_EQUAL_THAN" | "DATE_GREATER_THAN" | "DATE_LESS_OR_EQUAL_THAN" | "DATE_LESS_THAN" | "IS" | "IS_NIL" | "IS_NIL_OR_DATE_GREATER_OR_EQUAL_THAN" | "IS_NOT_ONE_OF" | "IS_ONE_OF" | "%future added value";
export type LinkFilterType = "EQUIPMENT_INST" | "EQUIPMENT_TYPE" | "LINK_FUTURE_STATUS" | "LOCATION_INST" | "LOCATION_INST_EXTERNAL_ID" | "PROPERTY" | "SERVICE_INST" | "%future added value";
export type PortFilterType = "LOCATION_INST" | "LOCATION_INST_EXTERNAL_ID" | "PORT_DEF" | "PORT_INST_EQUIPMENT" | "PORT_INST_HAS_LINK" | "PROPERTY" | "SERVICE_INST" | "%future added value";
export type PropertyKind = "bool" | "date" | "datetime_local" | "email" | "enum" | "float" | "gps_location" | "int" | "node" | "range" | "string" | "%future added value";
export type LinkFilterInput = {|
  filterType: LinkFilterType,
  operator: FilterOperator,
  stringValue?: ?string,
  propertyValue?: ?PropertyTypeInput,
  idSet?: ?$ReadOnlyArray<string>,
  stringSet?: ?$ReadOnlyArray<string>,
  maxDepth?: ?number,
|};
export type PropertyTypeInput = {|
  id?: ?string,
  externalId?: ?string,
  name: string,
  type: PropertyKind,
  nodeType?: ?string,
  index?: ?number,
  category?: ?string,
  stringValue?: ?string,
  intValue?: ?number,
  booleanValue?: ?boolean,
  floatValue?: ?number,
  latitudeValue?: ?number,
  longitudeValue?: ?number,
  rangeFromValue?: ?number,
  rangeToValue?: ?number,
  isEditable?: ?boolean,
  isInstanceProperty?: ?boolean,
  isMandatory?: ?boolean,
  isDeleted?: ?boolean,
  propertyCategoryID?: ?string,
  isListable?: ?boolean,
|};
export type PortFilterInput = {|
  filterType: PortFilterType,
  operator: FilterOperator,
  boolValue?: ?boolean,
  stringValue?: ?string,
  propertyValue?: ?PropertyTypeInput,
  idSet?: ?$ReadOnlyArray<string>,
  stringSet?: ?$ReadOnlyArray<string>,
  maxDepth?: ?number,
|};
export type AddLinkOrPortToServiceDialogQueryVariables = {|
  filters: $ReadOnlyArray<LinkFilterInput>,
  portFilters: $ReadOnlyArray<PortFilterInput>,
|};
export type AddLinkOrPortToServiceDialogQueryResponse = {|
  +links: {|
    +edges: $ReadOnlyArray<{|
      +node: ?{|
        +id: string,
        +ports: $ReadOnlyArray<?{|
          +parentEquipment: {|
            +id: string,
            +name: string,
          |},
          +definition: {|
            +id: string,
            +name: string,
          |},
        |}>,
        +$fragmentRefs: AvailableLinksAndPortsTable_links$ref,
      |}
    |}>
  |},
  +ports: {|
    +edges: $ReadOnlyArray<{|
      +node: ?{|
        +id: string,
        +link: ?{|
          +id: string
        |},
        +$fragmentRefs: AvailableLinksAndPortsTable_ports$ref,
      |}
    |}>
  |},
|};
export type AddLinkOrPortToServiceDialogQuery = {|
  variables: AddLinkOrPortToServiceDialogQueryVariables,
  response: AddLinkOrPortToServiceDialogQueryResponse,
|};
*/


/*
query AddLinkOrPortToServiceDialogQuery(
  $filters: [LinkFilterInput!]!
  $portFilters: [PortFilterInput!]!
) {
  links(filterBy: $filters, first: 50) {
    edges {
      node {
        id
        ports {
          parentEquipment {
            id
            name
          }
          definition {
            id
            name
          }
          id
        }
        ...AvailableLinksAndPortsTable_links
      }
    }
  }
  ports: equipmentPorts(first: 50, filterBy: $portFilters) {
    edges {
      node {
        id
        link {
          id
        }
        ...AvailableLinksAndPortsTable_ports
      }
    }
  }
}

fragment AvailableLinksAndPortsTable_links on Link {
  id
  ports {
    parentEquipment {
      id
      name
      positionHierarchy {
        parentEquipment {
          id
        }
        id
      }
      ...EquipmentBreadcrumbs_equipment
    }
    definition {
      id
      name
    }
    id
  }
}

fragment AvailableLinksAndPortsTable_ports on EquipmentPort {
  id
  parentEquipment {
    id
    name
    positionHierarchy {
      parentEquipment {
        id
      }
      id
    }
    ...EquipmentBreadcrumbs_equipment
  }
  definition {
    id
    name
  }
}

fragment EquipmentBreadcrumbs_equipment on Equipment {
  id
  name
  equipmentType {
    id
    name
  }
  locationHierarchy {
    id
    name
    locationType {
      name
      id
    }
  }
  positionHierarchy {
    id
    definition {
      id
      name
      visibleLabel
    }
    parentEquipment {
      id
      name
      equipmentType {
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
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "filters"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "portFilters"
  }
],
v1 = {
  "kind": "Literal",
  "name": "first",
  "value": 50
},
v2 = [
  {
    "kind": "Variable",
    "name": "filterBy",
    "variableName": "filters"
  },
  (v1/*: any*/)
],
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v5 = [
  (v3/*: any*/),
  (v4/*: any*/)
],
v6 = {
  "alias": null,
  "args": null,
  "concreteType": "EquipmentPortDefinition",
  "kind": "LinkedField",
  "name": "definition",
  "plural": false,
  "selections": (v5/*: any*/),
  "storageKey": null
},
v7 = [
  {
    "kind": "Variable",
    "name": "filterBy",
    "variableName": "portFilters"
  },
  (v1/*: any*/)
],
v8 = {
  "alias": null,
  "args": null,
  "concreteType": "Link",
  "kind": "LinkedField",
  "name": "link",
  "plural": false,
  "selections": [
    (v3/*: any*/)
  ],
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "concreteType": "EquipmentType",
  "kind": "LinkedField",
  "name": "equipmentType",
  "plural": false,
  "selections": (v5/*: any*/),
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "concreteType": "Equipment",
  "kind": "LinkedField",
  "name": "parentEquipment",
  "plural": false,
  "selections": [
    (v3/*: any*/),
    (v4/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "EquipmentPosition",
      "kind": "LinkedField",
      "name": "positionHierarchy",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "Equipment",
          "kind": "LinkedField",
          "name": "parentEquipment",
          "plural": false,
          "selections": [
            (v3/*: any*/),
            (v4/*: any*/),
            (v9/*: any*/)
          ],
          "storageKey": null
        },
        (v3/*: any*/),
        {
          "alias": null,
          "args": null,
          "concreteType": "EquipmentPositionDefinition",
          "kind": "LinkedField",
          "name": "definition",
          "plural": false,
          "selections": [
            (v3/*: any*/),
            (v4/*: any*/),
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "visibleLabel",
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    (v9/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "Location",
      "kind": "LinkedField",
      "name": "locationHierarchy",
      "plural": true,
      "selections": [
        (v3/*: any*/),
        (v4/*: any*/),
        {
          "alias": null,
          "args": null,
          "concreteType": "LocationType",
          "kind": "LinkedField",
          "name": "locationType",
          "plural": false,
          "selections": [
            (v4/*: any*/),
            (v3/*: any*/)
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "AddLinkOrPortToServiceDialogQuery",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "LinkConnection",
        "kind": "LinkedField",
        "name": "links",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "LinkEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Link",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v3/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "EquipmentPort",
                    "kind": "LinkedField",
                    "name": "ports",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Equipment",
                        "kind": "LinkedField",
                        "name": "parentEquipment",
                        "plural": false,
                        "selections": (v5/*: any*/),
                        "storageKey": null
                      },
                      (v6/*: any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "AvailableLinksAndPortsTable_links"
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
      {
        "alias": "ports",
        "args": (v7/*: any*/),
        "concreteType": "EquipmentPortConnection",
        "kind": "LinkedField",
        "name": "equipmentPorts",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "EquipmentPortEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "EquipmentPort",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v3/*: any*/),
                  (v8/*: any*/),
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "AvailableLinksAndPortsTable_ports"
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
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "AddLinkOrPortToServiceDialogQuery",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "LinkConnection",
        "kind": "LinkedField",
        "name": "links",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "LinkEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Link",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v3/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "EquipmentPort",
                    "kind": "LinkedField",
                    "name": "ports",
                    "plural": true,
                    "selections": [
                      (v10/*: any*/),
                      (v6/*: any*/),
                      (v3/*: any*/)
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
      {
        "alias": "ports",
        "args": (v7/*: any*/),
        "concreteType": "EquipmentPortConnection",
        "kind": "LinkedField",
        "name": "equipmentPorts",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "EquipmentPortEdge",
            "kind": "LinkedField",
            "name": "edges",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "EquipmentPort",
                "kind": "LinkedField",
                "name": "node",
                "plural": false,
                "selections": [
                  (v3/*: any*/),
                  (v8/*: any*/),
                  (v10/*: any*/),
                  (v6/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "ef21a4cfb2cbf21346e23f64f20719af",
    "id": null,
    "metadata": {},
    "name": "AddLinkOrPortToServiceDialogQuery",
    "operationKind": "query",
    "text": "query AddLinkOrPortToServiceDialogQuery(\n  $filters: [LinkFilterInput!]!\n  $portFilters: [PortFilterInput!]!\n) {\n  links(filterBy: $filters, first: 50) {\n    edges {\n      node {\n        id\n        ports {\n          parentEquipment {\n            id\n            name\n          }\n          definition {\n            id\n            name\n          }\n          id\n        }\n        ...AvailableLinksAndPortsTable_links\n      }\n    }\n  }\n  ports: equipmentPorts(first: 50, filterBy: $portFilters) {\n    edges {\n      node {\n        id\n        link {\n          id\n        }\n        ...AvailableLinksAndPortsTable_ports\n      }\n    }\n  }\n}\n\nfragment AvailableLinksAndPortsTable_links on Link {\n  id\n  ports {\n    parentEquipment {\n      id\n      name\n      positionHierarchy {\n        parentEquipment {\n          id\n        }\n        id\n      }\n      ...EquipmentBreadcrumbs_equipment\n    }\n    definition {\n      id\n      name\n    }\n    id\n  }\n}\n\nfragment AvailableLinksAndPortsTable_ports on EquipmentPort {\n  id\n  parentEquipment {\n    id\n    name\n    positionHierarchy {\n      parentEquipment {\n        id\n      }\n      id\n    }\n    ...EquipmentBreadcrumbs_equipment\n  }\n  definition {\n    id\n    name\n  }\n}\n\nfragment EquipmentBreadcrumbs_equipment on Equipment {\n  id\n  name\n  equipmentType {\n    id\n    name\n  }\n  locationHierarchy {\n    id\n    name\n    locationType {\n      name\n      id\n    }\n  }\n  positionHierarchy {\n    id\n    definition {\n      id\n      name\n      visibleLabel\n    }\n    parentEquipment {\n      id\n      name\n      equipmentType {\n        id\n        name\n      }\n    }\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'ab0d180031ef7172a041ab75450ce1bf';

module.exports = node;
