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
import type {PlatformKeycloakLoginScreenUserQueryResponse} from 'Platform/Screens/__generated__/PlatformKeycloakLoginScreenUserQuery.graphql.js';

import AppContext from 'Platform/Context/AppContext';
import AppManager from 'Platform/Services/AppManager';
import LocalStorage from 'Platform/Services/LocalStorage';
import Login from 'react-native-login-keycloak';
import NavigationService from '@fbcmobile/ui/Services/NavigationService';
import PasswordTextInput from '@fbcmobile/ui/Components/PasswordTextInput';
import React, {useContext, useEffect, useState} from 'react';
import RelayEnvironment from 'Platform/Relay/RelayEnvironment.js';
import SplashScreen from '@fbcmobile/ui/Screens/SplashScreen';
import fbt from 'fbt';
import {ApplicationStyles, Colors} from '@fbcmobile/ui/Theme';
import {Button, Image, StyleSheet, View} from 'react-native';
import {CLIENT_ID, KC_AUTH_URI, loginService} from 'Platform/Services/Login';
import {Images} from 'Platform/Theme';
import {Screens} from 'Platform/Screens/ScreensConsts';
import {TextInput} from 'react-native';
import {fetchQuery} from 'relay-runtime';

const graphql = require('babel-plugin-relay/macro');

const userQuery = graphql`
  query PlatformKeycloakLoginScreenUserQuery {
    me {
      user {
        id
        distanceUnit
      }
    }
  }
`;

type Props = NavigationNavigatorProps<{}, {params: {}}>;

const PlatformKeycloakLoginScreen = ({navigation}: Props) => {
  const context = useContext(AppContext);
  const [email, setEmail] = useState<?string>('');
  const [password, setPassword] = useState<?string>('');
  const [tenant, setTenant] = useState<?string>('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(false);
    _setLastAuthInfo();
  }, []);

  const _setLastAuthInfo = () => {
    LocalStorage.getAuthParams().then(params => {
      if (params) {
        setEmail(params.email);
        setTenant(params.tenant);
      }
    });
  };

  const _alertOnError = () => {
    NavigationService.alert(
      'error',
      fbt('Error', 'Error occured'),
      fbt(
        'A navigation error occurred. Please restart the app and try again.',
        'Error message that appears when the app tries opening a screen that does not exist.',
      ),
    );
  };

  const login = async () => {
    if (!email || !tenant || !password) {
      setLoading(false);
      NavigationService.alert(
        'error',
        fbt(
          'All fields required',
          'Error message shown when the user tried to login without providing an email, password, or company',
        ),
        fbt(
          'Please verify the Email, Password, and Company fields have been entered correctly.',
          'Error message shown when the user tried to login without providing an email, password, or company',
        ),
      );
      return;
    }
    Login.startLoginProcess({
      url: KC_AUTH_URI,
      clientId: CLIENT_ID,
      realm: tenant,
      username: email,
      password: password,
    })
      .then(tokens => {
        if (!tokens || !tokens.access_token || !tokens.refresh_token) {
          setLoading(false);
          NavigationService.alert(
            'error',
            fbt(
              'Login failed. Please try again.',
              'Error message shown when an error occurred while the user was logging in',
            ),
          );
          return;
        }
        loginService.saveKCTokens(tokens);
        return fetchQuery(RelayEnvironment, userQuery, {});
      })
      .then((response: ?PlatformKeycloakLoginScreenUserQueryResponse) => {
        const id = response?.me?.user?.id;
        if (id == null) {
          setLoading(false);
          _alertOnError();
          return;
        }
        const distanceUnit = response?.me?.user?.distanceUnit;
        try {
          context.setUser({email, tenant, id});
          LocalStorage.setAuthParams({
            tenant,
            id,
            email,
            token: null,
          });
          AppManager.setupUserActionLogger();
          LocalStorage.setTenant(tenant).then(() =>
            navigation.navigate(Screens.Navigators.PlatformNavigator),
          );
          context.setUserPreferences({distUnit: distanceUnit});
          LocalStorage.setUserPreferences({distUnit: distanceUnit});
        } catch (error) {
          setLoading(false);
          console.error(error);
          _alertOnError();
        }
      })
      .catch(() => {
        setLoading(false);
        _alertOnError();
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
      </View>
      <View>
        <TextInput
          style={ApplicationStyles.textInput}
          placeholder={fbt('Email', 'Text input placeholder text').toString()}
          autoCompleteType="email"
          keyboardType="email-address"
          value={email != null ? email : ''}
          onChangeText={email => setEmail(email)}
        />
        <PasswordTextInput onChangeText={password => setPassword(password)} />
      </View>
      <View style={styles.actionButton}>
        <Button
          title={fbt(
            'Login',
            'Text of the button that logs in to Keycloak and retrieves a set of tokens',
          ).toString()}
          color={Colors.Blue}
          onPress={() => {
            setLoading(true);
            login();
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

export default PlatformKeycloakLoginScreen;
