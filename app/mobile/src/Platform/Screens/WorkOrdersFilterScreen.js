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

import type {
  NavigationNavigatorProps,
  NavigationScreenConfig,
} from 'react-navigation';
import type {RelayStoreUtilsWorkOrdersQueryVariables} from 'Platform/Relay/__generated__/RelayStoreUtilsWorkOrdersQuery.graphql.js';

import Colors from '@fbcmobile/ui/Theme/Colors';
import NavigationService from '@fbcmobile/ui/Services/NavigationService';
import React, {useState} from 'react';
import fbt from 'fbt';
import {Button, Picker, StyleSheet, Text, View} from 'react-native';
import {Checkbox} from 'react-native-material-ui';
import {Screens} from 'Platform/Screens/ScreensConsts';
import {ScrollView} from 'react-native-gesture-handler';
import {WorkOrderPriorities, WorkOrderStatuses} from './WorkOrdersSearchScreen';

type Props = NavigationNavigatorProps<
  {},
  {
    params: {
      filters: RelayStoreUtilsWorkOrdersQueryVariables,
      sortOption: string,
    },
  },
>;

const WorkOrdersFilterScreen = (props: Props) => {
  const {navigation} = props;
  const [selectedSort, setSelectedSort] = useState(
    navigation.state.params.sortOption,
  );
  const [status, setStatus] = useState<Array<string>>(
    navigation.state.params.filters[1].stringSet,
  );
  const [priority, setPriority] = useState<Array<string>>(
    navigation.state.params.filters[2].stringSet,
  );

  const onSelectOption = (value: string, filter: string) => (
    checked: boolean,
  ) => {
    if (filter === 'status') {
      setStatus(selectedValues => {
        return checked
          ? [...selectedValues, value]
          : selectedValues.filter(v => v !== value);
      });
    } else if (filter === 'priority') {
      setPriority(selectedValues => {
        return checked
          ? [...selectedValues, value]
          : selectedValues.filter(v => v !== value);
      });
    }
  };

  return (
    <View style={styles.root}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.header}>
          <fbt desc="Header title for advanced filter screen">Status</fbt>
        </Text>
        {Object.keys(WorkOrderStatuses).map(value => (
          <Checkbox
            key={value}
            label={fbt(
              fbt.param('status value', value),
              'Status checkbox label',
            ).toString()}
            value={fbt(
              fbt.param('status value', value),
              'Status checkbox value',
            ).toString()}
            checked={status.includes(value)}
            onCheck={onSelectOption(value, 'status')}
          />
        ))}

        <Text style={styles.header}>
          <fbt desc="Header title for advanced filter screen">Priority</fbt>
        </Text>
        {Object.keys(WorkOrderPriorities).map(value => (
          <Checkbox
            key={value}
            label={fbt(
              fbt.param('priority value', value),
              'Priority checkbox label',
            ).toString()}
            value={fbt(
              fbt.param('priority value', value),
              'Priority checkbox value',
            ).toString()}
            checked={priority.includes(value)}
            onCheck={onSelectOption(value, 'priority')}
          />
        ))}
        <Text style={styles.header}>
          <fbt desc="Header title for advanced filter screen">Sort By</fbt>
        </Text>
        <Picker
          selectedValue={selectedSort}
          style={styles.picker}
          mode="dropdown"
          onValueChange={itemValue => setSelectedSort(itemValue)}>
          <Picker.Item
            label={fbt(
              'Name',
              'Filtering option that allows user to filter by name',
            ).toString()}
            value={fbt(
              'Name',
              'Filtering option that allows user to filter by name',
            ).toString()}
          />
          <Picker.Item
            label={fbt('Status', 'Label for sorting by status').toString()}
            value={fbt(
              'Status',
              'Filtering option that allows user to filter by status',
            ).toString()}
          />
          <Picker.Item
            label={fbt(
              'Priority',
              'Filtering option that allows user to filter by priority',
            ).toString()}
            value={fbt(
              'Priority',
              'Filtering option that allows user to filter by priority',
            ).toString()}
          />
        </Picker>
      </ScrollView>
      <Button
        title={fbt('Filter', 'Filter button title').toString()}
        onPress={() => {
          NavigationService.navigate(Screens.WorkOrdersSearchScreen, {
            status: status,
            priority: priority,
            sortOption: selectedSort,
          });
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.BackgroundWhite,
  },
  header: {
    margin: 10,
    color: Colors.Black,
    fontSize: 15,
  },
  picker: {
    height: 50,
    width: 250,
  },
  scrollView: {
    flexGrow: 1,
  },
});

const options: NavigationScreenConfig<*> = {
  headerShown: true,
  headerTitle: fbt(
    'Advanced Filter',
    'Work Order Search Advanced Filter screen title',
  ).toString(),
};

WorkOrdersFilterScreen.navigationOptions = options;

export default WorkOrdersFilterScreen;
