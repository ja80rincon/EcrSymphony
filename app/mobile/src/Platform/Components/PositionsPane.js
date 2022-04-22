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

import type {PositionsPane_positionDefinitions} from './__generated__/PositionsPane_positionDefinitions.graphql';
import type {PositionsPane_positions} from './__generated__/PositionsPane_positions.graphql';

import List from '@fbcmobile/ui/Components/List';
import ListItem from '@fbcmobile/ui/Components/ListItem';
import NavigationService from '@fbcmobile/ui/Services/NavigationService';
import React, {useCallback, useMemo} from 'react';
import Text from '@fbcmobile/ui/Components/Core/Text';
import {Screens} from 'Platform/Screens/ScreensConsts';
import {View} from 'react-native';
import {createFragmentContainer} from 'react-relay-offline';

const graphql = require('babel-plugin-relay/macro');

type Props = {
  +positions: PositionsPane_positions,
  +positionDefinitions: PositionsPane_positionDefinitions,
};

const PositionsPane = (props: Props) => {
  const {positions, positionDefinitions} = props;

  const getNonInstancePositionDefinitions = useCallback(
    (positions, positionDefinitions) => {
      const definitionIds = positions.map(p => p.definition.id);
      return positionDefinitions.filter(def => !definitionIds.includes(def.id));
    },
    [],
  );

  const positionsToDisplay = useMemo(
    () => [
      ...positions.map(p => ({
        id: p.id,
        name: p.definition.name,
        attachedEquipmentName: p.attachedEquipment?.name ?? null,
        onClick: () =>
          p.attachedEquipment &&
          NavigationService.navigate(Screens.EquipmentScreen, {
            id: p.attachedEquipment.id,
          }),
      })),
      ...getNonInstancePositionDefinitions(positions, positionDefinitions).map(
        p => ({
          id: p.id,
          name: p.name,
          attachedEquipmentName: null,
        }),
      ),
    ],
    [positions, positionDefinitions, getNonInstancePositionDefinitions],
  );
  return (
    <List style={styles.root}>
      {positionsToDisplay.map(p => (
        <ListItem
          key={p.id}
          id={p.id}
          onItemClicked={() => p.onClick && p.onClick()}>
          <View style={styles.position}>
            <Text>{p.name}: </Text>
            <Text color={p.attachedEquipmentName ? 'regular' : 'gray'}>
              {p.attachedEquipmentName ?? 'None'}
            </Text>
          </View>
        </ListItem>
      ))}
    </List>
  );
};

const styles = {
  root: {
    paddingLeft: 20,
  },
  position: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 16,
  },
};

export default createFragmentContainer(PositionsPane, {
  positions: graphql`
    fragment PositionsPane_positions on EquipmentPosition @relay(plural: true) {
      id
      definition {
        id
        name
        index
        visibleLabel
      }
      attachedEquipment {
        id
        name
      }
      parentEquipment {
        id
      }
    }
  `,
  positionDefinitions: graphql`
    fragment PositionsPane_positionDefinitions on EquipmentPositionDefinition
      @relay(plural: true) {
      id
      name
      index
      visibleLabel
    }
  `,
});
