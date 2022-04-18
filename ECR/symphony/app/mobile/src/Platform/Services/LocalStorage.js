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

import type {CellScanCollection} from 'Platform/Components/CellScanPane';
import type {DistanceUnit} from 'Platform/Relay/Mutations/__generated__/UserPreferencesMutation.graphql.js';
import type {NuxName} from 'Platform/Components/Nux/NuxConsts';
import type {SurveyCreateData} from 'Platform/Relay/Mutations/__generated__/CreateSurveyMutation.graphql.js';

import AsyncStorage from '@react-native-community/async-storage';
import {SurveyStatuses} from 'Platform/Consts/SurveyConstants';

export const KEYS = {
  TENANT: 'tenant',
  TOKEN: 'token',
  EMAIL: 'email',
  USER_ID: 'user_id',
  QUESTION: 'question',
  CELL_SCAN: 'cell_scan',
  SURVEY: 'survey',
  LOCATIONS: 'locations',
  LOCATIONTYPES_WITH_LOCATIONS: 'locationtypes_with_locations',
  WORK_ORDERS_CACHE: 'work_orders_cache',
  NUX_EVENT: 'nux_event',
  DISTANCE_UNIT: 'distance_unit',
};

export type AuthParams = {
  tenant: ?string,
  token: ?string,
  email: ?string,
  id: ?string,
};

export type UserPreferences = {
  distUnit: ?DistanceUnit,
};

const UserPreferencesToKeys = {
  distUnit: KEYS.DISTANCE_UNIT,
};

const AuthParamsToKeys = {
  tenant: KEYS.TENANT,
  token: KEYS.TOKEN,
  email: KEYS.EMAIL,
  id: KEYS.USER_ID,
};

/**
 * Tenant functions
 *
 * Passing a null value clears the tenant from local storage.
 */
async function setTenant(tenant: ?string) {
  if (tenant) {
    await AsyncStorage.setItem(KEYS.TENANT, tenant);
  } else {
    await AsyncStorage.removeItem(KEYS.TENANT);
  }
}

async function getTenant(): Promise<?string> {
  return await AsyncStorage.getItem(KEYS.TENANT);
}

/**
 * Cached Locations functions
 *
 * Passing a null value clears the location data from local storage.
 */
async function setLocations(locations: ?string) {
  if (locations) {
    await AsyncStorage.setItem(KEYS.LOCATIONS, locations);
  } else {
    await AsyncStorage.removeItem(KEYS.LOCATIONS);
  }
}

async function getLocations(): Promise<?string> {
  return await AsyncStorage.getItem(KEYS.LOCATIONS);
}

/**
 * Cached Location Types with Locations functions
 *
 * Passing a null value clears the location data from local storage.
 */
async function setLocationTypesWithLocations(locations: ?string) {
  if (locations) {
    await AsyncStorage.setItem(KEYS.LOCATIONTYPES_WITH_LOCATIONS, locations);
  } else {
    await AsyncStorage.removeItem(KEYS.LOCATIONTYPES_WITH_LOCATIONS);
  }
}

async function getLocationTypesWithLocations(): Promise<?string> {
  return await AsyncStorage.getItem(KEYS.LOCATIONTYPES_WITH_LOCATIONS);
}

/*
 * Auth Params functions
 * Sets the AuthParams. To clear it's values use the `unsetAuthParams` method.
 */
async function setAuthParams(auth: AuthParams) {
  if (auth.tenant) {
    await AsyncStorage.setItem(KEYS.TENANT, auth.tenant);
  }
  if (auth.email) {
    await AsyncStorage.setItem(KEYS.EMAIL, auth.email);
  }
  if (auth.token) {
    await AsyncStorage.setItem(KEYS.TOKEN, auth.token);
  }
  if (auth.id) {
    await AsyncStorage.setItem(KEYS.USER_ID, auth.id);
  }
}

async function unsetAuthParams(authKeys: Array<$Keys<AuthParams>>) {
  await authKeys.forEach(async key => {
    await AsyncStorage.removeItem(AuthParamsToKeys[key]);
  });
}

async function getAuthParams(): Promise<AuthParams> {
  const kvArray = await AsyncStorage.multiGet([
    KEYS.TENANT,
    KEYS.TOKEN,
    KEYS.EMAIL,
    KEYS.USER_ID,
  ]);
  const map = {};
  kvArray.forEach(([key, value]) => (map[key] = value));
  return {
    tenant: map[KEYS.TENANT],
    token: map[KEYS.TOKEN],
    email: map[KEYS.EMAIL],
    id: map[KEYS.USER_ID],
  };
}

/*
 * Survey Data functions
 *
 * Passing a null value clears all surveys from local storage.
 */
async function addSurvey(locationId: string, survey: ?SurveyCreateData) {
  const surveyKey = _getSurveyKeyForLocation(locationId);
  if (survey) {
    // Get any existing workflows that may be in AsyncStorage
    const value = await AsyncStorage.getItem(surveyKey);
    const surveys: ?Array<SurveyCreateData> = JSON.parse(value);

    // Replace the first in-progress survey, otherwise add it as a new
    // survey.
    let updatedSurveys = null;
    if (surveys == null || surveys.length === 0) {
      updatedSurveys = [survey];
    } else {
      // Replace the first survey in the array if it's in progress
      if (surveys[0].status === SurveyStatuses.INPROGRESS) {
        updatedSurveys = [survey, ...surveys.slice(1)];
      } else {
        // Add the completed survey to the array if it has not been added already
        if (!surveyToUploadAlreadyExists(survey, surveys)) {
          updatedSurveys = [survey, ...surveys];
        }
      }
    }
    if (updatedSurveys != null) {
      await AsyncStorage.setItem(surveyKey, JSON.stringify(updatedSurveys));
    }
  } else {
    await AsyncStorage.removeItem(surveyKey);
  }
}

async function clearCompletedSurveys(locationId: string) {
  const surveyKey = _getSurveyKeyForLocation(locationId);
  const surveys = await getSurveys(locationId);

  if (surveys == null) {
    return;
  }

  const inProgressSurveys: ?Array<SurveyCreateData> = surveys.filter(
    survey => survey.status === SurveyStatuses.INPROGRESS,
  );

  // Replace existing surveys with just the in-progress surveys, if there
  // are any, otherwise just blow away the key.
  if (surveys.length > 0) {
    if (inProgressSurveys != null && inProgressSurveys.length > 0) {
      await AsyncStorage.setItem(surveyKey, JSON.stringify(inProgressSurveys));
    } else {
      await AsyncStorage.removeItem(surveyKey);
    }
  }
}

async function getInProgressSurvey(
  locationId: string,
): Promise<?SurveyCreateData> {
  const surveys = await getSurveys(locationId);
  const latestSurvey =
    surveys &&
    surveys.length > 0 &&
    surveys[0].status === SurveyStatuses.INPROGRESS
      ? surveys[0]
      : null;
  return latestSurvey;
}

async function getSurveys(
  locationId: string,
): Promise<?Array<SurveyCreateData>> {
  const surveyKey = _getSurveyKeyForLocation(locationId);
  const value = await AsyncStorage.getItem(surveyKey);

  const surveys: ?Array<SurveyCreateData> = JSON.parse(value);
  return surveys;
}

function _getSurveyKeyForLocation(locationId: string) {
  return `${KEYS.SURVEY}_${locationId}`;
}

function surveyToUploadAlreadyExists(
  newSurvey: ?SurveyCreateData,
  surveys: ?Array<SurveyCreateData>,
): boolean {
  if (surveys != null && newSurvey != null) {
    for (const survey of surveys) {
      if (newSurvey.creationTimestamp === survey.creationTimestamp) {
        return true;
      }
    }
  }
  return false;
}

/*
 * Survey Question functions
 */
async function setQuestion(
  locationId: string,
  questionId: string,
  question: ?any,
) {
  const questionIndexKey = getQuestionKeyForLocation(locationId, questionId);
  await AsyncStorage.setItem(questionIndexKey, question);
}

async function getQuestion(
  locationId: string,
  questionId: string,
): Promise<?any> {
  const questionIndexKey = getQuestionKeyForLocation(locationId, questionId);
  return await AsyncStorage.getItem(questionIndexKey);
}

function getQuestionKeyForLocation(locationId: string, questionId: string) {
  return `${KEYS.QUESTION}_${locationId}_${questionId}`;
}

/*
 * Cell Scan functions
 */
async function storeCellScan(
  locationId: string,
  cellScans: CellScanCollection,
) {
  const cellScanIndexKey = getCellScanKeyForLocation(locationId);
  const cellScanKeysJSON = await AsyncStorage.getItem(cellScanIndexKey);
  const cellScanKeys = cellScanKeysJSON ? JSON.parse(cellScanKeysJSON) : [];

  const cellScanKey = `${cellScanIndexKey}_${new Date().getTime()}`;
  cellScanKeys.push(cellScanKey);

  await AsyncStorage.multiSet([
    [cellScanIndexKey, JSON.stringify(cellScanKeys)],
    [cellScanKey, JSON.stringify(cellScans)],
  ]);
}

async function getAllCellScans(
  locationId: string,
): Promise<Array<CellScanCollection>> {
  const cellScanIndexKey = getCellScanKeyForLocation(locationId);
  const cellScanKeysJSON = await AsyncStorage.getItem(cellScanIndexKey);
  if (cellScanKeysJSON == null) {
    return [];
  }
  const cellScanKeys = JSON.parse(cellScanKeysJSON);

  const cellScans = await AsyncStorage.multiGet(cellScanKeys);
  return cellScans.map(cellScan => JSON.parse(cellScan[1]));
}

async function removeAllCellScans(locationId: string) {
  const cellScanIndexKey = getCellScanKeyForLocation(locationId);
  const cellScanKeysJSON = await AsyncStorage.getItem(cellScanIndexKey);
  if (cellScanKeysJSON == null) {
    return;
  }
  const cellScanKeys = JSON.parse(cellScanKeysJSON);

  await AsyncStorage.multiRemove([cellScanIndexKey].concat(cellScanKeys));
}

function getCellScanKeyForLocation(locationId: string) {
  return `${KEYS.CELL_SCAN}_${locationId}`;
}

async function getWorkOrdersCache(): Promise<?string> {
  return await AsyncStorage.getItem(KEYS.WORK_ORDERS_CACHE);
}

async function setWorkOrdersCache(stringifiedData: string): Promise<void> {
  return await AsyncStorage.setItem(KEYS.WORK_ORDERS_CACHE, stringifiedData);
}

async function getNUXStorageKey(nuxName: NuxName): Promise<string> {
  const userId = await AsyncStorage.getItem(KEYS.USER_ID);
  return `${KEYS.NUX_EVENT}_${nuxName}_${userId}`;
}

async function setNUXView(nuxName: NuxName): Promise<void> {
  const nuxStorageKey = await getNUXStorageKey(nuxName);
  return await AsyncStorage.setItem(nuxStorageKey, 'true');
}

async function isNuxViewSet(nuxName: NuxName): Promise<boolean> {
  const nuxStorageKey = await getNUXStorageKey(nuxName);
  const value = await AsyncStorage.getItem(nuxStorageKey);
  return value !== null;
}

/*
 * User Preferences functions
 */

async function setUserPreferences(userPreferences: UserPreferences) {
  if (userPreferences.distUnit) {
    await AsyncStorage.setItem(KEYS.DISTANCE_UNIT, userPreferences.distUnit);
  }
}

async function clearUserPreferences(
  userPreferencesKeys: Array<$Keys<UserPreferences>>,
) {
  await userPreferencesKeys.forEach(async key => {
    await AsyncStorage.removeItem(UserPreferencesToKeys[key]);
  });
}

async function getUserPreferences(): Promise<UserPreferences> {
  const kvArray = await AsyncStorage.multiGet([KEYS.DISTANCE_UNIT]);
  const map = {};
  kvArray.forEach(([key, value]) => (map[key] = value));
  return {
    distUnit: map[KEYS.DISTANCE_UNIT],
  };
}

export default {
  getTenant,
  setTenant,
  getLocations,
  setLocations,
  getLocationTypesWithLocations,
  setLocationTypesWithLocations,
  getAuthParams,
  setAuthParams,
  unsetAuthParams,
  addSurvey,
  clearCompletedSurveys,
  getInProgressSurvey,
  getSurveys,
  setQuestion,
  getQuestion,
  storeCellScan,
  getAllCellScans,
  removeAllCellScans,
  getWorkOrdersCache,
  setWorkOrdersCache,
  isNuxViewSet,
  setNUXView,
  setUserPreferences,
  getUserPreferences,
  clearUserPreferences,
};
