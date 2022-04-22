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
import AppContext from 'Platform/Context/AppContext';
import Text from '@fbcmobile/ui/Components/Core/Text';
import fbt from 'fbt';
import moment from 'moment';
import {Colors} from '@fbcmobile/ui/Theme';
import {View} from 'react-native';
import {getReadableDateString} from '@fbcmobile/ui/Utils/DateUtils';
import {useContext} from 'react';

type Props = {
  +date: moment$Moment,
  +numSiteSurveys: number,
  +numWorkOrders: number,
};

const MyTasksHeader = ({date, numSiteSurveys, numWorkOrders}: Props) => {
  const {jsLocale} = useContext(AppContext);
  const isToday = moment().isSame(date, 'day');

  const getDescriptionText = () => {
    if (numSiteSurveys > 0 && numWorkOrders > 0) {
      return (
        <fbt desc="Text that shows how many site surveys and work orders the user has assigned to them">
          You have
          <fbt:plural
            name="number of site surveys"
            many="site surveys"
            showCount="yes"
            count={numSiteSurveys}>
            site survey
          </fbt:plural>
          and
          <fbt:plural
            name="number of work orders"
            many="work orders"
            showCount="yes"
            count={numWorkOrders}>
            work order
          </fbt:plural>
        </fbt>
      );
    } else if (numSiteSurveys > 0) {
      return (
        <fbt desc="Text that shows how many site surveys the user has assigned to them">
          You have
          <fbt:plural
            many="site surveys"
            showCount="yes"
            count={numSiteSurveys}>
            site survey
          </fbt:plural>
        </fbt>
      );
    } else if (numWorkOrders > 0) {
      return (
        <fbt desc="Text that shows how many work orders the user has assigned to them">
          You have
          <fbt:plural
            name="work orders"
            many="work orders"
            showCount="yes"
            count={numWorkOrders}>
            work order
          </fbt:plural>
        </fbt>
      );
    }

    return null;
  };

  return (
    <View
      style={[styles.root, isToday ? styles.todayRoot : styles.notTodayRoot]}>
      {isToday ? <View style={styles.todayBar} /> : null}
      <View style={styles.content}>
        <Text variant="h1">{getReadableDateString(date, jsLocale)}</Text>
        {numSiteSurveys > 0 || numWorkOrders > 0 ? (
          <View style={styles.descriptionContainer}>
            <Text variant="h7" weight="medium" color="regular">
              {getDescriptionText()}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
};

const styles = {
  todayBar: {
    height: '100%',
    backgroundColor: Colors.Blue,
    width: 12,
  },
  root: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: Colors.BackgroundWhite,
    height: 90,
  },
  content: {
    paddingVertical: 16,
    display: 'flex',
    marginLeft: 8,
  },
  notTodayRoot: {
    marginLeft: 12,
  },
  calendarIcon: {
    marginRight: 6,
  },
  todayRoot: {
    backgroundColor: Colors.BlueBackground,
  },
  descriptionContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    paddingTop: 5,
  },
};

export default MyTasksHeader;
