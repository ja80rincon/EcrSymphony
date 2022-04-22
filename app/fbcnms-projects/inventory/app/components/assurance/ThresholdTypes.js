/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {RemoveThresholdMutationVariables} from '../../mutations/__generated__/RemoveThresholdMutation.graphql';

import AddThresholdItemForm from './AddThresholdItemForm';
import ConfigureTitle from './common/ConfigureTitle';
import EditThresholdItemForm from './EditThresholdItemForm';
import React, {useCallback, useEffect, useState} from 'react';
import RelayEnvironment from '../../common/RelayEnvironment';
import ThresholdProvider from './ThresholdProvider';
import ThresholdTypeItem from './ThresholdTypeItem';
import TitleTextCardsThresholds from './TitleTextCardsThresholds';
import fbt from 'fbt';
import symphony from '@symphony/design-system/theme/symphony';
import {Grid, List} from '@material-ui/core';
import {fetchQuery} from 'relay-runtime';
import {graphql} from 'react-relay';
import {makeStyles} from '@material-ui/styles';

import AddRuleItemForm from './AddRuleItemForm';
import EditRuleItemForm from './EditRuleItemForm';
import RemoveThresholdMutation from '../../mutations/RemoveThresholdMutation';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 0,
    padding: '30px',
    margin: '0',
  },
  titleThreshold: {
    margin: '0 0 40px 0',
  },
  listContainer: {
    overflow: 'auto',
    paddingRight: '9px',
    maxHeight: 'calc(95vh - 156px)',
    '&::-webkit-scrollbar': {
      width: '9px',
    },
    '&::-webkit-scrollbar-thumb': {
      background: symphony.palette.D300,
      borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb:active': {
      background: symphony.palette.D200,
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: symphony.palette.D400,
    },
    '&::-webkit-scrollbar-track': {
      background: symphony.palette.D100,
      borderRadius: '4px',
    },
  },
}));

const ThresholdQuery = graphql`
  query ThresholdTypesQuery {
    thresholds {
      edges {
        node {
          id
          name
          description
          status
          kpi {
            id
            name
          }
          rule {
            id
            name
            status
            gracePeriod
            additionalInfo
            specificProblem
            eventTypeName
            startDateTime
            endDateTime
            ruleType {
              id
              name
            }
            ruleLimit {
              comparator {
                id
                name
              }
              id
              number
              limitType
            }
            eventSeverity {
              id
              name
            }
            threshold {
              id
              name
            }
          }
        }
      }
    }
  }
`;

type Rule = {
  id: string,
  name: string,
  ruleType: {
    name: string,
  },
};

type Thresholds = {
  item: {
    node: {
      id: string,
      name: string,
      description: string,
      status: boolean,
      kpi: {
        id: string,
        name: string,
      },
      rule: Array<Rule>,
    },
  },
};

const ThresholdTypes = () => {
  const classes = useStyles();

  const [dataThreshold, setDataThreshold] = useState({});
  const [showEditCard, setShowEditCard] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditRuleForm, setShowEditRuleForm] = useState(false);
  const [dataEdit, setDataEdit] = useState({});

  useEffect(() => {
    isCompleted();
  }, []);

  const isCompleted = useCallback(() => {
    fetchQuery(RelayEnvironment, ThresholdQuery, {}).then(data => {
      setDataThreshold(data);
    });
  }, [setDataThreshold]);

  const handleRemove = id => {
    const variables: RemoveThresholdMutationVariables = {
      id: id,
    };
    RemoveThresholdMutation(variables, {onCompleted: () => isCompleted()});
  };

  // render Add Rule

  const showAddRuleItemForm = (thresholds: Thresholds) => {
    setDataEdit(thresholds);
    setShowAddForm(true);
  };

  const hideAddRuleForm = () => {
    setShowAddForm(false);
  };

  if (showAddForm) {
    return (
      <AddRuleItemForm
        threshold={dataEdit.item.node}
        hideAddRuleForm={hideAddRuleForm}
        isCompleted={isCompleted}
      />
    );
  }

  // render edit rule

  const showEditRuleItemForm = (thresholds: Thresholds) => {
    setDataEdit(thresholds);
    setShowEditRuleForm(true);
  };

  const hideEditRuleForm = () => {
    setShowEditRuleForm(false);
  };

  if (showEditRuleForm) {
    return (
      <ThresholdProvider>
        <EditRuleItemForm
          threshold={dataEdit.item.node}
          hideAddRuleForm={hideEditRuleForm}
          isCompleted={isCompleted}
        />
      </ThresholdProvider>
    );
  }

  // render Edit Threshold

  const showEditThresholdItemForm = (thresholds: Thresholds) => {
    setShowEditCard(true);
    setDataEdit(thresholds);
  };

  const hideEditThresholdForm = () => {
    setShowEditCard(false);
  };

  const thresholdNames = dataThreshold.thresholds?.edges.map(
    item => item?.node.name,
  );

  if (showEditCard) {
    return (
      <ThresholdProvider>
        <EditThresholdItemForm
          thresholdNames={thresholdNames}
          formValues={dataEdit?.item.node}
          dataRulesTable={dataThreshold.thresholds?.edges.map(
            item => item.node,
          )}
          hideEditThresholdForm={hideEditThresholdForm}
          editRule={() => {
            showEditRuleItemForm(dataEdit);
          }}
          isCompleted={isCompleted}
        />
      </ThresholdProvider>
    );
  }

  return (
    <ThresholdProvider>
      <Grid className={classes.root} container spacing={0}>
        <Grid className={classes.titleThreshold} item xs={12}>
          <ConfigureTitle
            title={fbt('Thresholds', 'Threshold Title')}
            subtitle={fbt(
              'Thresholds definition for alarm generation',
              'Threshold description',
            )}
          />
        </Grid>
        <Grid spacing={1} container>
          <Grid item xs={12} sm={12} lg={9} xl={9}>
            <TitleTextCardsThresholds />
            <List disablePadding className={classes.listContainer}>
              {dataThreshold.thresholds?.edges.map((item, index) => (
                <ThresholdTypeItem
                  key={index}
                  deleteItem={() => handleRemove(item.node?.id)}
                  edit={() => showEditThresholdItemForm({item})}
                  addRule={() => showAddRuleItemForm({item})}
                  editRule={() => showEditRuleItemForm({item})}
                  isCompleted={isCompleted}
                  {...item?.node}
                />
              ))}
            </List>
          </Grid>
          <Grid item xs={12} sm={12} lg={3} xl={3}>
            <AddThresholdItemForm
              thresholdNames={dataThreshold.thresholds?.edges}
              isCompleted={isCompleted}
            />
          </Grid>
        </Grid>
      </Grid>
    </ThresholdProvider>
  );
};

export default ThresholdTypes;
