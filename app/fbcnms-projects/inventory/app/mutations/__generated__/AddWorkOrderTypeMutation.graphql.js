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
type AddEditWorkOrderTypeCard_workOrderType$ref = any;
export type CheckListItemEnumSelectionMode = "multiple" | "single" | "%future added value";
export type CheckListItemType = "cell_scan" | "enum" | "files" | "simple" | "string" | "wifi_scan" | "yes_no" | "%future added value";
export type PropertyKind = "bool" | "date" | "datetime_local" | "email" | "enum" | "float" | "gps_location" | "int" | "node" | "range" | "string" | "%future added value";
export type AddWorkOrderTypeInput = {|
  name: string,
  description?: ?string,
  properties?: ?$ReadOnlyArray<?PropertyTypeInput>,
  checkListCategories?: ?$ReadOnlyArray<CheckListCategoryDefinitionInput>,
  assigneeCanCompleteWorkOrder?: ?boolean,
  duration?: ?number,
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
export type CheckListCategoryDefinitionInput = {|
  id?: ?string,
  title: string,
  description?: ?string,
  checkList: $ReadOnlyArray<CheckListDefinitionInput>,
|};
export type CheckListDefinitionInput = {|
  id?: ?string,
  title: string,
  type: CheckListItemType,
  index?: ?number,
  isMandatory?: ?boolean,
  enumValues?: ?string,
  enumSelectionMode?: ?CheckListItemEnumSelectionMode,
  helpText?: ?string,
|};
export type AddWorkOrderTypeMutationVariables = {|
  input: AddWorkOrderTypeInput
|};
export type AddWorkOrderTypeMutationResponse = {|
  +addWorkOrderType: {|
    +id: string,
    +name: string,
    +description: ?string,
    +$fragmentRefs: AddEditWorkOrderTypeCard_workOrderType$ref,
  |}
|};
export type AddWorkOrderTypeMutation = {|
  variables: AddWorkOrderTypeMutationVariables,
  response: AddWorkOrderTypeMutationResponse,
|};
*/


/*
mutation AddWorkOrderTypeMutation(
  $input: AddWorkOrderTypeInput!
) {
  addWorkOrderType(input: $input) {
    id
    name
    description
    ...AddEditWorkOrderTypeCard_workOrderType
  }
}

fragment AddEditWorkOrderTypeCard_workOrderType on WorkOrderType {
  id
  name
  description
  assigneeCanCompleteWorkOrder
  numberOfWorkOrders
  propertyTypes {
    id
    name
    type
    nodeType
    index
    stringValue
    intValue
    booleanValue
    floatValue
    latitudeValue
    longitudeValue
    rangeFromValue
    rangeToValue
    isEditable
    isMandatory
    isInstanceProperty
    isDeleted
    category
  }
  checkListCategoryDefinitions {
    id
    title
    description
    checklistItemDefinitions {
      id
      title
      type
      index
      isMandatory
      enumValues
      enumSelectionMode
      helpText
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
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
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
  "name": "name",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "description",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "type",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "index",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isMandatory",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "AddWorkOrderTypeMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "WorkOrderType",
        "kind": "LinkedField",
        "name": "addWorkOrderType",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "AddEditWorkOrderTypeCard_workOrderType"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "AddWorkOrderTypeMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "WorkOrderType",
        "kind": "LinkedField",
        "name": "addWorkOrderType",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "assigneeCanCompleteWorkOrder",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "numberOfWorkOrders",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "PropertyType",
            "kind": "LinkedField",
            "name": "propertyTypes",
            "plural": true,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              (v5/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "nodeType",
                "storageKey": null
              },
              (v6/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "stringValue",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "intValue",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "booleanValue",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "floatValue",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "latitudeValue",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "longitudeValue",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "rangeFromValue",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "rangeToValue",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "isEditable",
                "storageKey": null
              },
              (v7/*: any*/),
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
                "name": "isDeleted",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "category",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "CheckListCategoryDefinition",
            "kind": "LinkedField",
            "name": "checkListCategoryDefinitions",
            "plural": true,
            "selections": [
              (v2/*: any*/),
              (v8/*: any*/),
              (v4/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "CheckListItemDefinition",
                "kind": "LinkedField",
                "name": "checklistItemDefinitions",
                "plural": true,
                "selections": [
                  (v2/*: any*/),
                  (v8/*: any*/),
                  (v5/*: any*/),
                  (v6/*: any*/),
                  (v7/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "enumValues",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "enumSelectionMode",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "helpText",
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
    ]
  },
  "params": {
    "cacheID": "4e84cb03445f9712abb6c8147f48529c",
    "id": null,
    "metadata": {},
    "name": "AddWorkOrderTypeMutation",
    "operationKind": "mutation",
    "text": "mutation AddWorkOrderTypeMutation(\n  $input: AddWorkOrderTypeInput!\n) {\n  addWorkOrderType(input: $input) {\n    id\n    name\n    description\n    ...AddEditWorkOrderTypeCard_workOrderType\n  }\n}\n\nfragment AddEditWorkOrderTypeCard_workOrderType on WorkOrderType {\n  id\n  name\n  description\n  assigneeCanCompleteWorkOrder\n  numberOfWorkOrders\n  propertyTypes {\n    id\n    name\n    type\n    nodeType\n    index\n    stringValue\n    intValue\n    booleanValue\n    floatValue\n    latitudeValue\n    longitudeValue\n    rangeFromValue\n    rangeToValue\n    isEditable\n    isMandatory\n    isInstanceProperty\n    isDeleted\n    category\n  }\n  checkListCategoryDefinitions {\n    id\n    title\n    description\n    checklistItemDefinitions {\n      id\n      title\n      type\n      index\n      isMandatory\n      enumValues\n      enumSelectionMode\n      helpText\n    }\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '1f296cdaf33a0807ddd00b2dd62f80b8';

module.exports = node;
