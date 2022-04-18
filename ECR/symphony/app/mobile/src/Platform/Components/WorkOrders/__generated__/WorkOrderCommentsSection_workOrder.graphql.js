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
import type { ReaderFragment } from 'relay-runtime';
type WorkOrderCommentListItem_comment$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type WorkOrderCommentsSection_workOrder$ref: FragmentReference;
declare export opaque type WorkOrderCommentsSection_workOrder$fragmentType: WorkOrderCommentsSection_workOrder$ref;
export type WorkOrderCommentsSection_workOrder = {|
  +id: string,
  +comments: $ReadOnlyArray<?{|
    +id: string,
    +$fragmentRefs: WorkOrderCommentListItem_comment$ref,
  |}>,
  +$refType: WorkOrderCommentsSection_workOrder$ref,
|};
export type WorkOrderCommentsSection_workOrder$data = WorkOrderCommentsSection_workOrder;
export type WorkOrderCommentsSection_workOrder$key = {
  +$data?: WorkOrderCommentsSection_workOrder$data,
  +$fragmentRefs: WorkOrderCommentsSection_workOrder$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "WorkOrderCommentsSection_workOrder",
  "selections": [
    (v0/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "Comment",
      "kind": "LinkedField",
      "name": "comments",
      "plural": true,
      "selections": [
        (v0/*: any*/),
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "WorkOrderCommentListItem_comment"
        }
      ],
      "storageKey": null
    }
  ],
  "type": "WorkOrder"
};
})();
// prettier-ignore
(node/*: any*/).hash = '3c7b970a45c080c31916729d1325ec86';

module.exports = node;
