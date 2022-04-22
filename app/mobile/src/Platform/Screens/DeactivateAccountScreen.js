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

import type {DeactivateAccountMutationVariables} from 'Platform/Relay/Mutations/__generated__/DeactivateAccountMutation.graphql.js';
import type {NavigationScreenConfig} from 'react-navigation';

import AppContext from 'Platform/Context/AppContext';
import Button from '@fbcmobile/ui/Components/Core/Button';
import Colors from '@fbcmobile/ui/Theme/Colors';
import DeactivateAccountMutation from 'Platform/Relay/Mutations/DeactivateAccountMutation';
import NavigationService from '@fbcmobile/ui/Services/NavigationService';
import React, {useState} from 'react';
import Text from '@fbcmobile/ui/Components/Core/Text';
import fbt from 'fbt';
import nullthrows from 'nullthrows';
import {View} from 'react-native';
import {useContext} from 'react';

const DeactivateAccountScreen = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {user} = useContext(AppContext);

  const onDeactivate = () => {
    setIsSubmitting(true);
    const variables: DeactivateAccountMutationVariables = {
      input: {
        id: nullthrows(user).id,
        status: 'DEACTIVATED',
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
            'Error deactivating account',
            'Error message title shown when there was an error deactivating the account.',
          ),
          fbt(
            'There was an error deactivating this account, please try again later',
            'Error message shown when submitting a new comment failed.',
          ),
        );
      },
    };

    DeactivateAccountMutation(variables, callbacks);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header} variant="h2">
        <fbt desc="Section title explaining users what happens when they deactivate their account">
          Deactivate your account
        </fbt>
      </Text>
      <Text>
        <fbt desc="Text explaining that the account will be deactivated">
          Clicking the 'Deactivate' button below will start the process of
          deactivating your account. Once deactivated, you will no longer be
          able to log into the mobile app or the website.
        </fbt>
      </Text>
      <Text style={styles.header} variant="h2">
        <fbt desc="header for what else you should know">
          What else you should know
        </fbt>
      </Text>
      <Text>
        <fbt desc="Text stating that deactivating the account will not delete prior activity">
          Deactivating your account will not delete your data or your activities
          that have previously been saved. If you deactivate your account you
          can have it restored by contacting an administrator.
        </fbt>
      </Text>
      <Button
        style={styles.deactivateButton}
        disabled={isSubmitting}
        onPress={onDeactivate}>
        Deactivate
      </Button>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    textAlign: 'center',
  },
  divider: {
    height: 20,
    backgroundColor: Colors.White,
  },
  deactivateButton: {
    marginTop: 20,
    backgroundColor: Colors.BrightRed,
  },
};

const options: NavigationScreenConfig<*> = {
  headerShown: true,
  headerTitle: fbt(
    'Deactivate Account',
    'Deactivate Account screen title',
  ).toString(),
};

DeactivateAccountScreen.navigationOptions = options;

export default DeactivateAccountScreen;
