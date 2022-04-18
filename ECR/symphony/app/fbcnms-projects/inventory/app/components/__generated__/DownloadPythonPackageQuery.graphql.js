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
export type DownloadPythonPackageQueryVariables = {||};
export type DownloadPythonPackageQueryResponse = {|
  +pythonPackages: $ReadOnlyArray<{|
    +version: string,
    +whlFileKey: string,
    +uploadTime: any,
  |}>
|};
export type DownloadPythonPackageQuery = {|
  variables: DownloadPythonPackageQueryVariables,
  response: DownloadPythonPackageQueryResponse,
|};
*/


/*
query DownloadPythonPackageQuery {
  pythonPackages {
    version
    whlFileKey
    uploadTime
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "PythonPackage",
    "kind": "LinkedField",
    "name": "pythonPackages",
    "plural": true,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "version",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "whlFileKey",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "uploadTime",
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
    "name": "DownloadPythonPackageQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "DownloadPythonPackageQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "a23c977651b7d654345475cab562dd19",
    "id": null,
    "metadata": {},
    "name": "DownloadPythonPackageQuery",
    "operationKind": "query",
    "text": "query DownloadPythonPackageQuery {\n  pythonPackages {\n    version\n    whlFileKey\n    uploadTime\n  }\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'c2ffc17589d8cfa0daad1826bd83f69c';

module.exports = node;
