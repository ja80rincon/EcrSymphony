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

import type {NavigationNavigatorProps} from 'react-navigation';
import type {SharedWebCredentials} from 'react-native-keychain';

import * as Keychain from 'react-native-keychain';
import AppManager from 'Platform/Services/AppManager';
import LocalStorage from 'Platform/Services/LocalStorage';
import NavigationService from '@fbcmobile/ui/Services/NavigationService';
import React, {useEffect, useState} from 'react';
import SplashScreen from '@fbcmobile/ui/Screens/SplashScreen';
import fbt from 'fbt';
import {ApplicationStyles, Colors} from '@fbcmobile/ui/Theme';
import {Button, Image, StyleSheet, Text, View} from 'react-native';
import {Images} from 'Platform/Theme';
import {Screens} from 'Platform/Screens/ScreensConsts';
import {TextInput} from 'react-native';
import {loginService} from 'Platform/Services/Login';

type Props = NavigationNavigatorProps<{}, {params: {}}>;

const PlatformTenantLoginScreen = ({navigation}: Props) => {
  const [tenant, setTenant] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    _checkAlreadyLoggedIn()
      .then(tenant => {
        AppManager.setupUserActionLogger();
        if (tenant) {
          navigation.navigate(Screens.Navigators.PlatformNavigator);
        } else {
          setLoading(false);
        }
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, [navigation]);

  const _checkAlreadyLoggedIn = async (): Promise<?string> => {
    const tenant = await LocalStorage.getTenant();
    if (!tenant) {
      return null;
    }
    const keystore:
      | false
      | SharedWebCredentials = await Keychain.getGenericPassword();
    if (keystore) {
      const tokens = JSON.parse(keystore.password);
      if (
        tokens.refresh_token &&
        !loginService.isTokenExpired(tokens.refresh_expiration_in_ms)
      ) {
        return tenant;
      }
    }
    const loggedInTenant = await loginService.loggedIn();
    if (!loggedInTenant) {
      return null;
    }
    return tenant;
  };

  const getAuthConfig = async () => {
    if (!tenant) {
      setLoading(false);
      NavigationService.alert(
        'error',
        fbt(
          'Company required',
          'Error message shown when the user tried to login without providing a company',
        ),
        fbt(
          'Please verify the Company field has been entered correctly.',
          'Error message shown when the user tried to login without providing a company',
        ),
      );
      return;
    }

    loginService
      .getAuthConfig(tenant)
      .then(ssoEnabled => {
        setLoading(false);
        if (!ssoEnabled) {
          navigation.navigate('PlatformLoginScreen');
        } else {
          navigation.navigate('PlatformKeycloakLoginScreen');
        }
      })
      .catch(() => {
        setLoading(false);
        NavigationService.alert(
          'error',
          fbt(
            'Network Issue',
            'Error message shown when the user tried to login without a network connection',
          ),
          fbt(
            'There was an error communicating with the server.  Please verify your network connection and try again.',
            'Error message shown when the user tried to login without providing a company',
          ),
        );
      });
  };

  return loading ? (
    <SplashScreen />
  ) : (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          style={styles.logo}
          source={Images.symphony}
          resizeMode={'contain'}
        />
        <Text style={styles.title}>Symphony</Text>
      </View>
      <View>
        <TextInput
          style={ApplicationStyles.textInput}
          placeholder={fbt(
            'Company or Hostname',
            'Placeholder text in a form field. "Company" is the company you work for or "Hostname" is the URL host of the backend.',
          ).toString()}
          value={tenant ? tenant : ''}
          onChangeText={tenant => setTenant(tenant)}
        />
      </View>
      <View style={styles.actionButton}>
        <Button
          title={fbt(
            'Next',
            'Text of the button that triggers an auth configuration request before navigating to the next screen',
          ).toString()}
          color={Colors.Blue}
          onPress={() => {
            setLoading(true);
            getAuthConfig();
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    paddingTop: 40,
    justifyContent: 'flex-start',
  },
  title: {
    fontWeight: 'bold',
    paddingTop: 20,
  },
  loading: {
    alignItems: 'center',
  },
  actionButton: {
    paddingTop: 20,
  },
  logoContainer: {
    width: '100%',
    height: 135,
    alignItems: 'center',
    paddingBottom: 60,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
});

export default PlatformTenantLoginScreen;
