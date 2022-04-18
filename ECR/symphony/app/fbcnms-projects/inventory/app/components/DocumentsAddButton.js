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
  AddImageMutationResponse,
  AddImageMutationVariables,
  ImageEntity,
} from '../mutations/__generated__/AddImageMutation.graphql';
import type {AppContextType} from '@fbcnms/ui/context/AppContext';
import type {MutationCallbacks} from '../mutations/MutationCallbacks.js';
import type {WithSnackbarProps} from 'notistack';
import type {WithStyles} from '@material-ui/core';

import AddImageMutation from '../mutations/AddImageMutation';
import AppContext from '@fbcnms/ui/context/AppContext';
import Button from '@symphony/design-system/components/Button';
import Clickable from '@symphony/design-system/components/Core/Clickable';
import FileUploadButton from './FileUpload/FileUploadButton';
import FormAction from '@symphony/design-system/components/Form/FormAction';
import PopoverMenu from '@symphony/design-system/components/Select/PopoverMenu';
import React from 'react';
import SnackbarItem from '@fbcnms/ui/components/SnackbarItem';
import Strings from '../common/InventoryStrings';
import Text from '@symphony/design-system/components/Text';
import {LogEvents, ServerLogger} from '../common/LoggingUtils';
import {withSnackbar} from 'notistack';
import {withStyles} from '@material-ui/core/styles';

const styles = {
  uploadCategory: {
    padding: '0px',
  },
  uploadCategoryButton: {
    padding: '8px 16px',
    display: 'block',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    width: '100%',
  },
  autoWidth: {
    width: '100%',
  },
};

export type CategoryItem = $ReadOnly<{|
  id: string,
  name: ?string,
|}>;

type Props = {|
  entityId: ?string,
  entityType: ImageEntity,
  categories: Array<CategoryItem>,
|} & WithSnackbarProps &
  WithStyles<typeof styles>;

type State = {
  isMenuOpened: boolean,
};

const FileTypeEnum = {
  IMAGE: 'IMAGE',
  FILE: 'FILE',
};

class DocumentsAddButton extends React.Component<Props, State> {
  static contextType = AppContext;
  context: AppContextType;

  state = {
    isMenuOpened: false,
  };

  render() {
    const {entityId, classes, categories} = this.props;
    const categoriesEnabled = this.context.isFeatureEnabled('file_categories');
    if (!entityId) {
      return null;
    }

    return (
      <FormAction>
        {categoriesEnabled ? (
          <PopoverMenu
            skin="primary"
            menuDockRight={true}
            disabled={!categories.length}
            options={categories.map(category => ({
              key: category.id,
              label: (
                <FileUploadButton
                  key={category.id}
                  onFileUploaded={this.onDocumentUploaded(category)}>
                  {openFileUploadDialog => (
                    <Clickable
                      onClick={openFileUploadDialog}
                      className={classes.autoWidth}>
                      <Text
                        className={classes.uploadCategoryButton}
                        variant="body2">
                        {category.name}
                      </Text>
                    </Clickable>
                  )}
                </FileUploadButton>
              ),
              value: category.name,
              className: classes.uploadCategory,
            }))}>
            {Strings.documents.uploadButton}
          </PopoverMenu>
        ) : (
          <FileUploadButton
            onFileUploaded={this.onDocumentUploaded({id: '', name: ''})}>
            {openFileUploadDialog => (
              <Button skin="primary" onClick={openFileUploadDialog}>
                {Strings.documents.uploadButton}
              </Button>
            )}
          </FileUploadButton>
        )}
      </FormAction>
    );
  }

  onDocumentUploaded = (category: CategoryItem) => (file, key) => {
    ServerLogger.info(LogEvents.LOCATION_CARD_UPLOAD_FILE_CLICKED);
    if (this.props.entityId == null) {
      return;
    }

    const variables: AddImageMutationVariables = {
      input: {
        entityType: this.props.entityType,
        entityId: this.props.entityId,
        imgKey: key,
        fileName: file.name,
        fileSize: file.size,
        modified: new Date(file.lastModified).toISOString(),
        contentType: file.type,
        category: category.name,
        documentCategoryId: category.id,
      },
    };

    const updater = store => {
      const {entityId} = this.props;
      if (entityId == null) {
        return;
      }
      const newNode = store.getRootField('addImage');
      const entityProxy = store.get(entityId);
      if (newNode == null || entityProxy == null) {
        return;
      }
      const fileType = newNode.getValue('fileType');
      if (fileType == FileTypeEnum.IMAGE) {
        const imageNodes = entityProxy.getLinkedRecords('images') || [];
        entityProxy.setLinkedRecords([...imageNodes, newNode], 'images');
      } else {
        const fileNodes = entityProxy.getLinkedRecords('files') || [];
        entityProxy.setLinkedRecords([...fileNodes, newNode], 'files');
      }
    };

    const callbacks: MutationCallbacks<AddImageMutationResponse> = {
      onCompleted: (_, errors) => {
        if (errors && errors[0]) {
          this.props.enqueueSnackbar(errors[0].message, {
            children: key => (
              <SnackbarItem
                id={key}
                message={errors[0].message}
                variant="error"
              />
            ),
          });
        }
      },
      onError: () => {},
    };

    AddImageMutation(variables, callbacks, updater);
  };
}

export default withStyles(styles)(withSnackbar(DocumentsAddButton));
