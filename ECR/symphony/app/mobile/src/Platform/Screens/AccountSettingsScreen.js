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
  DistanceUnit,
  UserPreferencesMutationVariables,
} from 'Platform/Relay/Mutations/__generated__/UserPreferencesMutation.graphql.js';
import type {NavigationDrawerProp} from 'react-navigation-drawer';
import type {NavigationScreenConfig} from 'react-navigation';

import AppContext, {distUnitOptions} from 'Platform/Context/AppContext';
import Button from '@fbcmobile/ui/Components/Core/Button';
import Colors from '@fbcmobile/ui/Theme/Colors';
import LocalStorage from 'Platform/Services/LocalStorage';
import NavigationService from '@fbcmobile/ui/Services/NavigationService';
import React, {useContext, useEffect, useState} from 'react';
import Text from '@fbcmobile/ui/Components/Core/Text';
import Toolbar from '@fbcmobile/ui/Components/Toolbar';
import UserPreferencesMutation from 'Platform/Relay/Mutations/UserPreferencesMutation';
import fbt from 'fbt';
import nullthrows from 'nullthrows';
import {RadioButton} from 'react-native-material-ui';
import {Screens} from 'Platform/Screens/ScreensConsts';
import {ScrollView, StyleSheet, View} from 'react-native';

type Props = {+navigation: NavigationDrawerProp<{params: {}}>};

const AccountSettingsScreen = (props: Props) => {
  const context = useContext(AppContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [distUnit, setDistUnit] = useState<DistanceUnit>(
    distUnitOptions.KILOMETER,
  );
  const [changedState, setChangedState] = useState(false);
  const isDisabled = isSubmitting || !changedState;

  const onSelectOption = (value: DistanceUnit) => {
    return (checked: boolean) => {
      setDistUnit(selectedValue => (checked ? value : selectedValue));
      setChangedState(value !== distUnit);
    };
  };

  const applySettings = async () => {
    const userPreferences = {
      distUnit: distUnit,
    };
    await LocalStorage.setUserPreferences(userPreferences);
    context.setUserPreferences(userPreferences);
    setIsSubmitting(true);
    const variables: UserPreferencesMutationVariables = {
      input: {
        id: nullthrows(context.user).id,
        distanceUnit: distUnit,
      },
    };

    const callbacks = {
      onCompleted: () => {
        setIsSubmitting(false);
      },
      onError: _error => {
        setIsSubmitting(false);
        NavigationService.alert(
          'error',
          fbt(
            'Error changing user preferences',
            'Error message title shown when there was an error changing user preferences.',
          ),
          fbt(
            'There was an error changing user preferences, please try again later',
            'Error message shown when changing user preferences failed.',
          ),
        );
      },
    };

    UserPreferencesMutation(variables, callbacks);
  };

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('didFocus', () => {
      _setLastSettingsInfo();
    });

    _setLastSettingsInfo();

    return () => {
      unsubscribe.remove();
    };
  }, [props.navigation]);

  const _setLastSettingsInfo = () => {
    LocalStorage.getUserPreferences().then(params => {
      if (params.distUnit) {
        setDistUnit(params.distUnit);
      }
    });
  };

  const distUnitToFbtString = (value: DistanceUnit) => {
    return value === distUnitOptions.KILOMETER
      ? fbt(
          'Kilometer',
          'Radio button label showing the kilometer metric unit of measurement',
        ).toString()
      : fbt(
          'Mile',
          'Radio button label showing the miles metric unit of measurement',
        ).toString();
  };

  return (
    <Toolbar
      onIconClicked={() => {
        if (props.navigation.openDrawer) {
          props.navigation.openDrawer();
          return;
        }
        throw new Error(
          fbt(
            'Menu not available',
            "Error message that appears when a user tries to navigate to the app's main menu and it is not available",
          ),
        );
      }}
      title={fbt('Account Settings', 'Account Settings page title').toString()}
      searchable={false}
      onSearchClicked={() => {}}>
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <Text style={styles.header}>
            <fbt desc="User Preferences header title">Distance Unit</fbt>
          </Text>
          {Object.keys(distUnitOptions).map(value => (
            <RadioButton
              style={styles.radioButton}
              key={value}
              label={distUnitToFbtString(value)}
              checked={distUnit === value}
              value={value}
              onSelect={onSelectOption(value)}
            />
          ))}
        </ScrollView>
        <Button
          style={styles.button}
          disabled={isDisabled}
          onPress={() => applySettings()}>
          <Text style={styles.buttonText}>
            <fbt desc="Title of button that save the settings">
              Apply Settings
            </fbt>
          </Text>
        </Button>
        <Button
          style={styles.deactivateButton}
          onPress={() =>
            NavigationService.push(Screens.DeactivateAccountScreen)
          }>
          <Text style={styles.buttonText}>
            <fbt desc="Title of button that navigates to Deativate Account screen">
              Deactivate account
            </fbt>
          </Text>
        </Button>
      </View>
    </Toolbar>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.BackgroundWhite,
    paddingHorizontal: 20,
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    color: Colors.Black,
  },
  radioButton: {
    margin: 100,
  },
  button: {
    marginBottom: 20,
  },
  deactivateButton: {
    backgroundColor: Colors.BrightRed,
  },
  scrollView: {
    flexGrow: 1,
    marginBottom: 20,
  },
  buttonText: {
    color: Colors.White,
  },
});

const options: NavigationScreenConfig<*> = {
  headerShown: false,
  headerTitle: '',
};

AccountSettingsScreen.navigationOptions = options;

export default AccountSettingsScreen;
