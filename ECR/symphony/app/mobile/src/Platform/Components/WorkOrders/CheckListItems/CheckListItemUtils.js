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
  CachedCheckListItem,
  CachedFileData,
  CachedFilesData,
  FilesData,
} from 'Platform/Components/WorkOrders/CheckListItemTypes.js';
import type {User} from 'Platform/Context/AppContext';

import UserActionLogger from '@fbcmobile/ui/Logging/UserActionLogger';
import fbt from 'fbt';
import nullthrows from 'nullthrows';
import {ERROR} from 'Platform/Consts/UserActionEvents';
import {getDocumentUrl} from 'Platform/Consts/Constants';

export function mergeFiles(
  files: ?FilesData,
  cachedFiles: ?CachedFilesData,
): ?CachedFilesData {
  if (cachedFiles == null || cachedFiles.length == 0) {
    return files?.map(file => ({status: 'server', ...file}));
  } else if (files == null) {
    return cachedFiles;
  }

  const union = [...cachedFiles];

  files.forEach(file => {
    if (!union.some(item => item.fileName === file.fileName)) {
      union.push({status: 'server', ...file});
    }
  });

  return union;
}

export function isChecklistItemDone(item: CachedCheckListItem): boolean {
  switch (item.type) {
    case 'enum':
      return (
        item.selectedEnumValues != null && item.selectedEnumValues.length > 0
      );
    case 'simple':
      return item.checked === true;
    case 'string':
      return item.stringValue != null && item.stringValue.trim() !== '';
    case 'yes_no':
      return item.yesNoResponse != null;
    case 'wifi_scan':
      return item.wifiData != null;
    case 'cell_scan':
      return item.cellData != null;
    case 'files':
      return (
        item.files != null &&
        item.files.length > 0 &&
        item.files.some(file => file.status !== 'deleted')
      );
    default:
      UserActionLogger.logError({
        key: ERROR.ERROR_CHECKLIST_ITEM_TYPE_NOT_SUPPORTED,
        errorMessage: `Checklist item type not supported: ${item.type}`,
      });
      return false;
  }
}

export const CHECKLIST_ITEM_NOT_APPLICABLE_LABEL: string = fbt(
  'N/A',
  'Checklist item N/A label. Indicates that an answer was not provided by the technician or the question is not applicable.',
).toString();

export const getChecklistItemFileUri = (
  file: CachedFileData,
  user: User,
): ?string => {
  return file.status === 'server' && file.storeKey
    ? getDocumentUrl(user.tenant, nullthrows(file.storeKey))
    : file.fileName;
};
