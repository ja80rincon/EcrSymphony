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
import RelayEnvironment from 'Platform/Relay/RelayEnvironment.js';
import UserActionLogger from '@fbcmobile/ui/Logging/UserActionLogger';
import graphql from 'babel-plugin-relay/macro';
import nullthrows from 'nullthrows';
import {ERROR} from 'Platform/Consts/UserActionEvents';
import {commitMutation} from 'react-relay';
import {uploadPhoto} from 'Platform/Utils/UploadUtils';
import type {
  CreateSurveyMutation,
  CreateSurveyMutationResponse,
  CreateSurveyMutationVariables,
} from './__generated__/CreateSurveyMutation.graphql';

import type {PayloadError, Uploadable, UploadableMap} from 'relay-runtime';
import type {PhotoResponse} from 'Platform/Utils/UploadUtils';

const mutation = graphql`
  mutation CreateSurveyMutation($input: SurveyCreateData!) {
    createSurvey(data: $input)
  }
`;
type UploadableFile = Uploadable & {
  uri?: string,
  fileName?: string,
  mimeType?: string,
};

async function _uploadPhotosAndSetKeys(
  params: CreateSurveyMutationVariables,
  uploadables?: UploadableMap,
): Promise<CreateSurveyMutationVariables> {
  for (const uploadable in uploadables) {
    if (uploadables.hasOwnProperty(uploadable)) {
      try {
        const file: UploadableFile = uploadables[uploadable];
        const photoResponse: PhotoResponse = {
          uri: file?.uri || '',
          fileName: file?.fileName || '',
          mimeType: file.mimeType,
        };
        const key = await uploadPhoto(photoResponse);
        nullthrows(key);
        for (let i = 0; i < params.input.surveyResponses.length; i++) {
          const filename = getFilename(
            params.input.surveyResponses[i].formIndex,
            params.input.surveyResponses[i].questionIndex,
          );
          if (filename === uploadable) {
            // Need to add the photoData field with the uploadable info
            params.input.surveyResponses[i].photoData = {
              id: '0', // Not used but flow complains if not set.
              fileName: uploadable,
              fileType: 'IMAGE',
              mimeType: file.mimeType,
              storeKey: key || '',
            };
          }
        }
      } catch (error) {
        UserActionLogger.logError({
          key: ERROR.ERROR_FAILED_UPLOADING_PHOTO,
          errorMessage: 'Failed to upload photo: ' + error.toString(),
        });
      }
    }
  }
  return params;
}

function getFilename(
  formIndex: ?number | string,
  questionIndex: ?number | string,
): string {
  if (formIndex != null && questionIndex != null) {
    return formIndex + '-' + questionIndex;
  }
  return '';
}

function commit(
  params: CreateSurveyMutationVariables,
  uploadables?: UploadableMap,
  onSuccess?: (response: ?CreateSurveyMutationResponse) => void,
  onFailure?: (error: Error) => void,
) {
  _uploadPhotosAndSetKeys(params, uploadables).then(inputWithPhotoKeys => {
    commitMutation<CreateSurveyMutation>(RelayEnvironment, {
      mutation,
      variables: inputWithPhotoKeys,
      onCompleted: (
        response: ?CreateSurveyMutationResponse,
        errors: ?Array<PayloadError>,
      ) => {
        // onCompleted is still called if server throws exception during mutation
        if (errors && errors.length) {
          UserActionLogger.logError({
            key: ERROR.ERROR_CREATE_SURVEY_MUTATION,
            errorMessage:
              'CreateSurveyMutation failed: ' + errors[0].toString(),
          });
          onFailure && onFailure(new Error(errors[0].message));
          return;
        }
        onSuccess && onSuccess(response);
      },
      onError: (error: Error) => {
        UserActionLogger.logError({
          key: ERROR.ERROR_CREATE_SURVEY_MUTATION,
          errorMessage: 'CreateSurveyMutation failed: ' + error.message,
        });
        onFailure && onFailure(error);
      },
    });
  });
}

export {commit, getFilename};
