/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {AppContextType} from '@fbcnms/ui/context/AppContext';
import type {PropertyCategoriesType, PropertyCategoryType} from '../types';
import type {WithStyles} from '@material-ui/core';
import type {WithAlert} from '@fbcnms/ui/components/Alert/withAlert';
import type {WithSnackbarProps} from 'notistack';
import type {PayloadError} from 'relay-runtime';

import {withSnackbar} from 'notistack';
import withAlert from '@fbcnms/ui/components/Alert/withAlert';
import AppContext from '@fbcnms/ui/context/AppContext';
import Button from '@symphony/design-system/components/Button';
import React, {
  useState,
  useContext,
  useRef,
  useEffect,
  useCallback,
  useReducer,
} from 'react';

import SnackbarItem from '@fbcnms/ui/components/SnackbarItem';
import {getGraphError} from '../../../../common/EntUtils';
import FormAction from '@symphony/design-system/components/Form/FormAction';
import FormField from '@symphony/design-system/components/FormField/FormField';
import IconButton from '@symphony/design-system/components/IconButton';

import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextInput from '@symphony/design-system/components/Input/TextInput';

import {DeleteIcon, PlusIcon} from '@symphony/design-system/icons';
import {removeItem, setItem, updateItem} from '@fbcnms/util/arrays';
import {withStyles} from '@material-ui/core/styles';

import DraggableTableRow from '../../../draggable/DraggableTableRow';
import DroppableTableBody from '../../../draggable/DroppableTableBody';
import {reorder} from '../utils';
import inventoryTheme from '../../../../common/theme';
import PropertyCategoryMutateDispatchContext from '../utils/PropertyCategoryMutateDispatchContext';
import RemovePropertyCategoryTypeMutation from '../mutations/RemovePropertyCategoryTypeMutation';

const styles = () => ({
  container: {
    maxWidth: '1366px',
    overflowX: 'auto',
  },
  root: {
    marginBottom: '12px',
    maxWidth: '100%',
  },
  input: {
    ...inventoryTheme.textField,
    marginTop: '0px',
    marginBottom: '0px',
    width: '100%',
  },
  nameInput: {
    display: 'inline-flex',
    marginBottom: '16px',
    width: '100%',
  },
  cell: {
    ...inventoryTheme.textField,
    paddingLeft: '0px',
    width: 'unset',
  },
  selectMenu: {
    height: '14px',
  },
  actionsBar: {
    width: '20px',
  },
});

type Props = WithSnackbarProps &
  WithStyles<typeof styles> &
  WithAlert & {|
    propertyCategory: PropertyCategoryType,
    index: number,
  |};

const PropertyCategory = (props: Props) => {
  const {classes, propertyCategory, index} = props;
  const dispatch = useContext(PropertyCategoryMutateDispatchContext);

  const handleNameChange = (index: number, event) => {
    const newProp = {
      ...propertyCategory,
      name: event.target.value,
    };
    dispatch({type: 'EDIT_ITEM', value: newProp});
  };

  const handleNameBlur = (index: number, event) => {};

  const showSnackbarItem = (message, variant) => {
    props.enqueueSnackbar(message, {
      children: key => (
        <SnackbarItem id={key} message={message} variant={variant} />
      ),
    });
  };
  const handleErrors = (error: PayloadError) => {
    const errorMessage = getGraphError(error);
    showSnackbarItem(errorMessage, 'error');
  };

  const handleDeleteClick = (propCat: PropertyCategoryType) => {
    if (!propCat.id.includes('@tmp')) {
      props
        .confirm(`Are you sure you want to delete "${String(propCat?.name)}"?`)
        .then(confirm => {
          if (!confirm) {
            return;
          }
          RemovePropertyCategoryTypeMutation(
            {id: propCat.id},
            {
              onError: (error: any) => {
                handleErrors(error);
              },
              onCompleted: (response, errors) => {
                showSnackbarItem('Deleted', 'success');
              },
            },
            () => {
              dispatch({
                type: 'REMOVE_ITEM',
                itemId: propertyCategory.id,
              });
            },
          );
        });
    } else {
      dispatch({
        type: 'REMOVE_ITEM',
        itemId: propertyCategory.id,
      });
    }
  };

  return (
    <DraggableTableRow
      id={propertyCategory.id}
      index={index}
      key={propertyCategory.id}>
      <TableCell className={classes.cell} component="div" scope="row">
        <FormField>
          <TextInput
            autoFocus={true}
            placeholder="Name"
            className={classes.nameInput}
            value={propertyCategory.name || ''}
            onChange={event => handleNameChange(index, event)}
            onBlur={event => handleNameBlur(index, event)}
          />
        </FormField>
      </TableCell>
      <TableCell className={classes.actionsBar} align="right" component="div">
        <FormAction>
          <IconButton
            skin="primary"
            disabled={
              !!propertyCategory.numberOfProperties &&
              !propertyCategory.id.includes('@tmp')
            }
            tooltip={
              !!propertyCategory.numberOfProperties ? 'it is already used' : ''
            }
            onClick={() => handleDeleteClick(propertyCategory)}
            icon={DeleteIcon}
            key={index}
          />
        </FormAction>
      </TableCell>
    </DraggableTableRow>
  );
};

export default withStyles(styles)(withAlert(withSnackbar(PropertyCategory)));
