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
export type AddLocationInput = {|
  name: string,
  type: string,
  parent?: ?string,
  latitude?: ?number,
  longitude?: ?number,
  properties?: ?$ReadOnlyArray<PropertyInput>,
  externalID?: ?string,
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
export type AddLocationMutationVariables = {|
  input: AddLocationInput
|};
export type AddLocationMutationResponse = {|
  +addLocation: {|
    +id: string,
    +externalId: ?string,
    +name: string,
    +locationType: {|
      +id: string,
      +name: string,
    |},
    +numChildren: number,
    +siteSurveyNeeded: boolean,
    +children: $ReadOnlyArray<?{|
      +id: string,
      +externalId: ?string,
      +name: string,
      +locationType: {|
        +id: string,
        +name: string,
      |},
      +numChildren: number,
      +siteSurveyNeeded: boolean,
    |}>,
  |}
|};
export type AddLocationMutation = {|
  variables: AddLocationMutationVariables,
  response: AddLocationMutationResponse,
|};
*/


/*
mutation AddLocationMutation(
  $input: AddLocationInput!
) {
  addLocation(input: $input) {
    id
    externalId
    name
    locationType {
      id
      name
    }
    numChildren
    siteSurveyNeeded
    children {
      id
      externalId
      name
      locationType {
        id
        name
      }
      numChildren
      siteSurveyNeeded
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
  "name": "externalId",
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
  "concreteType": "LocationType",
  "kind": "LinkedField",
  "name": "locationType",
  "plural": false,
  "selections": [
    (v1/*: any*/),
    (v3/*: any*/)
  ],
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "numChildren",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "siteSurveyNeeded",
  "storageKey": null
},
v7 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "Location",
    "kind": "LinkedField",
    "name": "addLocation",
    "plural": false,
    "selections": [
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/),
      (v4/*: any*/),
      (v5/*: any*/),
      (v6/*: any*/),
      {
        "alias": null,
        "args": null,
        "concreteType": "Location",
        "kind": "LinkedField",
        "name": "children",
        "plural": true,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/),
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/)
        ],
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
    "name": "AddLocationMutation",
    "selections": (v7/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "AddLocationMutation",
    "selections": (v7/*: any*/)
  },
  "params": {
    "cacheID": "316e1dc785c097fa566962839546f610",
    "id": null,
    "metadata": {},
    "name": "AddLocationMutation",
    "operationKind": "mutation",
    "text": "mutation AddLocationMutation(\n  $input: AddLocationInput!\n) {\n  addLocation(input: $input) {\n    id\n    externalId\n    name\n    locationType {\n      id\n      name\n    }\n    numChildren\n    siteSurveyNeeded\n    children {\n      id\n      externalId\n      name\n      locationType {\n        id\n        name\n      }\n      numChildren\n      siteSurveyNeeded\n    }\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '6f4409b93601426ac35ab303fcdaea26';

module.exports = node;
