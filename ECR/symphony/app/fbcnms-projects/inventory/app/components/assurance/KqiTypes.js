/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import ConfigureTitle from './common/ConfigureTitle';
import React, {useCallback, useEffect, useState} from 'react';
import RelayEnvironment from '../../common/RelayEnvironment';
import {Grid} from '@material-ui/core';
import {makeStyles} from '@material-ui/styles';

import KqiFormCreate from './KqiFormCreate';
import KqiFormEdit from './KqiFormEdit';

import Button from '@symphony/design-system/components/Button';
import KqiTable from './KqiTable';
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

const KqiQuery = graphql`
  query KqiTypesQuery {
    kqis {
      edges {
        node {
          id
          name
          description
          formula
          startDateTime
          endDateTime
          kqiCategory {
            id
            name
          }
          kqiPerspective {
            id
            name
          }
          kqiSource {
            id
            name
          }
          kqiTemporalFrequency {
            id
            name
          }
          kqiTarget {
            id
            name
            impact
            allowedVariation
            initTime
            endTime
            status
            period
            kqi {
              id
              name
            }
            kqiComparator {
              kqiTargetFk {
                id
                name
              }
              comparatorFk {
                id
                name
              }
              id
              number
              comparatorType
            }
          }
        }
      }
    }
    kqiPerspectives {
      edges {
        node {
          id
          name
        }
      }
    }
    kqiSources {
      edges {
        node {
          id
          name
        }
      }
    }
    kqiCategories {
      edges {
        node {
          id
          name
        }
      }
    }
    kqiTemporalFrequencies {
      edges {
        node {
          id
          name
        }
      }
    }
    kqiTargets {
      edges {
        node {
          id
          name
          impact
          allowedVariation
          initTime
          endTime
          status
          period
          kqi {
            id
            name
          }
          kqiComparator {
            kqiTargetFk {
              id
              name
            }
            comparatorFk {
              id
              name
            }
            id
            number
            comparatorType
          }
        }
      }
    }
    comparators {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;

export type Kqis = {
  item: {
    id: string,
    name: string,
    description: string,
    formula: string,
    startDateTime: string,
    endDateTime: string,
    kqiCategory: {
      id: string,
      name: string,
    },
    kqiPerspective: {
      id: string,
      name: string,
    },
    kqiSource: {
      id: string,
      name: string,
    },
    kqiTemporalFrequency: {
      id: string,
      name: string,
    },
  },
};

const KqiTypes = () => {
  const classes = useStyles();
  const [dataKqi, setDataKqi] = useState({});
  const [dataEdit, setDataEdit] = useState<Kqis>({});
  const [showFormCreate, setShowFormCreate] = useState(false);
  const [showFormEdit, setShowFormEdit] = useState(false);

  const dataResponseKqi = dataKqi.kqis?.edges.map(item => item.node) || [];
  const dataResponsePerspectives = dataKqi.kqiPerspectives?.edges.map(
    item => item.node,
  );
  const dataResponseSources = dataKqi.kqiSources?.edges.map(item => item.node);
  const dataResponseCategories = dataKqi.kqiCategories?.edges.map(
    item => item.node,
  );
  const dataResponseTemporalFrequencies = dataKqi.kqiTemporalFrequencies?.edges.map(
    item => item.node,
  );
  const dataResponseKqiTargets = dataKqi.kqiTargets?.edges.map(
    item => item.node,
  );
  const dataResponseComparators = dataKqi.comparators?.edges.map(
    item => item.node,
  );

  useEffect(() => {
    isCompleted();
  }, []);

  const isCompleted = useCallback(() => {
    fetchQuery(RelayEnvironment, KqiQuery, {}).then(data => {
      setDataKqi(data);
    });
  }, [setDataKqi]);

  const handleClick = () => {
    setShowFormCreate(true);
  };

  const formEdit = (kqi: Kqis) => {
    setShowFormEdit(true);
    setDataEdit(kqi);
  };

  if (showFormCreate) {
    return (
      <KqiFormCreate
        isCompleted={isCompleted}
        dataKqi={dataResponseKqi}
        dataPerspectives={dataResponsePerspectives}
        dataSources={dataResponseSources}
        dataCategories={dataResponseCategories}
        dataTemporalFrequencies={dataResponseTemporalFrequencies}
        returnTableKqi={() => setShowFormCreate(false)}
      />
    );
  }

  if (showFormEdit) {
    return (
      <KqiFormEdit
        isCompleted={isCompleted}
        formValues={dataEdit}
        dataKqi={dataResponseKqi}
        dataPerspectives={dataResponsePerspectives}
        dataSources={dataResponseSources}
        dataCategories={dataResponseCategories}
        dataTemporalFrequencies={dataResponseTemporalFrequencies}
        dataKqiTarget={dataResponseKqiTargets}
        dataComparator={dataResponseComparators}
        returnTableKqi={() => setShowFormEdit(false)}
      />
    );
  }

  return (
    <Grid className={classes.root}>
      <Grid
        className={classes.header}
        container
        direction="row"
        justify="flex-end"
        alignItems="center">
        <Grid item xs>
          <ConfigureTitle
            title={fbt('KQI (Key Quality Indicator) ', 'KQI Title')}
            subtitle={fbt(
              'Quality indicators and targets to be defined by users and used by service quality management processes',
              'KQI description',
            )}
          />
        </Grid>
        <Grid>
          <Button onClick={handleClick}>Add KQI</Button>
        </Grid>
      </Grid>
      <Grid item>
        <KqiTable dataValues={dataResponseKqi} viewFormEdit={formEdit} />
      </Grid>
    </Grid>
  );
};
export default KqiTypes;
