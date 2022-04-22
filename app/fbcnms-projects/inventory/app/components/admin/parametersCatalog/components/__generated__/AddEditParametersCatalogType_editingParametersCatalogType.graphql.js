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
declare export opaque type AddEditParametersCatalogType_editingParametersCatalogType$ref: FragmentReference;
declare export opaque type AddEditParametersCatalogType_editingParametersCatalogType$fragmentType: AddEditParametersCatalogType_editingParametersCatalogType$ref;
export type AddEditParametersCatalogType_editingParametersCatalogType = {|
  +id: string,
  +name: ?string,
  +index: ?number,
  +isDisabled: ?boolean,
  +propertyCategories: $ReadOnlyArray<?{|
    +id: string,
    +name: ?string,
    +index: ?number,
    +numberOfProperties: ?number,
  |}>,
  +$refType: AddEditParametersCatalogType_editingParametersCatalogType$ref,
|};
export type AddEditParametersCatalogType_editingParametersCatalogType$data = AddEditParametersCatalogType_editingParametersCatalogType;
export type AddEditParametersCatalogType_editingParametersCatalogType$key = {
  +$data?: AddEditParametersCatalogType_editingParametersCatalogType$data,
  +$fragmentRefs: AddEditParametersCatalogType_editingParametersCatalogType$ref,
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
  "kind": "ScalarField",
  "name": "index",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "AddEditParametersCatalogType_editingParametersCatalogType",
  "selections": [
    (v0/*: any*/),
    (v1/*: any*/),
    (v2/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isDisabled",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "PropertyCategory",
      "kind": "LinkedField",
      "name": "propertyCategories",
      "plural": true,
      "selections": [
        (v0/*: any*/),
        (v1/*: any*/),
        (v2/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "numberOfProperties",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "ParameterCatalog",
  "abstractKey": null
};
})();
// prettier-ignore
(node/*: any*/).hash = '9cbffd718ceaeb06c0af700cb29ac94f';

module.exports = node;
