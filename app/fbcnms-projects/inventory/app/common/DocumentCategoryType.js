/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

export type DocumentCategoryType = {|
  id: string,
  name: string,
  index?: ?number,
  isDeleted?: ?boolean,
  numberOfDocuments?: number,
|};
