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

import type {NavigationScreenConfig} from 'react-navigation';

import AppManager from 'Platform/Services/AppManager';
import AppNavigator from 'Platform/AppNavigator';
import DropdownAlert from 'react-native-dropdownalert';
import LoadingBackdropContextProvider from '@fbcmobile/ui/Components/Core/LoadingBackdropContextProvider';
import NavigationService from '@fbcmobile/ui/Services/NavigationService';
import OfflineBanner from '@fbcmobile/ui/Components/OfflineBanner';
import React, {useEffect, useState} from 'react';
import SplashScreen from '@fbcmobile/ui/Screens/SplashScreen';
import {AppContextProvider} from 'Platform/Context/AppContext';
import {ApplicationStyles, Colors, MaterialUITheme} from '@fbcmobile/ui/Theme';
import {ThemeContext, getTheme} from 'react-native-material-ui';
import {View} from 'react-native';
import {WorkOrderChecklistCacheContextProvider} from 'Platform/Screens/WorkOrder/WorkOrderChecklistCacheContext';

// Kick off fetching as early as possible
const initPromise = AppManager.initApp();

const RootScreen = () => {
  const [isDataLoaded, setIsDataLoaded] = useState<boolean>(false);

  useEffect(() => {
    initPromise.then(_ => {
      setIsDataLoaded(true);
    });
  }, []);

  if (!isDataLoaded) {
    return <SplashScreen />;
  }

  return (
    <View style={ApplicationStyles.screen.container}>
      <AppContextProvider>
        <ThemeContext.Provider value={getTheme(MaterialUITheme)}>
          <LoadingBackdropContextProvider>
            <OfflineBanner />
            <WorkOrderChecklistCacheContextProvider>
              <AppNavigator
                // Initialize the NavigationService (see https://reactnavigation.org/docs/en/navigating-without-navigation-prop.html)
                ref={navigatorRef => {
                  NavigationService.setTopLevelNavigator(navigatorRef);
                }}
              />
            </WorkOrderChecklistCacheContextProvider>
            <DropdownAlert
              ref={ref => NavigationService.setDropDownAlert(ref)}
              successColor={Colors.Green}
              errorColor={Colors.Red}
              infoColor={Colors.Blue}
              updateStatusBar={false}
              useNativeDriver={true}
            />
          </LoadingBackdropContextProvider>
        </ThemeContext.Provider>
      </AppContextProvider>
    </View>
  );
};

const options: NavigationScreenConfig<*> = {headerShown: false};
RootScreen.options = options;
export default RootScreen;
