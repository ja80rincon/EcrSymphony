/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */
export type ParametersCatalogType = {|
  +id: string,
  +index: ?number,
  +isDisabled: ?boolean,
  +name: ?string,
  +propertyCategories: ?PropertyCategoriesType,
|};

export type PropertyCategoriesType = Array<PropertyCategoryType>;

export type PropertyCategoryType = {|
  +id: string,
  +index: ?number,
  +name: ?string,
  +numberOfProperties: ?number,
|}

export type PropertyCategoriesTypeStateType = $ReadOnly<{
  items: Array<PropertyCategoryType>
}>;