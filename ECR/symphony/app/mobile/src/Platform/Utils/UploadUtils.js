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

import type {
  AddImageMutationVariables,
  ImageEntity,
} from 'Platform/Relay/Mutations/__generated__/AddImageMutation.graphql';

import AddImageMutation from 'Platform/Relay/Mutations/AddImage';
import LocalStorage from 'Platform/Services/LocalStorage';
import UserActionLogger from '@fbcmobile/ui/Logging/UserActionLogger';
import nullthrows from 'nullthrows';
import {EVENT} from 'Platform/Consts/UserActionEvents';
import {getDocumentUploadUrl, getHost} from 'Platform/Consts/Constants';

export type PhotoResponse = {
  data?: string,
  width?: number,
  height?: number,
  fileSize?: number,
  mimeType?: string,
  fileName: string,
  timestamp?: number,
  uri: string,
  annotation?: ?string,
};

export async function uploadPhoto(
  photoResponse: PhotoResponse,
): Promise<?string> {
  try {
    const tenant = nullthrows(await LocalStorage.getTenant());
    const host = getHost(tenant);
    const baseUrl = `https://${host}`;
    const signingResponse = await fetch(
      `${getDocumentUploadUrl(tenant)}?contentType=${encodeURIComponent(
        photoResponse.mimeType ?? 'image/jpeg',
      )}`,
      {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-organization': tenant,
          Origin: baseUrl,
          Host: host,
          Accept: '*/*',
        },
        credentials: 'include',
      },
    );
    const signingData = await signingResponse.json();
    const photo = await fetch(photoResponse.uri);
    const blob = await photo.blob();
    const uploadResponse = await fetch(signingData.URL, {
      method: 'PUT',
      headers: {
        'Content-Type': photoResponse.mimeType ?? 'image/jpeg',
      },
      body: blob,
    });
    if (uploadResponse.ok) {
      return signingData.key;
    }
  } catch (error) {
    UserActionLogger.logError({
      key: EVENT.FAILED_GETTING_S3_KEY,
      errorMessage:
        'failed getting key for file: ' +
        JSON.stringify(photoResponse.uri) +
        ' error: ' +
        error.name +
        ':' +
        error.message,
    });
  }
  return null;
}

export async function uploadEntityImage(
  entityType: ImageEntity,
  entityId: string,
  photoResponse: PhotoResponse,
): Promise<void> {
  return uploadPhoto(photoResponse).then(key => {
    if (!key) {
      return;
    }

    const variables: AddImageMutationVariables = {
      input: {
        entityType,
        entityId,
        imgKey: key,
        fileName: nullthrows(photoResponse.fileName),
        fileSize: photoResponse.fileSize || 0,
        modified: (photoResponse.timestamp
          ? new Date(photoResponse.timestamp)
          : new Date()
        ).toISOString(),
        contentType: photoResponse.mimeType ?? 'image/jpeg',
      },
    };
    const updater = store => {
      const newNode = store.getRootField('addImage');
      const proxy = store.get(entityId);
      const imageNodes = proxy.getLinkedRecords('images') || [];
      proxy.setLinkedRecords([...imageNodes, newNode], 'images');
    };
    return new Promise((resolve, reject) =>
      AddImageMutation(
        variables,
        {
          onCompleted: () => resolve(),
          onError: reject,
        },
        updater,
      ),
    );
  });
}
