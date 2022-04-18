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
import type {DocumentCategoryType} from '../../common/DocumentCategoryType';
import type {WithStyles} from '@material-ui/core';
import type {WithAlert} from '@fbcnms/ui/components/Alert/withAlert';

import * as React from 'react';
import AppContext from '@fbcnms/ui/context/AppContext';
import Button from '@symphony/design-system/components/Button';
import DraggableTableRow from '../draggable/DraggableTableRow';
import DroppableTableBody from '../draggable/DroppableTableBody';
import FormAction from '@symphony/design-system/components/Form/FormAction';
import FormField from '@symphony/design-system/components/FormField/FormField';
import IconButton from '@symphony/design-system/components/IconButton';

import RemoveDocumentCategoryTypeMutation from '../../mutations/RemoveDocumentCategoryTypeMutation';

import PropertyValueInput from './PropertyValueInput';
import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TextInput from '@symphony/design-system/components/Input/TextInput';
import inventoryTheme from '../../common/theme';
import withAlert from '@fbcnms/ui/components/Alert/withAlert';
import {DeleteIcon, PlusIcon} from '@symphony/design-system/icons';
import {removeItem, setItem, updateItem} from '@fbcnms/util/arrays';
import {reorder} from '../draggable/DraggableUtils';
import {ConnectionHandler} from 'relay-runtime';
import {withStyles} from '@material-ui/core/styles';

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
    width: '305px',
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

type Props = {|
  propertyTypes: Array<DocumentCategoryType>,
  onPropertiesChanged: (newProperties: Array<DocumentCategoryType>) => void,
  supportDelete?: boolean,
|} & WithAlert &
  WithStyles<typeof styles>;

class CategoryTypeTable extends React.Component<Props> {
  static contextType = AppContext;
  context: AppContextType;
  render() {
    const {classes} = this.props;
    const propertyTypes = this.props.propertyTypes;
    const {supportMandatory = true} = this.props;
    return (
      <div className={classes.container}>
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
          <DroppableTableBody onDragEnd={this._onDragEnd}>
            {propertyTypes.map((property, i) =>
              property.isDeleted ? null : (
                <DraggableTableRow id={property.id} index={i} key={property.id}>
                  <TableCell
                    className={classes.cell}
                    component="div"
                    scope="row">
                    <FormField>
                      <TextInput
                        autoFocus={true}
                        placeholder="Name"
                        className={classes.nameInput}
                        value={property.name}
                        onChange={this._handleNameChange(i)}
                        onBlur={() => this._handleNameBlur(i)}
                      />
                    </FormField>
                  </TableCell>

                  <TableCell
                    className={classes.actionsBar}
                    align="right"
                    component="div">
                    <FormAction>
                      <IconButton
                        skin="primary"
                        disabled={
                          !!property.numberOfDocuments &&
                          !property.id.includes('@tmp')
                        }
                        tooltip={
                          !!property.numberOfDocuments
                            ? 'it is already used'
                            : ''
                        }
                        onClick={
                          !this.props.supportDelete &&
                          !property.id.includes('@tmp')
                            ? this._onRemoveCategoryClicked(i, property)
                            : this._onRemovePropertyClicked(i, property)
                        }
                        icon={DeleteIcon}
                      />
                    </FormAction>
                  </TableCell>
                </DraggableTableRow>
              ),
            )}
          </DroppableTableBody>
        </Table>
        <FormAction>
          <Button
            variant="text"
            onClick={this._onAddProperty}
            leftIcon={PlusIcon}>
            Add Category
          </Button>
        </FormAction>
      </div>
    );
  }

  _handleNameChange = index => event => {
    this.props.onPropertiesChanged(
      updateItem<DocumentCategoryType, 'name'>(
        this.props.propertyTypes,
        index,
        'name',

        event.target.value,
      ),
    );
  };

  _handleNameBlur = index => {
    const name = this.props.propertyTypes[index]?.name;
    const trimmedName = name && name.trim();
    if (name === trimmedName) {
      return;
    }

    this.props.onPropertiesChanged(
      updateItem<DocumentCategoryType, 'name'>(
        this.props.propertyTypes,
        index,
        'name',
        trimmedName,
      ),
    );
  };

  _onAddProperty = () => {
    this.props.onPropertiesChanged([
      ...this.props.propertyTypes,
      this.getInitialProperty(),
    ]);
  };

  _removeItem<T>(input: $ReadOnlyArray<T>, index: number): Array<T> {
    const newArray = [...input];
    newArray.splice(index, 1);
    return newArray;
  }
  _onRemoveCategoryClicked = (
    index,
    property: DocumentCategoryType,
  ) => _event => {
    this.props
      .confirm(`Are you sure you want to delete "${property.name}"?`)
      .then(confirm => {
        if (!confirm) {
          return;
        }
        RemoveDocumentCategoryTypeMutation(
          {id: property.id},
          {
            onError: (error: any) => {
              this.props.alert('Error: ' + error.source?.errors[0]?.message);
            },
          },
          store => {
            const rootQuery = store.getRoot();
            const locationTypes = ConnectionHandler.getConnection(
              rootQuery,
              'Catalog_locationTypes',
            );
            if (locationTypes != null) {
              ConnectionHandler.deleteNode(locationTypes, property.id);
            }
            store.delete(property.id);
          },
        );
        this.props.onPropertiesChanged(
          removeItem(this.props.propertyTypes, index),
        );
      });
  };

  _onRemovePropertyClicked = (
    index,
    property: DocumentCategoryType,
  ) => _event => {
    if (property.id?.includes('@tmp')) {
      this.props.onPropertiesChanged(
        removeItem(this.props.propertyTypes, index),
      );
    } else {
      this.props.onPropertiesChanged(
        updateItem<DocumentCategoryType, 'isDeleted'>(
          this.props.propertyTypes,
          index,
          'isDeleted',
          true,
        ),
      );
    }
  };

  _onDragEnd = result => {
    if (!result.destination) {
      return;
    }
    const items = reorder(
      this.props.propertyTypes,
      result.source.index,
      result.destination.index,
    );
    const newItems = items.map((property, i) => ({...property, index: i}));
    this.props.onPropertiesChanged(newItems);
  };

  getInitialProperty(): DocumentCategoryType {
    return {
      id: `CategoryType@tmp-${this.props.propertyTypes.length}-${Date.now()}`,
      name: '',
      index: this.props.propertyTypes.length,
    };
  }
}

export default withStyles(styles)(withAlert(CategoryTypeTable));
