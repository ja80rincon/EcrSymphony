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
import type {FileAttachment_file} from './__generated__/FileAttachment_file.graphql';
import type {WithStyles} from '@material-ui/core';
import type {DocumentCategoryNode} from '../common/LocationType';

import AppContext from '@fbcnms/ui/context/AppContext';
import DateTimeFormat from '../common/DateTimeFormat.js';
import DocumentMenu from './DocumentMenu';
import ImageDialog from './ImageDialog';
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Text from '@symphony/design-system/components/Text';
import classNames from 'classnames';
import nullthrows from 'nullthrows';
import symphony from '@symphony/design-system/theme/symphony';
import {DocumentAPIUrls} from '../common/DocumentAPI';
import {createFragmentContainer, graphql} from 'react-relay';
import {formatFileSize} from '@symphony/design-system/utils/displayUtils';
import {withStyles} from '@material-ui/core/styles';

import FormField from '@symphony/design-system/components/FormField/FormField';
import Select from '@symphony/design-system/components/Select/Select';
import Strings from '../common/InventoryStrings';

const styles = () => ({
  nameCell: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  thumbnail: {
    marginRight: '20px',
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    fontSize: '24px',
    width: '32px',
  },
  img: {
    width: '32px',
    height: '32px',
  },
  fileName: {
    ...symphony.typography.caption,
  },
  secondaryCell: {
    color: symphony.palette.D400,
  },
  cell: {
    height: '48px',
    ...symphony.typography.caption,
  },
  secondaryCell: {
    color: symphony.palette.D400,
  },
  moreIcon: {
    fill: symphony.palette.D400,
  },
});

type Props = {|
  file: FileAttachment_file,
  categories: $ReadOnlyArray<DocumentCategoryNode>,
  onDocumentDeleted: (file: $ElementType<FileAttachment_file, number>) => void,
  onChecked?: any,
  linkToLocationOptions?: boolean,
|} & WithStyles<typeof styles>;

type State = {
  isImageDialogOpen: boolean,
  isChecked: boolean,
  selectValue: DocumentCategoryNode,
};

class FileAttachment extends React.Component<Props, State> {
  static contextType = AppContext;
  context: AppContextType;

  downloadFileRef: {
    current: null | HTMLAnchorElement,
  } = React.createRef<HTMLAnchorElement>();

  constructor(props: Props) {
    super(props);
    this.state = {
      isImageDialogOpen: false,
      isChecked: false,
      selectValue: {id: '', name: ''},
    };
  }

  handleDownload = () => {
    if (this.downloadFileRef.current != null) {
      this.downloadFileRef.current.click();
    }
  };

  handleDelete = () => {
    this.props.onDocumentDeleted(this.props.file);
  };

  handleInputChange = () => {
    this.setState({isChecked: !this.state.isChecked}, () => {
      if (this.state.isChecked) {
        if (this.props.onChecked)
          this.props.onChecked({type: 'checkIncrement'});

        if (this.state.selectValue !== '') {
          if (this.props.onChecked)
            this.props.onChecked({
              type: 'valueIncrement',
              file: this.props.file,
              value: this.state.selectValue,
            });
        }
      } else {
        if (this.props.onChecked)
          this.props.onChecked({type: 'checkDecrement'});
        if (this.state.selectValue !== '') {
          if (this.props.onChecked)
            this.props.onChecked({
              type: 'valueDecrement',
              file: this.props.file,
              value: this.state.selectValue,
            });
        }
      }
    });
  };

  render() {
    const _setCategory = (value: DocumentCategoryNode) => {
      if (this.props.onChecked) {
        this.props.onChecked({
          type: 'valueIncrement',
          file: this.props.file,
          value: value,
        });
      }
    };

    const {classes, file, categories} = this.props;
    if (file === null) {
      return null;
    }

    const categoriesEnabled = this.context.isFeatureEnabled('file_categories');

    return (
      <TableRow key={file.id} hover={false}>
        {categoriesEnabled && (
          <TableCell padding="none" component="th" scope="row">
            {file?.documentCategory?.name || file?.category}
          </TableCell>
        )}
        <TableCell padding="none" component="th" scope="row">
          {file.annotation}
        </TableCell>
        <TableCell padding="none" component="th" scope="row">
          <div className={classes.nameCell}>
            <div className={classes.thumbnail}>
              {file.fileType === 'IMAGE' ? (
                <img
                  className={classes.img}
                  src={DocumentAPIUrls.get_url(nullthrows(file.storeKey))}
                />
              ) : (
                <InsertDriveFileIcon color="primary" className={classes.icon} />
              )}
            </div>
            <Text className={classes.fileName}>{file.fileName}</Text>
          </div>
        </TableCell>
        <TableCell
          padding="none"
          className={classNames(classes.cell, classes.secondaryCell)}
          component="th"
          scope="row">
          {file.fileName.split('.').pop().toUpperCase()}
        </TableCell>
        <TableCell
          padding="none"
          className={classNames(classes.cell, classes.secondaryCell)}
          component="th"
          scope="row">
          {file.sizeInBytes != null && formatFileSize(file.sizeInBytes)}
        </TableCell>
        <TableCell
          padding="none"
          className={classNames(classes.cell, classes.secondaryCell)}
          component="th"
          scope="row">
          {file.uploaded && DateTimeFormat.dateTime(file.uploaded)}
        </TableCell>
        {this.props.linkToLocationOptions && (
          <TableCell
            padding="none"
            className={classNames(classes.cell, classes.secondaryCell)}
            component="th"
            scope="row">
            <input type="checkbox" onChange={this.handleInputChange} />
          </TableCell>
        )}
        {this.props.linkToLocationOptions && (
          <TableCell
            padding="none"
            className={classNames(classes.cell, classes.secondaryCell)}
            component="th"
            scope="row">
            <FormField label="" disabled={!this.state.isChecked}>
              <Select
                options={categories.map(category => ({
                  key: category.id,
                  value: category,
                  label: category.name || '',
                }))}
                onChange={value => {
                  this.setState(
                    {selectValue: value || {id: '', name: ''}},
                    () => {
                      _setCategory(this.state.selectValue);
                    },
                  );
                }}
                selectedValue={
                  this.state.isChecked ? this.state.selectValue : ''
                }
              />
            </FormField>
          </TableCell>
        )}
        <TableCell
          padding="none"
          className={classNames(classes.cell, classes.secondaryCell)}
          component="th"
          scope="row"
          align="right">
          <DocumentMenu
            document={file}
            onDocumentDeleted={this.handleDelete}
            onDialogOpen={() => this.setState({isImageDialogOpen: true})}
          />
          {file.fileType === 'IMAGE' && (
            <ImageDialog
              onClose={() => this.setState({isImageDialogOpen: false})}
              open={this.state.isImageDialogOpen}
              img={file}
            />
          )}
        </TableCell>
      </TableRow>
    );
  }
}

export default withStyles(styles)(
  createFragmentContainer(FileAttachment, {
    file: graphql`
      fragment FileAttachment_file on File {
        id
        fileName
        sizeInBytes
        uploaded
        fileType
        storeKey
        category
        annotation
        documentCategory {
          id
          name
        }
        ...ImageDialog_img
      }
    `,
  }),
);
