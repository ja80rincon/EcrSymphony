/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {WorkOrderCheckOutActivityText_activity$key} from './__generated__/WorkOrderCheckOutActivityText_activity.graphql';

import React from 'react';
import fbt from 'fbt';
import {graphql, useFragment} from 'react-relay/hooks';
import {isTechnicianActivityDistanceValid} from '../work_orders/WorkOrderUtils';

type Props = $ReadOnly<{|
  activity: WorkOrderCheckOutActivityText_activity$key,
|}>;

const WorkOrderCheckOutActivityText = (props: Props) => {
  const {activity} = props;
  const data = useFragment(
    graphql`
      fragment WorkOrderCheckOutActivityText_activity on Activity {
        activityType
        clockDetails {
          clockOutReason
          distanceMeters
          comment
        }
      }
    `,
    activity,
  );

  if (data.activityType !== 'CLOCK_OUT' || data.clockDetails == null) {
    return null;
  }

  const {clockOutReason, distanceMeters, comment} = data.clockDetails;
  const isDistanceValid = isTechnicianActivityDistanceValid(distanceMeters);

  switch (clockOutReason) {
    case 'SUBMIT_INCOMPLETE':
      return (
        <span>
          {isDistanceValid ? (
            <fbt desc="">checked out.</fbt>
          ) : (
            <>
              <fbt desc="">
                checked out
                <fbt:param name="distance">{distanceMeters}</fbt:param>
                meters from the site.
              </fbt>
              <br />
            </>
          )}{' '}
          <fbt desc="">Some required information was missing.</fbt>
          <br />
          {comment != null && comment !== '' && (
            <fbt desc="">
              <strong>Additional details:</strong>{' '}
              <fbt:param name="technician comment">{comment}</fbt:param>
            </fbt>
          )}
        </span>
      );
    case 'BLOCKED':
      return (
        <>
          {isDistanceValid ? (
            <fbt desc="">
              checked out and reported the work order as blocked.
            </fbt>
          ) : (
            <fbt desc="">
              checked out{' '}
              <fbt:param name="distance">{distanceMeters}</fbt:param>
              meters from the site and reported the work order as blocked.
            </fbt>
          )}
          <br />
          {comment != null && comment !== '' && (
            <fbt desc="">
              <strong>Additional details:</strong>{' '}
              <fbt:param name="technician comment">{comment}</fbt:param>
            </fbt>
          )}
        </>
      );
    default:
      return isDistanceValid ? (
        <fbt desc="">checked out</fbt>
      ) : (
        <fbt desc="">
          checked out <fbt:param name="distance">{distanceMeters}</fbt:param>
          meters from the site
        </fbt>
      );
  }
};

export default WorkOrderCheckOutActivityText;
