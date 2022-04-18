/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

import type {
  ParametersCatalogPageQuery,
  ParametersCatalogPageQueryResponse,
} from './__generated__/ParametersCatalogPageQuery.graphql';
import type {PropertyCategoryType, ParametersCatalogType} from '../types';

import ConfigueTitle from '@fbcnms/ui/components/ConfigureTitle';

import React, {useState, useMemo} from 'react';
import fbt from 'fbt';
import {makeStyles} from '@material-ui/styles';

import {graphql} from 'relay-runtime';
import {useLazyLoadQuery} from 'react-relay/hooks';

import LocationTypeItem from '../../../configure/LocationTypeItem';

import AddEditParametersCatalogType from '../components/AddEditParametersCatalogType';

const useStyles = makeStyles(theme => ({
  typesList: {
    padding: '24px',
  },
  firstRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    marginLeft: '10px',
  },
  root: {
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
  },
  table: {
    width: '100%',
    marginTop: '15px',
  },
  listItem: {
    marginBottom: theme.spacing(),
  },
}));

const parametersCatalogPageQuery = graphql`
  query ParametersCatalogPageQuery {
    parametersCatalog {
      edges {
        node {
          id
          name
          index
          isDisabled
          propertyCategories {
            id
            name
            index
            numberOfProperties
          }
        }
      }
    }
  }
`;

const useParameterCatalogNodes = () => {
  const {
    parametersCatalog,
  }: ParametersCatalogPageQueryResponse = useLazyLoadQuery<ParametersCatalogPageQuery>(
    parametersCatalogPageQuery,
    {},
  );
  return parametersCatalog?.edges.map(edge => edge.node).filter(Boolean) ?? [];
};

const sortByIndex = (
  a: $ReadOnly<{index?: ?number}>,
  b: $ReadOnly<{index?: ?number}>,
) => (a.index ?? 0) - (b.index ?? 0);

export const ParametersCatalogPage = () => {
  const classes = useStyles();
  const parameterCatalogNodes = useParameterCatalogNodes();

  const parametersCatalogData = useMemo(
    () =>
      parameterCatalogNodes.map(e => ({
        ...e,
        propertyCategories: [...e.propertyCategories],
      })),
    [parameterCatalogNodes],
  );

  return (
    <div className={classes.typesList}>
      <div className={classes.firstRow}>
        <ConfigueTitle
          className={classes.title}
          title={fbt('Parameters Catalog', 'Parameters Catalog header')}
          subtitle={fbt(
            "Add and manage your organization's users by entering their details and selecting a role.",
            'Parameters Catalog subheader',
          )}
        />
      </div>
      <div className={classes.root}>
        {!!parametersCatalogData &&
          parametersCatalogData?.sort(sortByIndex).map((catalog, i) => {
            return (
              <div key={i} className={classes.listItem}>
                <AddEditParametersCatalogType
                  categories={catalog.propertyCategories}
                  catalogId={catalog.id}
                  catalogName={catalog.name}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default ParametersCatalogPage;
