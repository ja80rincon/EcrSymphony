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
export type ActivityField = "ASSIGNEE" | "CLOCK_IN" | "CLOCK_OUT" | "CREATION_DATE" | "DESCRIPTION" | "NAME" | "OWNER" | "PRIORITY" | "STATUS" | "%future added value";
import type { FragmentReference } from "relay-runtime";
declare export opaque type GenericActivityText_activity$ref: FragmentReference;
declare export opaque type GenericActivityText_activity$fragmentType: GenericActivityText_activity$ref;
export type GenericActivityText_activity = {|
  +activityType: ActivityField,
  +newRelatedNode: ?({|
    +__typename: "User",
    +email: string,
  |} | {|
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    +__typename: "%other"
  |}),
  +oldRelatedNode: ?({|
    +__typename: "User",
    +email: string,
  |} | {|
    // This will never be '%other', but we need some
    // value in case none of the concrete values match.
    +__typename: "%other"
  |}),
  +oldValue: ?string,
  +newValue: ?string,
  +$refType: GenericActivityText_activity$ref,
|};
export type GenericActivityText_activity$data = GenericActivityText_activity;
export type GenericActivityText_activity$key = {
  +$data?: GenericActivityText_activity$data,
  +$fragmentRefs: GenericActivityText_activity$ref,
  ...
};
*/


const node/*: ReaderFragment*/ = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "__typename",
    "storageKey": null
  },
  {
    "kind": "InlineFragment",
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "email",
        "storageKey": null
      }
    ],
    "type": "User",
    "abstractKey": null
  }
];
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "GenericActivityText_activity",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "activityType",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": null,
      "kind": "LinkedField",
      "name": "newRelatedNode",
      "plural": false,
      "selections": (v0/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": null,
      "kind": "LinkedField",
      "name": "oldRelatedNode",
      "plural": false,
      "selections": (v0/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "oldValue",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "newValue",
      "storageKey": null
    }
  ],
  "type": "Activity",
  "abstractKey": null
};
})();
// prettier-ignore
(node/*: any*/).hash = '736c776d7a9e4e936f031f4dd2f373e1';

module.exports = node;
