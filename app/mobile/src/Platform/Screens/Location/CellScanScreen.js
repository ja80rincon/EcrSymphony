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
import type {NavigationScreenConfig} from 'react-navigation';

import CellScanPane from 'Platform/Components/CellScanPane';
import Colors from '@fbcmobile/ui/Theme/Colors';
import React, {useEffect, useState} from 'react';
import fbt from 'fbt';
import nullthrows from 'nullthrows';
import {ApplicationStyles} from '@fbcmobile/ui/Theme';
import {Text} from '@99xt/first-born';
import {View} from 'react-native';

type Props = NavigationNavigatorProps<{}, {params: {locationId: string}}>;

const CellScanScreen = (props: Props) => {
  const {navigation} = props;
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const locationId = nullthrows(navigation.getParam('locationId'));

  useEffect(() => {
    const focusListener = navigation.addListener('didFocus', () => {
      setIsFocused(true);
    });

    return () => {
      focusListener.remove();
    };
  }, [navigation]);

  return (
    <View style={styles.root}>
      <Text style={ApplicationStyles.screenTitle}>
        <fbt desc="Title of the a screen. A cell scan is a process where the phone scans for the cellular signals from different providers (AT&T, Vodaphone, etc)">
          Cell Scan
        </fbt>
      </Text>
      <View style={styles.map}>
        <CellScanPane isFocused={isFocused} locationId={locationId} />
      </View>
    </View>
  );
};

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 1,
    backgroundColor: Colors.BackgroundWhite,
  },
  map: {
    position: 'relative',
    flexGrow: 1,
  },
  title: {
    lineHeight: 24,
    fontSize: 16,
    fontWeight: '500',
  },
};

const options: NavigationScreenConfig<*> = {
  headerShown: true,
  headerTitle: '',
};

CellScanScreen.navigationOptions = options;

export default CellScanScreen;
