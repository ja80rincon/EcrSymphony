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
  AddHyperlinkInput,
  AddHyperlinkMutationResponse,
  AddHyperlinkMutationVariables,
} from './../mutations/__generated__/AddHyperlinkMutation.graphql';
import type {CategoryItem} from './DocumentsAddButton';
import type {ButtonProps} from '@symphony/design-system/components/Button';
import type {ImageEntity} from '../mutations/__generated__/AddImageMutation.graphql';
import type {MutationCallbacks} from '../mutations/MutationCallbacks.js';
import type {WithSnackbarProps} from 'notistack';

import * as React from 'react';
import AddHyperlinkDialog from './AddHyperlinkDialog';
import AddHyperlinkMutation from '../mutations/AddHyperlinkMutation';
import AppContext from '@fbcnms/ui/context/AppContext';
import Button from '@symphony/design-system/components/Button';
import FormAction from '@symphony/design-system/components/Form/FormAction';
import InventoryStrings from '../common/InventoryStrings';
import PopoverMenu from '@symphony/design-system/components/Select/PopoverMenu';
import SnackbarItem from '@fbcnms/ui/components/SnackbarItem';
import {LogEvents, ServerLogger} from '../common/LoggingUtils';
import {useCallback, useContext, useState} from 'react';
import {withSnackbar} from 'notistack';

type addLinkProps = {|
  entityId: string,
  entityType: ImageEntity,
  categories: Array<CategoryItem>,
  allowCategories?: boolean,
  children?: ?React.Node,
  className?: string,
|};

type Props = addLinkProps & ButtonProps & WithSnackbarProps;

const addNewHyperlink = (input: AddHyperlinkInput, onError: string => void) => {
  const variables: AddHyperlinkMutationVariables = {
    input,
  };

  const updater = store => {
    const newNode = store.getRootField('addHyperlink');
    const entityProxy = store.get(input.entityId);
    if (newNode == null || entityProxy == null) {
      return;
    }

    const hyperlinkNodes = entityProxy.getLinkedRecords('hyperlinks') || [];
    entityProxy.setLinkedRecords([...hyperlinkNodes, newNode], 'hyperlinks');
  };

  const callbacks: MutationCallbacks<AddHyperlinkMutationResponse> = {
    onCompleted: (_, errors) => {
      if (errors && errors[0]) {
        onError(errors[0].message);
      }
    },
    onError: error => onError(error.message),
  };

  AddHyperlinkMutation(variables, callbacks, updater);
};

const AddHyperlinkButton = (props: Props) => {
  const {
    entityId,
    entityType,
    allowCategories = true,
    enqueueSnackbar,
    className,
    skin = 'gray',
    variant,
    disabled,
    children,
    categories,
  } = props;

  const [addHyperlinkDialogOpened, setAddHyperlinkDialogOpened] = useState(
    false,
  );
  const [dialogKey, setDialogKey] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<?CategoryItem>(null);
  const appContext = useContext(AppContext);
  const categoriesEnabled =
    allowCategories && appContext.isFeatureEnabled('file_categories');

  const openDialog = useCallback((category: ?CategoryItem) => {
    setSelectedCategory(category);
    setDialogKey(key => key + 1);
    setAddHyperlinkDialogOpened(true);
    ServerLogger.info(LogEvents.LOCATION_CARD_ADD_HYPERLINK_CLICKED);
  }, []);

  const callAddNewHyperlink = useCallback(
    (url: string, displayName: ?string) => {
      const onError = errorMessage => {
        enqueueSnackbar(errorMessage, {
          children: key => (
            <SnackbarItem id={key} message={errorMessage} variant="error" />
          ),
        });
      };
      const input = {
        entityId,
        entityType,
        url,
        displayName,
        category: selectedCategory?.name,
        documentCategoryId: selectedCategory?.id,
      };
      addNewHyperlink(input, onError);
    },
    [enqueueSnackbar, entityId, entityType, selectedCategory, categories],
  );
  
  return (
    <FormAction>
      {categoriesEnabled ? (
        <PopoverMenu
          skin={skin}
          menuDockRight={true}
          disabled={!categories.length}
          options={categories.map(category => ({
            key: category.id,
            label: category.name || '',
            value: category,
          }))}
          onChange={openDialog}>
          {children ?? InventoryStrings.documents.addLinkButton}
        </PopoverMenu>
      ) : (
        <Button
          onClick={() => openDialog()}
          className={className}
          skin={skin}
          variant={variant}
          disabled={disabled}>
          {children ?? InventoryStrings.documents.addLinkButton}
        </Button>
      )}
      {addHyperlinkDialogOpened ? (
        <AddHyperlinkDialog
          key={dialogKey}
          isOpened={true}
          onAdd={callAddNewHyperlink.bind(this)}
          onClose={() => setAddHyperlinkDialogOpened(false)}
          targetCategory={selectedCategory?.name}
        />
      ) : null}
    </FormAction>
  );
};

export default withSnackbar(AddHyperlinkButton);
