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

import type {EquipmentPane_equipment} from './__generated__/EquipmentPane_equipment.graphql';

import List from '@fbcmobile/ui/Components/List';
import ListItem from '@fbcmobile/ui/Components/ListItem';
import NavigationService from '@fbcmobile/ui/Services/NavigationService';
import React from 'react';
import Text from '@fbcmobile/ui/Components/Core/Text';
import fbt from 'fbt';
import {Colors} from '@fbcmobile/ui/Theme';
import {Screens} from 'Platform/Screens/ScreensConsts';
import {StyleSheet, View} from 'react-native';
import {createFragmentContainer} from 'react-relay-offline';

const graphql = require('babel-plugin-relay/macro');

type Props = {
  +equipment: EquipmentPane_equipment,
};

const EquipmentPane = (props: Props) => {
  const {equipment} = props;
  return (
    <View style={styles.root}>
      {equipment.length === 0 && (
        <View style={styles.noResults}>
          <View>
            <Text color="gray">
              <fbt desc="Empty state placeholder text that appears when no equipment has been added in association with a particular site.">
                No equipment has been added to this site.
              </fbt>
            </Text>
          </View>
        </View>
      )}
      <List>
        {equipment.map(equipment => (
          <ListItem
            key={equipment.id}
            id={equipment.id}
            onItemClicked={() =>
              NavigationService.navigate(Screens.EquipmentScreen, {
                id: equipment.id,
              })
            }>
            <View style={styles.textContainer}>
              <Text style={styles.equipmentText}>{equipment.name}</Text>
              <Text style={styles.typeText} variant="h6">
                {equipment.equipmentType.name}
              </Text>
            </View>
          </ListItem>
        ))}
      </List>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    flexGrow: 1,
    paddingLeft: 20,
  },
  noResults: {
    alignSelf: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingBottom: 16,
  },
  equipmentText: {
    marginRight: 8,
    color: Colors.Blue,
    fontWeight: '500',
  },
  typeText: {
    color: Colors.Gray60,
  },
});

export default createFragmentContainer(EquipmentPane, {
  equipment: graphql`
    fragment EquipmentPane_equipment on Equipment @relay(plural: true) {
      id
      name
      equipmentType {
        name
      }
    }
  `,
});
