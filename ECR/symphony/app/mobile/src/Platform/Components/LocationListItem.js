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

import type {LocationListItem_location} from './__generated__/LocationListItem_location.graphql';

import * as React from 'react';
import Text from '@fbcmobile/ui/Components/Core/Text';
import {Colors} from '@fbcmobile/ui/Theme';
import {StyleSheet, View} from 'react-native';
import {createFragmentContainer} from 'react-relay-offline';

const graphql = require('babel-plugin-relay/macro');

type Props = {
  +location: LocationListItem_location,
  +rightElement?: React.Node,
};

const LocationListItem = (props: Props) => {
  const {location, rightElement} = props;
  return (
    <View style={styles.root}>
      <View style={styles.locationHeaderContainer}>
        <Text style={styles.locationTitle} weight="bold">
          {location.name}
        </Text>
        {rightElement}
      </View>
      {location.locationHierarchy.length > 0 ? (
        <Text style={styles.locationHierarchy} variant="h6">
          {location.locationHierarchy.map(l => l.name).join(', ')}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    flexGrow: 1,
  },
  locationHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationTitle: {
    letterSpacing: 0.5,
  },
  locationHierarchy: {
    marginTop: 10,
    color: Colors.Gray70,
  },
});

export default createFragmentContainer(LocationListItem, {
  location: graphql`
    fragment LocationListItem_location on Location {
      id
      name
      locationHierarchy {
        id
        name
      }
    }
  `,
});
