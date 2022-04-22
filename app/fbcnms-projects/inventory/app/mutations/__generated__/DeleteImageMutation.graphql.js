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
type DocumentTable_files$ref = any;
type FileAttachment_file$ref = any;
export type ImageEntity = "CHECKLIST_ITEM" | "EQUIPMENT" | "LOCATION" | "SITE_SURVEY" | "USER" | "WORK_ORDER" | "%future added value";
export type DeleteImageMutationVariables = {|
  entityType: ImageEntity,
  entityId: string,
  id: string,
|};
export type DeleteImageMutationResponse = {|
  +deleteImage: {|
    +$fragmentRefs: DocumentTable_files$ref & FileAttachment_file$ref
  |}
|};
export type DeleteImageMutation = {|
  variables: DeleteImageMutationVariables,
  response: DeleteImageMutationResponse,
|};
*/


/*
mutation DeleteImageMutation(
  $entityType: ImageEntity!
  $entityId: ID!
  $id: ID!
) {
  deleteImage(entityType: $entityType, entityId: $entityId, id: $id) {
    ...DocumentTable_files
    ...FileAttachment_file
    id
  }
}

fragment DocumentTable_files on File {
  id
  fileName
  category
  ...FileAttachment_file
}

fragment FileAttachment_file on File {
  id
  fileName
  sizeInBytes
  uploaded
  fileType
  storeKey
  category
  annotation
  documentCategory {
    id
    name
  }
  ...ImageDialog_img
}

fragment ImageDialog_img on File {
  storeKey
  fileName
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "entityId"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "entityType"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "id"
},
v3 = [
  {
    "kind": "Variable",
    "name": "entityId",
    "variableName": "entityId"
  },
  {
    "kind": "Variable",
    "name": "entityType",
    "variableName": "entityType"
  },
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  }
],
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "DeleteImageMutation",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": "File",
        "kind": "LinkedField",
        "name": "deleteImage",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "DocumentTable_files"
          },
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "FileAttachment_file"
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
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Operation",
    "name": "DeleteImageMutation",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": "File",
        "kind": "LinkedField",
        "name": "deleteImage",
        "plural": false,
        "selections": [
          (v4/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "fileName",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "category",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "sizeInBytes",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "uploaded",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "fileType",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "storeKey",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "annotation",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "DocumentCategory",
            "kind": "LinkedField",
            "name": "documentCategory",
            "plural": false,
            "selections": [
              (v4/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "name",
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
    "cacheID": "1ad1cd4543be3a9009d757667cc3c96e",
    "id": null,
    "metadata": {},
    "name": "DeleteImageMutation",
    "operationKind": "mutation",
    "text": "mutation DeleteImageMutation(\n  $entityType: ImageEntity!\n  $entityId: ID!\n  $id: ID!\n) {\n  deleteImage(entityType: $entityType, entityId: $entityId, id: $id) {\n    ...DocumentTable_files\n    ...FileAttachment_file\n    id\n  }\n}\n\nfragment DocumentTable_files on File {\n  id\n  fileName\n  category\n  ...FileAttachment_file\n}\n\nfragment FileAttachment_file on File {\n  id\n  fileName\n  sizeInBytes\n  uploaded\n  fileType\n  storeKey\n  category\n  annotation\n  documentCategory {\n    id\n    name\n  }\n  ...ImageDialog_img\n}\n\nfragment ImageDialog_img on File {\n  storeKey\n  fileName\n}\n"
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = 'e35a3c256648c1f9c986d51a8d7b77bb';

module.exports = node;
