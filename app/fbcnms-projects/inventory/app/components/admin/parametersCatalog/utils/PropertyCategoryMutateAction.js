/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

import type {
  ParametersCatalogType,
  PropertyCategoriesType,
  PropertyCategoryType,
} from '../types/index';
export type PropertyCategoryMutateStateActionType =
  | {|
      type: 'EDIT_ITEM',
      value: PropertyCategoryType,
    |}
  | {|
      type: 'ADD_ITEM',
    |}
  | {|
      type: 'REMOVE_ITEM',
      itemId: string,
    |}
  | {|
      type: 'CHANGE_ITEM_POSITION',
      sourceIndex: number,
      destinationIndex: number,
    |}
  | {|
      type: 'UPDATE_LIST_AFTER_SAVE',
      newItems: Array<PropertyCategoryType>,
    |}
  | {|
      type: 'ADD_ITEM_FILE',
      itemId: string,
      file: PropertyCategoryType,
    |};
