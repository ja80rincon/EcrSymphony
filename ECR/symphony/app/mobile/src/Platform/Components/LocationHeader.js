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

import type {LocationScreenQueryResponse} from '../Screens/__generated__/LocationScreenQuery.graphql';

import Breadcrumbs from '@fbcmobile/ui/Components/Breadcrumbs';
import NavigationService from '@fbcmobile/ui/Services/NavigationService';
import React from 'react';
import Text from '@fbcmobile/ui/Components/Core/Text';
import fbt from 'fbt';
import nullthrows from 'nullthrows';
import {Colors} from '@fbcmobile/ui/Theme';
import {Picker} from 'react-native';
import {Screens} from 'Platform/Screens/ScreensConsts';
import {StyleSheet, View} from 'react-native';

type Props = {
  +location: $ElementType<LocationScreenQueryResponse, 'node'>,
  +showExtraDetails?: boolean,
};

const LocationHeader = (props: Props) => {
  const {showExtraDetails} = props;
  const location = nullthrows(props.location);
  const navigateToLocation = id =>
    NavigationService.push(Screens.LocationScreen, {
      id,
    });
  return (
    <View style={styles.headerContainer}>
      {location.locationHierarchy && location.locationHierarchy.length > 0 ? (
        <View style={styles.breadcrumbs}>
          <Breadcrumbs
            breadcrumbs={location.locationHierarchy.map(l => ({
              id: l.id,
              name: l.name,
            }))}
            onClick={({id}) => navigateToLocation(id)}
          />
        </View>
      ) : null}
      <Text weight="bold" color="gray" style={styles.locationName}>
        {location.name}
      </Text>
      {showExtraDetails ? (
        <View style={styles.detailsContainer}>
          <Text variant="h6" style={styles.detailsText}>
            <fbt desc="ID label for locations">
              ID:
              <fbt:param name="Location ID">{location.id}</fbt:param>
            </fbt>
          </Text>
          <Text variant="h6" style={styles.detailsText}>
            <fbt desc="Label for coordinates">
              Latitude:<fbt:param name="Location latitude value">
                {location.latitude}
              </fbt:param>
            </fbt>
          </Text>
          <Text variant="h6" style={styles.detailsText}>
            <fbt desc="Label for coordinates">
              Longitude:<fbt:param name="Location longitude value">
                {location.longitude}
              </fbt:param>
            </fbt>
          </Text>
        </View>
      ) : null}
      {location.children && location.children.length > 0 ? (
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={null}
            style={styles.pickerStyle}
            onValueChange={navigateToLocation}
            mode="dropdown">
            <Picker.Item
              label="View sub-locations"
              value={null}
              color={Colors.TransparentGray70}
            />
            {location.children.map(l =>
              l ? <Picker.Item key={l.id} label={l.name} value={l.id} /> : null,
            )}
          </Picker>
          <View style={styles.underline} />
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  pickerContainer: {
    width: '60%',
    position: 'relative',
    left: -8,
  },
  underline: {
    borderBottomColor: Colors.Gray90,
    borderBottomWidth: 1,
    marginLeft: 8,
    marginRight: 14,
    position: 'relative',
    top: -3,
  },
  pickerStyle: {
    padding: 0,
    paddingHorizontal: 0,
    height: 44,
  },
  headerContainer: {
    padding: 20,
  },
  detailsContainer: {
    paddingVertical: 10,
  },
  detailsText: {
    letterSpacing: 0.5,
    color: Colors.Gray70,
  },
  locationHierarchy: {
    display: 'flex',
    flexDirection: 'row',
  },
  tabContainer: {
    display: 'flex',
    flexGrow: 1,
  },
  locationName: {
    fontSize: 30,
    lineHeight: 35,
  },
  breadcrumbs: {
    marginBottom: 10,
  },
});

export default LocationHeader;
