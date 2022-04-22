/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {WorkOrderCheckInActivityText_activity$key} from './__generated__/WorkOrderCheckInActivityText_activity.graphql';

import React from 'react';
import fbt from 'fbt';
import {graphql, useFragment} from 'react-relay/hooks';
import {isTechnicianActivityDistanceValid} from '../work_orders/WorkOrderUtils';

type Props = $ReadOnly<{|
  activity: WorkOrderCheckInActivityText_activity$key,
|}>;

const WorkOrderCheckInActivityText = (props: Props) => {
  const {activity} = props;
  const data = useFragment(
    graphql`
      fragment WorkOrderCheckInActivityText_activity on Activity {
        activityType
        clockDetails {
          distanceMeters
        }
      }
    `,
    activity,
  );

  if (data.activityType !== 'CLOCK_IN' || data.clockDetails == null) {
    return null;
  }

  const {distanceMeters} = data.clockDetails;
  const isDistanceValid = isTechnicianActivityDistanceValid(distanceMeters);
  return isDistanceValid ? (
    <fbt desc="">checked in</fbt>
  ) : (
    <fbt desc="">
      checked in
      <fbt:param name="distance">{distanceMeters}</fbt:param>
      meters from the site
    </fbt>
  );
};

export default WorkOrderCheckInActivityText;
