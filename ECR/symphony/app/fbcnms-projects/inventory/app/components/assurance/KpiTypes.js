/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import React, {useCallback, useEffect, useState} from 'react';
import RelayEnvironment from '../../common/RelayEnvironment';
import fbt from 'fbt';
import {fetchQuery} from 'relay-runtime';
import {graphql} from 'react-relay';

import symphony from '@symphony/design-system/theme/symphony';

// COMPONENTS //
import AddKpiItemForm from './AddKpiItemForm';
import ConfigureTitle from './common/ConfigureTitle';
import KpiTypeItem from './KpiTypeItem';
import TitleTextCardsKpi from './TitleTextCardsKpi';
import {EditKpiItemForm} from './EditKpiItemForm';

// MUTATIONS //
import type {RemoveKpiMutationVariables} from '../../mutations/__generated__/RemoveKpiMutation.graphql';

import RemoveKpiMutation from '../../mutations/RemoveKpiMutation';

// DESIGN SYSTEM //
import AddFormulaDialog from './AddFormulaDialog';
import AddFormulaItemForm from './AddFormulaItemForm';
import EditFormulaDialog from './EditFormulaDialog';
import {Grid, List} from '@material-ui/core';
import {makeStyles} from '@material-ui/styles';

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 0,
    padding: '30px',
    margin: '0',
  },
  titleKpi: {
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

const KpiQuery = graphql`
  query KpiTypesQuery {
    kpis {
      edges {
        node {
          id
          name
          status
          description
          domainFk {
            id
            name
          }
          formulaFk {
            id
            textFormula
            status
            kpiFk {
              id
              name
            }
            techFk {
              id
              name
            }
            networkTypeFk {
              id
              name
            }
          }
          kpiCategoryFK {
            id
            name
          }
        }
      }
    }
    thresholds {
      edges {
        node {
          name
          kpi {
            name
          }
        }
      }
    }
    networkTypes {
      edges {
        node {
          id
          name
        }
      }
    }
    counters {
      edges {
        node {
          id
          name
        }
      }
    }
    formulas {
      edges {
        node {
          id
          networkTypeFk {
            id
            name
          }
          textFormula
          status
          techFk {
            id
            name
          }
          kpiFk {
            id
            name
          }
        }
      }
    }
  }
`;

export type Counter = {
  id: string,
  name: string,
};

export type Formula = {
  id: string,
  textFormula: string,
  status: boolean,
  techFk: {
    id: string,
    name: string,
  },
  kpiFk: {
    id: string,
    name: string,
  },
  networkTypeFk: {
    id: string,
    name: string,
  },
};

export type FormulaForm = {
  data: {
    kpi: string,
    vendors: string,
    technology: string,
    networkTypes: string,
  },
};

type Kpis = {
  item: {
    node: {
      id: string,
      name: string,
      status: boolean,
      domainFk: {
        id: string,
        name: string,
      },
      kpiCategoryFK: {
        id: string,
        name: string,
      },
      description: string,
      formulaFk: Array<Formula>,
    },
  },
};

const KpiTypes = () => {
  const classes = useStyles();

  const [dataKpis, setDataKpis] = useState({});
  const [showChecking, setShowChecking] = useState(false);
  const [showEditCard, setShowEditCard] = useState(false);
  const [dataEdit, setDataEdit] = useState<Kpis>({});
  const [openDialog, setOpenDialog] = useState(false);
  const [formulaForm, setFormulaForm] = useState<FormulaForm>({});
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [formulaEditForm, setFormulaEditForm] = useState<any>({});

  useEffect(() => {
    isCompleted();
  }, []);

  const isCompleted = useCallback(() => {
    fetchQuery(RelayEnvironment, KpiQuery, {}).then(data => {
      setDataKpis(data);
    });
  }, [setDataKpis]);

  const handleCallback = childData => {
    setFormulaForm({data: childData});
  };

  const handleFormulaClick = () => {
    setOpenDialog(true);
  };

  const handleEditCallback = childData => {
    setFormulaEditForm({data: childData});
  };

  const handleEditFormulaClick = () => {
    setOpenEditDialog(true);
  };

  const handleRemove = id => {
    const variables: RemoveKpiMutationVariables = {
      id: id,
    };
    RemoveKpiMutation(variables, {onCompleted: () => isCompleted()});
  };

  const showEditKpiItemForm = (kpis: Kpis) => {
    setShowEditCard(true);
    setDataEdit(kpis);
  };

  const hideEditKpiForm = () => {
    setShowEditCard(false);
  };

  if (showEditCard) {
    return (
      <EditKpiItemForm
        isCompleted={isCompleted}
        kpi={dataKpis.kpis?.edges.map(item => item.node)}
        dataCounter={dataKpis.counters?.edges.map(item => item.node)}
        dataFormula={formulaEditForm}
        dataFormulaTable={dataKpis.formulas?.edges.map(item => item.node)}
        formValues={dataEdit.item.node}
        threshold={dataKpis.thresholds?.edges}
        hideEditKpiForm={hideEditKpiForm}
        handleEditFormulaClick={handleEditFormulaClick}
        parentEditCallback={handleEditCallback}
      />
    );
  }

  return (
    <Grid className={classes.root} container spacing={0}>
      <Grid className={classes.titleKpi} item xs={12}>
        <ConfigureTitle
          title={fbt('KPI (Key Performance Indicator)', 'Kpi Title')}
          subtitle={fbt(
            'Indicators and formulas to be defined by users and calculated by performance management processes.',
            'Kpi description',
          )}
        />
      </Grid>
      <Grid spacing={1} container>
        <Grid item xs={12} sm={12} md={12} lg={9} xl={9}>
          <TitleTextCardsKpi />
          <List disablePadding className={classes.listContainer}>
            {dataKpis.kpis?.edges.map((item, index) => (
              <KpiTypeItem
                key={index}
                threshold={dataKpis.thresholds?.edges}
                deleteItem={() => handleRemove(item.node.id)}
                edit={() => showEditKpiItemForm({item})}
                handleEditFormulaClick={handleEditFormulaClick}
                parentEditCallback={handleEditCallback}
                isCompleted={isCompleted}
                {...item.node}
              />
            ))}
          </List>
        </Grid>
        <Grid item xs={12} sm={12} lg={3} xl={3}>
          <AddKpiItemForm
            kpiNames={dataKpis.kpis?.edges}
            isCompleted={isCompleted}
          />
          <AddFormulaItemForm
            parentCallback={handleCallback}
            handleClick={handleFormulaClick}
            checking={showChecking}
            changeChecking={() => setShowChecking(false)}
            isCompleted={isCompleted}
          />
          {openDialog && (
            <AddFormulaDialog
              open={openDialog}
              dataFormula={formulaForm}
              dataCounter={dataKpis.counters?.edges.map(item => item.node)}
              onClose={() => {
                setOpenDialog(false);
              }}
              isCompleted={isCompleted}
              changeChecking={() => setShowChecking(true)}
            />
          )}
          {openEditDialog && (
            <EditFormulaDialog
              open={openEditDialog}
              dataFormula={formulaEditForm}
              dataCounter={dataKpis.counters?.edges.map(item => item.node)}
              onClose={() => {
                setOpenEditDialog(false);
              }}
              isCompleted={isCompleted}
            />
          )}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default KpiTypes;
