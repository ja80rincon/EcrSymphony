/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import * as React from 'react';
import ProjectsMap from './ProjectsMap';
import ProjectsTableView, {PROJECTS_PAGE_SIZE} from './ProjectsTableView';
import {DisplayOptions} from '../InventoryViewContainer';
import {graphql} from 'relay-runtime';
import {makeStyles} from '@material-ui/styles';
import {useLazyLoadQuery} from 'react-relay/hooks';

import type {DisplayOptionTypes} from '../InventoryViewContainer';
import type {
  ProjectComparisonViewQueryRendererSearchQuery,
  ProjectOrder,
} from './__generated__/ProjectComparisonViewQueryRendererSearchQuery.graphql';

import ComparisonViewNoResults from '../comparison_view/ComparisonViewNoResults';
import classNames from 'classnames';
import {useEffect} from 'react';
import {useMemo} from 'react';
import {useState} from 'react';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  noResultsRoot: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '100px',
    width: '100%',
  },
  noResultsLabel: {
    color: theme.palette.grey[600],
  },
  searchIcon: {
    color: theme.palette.grey[600],
    marginBottom: '6px',
    fontSize: '36px',
  },
  bar: {
    borderBottom: '2px solid #f0f0f0',
  },
  groupButtons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  buttonContent: {
    paddingTop: '4px',
  },
}));

type Props = $ReadOnly<{|
  className?: string,
  limit?: number,
  filters: Array<any>,
  orderBy: ProjectOrder,
  onOrderChanged: (newOrderSettings: ProjectOrder) => void,
  orderPropertyType?: string, //propertyValue
  orderPropertyDirection?: string,
  onOrderPropertyChanged: (newPropertyTypeValue: string) => void, //set string values
  onOrderDirectionChanged: (newPropertyTypeDirection: string) => void,
  displayMode?: DisplayOptionTypes,
  onProjectSelected: (projectID: string) => void,
  createProjectButton: React.Node,
  visibleColumns: string[],
  setVisibleColumns: (string[]) => void,
  propertyNames: string[],
|}>;

const projectSearchQuery = graphql`
  query ProjectComparisonViewQueryRendererSearchQuery(
    $limit: Int
    $filters: [ProjectFilterInput!]!
    $orderBy: ProjectOrder
    $propertyValue: String
    $propertyOrder: String
  ) {
    ...ProjectsTableView_query
      @arguments(
        first: $limit
        orderBy: $orderBy
        filterBy: $filters
        propertyValue: $propertyValue
        propertyOrder: $propertyOrder
      )
    projectsMap: projects(
      first: 100
      orderBy: $orderBy
      filterBy: $filters
      propertyValue: $propertyValue
      propertyOrder: $propertyOrder
    ) {
      totalCount
      edges {
        node {
          ...ProjectsMap_projects
        }
      }
    }
  }
`;

const ProjectComparisonViewQueryRenderer = (props: Props) => {
  const classes = useStyles();
  const [tableKey, setTableKey] = useState(0);

  const {
    filters,
    orderBy,
    onProjectSelected,
    displayMode,
    className,
    onOrderChanged,
    visibleColumns,
    setVisibleColumns,
    orderPropertyType,
    orderPropertyDirection,
    onOrderPropertyChanged,
    onOrderDirectionChanged,
    propertyNames,
    // createProjectButton,
  } = props;

  const filtersVariable = useMemo(
    () =>
      filters.map(f => ({
        filterType: f.name.toUpperCase(),
        operator: f.operator.toUpperCase(),
        stringValue: f.stringValue,
        propertyValue: f.propertyValue,
        idSet: f.idSet,
        stringSet: f.stringSet,
      })),
    [filters],
  );
  useEffect(() => setTableKey(key => key + 1), [filtersVariable, orderBy]);

  const response =
    useLazyLoadQuery<ProjectComparisonViewQueryRendererSearchQuery>(
      projectSearchQuery,
      {
        limit: PROJECTS_PAGE_SIZE,
        filters: filtersVariable,
        orderBy,
        propertyValue: orderPropertyType,
        propertyOrder: orderPropertyDirection,
      },
    );

  if (response == null || response.projectsMap == null) {
    return null;
  }

  const {totalCount} = response.projectsMap;
  if (totalCount === 0) {
    return <ComparisonViewNoResults />;
  }

  return (
    <div className={classNames(classes.root, className)}>
      {displayMode === DisplayOptions.map ? (
        <ProjectsMap
          projects={response.projectsMap.edges
            .filter(Boolean)
            // $FlowFixMe[incompatible-type] $FlowFixMe T74239404 Found via relay types
            // $FlowFixMe[prop-missing] $FlowFixMe T74239404 Found via relay types
            .map(edge => edge.node)}
        />
      ) : (
        <ProjectsTableView
          key={tableKey}
          orderBy={orderBy}
          projects={response}
          onProjectSelected={onProjectSelected}
          onOrderChanged={onOrderChanged}
          onOrderPropertyChanged={onOrderPropertyChanged}
          onOrderDirectionChanged={onOrderDirectionChanged}
          visibleColumns={visibleColumns}
          setVisibleColumns={setVisibleColumns}
          propertyNames={propertyNames}
        />
      )}
    </div>
  );
};

export default ProjectComparisonViewQueryRenderer;
