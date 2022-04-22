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

import type {Coords} from '@fbcmobile/ui/Utils/MapUtils';
import type {MyTaskListItem_location} from './__generated__/MyTaskListItem_location.graphql';
import type {Priority} from '@fbcmobile/ui/Components/PriorityPill';
import type {Status} from '@fbcmobile/ui/Components/StatusPill';

import * as React from 'react';
import ChevronIcon from '@fbcmobile/ui/Components/ChevronIcon';
import Colors from '@fbcmobile/ui/Theme/Colors';
import ListItem from '@fbcmobile/ui/Components/ListItem';
import PillsView from '@fbcmobile/ui/Components/PillsView';
import PriorityPill from '@fbcmobile/ui/Components/PriorityPill';
import StatusPill from '@fbcmobile/ui/Components/StatusPill';
import Text from '@fbcmobile/ui/Components/Core/Text';
import fbt from 'fbt';
import {Icon} from 'react-native-material-ui';
import {StyleSheet, View} from 'react-native';
import {createFragmentContainer} from 'react-relay-offline';
import {getDistanceBetweenLocations} from '@fbcmobile/ui/Utils/MapUtils';

const graphql = require('babel-plugin-relay/macro');

type Props = {
  +name: React.Node,
  +location: ?MyTaskListItem_location,
  +userLocation: ?Coords,
  +priority?: ?Priority,
  +status?: ?Status,
  +numCategories?: ?number,
  +isUploadRequired?: boolean,
  +onClick: () => void,
};

const MyTaskListItem = ({
  name,
  status,
  priority,
  onClick,
  location,
  userLocation,
  numCategories,
  isUploadRequired = false,
}: Props) => {
  const distance = getDistanceBetweenLocations(userLocation, {
    latitude: location?.latitude,
    longitude: location?.longitude,
  });
  const locationBreadcrumb =
    location == null
      ? null
      : [...location.locationHierarchy.map(l => l.name), location.name].join(
          ' / ',
        );
  return (
    <ListItem onItemClicked={onClick}>
      <View style={styles.root}>
        <View style={styles.locationHeaderContainer}>
          <View style={styles.itemContent}>
            <Text variant="h3" weight="bold">
              {name}
            </Text>
            {locationBreadcrumb && (
              <View style={styles.locationPath}>
                <Text>
                  <Text variant="h8" style={styles.locationHierarchy}>
                    {locationBreadcrumb}
                  </Text>
                </Text>
              </View>
            )}
            <PillsView style={styles.pills}>
              {numCategories ? (
                <Text variant="h7">
                  <fbt desc="Label to show the amount of forms">
                    <fbt:plural
                      many="categories"
                      showCount="yes"
                      count={numCategories}>
                      category
                    </fbt:plural>
                  </fbt>
                </Text>
              ) : null}
              {status ? <StatusPill status={status} /> : null}
              {priority ? <PriorityPill priority={priority} /> : null}
            </PillsView>
          </View>
          {distance ? (
            <Text style={styles.distanceLabel} variant="h7">
              <fbt desc="Abbreviation of kilometers. This is a label showing distance to a location">
                <fbt:param name="Distance value in km">
                  {(distance / 1000).toFixed(2)}
                </fbt:param>
                km
              </fbt>
            </Text>
          ) : null}
          {isUploadRequired ? (
            <View style={styles.uploadIndicator}>
              <Icon
                name="arrow-up"
                size={20}
                color={Colors.BackgroundWhite}
                iconSet="MaterialCommunityIcons"
              />
            </View>
          ) : null}
          <ChevronIcon />
        </View>
      </View>
    </ListItem>
  );
};

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    flexGrow: 1,
  },
  itemContent: {
    flexGrow: 1,
    flexShrink: 1,
  },
  locationHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationPath: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    marginTop: 4.5,
  },
  locationHierarchy: {
    flexShrink: 1,
  },
  pills: {
    marginTop: 14.5,
  },
  distanceLabel: {
    color: Colors.Gray60,
  },
  uploadIndicator: {
    marginRight: 0.5,
    marginLeft: 6,
    backgroundColor: Colors.Gray140,
    borderRadius: 15.5,
    padding: 5.5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default createFragmentContainer(MyTaskListItem, {
  location: graphql`
    fragment MyTaskListItem_location on Location {
      id
      name
      latitude
      longitude
      locationHierarchy {
        id
        name
      }
    }
  `,
});
