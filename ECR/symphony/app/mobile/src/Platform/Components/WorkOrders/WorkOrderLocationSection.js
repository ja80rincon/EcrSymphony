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

import type {ViewStyleProp} from 'react-native/Libraries/StyleSheet/StyleSheet';
import type {WorkOrderLocationSection_workOrder} from './__generated__/WorkOrderLocationSection_workOrder.graphql';

import * as React from 'react';
import LocationMapSection from '@fbcmobile/ui/Components/LocationMapSection';
import Text from '@fbcmobile/ui/Components/Core/Text';
import fbt from 'fbt';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {createFragmentContainer} from 'react-relay-offline';
import {navigateToCoords} from '@fbcmobile/ui/Utils/MapUtils';

const graphql = require('babel-plugin-relay/macro');

type Props = {
  +style?: ViewStyleProp,
  +workOrder: WorkOrderLocationSection_workOrder,
};

const WorkOrderLocationSection = ({workOrder, style}: Props) => {
  const {location} = workOrder;
  if (!location || !location.longitude || !location.latitude) {
    return null;
  }

  return (
    <TouchableOpacity
      style={style}
      onPress={() => navigateToCoords(location.latitude, location.longitude)}>
      <View style={styles.mapSection}>
        <View style={styles.mapContainer}>
          <LocationMapSection
            style={styles.map}
            longitude={location.longitude}
            latitude={location.latitude}
          />
        </View>
        <View style={styles.directionsSection}>
          <View>
            <Text variant="h8" weight="bold" style={styles.locationTitle}>
              <fbt desc="Location header text, shown next to a map">
                Location
              </fbt>
            </Text>
            <Text variant="h5" weight="light">
              {location.name}
            </Text>
            <Text variant="h5" color="primary" weight="light">
              <fbt desc="Button label. Clicking it will open the maps app and navigate the user.">
                Get Directions
              </fbt>
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mapSection: {
    display: 'flex',
    flexDirection: 'row',
  },
  directionsSection: {
    flex: 1,
    alignSelf: 'flex-end',
  },
  mapContainer: {
    height: 89,
    flex: 1,
    marginRight: 11.5,
  },
  map: {
    height: '100%',
    width: '100%',
  },
  locationTitle: {
    marginBottom: 5,
  },
});

export default createFragmentContainer(WorkOrderLocationSection, {
  workOrder: graphql`
    fragment WorkOrderLocationSection_workOrder on WorkOrder {
      location {
        name
        latitude
        longitude
      }
    }
  `,
});
