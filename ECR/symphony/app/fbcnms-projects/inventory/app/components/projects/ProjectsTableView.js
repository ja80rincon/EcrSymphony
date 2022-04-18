/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {
  ProjectOrder,
  ProjectOrderField,
} from './__generated__/ProjectsTableViewPaginationQuery.graphql';
import type {ProjectsTableViewPaginationQuery} from './__generated__/ProjectsTableViewPaginationQuery.graphql';
import type {ProjectsTableView_query$key} from './__generated__/ProjectsTableView_query.graphql';

import Button from '@symphony/design-system/components/Button';
import DateTimeFormat from '../../common/DateTimeFormat';
import LocationLink from '../location/LocationLink';
import PriorityTag from '../work_orders/PriorityTag';
import React, {useMemo, useState} from 'react';
import Table from '@symphony/design-system/components/Table/Table';
import TableColumnSelector from '@symphony/design-system/components/Table/TableColumnSelector';
import Toolbar from '@material-ui/core/Toolbar';
import fbt from 'fbt';
import {TABLE_SORT_ORDER} from '@symphony/design-system/components/Table/TableContext';
import {getPropertyValue} from '../../common/Property';
import {graphql} from 'react-relay';
import {makeStyles} from '@material-ui/styles';
import {usePaginationFragment} from 'react-relay/hooks';

const useStyles = makeStyles(() => ({
  workOrderCell: {
    borderRadius: '15px',
    minWidth: '26px',
  },
  table: {
    height: '100%',
  },
}));

export const PROJECTS_PAGE_SIZE = 15;
export const defaultVisibleColumnsKeys: {[key: string]: string} = {
  name: 'name',
  numberOfWorkOrders: 'numberOfWorkOrders',
  type: 'type',
  location: 'location',
  owner: 'owner',
  priority: 'priority',
  createTime: 'createTime',
};

type Props = $ReadOnly<{|
  projects: ProjectsTableView_query$key,
  onProjectSelected: string => void,
  orderBy: ProjectOrder,
  onOrderChanged: (newOrderSettings: ProjectOrder) => void,
  onOrderPropertyChanged: (newPropertyTypeValue: string) => void, //set string values
  onOrderDirectionChanged: (newPropertyTypeDirection: string) => void,
  visibleColumns: string[],
  propertyNames: string[],
  setVisibleColumns: (string[]) => void,
|}>;

const ProjectsTableView = (props: Props) => {
  const {
    onProjectSelected,
    orderBy,
    onOrderChanged,
    visibleColumns,
    setVisibleColumns,
    onOrderPropertyChanged,
    onOrderDirectionChanged,
    propertyNames,
  } = props;
  const classes = useStyles();

  // $FlowFixMe[missing-type-arg] $FlowFixMe T74239404 Found via relay types
  const {data, loadNext} = usePaginationFragment<
    ProjectsTableViewPaginationQuery,
    ProjectsTableView_query$key,
  >(
    graphql`
      fragment ProjectsTableView_query on Query
      @argumentDefinitions(
        first: {type: "Int"}
        orderBy: {type: "ProjectOrder"}
        filterBy: {type: "[ProjectFilterInput!]"}
        propertyValue: {type: "String"}
        propertyOrder: {type: "String"}
        cursor: {type: "Cursor"}
      )
      @refetchable(queryName: "ProjectsTableViewPaginationQuery") {
        projects(
          after: $cursor
          first: $first
          orderBy: $orderBy
          propertyValue: $propertyValue
          propertyOrder: $propertyOrder
          filterBy: $filterBy
        ) @connection(key: "ProjectsTableView_projects") {
          totalCount
          edges {
            node {
              id
              createTime
              name
              createdBy {
                email
              }
              location {
                id
                name
              }
              type {
                id
                name
              }
              priority
              properties {
                id
                stringValue
                intValue
                floatValue
                booleanValue
                latitudeValue
                longitudeValue
                rangeFromValue
                rangeToValue
                nodeValue {
                  id
                  name
                }
                propertyType {
                  id
                  name
                  type
                  nodeType
                  isEditable
                  isMandatory
                  isInstanceProperty
                  stringValue
                  intValue
                  floatValue
                  booleanValue
                  latitudeValue
                  longitudeValue
                  rangeFromValue
                  rangeToValue
                }
              }
              numberOfWorkOrders
            }
          }
        }
      }
    `,
    props.projects,
  );

  const [columns, setColumns] = useState(
    [
      {
        key: defaultVisibleColumnsKeys.name,
        title: 'Project',
        render: row => (
          <Button
            variant="text"
            onClick={() => onProjectSelected(row.id)}
            tooltip={row.name ?? ''}>
            {row.name}
          </Button>
        ),
        isSortable: true,
      },
      {
        key: defaultVisibleColumnsKeys.numberOfWorkOrders,
        title: 'Work Orders',
        render: row =>
          row?.numberOfWorkOrders ? (
            <Button
              className={classes.workOrderCell}
              onClick={() => onProjectSelected(row.id)}>
              {row.numberOfWorkOrders}
            </Button>
          ) : null,
      },
      {
        key: defaultVisibleColumnsKeys.type,
        title: `${fbt('Template', '')}`,
        render: row => row.type?.name ?? '',
        tooltip: row => row.type?.name ?? '',
      },
      {
        key: defaultVisibleColumnsKeys.location,
        title: 'Location',
        render: row =>
          row.location ? (
            <LocationLink title={row.location.name} id={row.location.id} />
          ) : (
            ''
          ),
        tooltip: row => row.location?.name ?? '',
      },
      {
        key: defaultVisibleColumnsKeys.owner,
        title: 'Owner',
        render: row => row?.createdBy?.email ?? '',
        tooltip: row => row.createdBy?.email ?? '',
      },
      {
        key: defaultVisibleColumnsKeys.priority,
        title: 'Priority',
        render: row => <PriorityTag priority={row.priority} />,
        isSortable: true,
      },
      {
        key: defaultVisibleColumnsKeys.createTime,
        title: 'Creation Time',
        render: row => DateTimeFormat.dateTime(row.createTime),
        tooltip: row => DateTimeFormat.dateTime(row.createTime),
        isSortable: true,
      },

      ...propertyNames
        .filter(name => !!name)
        .map((name = '') => ({
          hidden: true,
          key: name,
          title: name,
          getSortingValue: row => row.type?.name,
          render: row => {
            const indexOfProperty = row.properties.findIndex(
              property => property.propertyType.name === name,
            );
            const renderRowValues =
              indexOfProperty >= 0 ? (
                row.properties[indexOfProperty]?.propertyType?.nodeType ===
                'project' ? (
                  <Button
                    variant="text"
                    onClick={() =>
                      onProjectSelected(
                        row.properties[indexOfProperty].nodeValue.id,
                      )
                    }
                    tooltip={
                      row.properties[indexOfProperty].nodeValue?.name ?? ''
                    }>
                    {row.properties[indexOfProperty].nodeValue?.id}
                  </Button>
                ) : (
                  getPropertyValue(row.properties[indexOfProperty])
                )
              ) : null;

            return renderRowValues;
          },
          tooltip: row => {
            const indexOfProperty = row.properties.findIndex(
              property => property.propertyType.name === name,
            );

            return (
              (indexOfProperty >= 0 &&
                getPropertyValue(row.properties[indexOfProperty])) ||
              null
            );
          },
          isSortable: true,
        })),
    ].map(column => {
      const hidden = !visibleColumns.includes(column.key);
      return {
        ...column,
        hidden,
        value: column.title,
        isSelected: !hidden,
      };
    }),
  );

  const projectsData = useMemo(
    () =>
      data?.projects?.edges.map(edge => {
        if (edge.node) {
          return {...edge.node, key: edge.node.id};
        }
      }),
    [data],
  );

  if (projectsData == null || projectsData.length === 0) {
    return <div />;
  }

  const orderByObj: {[string]: ProjectOrderField} = {
    name: 'NAME',
    createTime: 'CREATED_AT',
    updateTime: 'UPDATED_AT',
    priority: 'PRIORITY',
    property: 'PROPERTY',
  };

  const getSortSettings = orderBy => {
    const orderByColumnObj: {[ProjectOrderField]: string} = {
      NAME: 'name',
      CREATED_AT: 'createTime',
      UPDATED_AT: 'updateTime',
      PRIORITY: 'priority',
      PROPERTY: 'property',
    };

    if (!orderBy.field || !orderByColumnObj[orderBy.field]) {
      return undefined;
    }

    return {
      columnKey: orderByColumnObj[orderBy.field],
      order:
        orderBy.direction === 'ASC'
          ? TABLE_SORT_ORDER.ascending
          : TABLE_SORT_ORDER.descending,
      overrideSorting: true,
    };
  };

  if (projectsData.length === 0) {
    return null;
  }

  return (
    <>
      <Toolbar>
        <TableColumnSelector
          columnDataList={columns.map(({key, title, value, isSelected}) => ({
            key,
            title,
            value,
            isSelected,
          }))}
          wrapperStyle={{marginLeft: 'auto'}}
          handleOnChange={clickedOption => {
            setVisibleColumns(
              clickedOption.isSelected
                ? visibleColumns.filter(c => c !== clickedOption.key)
                : [...visibleColumns, clickedOption.key],
            );
            setColumns([
              ...columns.map(listOption =>
                listOption.value === clickedOption?.value
                  ? {
                      ...listOption,
                      isSelected: !listOption.isSelected,
                      hidden: !listOption.hidden,
                    }
                  : listOption,
              ),
            ]);
          }}
        />
      </Toolbar>
      <Table
        className={classes.table}
        data={projectsData}
        columns={columns.map(
          ({isSelected: _isSelected, value: _value, ...rest}) => rest,
        )}
        onSortChanged={newSortSettings => {
          onOrderPropertyChanged(
            orderByObj[newSortSettings.columnKey]
              ? ''
              : newSortSettings.columnKey,
          );
          onOrderDirectionChanged(
            newSortSettings.order === TABLE_SORT_ORDER.ascending
              ? 'ASC'
              : 'DESC',
          );
          return onOrderChanged({
            direction:
              newSortSettings.order === TABLE_SORT_ORDER.ascending
                ? 'ASC'
                : 'DESC',
            field: orderByObj[newSortSettings.columnKey]
              ? orderByObj[newSortSettings.columnKey]
              : 'UPDATED_AT',
          });
        }}
        paginationSettings={{
          loadNext: onCompleted => {
            loadNext(PROJECTS_PAGE_SIZE, {
              // $FlowFixMe[incompatible-call] $FlowFixMe T74239404 Found via relay types
              onComplete: () => onCompleted && onCompleted(),
            });
          },
          pageSize: PROJECTS_PAGE_SIZE,
          totalRowsCount: data.projects.totalCount,
        }}
        sortSettings={getSortSettings(orderBy)}
      />
    </>
  );
};

export default ProjectsTableView;
