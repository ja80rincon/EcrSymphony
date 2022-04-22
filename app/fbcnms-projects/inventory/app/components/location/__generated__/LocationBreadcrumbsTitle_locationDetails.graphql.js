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
import type { FragmentReference } from "relay-runtime";
declare export opaque type LocationBreadcrumbsTitle_locationDetails$ref: FragmentReference;
declare export opaque type LocationBreadcrumbsTitle_locationDetails$fragmentType: LocationBreadcrumbsTitle_locationDetails$ref;
export type LocationBreadcrumbsTitle_locationDetails = {|
  +id: string,
  +name: string,
  +locationType: {|
    +name: string
  |},
  +locationHierarchy: $ReadOnlyArray<{|
    +id: string,
    +name: string,
    +locationType: {|
      +name: string
    |},
  |}>,
  +$refType: LocationBreadcrumbsTitle_locationDetails$ref,
|};
export type LocationBreadcrumbsTitle_locationDetails$data = LocationBreadcrumbsTitle_locationDetails;
export type LocationBreadcrumbsTitle_locationDetails$key = {
  +$data?: LocationBreadcrumbsTitle_locationDetails$data,
  +$fragmentRefs: LocationBreadcrumbsTitle_locationDetails$ref,
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
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "concreteType": "LocationType",
  "kind": "LinkedField",
  "name": "locationType",
  "plural": false,
  "selections": [
    (v1/*: any*/)
  ],
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "LocationBreadcrumbsTitle_locationDetails",
  "selections": [
    (v0/*: any*/),
    (v1/*: any*/),
    (v2/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "Location",
      "kind": "LinkedField",
      "name": "locationHierarchy",
      "plural": true,
      "selections": [
        (v0/*: any*/),
        (v1/*: any*/),
        (v2/*: any*/)
      ],
      "storageKey": null
    }
  ],
  "type": "Location",
  "abstractKey": null
};
})();
// prettier-ignore
(node/*: any*/).hash = '807c6b11117d3143cb9babd7a3239785';

module.exports = node;
