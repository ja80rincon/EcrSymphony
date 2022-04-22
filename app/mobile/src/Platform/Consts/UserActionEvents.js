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

export const EVENT = {
  FAILED_GETTING_S3_KEY: 'failed_getting_s3_key',
  FAILED_LOGIN: 'failed_login',
  STILL_LOGGED_IN: 'still_logged_in',
  SUCCESS_CREATE_SURVEY_MUTATION: 'success_create_survey_mutation',
  SUCCESS_LOGOUT: 'success_logout',
  SUCCESS_COMMIT_CELL_SCAN_MUTATION: 'success_commit_cell_scan_mutation',
  TECHNICIAN_CHECKED_IN: 'technician_checked_in',
  SUCCESS_WORK_ORDER_CACHE_LOADED: 'success_work_order_cache_loaded',
  SUCCESS_TECHNICIAN_UPLOADED_DATA: 'success_technician_uploaded_data',
  SUCCESS_WORK_ORDER_ADD_COMMENT: 'success_work_order_add_comment',
};

export const METRIC = {
  LOGIN_SUCCESS_MS: 'login_success_ms',
  GPS_LOCK_LOW_ACCURACY: 'gps_lock_low_accuracy',
  GRAPHQL_QUERY_RESPONSE_MS: 'graphql_query_response_ms',
  SURVEY_COMPLETION_DURATION_SEC: 'survey_completion_sec',
};

export const ERROR = {
  ERROR_COMMIT_CELL_SCAN_MUTATION: 'error_commit_cell_scan_mutation',
  ERROR_CREATE_SURVEY_MUTATION: 'error_create_survey_mutation',
  ERROR_FAILED_UPLOADING_PHOTO: 'error_failed_uploading_photo',
  ERROR_FETCH: 'error_fetch',
  ERROR_FETCH_QUERY: 'error_fetch_query',
  ERROR_FETCHING_SIDE_MENU_USER_INFO: 'error_fetching_side_menu_user_info',
  ERROR_GETTING_GEOLOCATION: 'error_getting_geolocation',
  ERROR_IMAGE_UPLOAD: 'error_image_upload',
  ERROR_TECHNICIAN_CHECK_IN: 'error_technician_check_in',
  ERROR_MY_TASKS_SCROLL_TO_TODAY: 'error_my_tasks_scroll_to_today',
  ERROR_PARSING_WORK_ORDER_CACHE: 'error_parsing_work_order_cache',
  ERROR_TECHNICIAN_UPLOADED_DATA: 'error_technician_uploaded_data',
  ERROR_CHECKLIST_ITEM_TYPE_NOT_SUPPORTED:
    'error_checklist_item_type_not_supported',
  ERROR_WORK_ORDER_ADD_COMMENT: 'error_work_order_add_comment',
};
