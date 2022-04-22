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

import type {CheckInStatus} from 'Platform/Screens/WorkOrder/CheckInStatusTypes';
import type {CheckListItemEnumSelectionMode} from 'Platform/Components/WorkOrders/CheckListItems/__generated__/MultipleChoiceCheckListItem_item.graphql';
import type {
  CheckListItemType,
  WorkOrderCheckListItem_item,
} from './__generated__/WorkOrderCheckListItem_item.graphql';
import type {CheckListItemType as CheckListItemTypeEnum} from 'Platform/Components/WorkOrders/__generated__/WorkOrderCheckListItem_item.graphql';
import type {PhotosCheckListItem_item} from 'Platform/Components/WorkOrders/CheckListItems/__generated__/PhotosCheckListItem_item.graphql';
import type {
  SurveyCellScanData,
  SurveyWiFiScanData,
} from 'Platform/Relay/Mutations/__generated__/CreateSurveyMutation.graphql.js';
import type {YesNoResponse} from 'Platform/Components/WorkOrders/CheckListItems/__generated__/YesNoCheckListItem_item.graphql';

import * as React from 'react';
import CellScanCheckListItem from 'Platform/Components/WorkOrders/CheckListItems/Editing/CellScanCheckListItem';
import CellScanViewOnlyCheckListItem from 'Platform/Components/WorkOrders/CheckListItems/Viewing/CellScanViewOnlyCheckListItem';
import MultipleChoiceCheckListItem from 'Platform/Components/WorkOrders/CheckListItems/Editing/MultipleChoiceCheckListItem';
import MultipleChoiceViewOnlyCheckListItem from 'Platform/Components/WorkOrders/CheckListItems/Viewing/MultipleChoiceViewOnlyCheckListItem';
import PhotosCheckListItem from 'Platform/Components/WorkOrders/CheckListItems/Editing/PhotosCheckListItem';
import PhotosViewOnlyCheckListItem from 'Platform/Components/WorkOrders/CheckListItems/Viewing/PhotosViewOnlyCheckListItem';
import SimpleCheckListItem from 'Platform/Components/WorkOrders/CheckListItems/Editing/SimpleCheckListItem';
import SimpleViewOnlyCheckListItem from 'Platform/Components/WorkOrders/CheckListItems/Viewing/SimpleViewOnlyCheckListItem';
import StringCheckListItem from 'Platform/Components/WorkOrders/CheckListItems/Editing/StringCheckListItem';
import StringViewOnlyCheckListItem from 'Platform/Components/WorkOrders/CheckListItems/Viewing/StringViewOnlyCheckListItem';
import WifiScanCheckListItem from 'Platform/Components/WorkOrders/CheckListItems/Editing/WifiScanCheckListItem';
import WifiScanViewOnlyCheckListItem from 'Platform/Components/WorkOrders/CheckListItems/Viewing/WiFiScanViewOnlyCheckListItem';
import YesNoCheckListItem from 'Platform/Components/WorkOrders/CheckListItems/Editing/YesNoCheckListItem';
import YesNoViewOnlyCheckListItem from 'Platform/Components/WorkOrders/CheckListItems/Viewing/YesNoViewOnlyCheckListItem';

export type SimpleCheckListItemType = {|
  checked?: ?boolean,
|};

export type StringCheckListItemType = {|
  stringValue?: ?string,
|};

export type MultipleChoiceCheckListItemType = {|
  enumSelectionMode?: ?CheckListItemEnumSelectionMode,
  enumValues?: ?string,
  selectedEnumValues?: ?Array<string>,
|};

type YesNoCheckListItemType = {|
  yesNoResponse?: ?YesNoResponse,
|};

type WifiScanCheckListItemType = {|
  wifiData?: ?$ReadOnlyArray<SurveyWiFiScanData>,
|};

type CellScanCheckListItemType = {|
  cellData?: ?$ReadOnlyArray<SurveyCellScanData>,
|};

export type FilesData = $ElementType<PhotosCheckListItem_item, 'files'>;

export type FileStatus = 'added' | 'deleted' | 'server';

export type CachedFileData = {|
  id?: string,
  fileName: string,
  storeKey?: ?string,
  mimeType: ?string,
  sizeInBytes: ?number,
  modified: ?any,
  uploaded?: ?any,
  status: FileStatus,
  annotation?: ?string,
|};

export type CachedFilesData = ?Array<CachedFileData>;

export type CachedPhotosCheckListItemType = {|
  files?: ?CachedFilesData,
|};

export type CachedCheckListItem = {|
  id: string,
  title: string,
  index: ?number,
  helpText: ?string,
  type: CheckListItemTypeEnum,
  isMandatory: ?boolean,
  ...SimpleCheckListItemType,
  ...StringCheckListItemType,
  ...MultipleChoiceCheckListItemType,
  ...YesNoCheckListItemType,
  ...WifiScanCheckListItemType,
  ...CellScanCheckListItemType,
  ...CachedPhotosCheckListItemType,
|};

export type WorkOrderCategoryCacheItem = $ReadOnly<{|
  id: string,
  title: string,
  checklist: $ReadOnlyArray<CachedCheckListItem>,
|}>;

export type WorkOrderCacheItem = $ReadOnly<{|
  id: string,
  categories: $ReadOnlyArray<WorkOrderCategoryCacheItem>,
  checkInStatus?: CheckInStatus,
  images: $ReadOnlyArray<?CachedFileData>,
  isSubmitting: boolean
|}>;

export const CheckListItemTypes: {
  [type: CheckListItemType]: {
    editingComponent: ?React.ComponentType<{|
      workOrderId: string,
      categoryId: string,
      item: CachedCheckListItem,
      hasError: boolean,
    |}>,
    viewingComponent: ?React.ComponentType<{
      item: WorkOrderCheckListItem_item,
    }>,
  },
} = {
  string: {
    editingComponent: StringCheckListItem,
    viewingComponent: StringViewOnlyCheckListItem,
  },
  simple: {
    editingComponent: SimpleCheckListItem,
    viewingComponent: SimpleViewOnlyCheckListItem,
  },
  enum: {
    editingComponent: MultipleChoiceCheckListItem,
    viewingComponent: MultipleChoiceViewOnlyCheckListItem,
  },
  yes_no: {
    editingComponent: YesNoCheckListItem,
    viewingComponent: YesNoViewOnlyCheckListItem,
  },
  wifi_scan: {
    editingComponent: WifiScanCheckListItem,
    viewingComponent: WifiScanViewOnlyCheckListItem,
  },
  cell_scan: {
    editingComponent: CellScanCheckListItem,
    viewingComponent: CellScanViewOnlyCheckListItem,
  },
  files: {
    editingComponent: PhotosCheckListItem,
    viewingComponent: PhotosViewOnlyCheckListItem,
  },
};
