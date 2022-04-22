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
  AddEditParametersCatalogType_editingParametersCatalogType$data,
  AddEditParametersCatalogType_editingParametersCatalogType,
} from './__generated__/AddEditParametersCatalogType_editingParametersCatalogType.graphql';

import type {WithAlert} from '@fbcnms/ui/components/Alert/withAlert';
import type {WithSnackbarProps} from 'notistack';
import type {WithStyles} from '@material-ui/core';
import type {PayloadError} from 'relay-runtime';

import React, {useState, useEffect, useCallback, useReducer} from 'react';
import {createFragmentContainer, graphql} from 'react-relay';
import {withSnackbar} from 'notistack';
import {withStyles} from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import withAlert from '@fbcnms/ui/components/Alert/withAlert';

import editPropertyCategoryTypeMutation from '../mutations/EditPropertyCategoryTypeMutation';

import SnackbarItem from '@fbcnms/ui/components/SnackbarItem';

import Button from '@symphony/design-system/components/Button';
import PageFooter from '@fbcnms/ui/components/PageFooter';

import {getGraphError} from '../../../../common/EntUtils';

import PropertyCategory from '../components/PropertyCategory.js';
import DraggableTableRow from '../../../draggable/DraggableTableRow';
import ExpandingPanel from '@fbcnms/ui/components/ExpandingPanel';
import type {
  ParametersCatalogType,
  PropertyCategoriesType,
  PropertyCategoryType,
  PropertyCategoriesTypeStateType,
} from '../types';
import FormAction from '@symphony/design-system/components/Form/FormAction';
import {DeleteIcon, PlusIcon} from '@symphony/design-system/icons';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import inventoryTheme from '../../../../common/theme';
import {reducer, getInitialState} from '../utils/PropertyCategoryMutateReducer';
import type {PropertyCategoryMutateStateActionType} from '../utils/PropertyCategoryMutateAction';
import PropertyCategoryMutateDispatchContext from '../utils/PropertyCategoryMutateDispatchContext';
import DroppableTableBody from '../../../draggable/DroppableTableBody';

const styles = theme => ({
  draggableRow: {
    display: 'flex',
    paddingLeft: '10px',
    alignItems: 'center',
    boxShadow: theme.shadows[1],
    borderRadius: 4,
  },
  cell: {
    ...inventoryTheme.textField,
    paddingLeft: '10px',
  },
  panel: {
    width: '100%',
    boxShadow: 'none',
  },
  row: {
    flexGrow: 1,
  },
  properties: {
    marginBottom: '24px',
    width: '100%',
  },
  savebtn: {
    marginRight: '20px',
  },
  expandingPanel: {
    width: '100%',
  },
  btnsave: {
    marginRight: '30px',
  },
  root: {
    marginBottom: '12px',
    maxWidth: '100%',
  },
  tablecell: {
    width: '100%',
    paddingLeft: '0px',
    width: 'unset',
  },
  container: {
    maxWidth: '97%',
    overflowX: 'auto',
  },
});

type Props = WithSnackbarProps &
  WithStyles<typeof styles> &
  WithAlert & {|
    categories: PropertyCategoriesType,
    catalogId: string,
    catalogName: ?string,
  |};

const sortByIndex = (
  a: $ReadOnly<{index?: ?number}>,
  b: $ReadOnly<{index?: ?number}>,
) => (a.index ?? 0) - (b.index ?? 0);

const AddEditParametersCatalogType = (props: Props) => {
  const {classes, categories, catalogId, catalogName} = props;

  const [categoriesState, dispatch] = useReducer<
    PropertyCategoriesTypeStateType,
    PropertyCategoryMutateStateActionType,
    Array<PropertyCategoryType>,
  >(reducer, categories, getInitialState);

  const onAddProperty = () => {
    dispatch({type: 'ADD_ITEM'});
  };

  const showSnackbarItem = (message, variant) => {
    props.enqueueSnackbar(message, {
      children: key => (
        <SnackbarItem id={key} message={message} variant={variant} />
      ),
    });
  };

  const onSave = () => {
    const handleErrors = (error: PayloadError) => {
      const errorMessage = getGraphError(error);
      showSnackbarItem(errorMessage, 'error');
    };

    const input = categoriesState.items.map(prop => ({
      id: prop.id.includes('tmp') ? null : prop.id,
      name: String(prop.name),
      index: Number(prop.index),
      parameterCatalogId: catalogId,
    }));

    editPropertyCategoryTypeMutation(
      {propertyCategories: input},
      {
        onError: (error: any) => {
          handleErrors(error);
        },
        onCompleted: (response, errors) => {
          if (errors) {
            return;
          }
          showSnackbarItem('Saved', 'success');
          const newItems = (response.editPropertyCategories || []).map(el => ({
            ...el,
          }));
          dispatch({
            type: 'UPDATE_LIST_AFTER_SAVE',
            newItems: newItems,
          });
        },
      },
    );
  };

  const _onDragEnd = result => {
    if (!result.destination) {
      return;
    }
    dispatch({
      type: 'CHANGE_ITEM_POSITION',
      sourceIndex: result.source.index,
      destinationIndex: result.destination.index,
    });
  };
  return (
    <ExpandingPanel
      allowExpandCollapse={true}
      defaultExpanded={false}
      title={String(catalogName)}
      className={classes.panel}
      rightContent={
        <Button onClick={onSave} className={classes.btnsave}>
          Save
        </Button>
      }>
      <div className={classes.container}>
        <PropertyCategoryMutateDispatchContext.Provider value={dispatch}>
          <Table component="div" className={classes.root}>
            <TableHead component="div">
              <TableRow component="div">
                <TableCell size="small" padding="none" component="div" />
                <TableCell component="div" className={classes.cell}>
                  Name
                </TableCell>
                <TableCell component="div" />
                <TableCell component="div" />
              </TableRow>
            </TableHead>
            <DroppableTableBody onDragEnd={_onDragEnd}>
              {!!categoriesState &&
                categoriesState.items
                  .slice()
                  .sort(sortByIndex)
                  .map((el: PropertyCategoryType, i) => {
                    return (
                      <PropertyCategory
                        propertyCategory={el}
                        key={i}
                        index={i}
                      />
                    );
                  })}
            </DroppableTableBody>
          </Table>
        </PropertyCategoryMutateDispatchContext.Provider>
      </div>
      <FormAction>
        <Button variant="text" onClick={onAddProperty} leftIcon={PlusIcon}>
          Add Parameter
        </Button>
      </FormAction>
    </ExpandingPanel>
  );
};

export default withStyles(styles)(
  withAlert(withSnackbar(AddEditParametersCatalogType)),
);
