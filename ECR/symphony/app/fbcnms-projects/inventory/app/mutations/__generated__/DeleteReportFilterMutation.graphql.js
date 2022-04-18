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
export type DeleteReportFilterMutationVariables = {|
  id: string
|};
export type DeleteReportFilterMutationResponse = {|
  +deleteReportFilter: boolean
|};
export type DeleteReportFilterMutation = {|
  variables: DeleteReportFilterMutationVariables,
  response: DeleteReportFilterMutationResponse,
|};
*/


/*
mutation DeleteReportFilterMutation(
  $id: ID!
) {
  deleteReportFilter(id: $id)
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
    "name": "deleteReportFilter",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "DeleteReportFilterMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "DeleteReportFilterMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "4ed13f38fa4d8ec48c83c8919984606f",
    "id": null,
    "metadata": {},
    "name": "DeleteReportFilterMutation",
    "operationKind": "mutation",
    "text": "mutation DeleteReportFilterMutation(\n  $id: ID!\n) {\n  deleteReportFilter(id: $id)\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '7963d86165414f401b01981da338f8de';

module.exports = node;
