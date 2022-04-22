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
export type RemoveSiteSurveyMutationVariables = {|
  id: string
|};
export type RemoveSiteSurveyMutationResponse = {|
  +removeSiteSurvey: string
|};
export type RemoveSiteSurveyMutation = {|
  variables: RemoveSiteSurveyMutationVariables,
  response: RemoveSiteSurveyMutationResponse,
|};
*/


/*
mutation RemoveSiteSurveyMutation(
  $id: ID!
) {
  removeSiteSurvey(id: $id)
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "id",
        "variableName": "id"
      }
    ],
    "kind": "ScalarField",
    "name": "removeSiteSurvey",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "RemoveSiteSurveyMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "RemoveSiteSurveyMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "52c4cfd0d670294b9754caa9546832b0",
    "id": null,
    "metadata": {},
    "name": "RemoveSiteSurveyMutation",
    "operationKind": "mutation",
    "text": "mutation RemoveSiteSurveyMutation(\n  $id: ID!\n) {\n  removeSiteSurvey(id: $id)\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'fc6117923fa8eda4898294028568180b';

module.exports = node;
