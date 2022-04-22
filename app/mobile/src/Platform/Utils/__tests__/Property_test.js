/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

'use strict';

import {getEntityPropertyValues} from '../Property';
import type {PropertiesPane_properties} from '../../Components/__generated__/PropertiesPane_properties.graphql';
import type {PropertiesPane_propertyTypes} from '../../Components/__generated__/PropertiesPane_propertyTypes.graphql';
import type {FragmentReference} from 'relay-runtime';

describe('Property Tests', () => {
  test('Property ', () => {
    const mockRefType: any = null;
    const properties: PropertiesPane_properties = [
      {
        id: 'id1',
        propertyType: {
          id: 'propid1',
          name: 'type1',
          index: 1,
          isInstanceProperty: false,
          type: 'bool',
          stringValue: null,
          intValue: null,
          floatValue: null,
          booleanValue: true,
          latitudeValue: null,
          longitudeValue: null,
          rangeFromValue: null,
          rangeToValue: null,
        },
        stringValue: null,
        intValue: null,
        floatValue: null,
        booleanValue: true,
        latitudeValue: null,
        longitudeValue: null,
        rangeFromValue: null,
        rangeToValue: null,
        $refType: mockRefType,
      },
      {
        id: 'id2',
        propertyType: {
          id: 'propid2',
          name: 'type2',
          index: 2,
          isInstanceProperty: false,
          type: 'string',
          stringValue: 'testing',
          intValue: null,
          floatValue: null,
          booleanValue: true,
          latitudeValue: null,
          longitudeValue: null,
          rangeFromValue: null,
          rangeToValue: null,
        },
        stringValue: 'testing',
        intValue: null,
        floatValue: null,
        booleanValue: null,
        latitudeValue: null,
        longitudeValue: null,
        rangeFromValue: null,
        rangeToValue: null,
        $refType: mockRefType,
      },
    ];
    const propertyTypes: PropertiesPane_propertyTypes = [
      {
        id: 'propid1',
        name: 'type1',
        index: 1,
        isInstanceProperty: false,
        type: 'bool',
        stringValue: null,
        intValue: null,
        floatValue: null,
        booleanValue: true,
        latitudeValue: null,
        longitudeValue: null,
        rangeFromValue: null,
        rangeToValue: null,
        $refType: mockRefType,
      },
    ];
    const propertyValues = getEntityPropertyValues(properties, propertyTypes);
    expect(propertyValues).toStrictEqual([
      {id: 'id1', name: 'type1', value: 'true'},
      {id: 'id2', name: 'type2', value: 'testing'},
    ]);
    const propertyValueNoPropTypes = getEntityPropertyValues(properties, null);
    expect(propertyValues).toStrictEqual([
      {id: 'id1', name: 'type1', value: 'true'},
      {id: 'id2', name: 'type2', value: 'testing'},
    ]);
  });
});
