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

import type {PropertiesPane_properties} from './__generated__/PropertiesPane_properties.graphql';
import type {PropertiesPane_propertyTypes} from './__generated__/PropertiesPane_propertyTypes.graphql';

import List from '@fbcmobile/ui/Components/List';
import ListItem from '@fbcmobile/ui/Components/ListItem';
import React, {useMemo} from 'react';
import Text from '@fbcmobile/ui/Components/Core/Text';
import {Colors} from '@fbcmobile/ui/Theme';
import {StyleSheet} from 'react-native';
import {View} from 'react-native';
import {createFragmentContainer} from 'react-relay-offline';
import {getEntityPropertyValues} from '../Utils/Property';

const graphql = require('babel-plugin-relay/macro');

type Props = {
  +properties: PropertiesPane_properties,
  +propertyTypes: ?PropertiesPane_propertyTypes,
};

const PropertiesPane = (props: Props) => {
  const {properties, propertyTypes} = props;
  const propertyValues = useMemo(
    () => getEntityPropertyValues(properties, propertyTypes),
    [properties, propertyTypes],
  );
  return (
    <List style={styles.root}>
      {propertyValues.map(property => (
        <ListItem key={property.id}>
          <View>
            <Text style={styles.name}>{property.name}</Text>
            <Text style={styles.value}>{property.value}</Text>
          </View>
        </ListItem>
      ))}
    </List>
  );
};

const styles = StyleSheet.create({
  root: {
    paddingLeft: 20,
  },
  name: {
    color: Colors.Gray30,
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 16,
    marginBottom: 5,
  },
  value: {
    color: Colors.BlackText,
    fontSize: 14,
    lineHeight: 16,
  },
});

export default createFragmentContainer(PropertiesPane, {
  properties: graphql`
    fragment PropertiesPane_properties on Property @relay(plural: true) {
      id
      propertyType {
        id
        name
        index
        isInstanceProperty
        type
        stringValue
        intValue
        floatValue
        booleanValue
        latitudeValue
        longitudeValue
        rangeFromValue
        rangeToValue
      }
      stringValue
      intValue
      floatValue
      booleanValue
      latitudeValue
      longitudeValue
      rangeFromValue
      rangeToValue
    }
  `,
  propertyTypes: graphql`
    fragment PropertiesPane_propertyTypes on PropertyType @relay(plural: true) {
      id
      name
      index
      isInstanceProperty
      type
      stringValue
      intValue
      floatValue
      booleanValue
      latitudeValue
      longitudeValue
      rangeFromValue
      rangeToValue
    }
  `,
});
