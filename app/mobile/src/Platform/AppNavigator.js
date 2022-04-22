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

import AccountSettingsScreen from 'Platform/Screens/AccountSettingsScreen';
import BugReportScreen from '@fbcmobile/ui/Screens/BugReportScreen';
import CellScanScreen from 'Platform/Screens/Location/CellScanScreen';
import ClosedWorkOrdersScreen from 'Platform/Screens/ClosedWorkOrdersScreen';
import DeactivateAccountScreen from 'Platform/Screens/DeactivateAccountScreen';
import EquipmentListScreen from 'Platform/Screens/Location/EquipmentListScreen';
import EquipmentPositionsListScreen from 'Platform/Screens/Equipment/EquipmentPositionsListScreen';
import EquipmentPropertiesListScreen from 'Platform/Screens/Equipment/EquipmentPropertiesListScreen';
import EquipmentScreen from 'Platform/Screens/EquipmentScreen';
import LocationDocumentsScreen from 'Platform/Screens/Location/LocationDocumentsScreen';
import LocationPropertiesListScreen from 'Platform/Screens/Location/PropertiesListScreen';
import LocationScreen from 'Platform/Screens/LocationScreen';
import LocationsScreen from 'Platform/Screens/LocationsScreen';
import LocationsSearchScreen from 'Platform/Screens/LocationsSearchScreen';
import MyTasksScreen from 'Platform/Screens/MyTasksScreen';
import PlatformKeycloakLoginScreen from 'Platform/Screens/PlatformKeycloakLoginScreen';
import PlatformLoginScreen from 'Platform/Screens/PlatformLoginScreen';
import PlatformTenantLoginScreen from 'Platform/Screens/PlatformTenantLoginScreen';
import SideMenu from 'Platform/Components/SideMenu';
import SiteSurveyListScreen from 'Platform/Screens/Location/SiteSurveyListScreen';
import SiteSurveysScreen from 'Platform/Screens/SiteSurveysScreen';
import SplashScreen from '@fbcmobile/ui/Screens/SplashScreen';
import SurveyCategoriesScreen from 'Platform/Screens/Location/SurveyCategoriesScreen';
import SurveyDoneScreen from 'Platform/Screens/Location/SurveyDoneScreen';
import SurveyQuestionsScreen from 'Platform/Screens/Location/SurveyQuestionsScreen';
import WorkOrderChecklistCategoryScreen from 'Platform/Screens/WorkOrder/WorkOrderChecklistCategoryScreen';
import WorkOrderChecklistScreen from 'Platform/Screens/WorkOrder/WorkOrderChecklistScreen';
import WorkOrderCommentsScreen from 'Platform/Screens/WorkOrder/WorkOrderCommentsScreen';
import WorkOrderDocumentsScreen from 'Platform/Screens/WorkOrder/WorkOrderDocumentsScreen';
import WorkOrderPropertiesListScreen from 'Platform/Screens/WorkOrder/WorkOrderPropertiesListScreen';
import WorkOrderScreen from 'Platform/Screens/WorkOrderScreen';
import WorkOrdersFilterScreen from 'Platform/Screens/WorkOrdersFilterScreen';
import WorkOrdersSearchScreen from 'Platform/Screens/WorkOrdersSearchScreen';
import {Colors} from '@fbcmobile/ui/Theme';
import {Dimensions} from 'react-native';
import {createAppContainer} from '@react-navigation/native';
import {createDrawerNavigator} from 'react-navigation-drawer';
import {createStackNavigator} from 'react-navigation-stack';
import {createSwitchNavigator} from '@react-navigation/core';

const defaultNavigationOptions = {
  headerStyle: {
    elevation: 0, // remove shadow on Android
    shadowOpacity: 0, // remove shadow on iOS
    backgroundColor: Colors.BackgroundWhite,
  },
  headerTintColor: Colors.BlueGray,
};

const PlatformAuth = createStackNavigator(
  {
    PlatformTenantLoginScreen,
    PlatformKeycloakLoginScreen,
    PlatformLoginScreen,
  },
  {headerMode: 'none'},
);

const CommonRoutes = {
  LocationScreen,
  LocationsSearchScreen,
  EquipmentScreen,
  EquipmentListScreen,
  SiteSurveyListScreen,
  CellScanScreen,
  SurveyQuestionsScreen,
  SurveyCategoriesScreen,
  SurveyDoneScreen,
  LocationPropertiesListScreen,
  EquipmentPropertiesListScreen,
  EquipmentPositionsListScreen,
  LocationDocumentsScreen,
  WorkOrderScreen,
  WorkOrderChecklistScreen,
  WorkOrderPropertiesListScreen,
  WorkOrderDocumentsScreen,
  WorkOrderChecklistCategoryScreen,
  WorkOrderCommentsScreen,
  BugReportScreen,
  WorkOrdersSearchScreen,
  WorkOrdersFilterScreen,
  ClosedWorkOrdersScreen,
};

const PlatformLocations = createStackNavigator(
  {
    LocationsScreen,
    ...CommonRoutes,
  },
  {
    defaultNavigationOptions: defaultNavigationOptions,
    headerMode: 'screen',
  },
);

const SiteSurveyLocations = createStackNavigator(
  {
    SiteSurveysScreen,
    ...CommonRoutes,
  },
  {
    defaultNavigationOptions: defaultNavigationOptions,
    headerMode: 'screen',
  },
);

const MyTasks = createStackNavigator(
  {
    MyTasksScreen,
    ...CommonRoutes,
  },
  {
    defaultNavigationOptions: defaultNavigationOptions,
    headerMode: 'screen',
  },
);

const ClosedWorkOrders = createStackNavigator(
  {
    ClosedWorkOrdersScreen,
    ...CommonRoutes,
  },
  {
    defaultNavigationOptions: defaultNavigationOptions,
    headerMode: 'screen',
  },
);

const AccountSettings = createStackNavigator(
  {
    AccountSettingsScreen,
    DeactivateAccountScreen,
  },
  {
    defaultNavigationOptions: defaultNavigationOptions,
  },
);

const PlatformNavigator = createDrawerNavigator(
  {
    MyTasks,
    ClosedWorkOrders,
    PlatformLocations,
    SiteSurveyLocations,
    AccountSettings,
  },
  {
    defaultNavigationOptions: defaultNavigationOptions,
    drawerWidth: Dimensions.get('window').width * 0.75,
    contentComponent: SideMenu,
  },
);

const AppNavigator = createSwitchNavigator(
  {
    // Create the application routes here (the key is the route name, the value is the
    // target screen)
    // See https://reactnavigation.org/docs/en/stack-navigator.html#routeconfigs
    SplashScreen,
    PlatformAuth,
    PlatformNavigator,
  },
  {
    initialRouteName: 'PlatformAuth',
  },
);

export default createAppContainer<*, *>(AppNavigator);
