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

import * as React from 'react';
import Badge from '@fbcmobile/ui/Components/Core/Badge';
import {Colors} from '@fbcmobile/ui/Theme';
import {Icon} from 'react-native-material-ui';

type Props = {
  +doneCount: number,
  +totalCount: number,
};

const ChecklistBadge = ({doneCount, totalCount}: Props) => {
  return (
    <Badge
      icon={
        doneCount === totalCount ? (
          <Icon name="check" iconSet="MaterialIcons" color={Colors.White} />
        ) : null
      }
      label={doneCount !== totalCount ? `${doneCount}/${totalCount}` : null}
      variant={doneCount > 0 ? 'primary' : 'secondary'}
    />
  );
};

export default ChecklistBadge;
