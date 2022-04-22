/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */
import AlarmFilteringFormCreate from './AlarmFilteringFormCreate';
import AlarmFilteringTable from './AlarmFilteringTable';
import Button from '@symphony/design-system/components/Button';
import EditAlarmFilteringItemForm from './EditAlarmFilteringItemForm';
import React, {useCallback, useEffect, useState} from 'react';
import {Grid} from '@material-ui/core';
import {makeStyles} from '@material-ui/styles';

import ConfigureTitle from './common/ConfigureTitle';
import RelayEnvironment from '../../common/RelayEnvironment';
import fbt from 'fbt';
import {fetchQuery} from 'relay-runtime';
import {graphql} from 'react-relay';

const useStyles = makeStyles(() => ({
  root: {
    padding: '40px',
  },
  header: {
    marginBottom: '1rem',
  },
}));

const AlarmFilteringQuery = graphql`
  query AlarmFilteringTypesQuery {
    alarmFilters {
      edges {
        node {
          id
          name
          networkResource
          enable
          beginTime
          endTime
          reason
          user
          creationTime
          alarmStatus {
            id
            name
          }
        }
      }
    }
  }
`;

export type Node = {
  node: {
    name: string,
  },
};

export type Alarms = {
  item: {
    id: string,
    name: string,
    networkResource: string,
    enable: boolean,
    beginTime: string,
    endTime: string,
    reason: string,
    user: string,
    creationTime: string,
  },
};

const AlarmFilteringTypes = () => {
  const classes = useStyles();
  const [DataAlarms, setDataAlarms] = useState({});
  const [showEditForm, setShowEditForm] = useState(false);
  const [dataEdit, setDataEdit] = useState<Alarms>({});
  const [showForm, setShowForm] = useState(false);

  const alarms = DataAlarms.alarmFilters?.edges.map(node => node);

  useEffect(() => {
    isCompleted();
  }, []);

  const isCompleted = useCallback(() => {
    fetchQuery(RelayEnvironment, AlarmFilteringQuery, {}).then(data => {
      setDataAlarms(data);
    });
  }, [setDataAlarms]);

  const handleClickEdit = (alarm: Alarms) => {
    setShowEditForm(true);
    setDataEdit(alarm);
  };

  const handleClickAdd = () => {
    setShowForm(true);
  };

  if (showForm) {
    return (
      <AlarmFilteringFormCreate
        alarms={alarms}
        returnTableAlarm={() => setShowForm(false)}
        isCompleted={isCompleted}
      />
    );
  }

  if (showEditForm) {
    return (
      <EditAlarmFilteringItemForm
        alarms={alarms}
        closeEditForm={() => setShowEditForm(false)}
        formValues={dataEdit}
        isCompleted={isCompleted}
      />
    );
  }
  return (
    <Grid className={classes.root}>
      <Grid className={classes.header} container>
        <Grid item xs>
          <ConfigureTitle
            title={fbt('Alarm Admission', 'Alarm Admission Title')}
            subtitle={fbt(
              'Alarm filtering rules for Fault Management processes',
              'Alarm description ',
            )}
          />
        </Grid>
        <Grid>
          <Button onClick={handleClickAdd}>Add Alarm Admission</Button>
        </Grid>
      </Grid>
      <Grid item>
        <AlarmFilteringTable
          dataValues={DataAlarms.alarmFilters?.edges.map(item => item.node)}
          edit={handleClickEdit}
          isCompleted={isCompleted}
        />
      </Grid>
    </Grid>
  );
};

export default AlarmFilteringTypes;
