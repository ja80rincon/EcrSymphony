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

import type {AuthParams} from 'Platform/Services/LocalStorage';
import type {NavigationDrawerProp} from 'react-navigation-drawer';

import AppContext from 'Platform/Context/AppContext';
import LocalStorage from 'Platform/Services/LocalStorage';
import NavigationService from '@fbcmobile/ui/Services/NavigationService';
import React, {useContext, useEffect, useState} from 'react';
import Text from '@fbcmobile/ui/Components/Core/Text';
import UserActionLogger from '@fbcmobile/ui/Logging/UserActionLogger';
import VersionNumber from 'react-native-version-number';
import fbt from 'fbt';
import {Colors} from '@fbcmobile/ui/Theme';
import {DrawerActions} from 'react-navigation-drawer';
import {ERROR} from 'Platform/Consts/UserActionEvents';
import {ListItem} from 'react-native-material-ui';
import {NavigationActions} from '@react-navigation/core';
import {Screens} from 'Platform/Screens/ScreensConsts';
import {StyleSheet} from 'react-native';
import {View, YellowBox} from 'react-native';
import {loginService} from '../Services/Login';

type Props = {+navigation: NavigationDrawerProp<{}>};

const SideMenu = ({navigation}: Props) => {
  const context = useContext(AppContext);
  const [tenant, setTenant] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  useEffect(() => {
    YellowBox.ignoreWarnings(['Warning: componentWillReceiveProps']);
    LocalStorage.getAuthParams()
      .then((authParams: AuthParams) => {
        setTenant(authParams.tenant || '');
        setEmail(authParams.email || '');
      })
      .catch((error: Error) => {
        NavigationService.alert(
          'error',
          fbt(
            'You were logged out. Please restart the app and log back in.',
            'Error shown in an alert when loading the user info failed.',
          ),
        );
        UserActionLogger.logError({
          key: ERROR.ERROR_FETCHING_SIDE_MENU_USER_INFO,
          errorMessage: error.message,
        });
      });
  }, []);

  const navigateToScreen = (route: string) => {
    navigation.dispatch(DrawerActions.closeDrawer({}));
    const navigateAction = NavigationActions.navigate({
      routeName: route,
    });
    navigation.dispatch(navigateAction);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text
          style={{letterSpacing: 0.5}}
          variant="h3"
          weight="bold"
          color="regular">
          {tenant}
        </Text>
        <Text variant="h3">{email}</Text>
      </View>
      <View>
        <ListItem
          style={styles.primaryText}
          leftElement="work"
          centerElement={fbt(
            'Work Orders',
            'Item on a navigation menu - tapping it shows the user the work orders that are assigned to them',
          ).toString()}
          onPress={() => navigateToScreen(Screens.MyTasks)}
        />
        <ListItem
          style={styles.primaryText}
          leftElement="history"
          centerElement={fbt(
            'Closed Work Orders',
            'Item on a navigation menu - tapping it shows the user the tasks that are closed',
          ).toString()}
          onPress={() => navigateToScreen(Screens.ClosedWorkOrders)}
        />
        <ListItem
          style={styles.primaryText}
          leftElement="near-me"
          centerElement={fbt(
            'Nearby Sites',
            'Item on navigation menu. When tapped, it shows user locations of nearby work sites',
          ).toString()}
          onPress={() => navigateToScreen(Screens.PlatformLocations)}
        />
        <ListItem
          style={styles.primaryText}
          leftElement="account-circle"
          centerElement={fbt(
            'Account Settings',
            'Item on a navigation menu - tapping it shows user their account settings',
          ).toString()}
          onPress={() => navigateToScreen(Screens.AccountSettings)}
        />
        <ListItem
          style={styles.primaryText}
          leftElement="exit-to-app"
          centerElement={fbt('Log Out', 'Log out button').toString()}
          onPress={() =>
            loginService.logout().then(success => {
              if (success) {
                context.clearUser();
                navigation.navigate(Screens.Navigators.PlatformAuth);
              } else {
                NavigationService.alert(
                  'error',
                  fbt(
                    'Something went wrong while logging out. Please try again later.',
                    'An error message that appears when a user tries to log out of the app and it does not work.',
                  ),
                );
              }
            })
          }
        />
      </View>
      <View style={styles.footer}>
        <Text variant="h7" color="gray">
          <fbt desc="App version number">
            Version:
            <fbt:param name="App version value">
              {VersionNumber.appVersion}
            </fbt:param>
          </fbt>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    padding: 15,
    paddingVertical: 40,
  },
  primaryText: {
    color: Colors.Gray70,
    letterSpacing: 0.5,
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: 20,
  },
});

export default SideMenu;
