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
import type {PlatformLoginScreenUserQueryResponse} from 'Platform/Screens/__generated__/PlatformLoginScreenUserQuery.graphql.js';

import AppContext from 'Platform/Context/AppContext';
import AppManager from 'Platform/Services/AppManager';
import LocalStorage from 'Platform/Services/LocalStorage';
import NavigationService from '@fbcmobile/ui/Services/NavigationService';
import PasswordTextInput from '@fbcmobile/ui/Components/PasswordTextInput';
import React, {useContext, useEffect, useState} from 'react';
import RelayEnvironment from 'Platform/Relay/RelayEnvironment.js';
import SplashScreen from '@fbcmobile/ui/Screens/SplashScreen';
import UserActionLogger from '@fbcmobile/ui/Logging/UserActionLogger';
import fbt from 'fbt';
import {ApplicationStyles, Colors} from '@fbcmobile/ui/Theme';
import {Button, Image, StyleSheet, Text, View} from 'react-native';
import {ERROR} from 'Platform/Consts/UserActionEvents';
import {Images} from 'Platform/Theme';
import {Screens} from 'Platform/Screens/ScreensConsts';
import {TextInput} from 'react-native';
import {fetchQuery} from 'relay-runtime';
import {loginService} from 'Platform/Services/Login';

const graphql = require('babel-plugin-relay/macro');

const userQuery = graphql`
  query PlatformLoginScreenUserQuery {
    me {
      user {
        id
        distanceUnit
      }
    }
  }
`;

type Props = NavigationNavigatorProps<{}, {params: {}}>;

const PlatformLoginScreen = ({navigation}: Props) => {
  const context = useContext(AppContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tenant, setTenant] = useState('');
  const [loading, setLoading] = useState(true);

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
    loginService
      .login({
        tenant,
        email,
        password,
      })
      .then(success => {
        if (success) {
          return fetchQuery(RelayEnvironment, userQuery, {});
        }
        setLoading(false);
        NavigationService.alert(
          'error',
          fbt('Login Failed', 'Login failed message'),
          fbt(
            'Please check your credentials and try again.',
            'Error message shown when an error occurred while the user was logging in',
          ),
        );
        return;
      })
      .then((response: ?PlatformLoginScreenUserQueryResponse) => {
        const id = response?.me?.user?.id;
        if (id == null) {
          // this should never happen
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
      .catch((error: Error) => {
        setLoading(false);
        UserActionLogger.logError({
          key: ERROR.ERROR_FETCH_QUERY,
          errorMessage: `fetchQuery failed for query PlatformLoginScreenUserQuery: ${error.toString()}`,
        });
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
        <Text style={styles.title}>Symphony</Text>
      </View>
      <View>
        <TextInput
          style={ApplicationStyles.textInput}
          placeholder={fbt('Email', 'Text input placeholder text').toString()}
          autoCompleteType="email"
          keyboardType="email-address"
          value={email ? email : ''}
          onChangeText={email => setEmail(email)}
        />
        <PasswordTextInput onChangeText={password => setPassword(password)} />
        <Text style={ApplicationStyles.disabledTextInput}>{tenant}</Text>
      </View>
      <View style={styles.actionButton}>
        <Button
          title={fbt('Log In', 'Log in button text').toString()}
          disabled={loading}
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
    fontWeight: 'bold',
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

export default PlatformLoginScreen;
