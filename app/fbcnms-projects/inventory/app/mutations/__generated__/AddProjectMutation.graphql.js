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
export type ProjectPriority = "HIGH" | "LOW" | "MEDIUM" | "NONE" | "URGENT" | "%future added value";
export type AddProjectInput = {|
  name: string,
  description?: ?string,
  priority?: ?ProjectPriority,
  creatorId?: ?string,
  type: string,
  location?: ?string,
  properties?: ?$ReadOnlyArray<PropertyInput>,
|};
export type PropertyInput = {|
  id?: ?string,
  propertyTypeID: string,
  stringValue?: ?string,
  intValue?: ?number,
  booleanValue?: ?boolean,
  floatValue?: ?number,
  latitudeValue?: ?number,
  longitudeValue?: ?number,
  rangeFromValue?: ?number,
  rangeToValue?: ?number,
  nodeIDValue?: ?string,
  isEditable?: ?boolean,
  isInstanceProperty?: ?boolean,
|};
export type AddProjectMutationVariables = {|
  input: AddProjectInput
|};
export type AddProjectMutationResponse = {|
  +createProject: {|
    +id: string,
    +createTime: any,
    +name: string,
    +createdBy: ?{|
      +email: string
    |},
    +location: ?{|
      +id: string,
      +name: string,
    |},
    +type: {|
      +id: string,
      +name: string,
    |},
    +priority: ProjectPriority,
    +numberOfWorkOrders: number,
  |}
|};
export type AddProjectMutation = {|
  variables: AddProjectMutationVariables,
  response: AddProjectMutationResponse,
|};
*/


/*
mutation AddProjectMutation(
  $input: AddProjectInput!
) {
  createProject(input: $input) {
    id
    createTime
    name
    createdBy {
      email
      id
    }
    location {
      id
      name
    }
    type {
      id
      name
    }
    priority
    numberOfWorkOrders
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
  "name": "createTime",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "email",
  "storageKey": null
},
v6 = [
  (v2/*: any*/),
  (v4/*: any*/)
],
v7 = {
  "alias": null,
  "args": null,
  "concreteType": "Location",
  "kind": "LinkedField",
  "name": "location",
  "plural": false,
  "selections": (v6/*: any*/),
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "concreteType": "ProjectType",
  "kind": "LinkedField",
  "name": "type",
  "plural": false,
  "selections": (v6/*: any*/),
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "priority",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "numberOfWorkOrders",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "AddProjectMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Project",
        "kind": "LinkedField",
        "name": "createProject",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "User",
            "kind": "LinkedField",
            "name": "createdBy",
            "plural": false,
            "selections": [
              (v5/*: any*/)
            ],
            "storageKey": null
          },
          (v7/*: any*/),
          (v8/*: any*/),
          (v9/*: any*/),
          (v10/*: any*/)
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
    "name": "AddProjectMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Project",
        "kind": "LinkedField",
        "name": "createProject",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "User",
            "kind": "LinkedField",
            "name": "createdBy",
            "plural": false,
            "selections": [
              (v5/*: any*/),
              (v2/*: any*/)
            ],
            "storageKey": null
          },
          (v7/*: any*/),
          (v8/*: any*/),
          (v9/*: any*/),
          (v10/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "e51259bffafa3d4081dfdd39ac7e2fbf",
    "id": null,
    "metadata": {},
    "name": "AddProjectMutation",
    "operationKind": "mutation",
    "text": "mutation AddProjectMutation(\n  $input: AddProjectInput!\n) {\n  createProject(input: $input) {\n    id\n    createTime\n    name\n    createdBy {\n      email\n      id\n    }\n    location {\n      id\n      name\n    }\n    type {\n      id\n      name\n    }\n    priority\n    numberOfWorkOrders\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '49be5a9ffa393f7b29e5d148a9ff2cfe';

module.exports = node;
