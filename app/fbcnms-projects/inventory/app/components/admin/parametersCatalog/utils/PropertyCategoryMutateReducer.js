/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */


import type {PropertyCategoryMutateStateActionType} from './PropertyCategoryMutateAction';
import type {PropertyCategoryType, PropertyCategoriesType, PropertyCategoriesTypeStateType} from '../types/index';
import shortid from 'shortid';
import {reorder} from '../../../draggable/DraggableUtils';

function editItem(
  state: PropertyCategoriesTypeStateType,
  updatedItem: PropertyCategoryType,
): PropertyCategoriesTypeStateType {
  const {items} = state;
  const itemIndex = items.findIndex(i => i.id === updatedItem.id);
  return {
    ...state,
    items: [
      ...items.slice(0, itemIndex),
      {
        ...items[itemIndex],
        ...updatedItem,
      },
      ...items.slice(itemIndex + 1),
    ],
  };
}

export function reducer(
  state: PropertyCategoriesTypeStateType,
  action: PropertyCategoryMutateStateActionType,
): PropertyCategoriesTypeStateType {
  const {items} = state;
  switch (action.type) {
    case 'EDIT_ITEM':
      return editItem(state, action.value);
    case 'ADD_ITEM':
      const newId = shortid.generate();
      return {
        items: [
          ...items,
          getInitialProperty(items, newId),
        ],
      };
    case 'CHANGE_ITEM_POSITION':
      return {
        ...state,
        items: reorder<PropertyCategoryType>(
          items,
          action.sourceIndex,
          action.destinationIndex,
        ).map((item, index) => {
          return {
            ...item,
            index,
          };
        }),
      };
    case 'REMOVE_ITEM':
      const itemToRemoveIndex = items.findIndex(c => c.id === action.itemId);
      return {
        ...state,
        items: [
          ...items.slice(0, itemToRemoveIndex),
          ...items.slice(itemToRemoveIndex + 1, items.length),
        ],
      };
    case 'UPDATE_LIST_AFTER_SAVE':
      return {
        ...state,
        items: [
          ...action.newItems
        ]
      }
    default:
      return state;
  }
}

export function getInitialProperty(items: Array<PropertyCategoryType>, newId: string) {
    return {
      id: newId + '@tmp',
      name: '',
      index: items.length,
      numberOfProperties: 0,
    };
};

export function getInitialState(
  initialItems: Array<PropertyCategoryType>,
): PropertyCategoriesTypeStateType {
  return {
    items: initialItems.slice().map(item => ({...item})),
  };
}
