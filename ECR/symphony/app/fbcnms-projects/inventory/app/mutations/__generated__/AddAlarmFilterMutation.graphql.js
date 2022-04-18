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
export type AddAlarmFilterInput = {|
  name: string,
  networkResource: string,
  enable: boolean,
  beginTime: any,
  endTime: any,
  reason: string,
  user: string,
  creationTime: any,
  alarmStatus?: ?string,
|};
export type AddAlarmFilterMutationVariables = {|
  input: AddAlarmFilterInput
|};
export type AddAlarmFilterMutationResponse = {|
  +addAlarmFilter: {|
    +id: string,
    +name: string,
    +networkResource: string,
    +enable: boolean,
    +beginTime: any,
    +endTime: any,
    +reason: string,
    +user: string,
    +creationTime: any,
    +alarmStatus: ?{|
      +id: string,
      +name: string,
    |},
  |}
|};
export type AddAlarmFilterMutation = {|
  variables: AddAlarmFilterMutationVariables,
  response: AddAlarmFilterMutationResponse,
|};
*/


/*
mutation AddAlarmFilterMutation(
  $input: AddAlarmFilterInput!
) {
  addAlarmFilter(input: $input) {
    id
    name
    networkResource
    enable
    beginTime
    endTime
    reason
    user
    creationTime
    alarmStatus {
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
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "AlarmFilter",
    "kind": "LinkedField",
    "name": "addAlarmFilter",
    "plural": false,
    "selections": [
      (v1/*: any*/),
      (v2/*: any*/),
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "networkResource",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "enable",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "beginTime",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "endTime",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "reason",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "user",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "creationTime",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "AlarmStatus",
        "kind": "LinkedField",
        "name": "alarmStatus",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/)
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
    "name": "AddAlarmFilterMutation",
    "selections": (v3/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "AddAlarmFilterMutation",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "97e5d4962372d59201a69a304a45a68a",
    "id": null,
    "metadata": {},
    "name": "AddAlarmFilterMutation",
    "operationKind": "mutation",
    "text": "mutation AddAlarmFilterMutation(\n  $input: AddAlarmFilterInput!\n) {\n  addAlarmFilter(input: $input) {\n    id\n    name\n    networkResource\n    enable\n    beginTime\n    endTime\n    reason\n    user\n    creationTime\n    alarmStatus {\n      id\n      name\n    }\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'e65eb01897cca7fd587b05cc9f39b193';

module.exports = node;
