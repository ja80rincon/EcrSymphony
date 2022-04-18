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

import LocalStorage from 'Platform/Services/LocalStorage';
import UserActionLogger from '@fbcmobile/ui/Logging/UserActionLogger';
import fbt from 'fbt';
import {EVENT, METRIC} from 'Platform/Consts/UserActionEvents';
import {SurveyStatuses} from 'Platform/Consts/SurveyConstants';
import {commit, getFilename} from './CreateSurvey';
import type {
  CreateSurveyMutationResponse,
  CreateSurveyMutationVariables,
  SurveyCreateData,
  SurveyQuestionResponse,
  SurveyQuestionType,
} from './__generated__/CreateSurveyMutation.graphql.js';
import type {UploadableMap} from 'relay-runtime';

export function cacheSurveyResponse(
  locationId: string,
  locationTypeName: string,
  questionText: string,
  questionFormat: SurveyQuestionType,
  newValue: SurveyQuestionResponse,
) {
  LocalStorage.getInProgressSurvey(locationId).then(survey => {
    if (survey) {
      const responses: Array<SurveyQuestionResponse> = [];
      let found: boolean = false;
      survey.surveyResponses.forEach(r => {
        if (r.questionText == questionText) {
          const updatedResponse = {
            ...r,
            textData: newValue?.textData,
            emailData: newValue?.emailData,
            phoneData: newValue?.phoneData,
            photoData: newValue?.photoData,
            cellData: newValue?.cellData,
            wifiData: newValue?.wifiData,
            boolData: newValue?.boolData,
            latitude: newValue?.latitude,
            longitude: newValue?.longitude,
            locationAccuracy: newValue?.locationAccuracy,
            altitude: newValue?.altitude,
            dateData: newValue?.dateData,
            floatData: newValue?.floatData,
            intData: newValue?.intData,
          };
          responses.push(updatedResponse);
          found = true;
        } else {
          responses.push(r);
        }
      });
      if (!found) {
        responses.push(newValue);
      }
      survey.surveyResponses = responses;
      LocalStorage.addSurvey(locationId, survey);
    } else {
      LocalStorage.getAuthParams().then(params => {
        const newSurvey: SurveyCreateData = {
          name: fbt(
            fbt.param('Location name', locationTypeName) + ' Site Survey',
            'Site Survey title',
          ),
          ownerName: params.email,
          status: SurveyStatuses.INPROGRESS,
          creationTimestamp: (Date.now() / 1000) | 0, // record start time
          completionTimestamp: 0,
          locationID: locationId,
          surveyResponses: [newValue],
        };
        LocalStorage.addSurvey(locationId, newSurvey);
      });
    }
  });
}

export function markSurveyCompleted(
  locationId: string,
  onSuccess?: () => void,
) {
  LocalStorage.getInProgressSurvey(locationId).then(
    (survey: ?SurveyCreateData) => {
      if (survey) {
        survey.completionTimestamp = (Date.now() / 1000) | 0;
        survey.status = SurveyStatuses.COMPLETED;
        LocalStorage.addSurvey(locationId, survey).then(() => {
          onSuccess && onSuccess();
        });
      }
      onSuccess && onSuccess();
    },
  );
}

export function submitSurveys(
  locationId: string,
  onSuccess?: (response: ?CreateSurveyMutationResponse) => void,
  onFailure?: (error: Error) => void,
) {
  LocalStorage.getSurveys(locationId).then(
    (surveys: ?Array<SurveyCreateData>) => {
      if (surveys) {
        surveys.forEach(survey => {
          // Mark the survey as completed
          survey.status = SurveyStatuses.COMPLETED;
          LocalStorage.addSurvey(locationId, survey);

          UserActionLogger.logMetric({
            key: METRIC.SURVEY_COMPLETION_DURATION_SEC,
            metric: ((Date.now() / 1000) | 0) - (survey.creationTimestamp || 0),
          });

          const imageValues = survey.surveyResponses.filter(
            x => x.questionFormat == 'PHOTO',
          );
          const uploadables: UploadableMap = {};
          imageValues.forEach(imageValue => {
            const fileName = getFilename(
              imageValue.formIndex,
              imageValue.questionIndex,
            );
            const uploadable: Blob = new Blob([], {
              name: fileName,
              mimeType: imageValue.photoData?.mimeType ?? 'image/jpg',
              uri: imageValue.photoData?.id,
            });
            uploadables[fileName] = uploadable;
          });
          const params: CreateSurveyMutationVariables = {
            input: {
              name: survey.name,
              status: SurveyStatuses.COMPLETED,
              creationTimestamp: survey.creationTimestamp,
              completionTimestamp: (Date.now() / 1000) | 0,
              locationID: survey.locationID,
              surveyResponses: _convertToGraphQL(survey.surveyResponses),
            },
          };
          commit(
            params,
            uploadables,
            response => {
              UserActionLogger.logEvent({
                key: EVENT.SUCCESS_CREATE_SURVEY_MUTATION,
                logMessage: response?.createSurvey,
              });
              // Clear the cached survey from local storage
              LocalStorage.clearCompletedSurveys(locationId).then(
                () => onSuccess && onSuccess(),
              );
            },
            (error: Error) => {
              onFailure && onFailure(error);
            },
          );
        });
      }
    },
  );
}

function _convertToGraphQL(
  results: $ReadOnlyArray<SurveyQuestionResponse>,
): Array<SurveyQuestionResponse> {
  const responses = results.map((x: SurveyQuestionResponse) => {
    const result: SurveyQuestionResponse = {
      formIndex: x.formIndex || 0,
      formName: x.formName,
      formDescription: x.formDescription,
      questionIndex: x.questionIndex || 0,
      questionFormat: x.questionFormat,
      questionText: x.questionText,
      boolData: x.boolData,
      emailData: x.emailData,
      phoneData: x.phoneData,
      latitude: x.latitude || 0,
      longitude: x.longitude || 0,
      locationAccuracy: x.locationAccuracy || 0,
      altitude: x.altitude || 0,
      textData: x.textData,
      wifiData: x.wifiData || [],
      cellData: x.cellData || [],
      dateData: x.dateData || 0,
      floatData: x.floatData || 0.0,
      intData: x.intData || 0,
    };
    return result;
  });
  return responses;
}
