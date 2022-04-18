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
import Button from '@fbcmobile/ui/Components/Core/Button';
import Spinner from 'react-native-spinkit';
import fbt from 'fbt';
import {Colors} from '@fbcmobile/ui/Theme';
import {Icon} from 'react-native-material-ui';

export type ButtonState = 'check-in' | 'check-out';

type Props = {|
  +isDisabled: boolean,
  +isSubmitting: boolean,
  +onPress: () => void,
  +buttonState: ButtonState,
  +requiresConfirmation?: ?boolean,
|};

const WorkOrderTechnicianActionButton = ({
  isDisabled,
  isSubmitting,
  onPress,
  buttonState,
  requiresConfirmation = false,
}: Props) => {
  return (
    <Button
      disabled={isDisabled}
      variant={requiresConfirmation ? 'warning' : 'primary'}
      textAlign="left"
      rightIcon={
        isSubmitting ? (
          <Spinner size={20} color={Colors.DisabledText} type="ThreeBounce" />
        ) : (
          <Icon
            name="arrow-right"
            iconSet="MaterialCommunityIcons"
            color={
              isDisabled
                ? Colors.DisabledText
                : requiresConfirmation
                ? Colors.BrightRed
                : Colors.White
            }
            size={20}
          />
        )
      }
      onPress={onPress}>
      {buttonState === 'check-in' ? (
        <fbt desc="Call to action for the technician to check into the location">
          Check In
        </fbt>
      ) : (
        <fbt desc="Call to action for the technician to checkout from the work order">
          Check Out
        </fbt>
      )}
    </Button>
  );
};

export default WorkOrderTechnicianActionButton;
