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

import type {PropertiesPane_properties} from '../Components/__generated__/PropertiesPane_properties.graphql';
import type {PropertiesPane_propertyTypes} from '../Components/__generated__/PropertiesPane_propertyTypes.graphql';

type PropertyValue = {
  id: string,
  name: string,
  value: ?string,
};

export const getEntityPropertyValues = (
  properties: PropertiesPane_properties,
  propertyTypes: ?PropertiesPane_propertyTypes,
): Array<PropertyValue> => {
  const propIds = properties.map(x => x.propertyType.id);
  const nonInstanceProperties = (propertyTypes ?? []).filter(type => {
    return !propIds.includes(type.id) && !type.isInstanceProperty;
  });

  return [
    ...properties.map(p => ({
      id: p.id,
      name: p.propertyType.name,
      value: getValue(p.propertyType.type, p),
    })),
    ...nonInstanceProperties.map(p => ({
      id: p.id,
      name: p.name,
      value: getValue(p.type, p),
    })),
  ];
};

export const getValue = (
  type: string,
  value:
    | $ElementType<PropertiesPane_properties, number>
    | $ElementType<PropertiesPane_propertyTypes, number>,
): ?string => {
  {
    switch (type) {
      case 'date':
      case 'datetime_local':
      case 'email':
      case 'enum':
      case 'string':
        return value.stringValue;
      case 'bool':
        return value.booleanValue != undefined
          ? value.booleanValue.toString()
          : '';
      case 'int':
        return String(value.intValue);
      case 'float':
        return String(value.floatValue);
      case 'range':
        return value.rangeFromValue !== null && value.rangeToValue !== null
          ? (value.rangeFromValue ?? '') + ' - ' + (value.rangeToValue ?? '')
          : '';
      case 'gps_location':
        return value.latitudeValue !== null && value.longitudeValue !== null
          ? (value.latitudeValue ?? '') + ', ' + (value.longitudeValue ?? '')
          : '';
    }
  }
};
