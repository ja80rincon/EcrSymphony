/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

'use strict';

import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';
import ModalActions from '@fbcmobile/ui/Components/Core/Modal/ModalActions';
import ModalHeader from '@fbcmobile/ui/Components/Core/Modal/ModalHeader';
import React, {useState} from 'react';
import Text from '@fbcmobile/ui/Components/Core/Text';
import fbt from 'fbt';
import {Colors} from '@fbcmobile/ui/Theme';
import {StyleSheet, TouchableOpacity, View} from 'react-native';

type Props = {|
  +onDeleteItem: () => void,
  +onCancelPressed: () => void,
|};

const DeleteCheckListItemButton = ({onDeleteItem, onCancelPressed}: Props) => {
  const [isDialogShown, setIsDialogShown] = useState(false);
  return (
    <TouchableOpacity
      style={styles.root}
      onPress={() => setIsDialogShown(true)}>
      <MCIcon
        style={styles.icon}
        name="delete-outline"
        size={25}
        color={Colors.DeleteRed}
      />
      <Text variant="h7" weight="medium" color="deleteRed">
        <fbt desc="Button text. Delete checklist item.">Delete</fbt>
      </Text>
      <Modal
        isVisible={isDialogShown}
        backdropOpacity={0.6}
        propagateSwipe={true}>
        <View style={styles.modal}>
          <ModalHeader
            title={fbt(
              'Are you sure you want to delete this item?',
              'Dialog header. Asks the user if they are sure they want to delete the checklist item',
            )}
            showCloseButton={false}
          />
          <ModalActions
            cancelLabel={`${fbt('Cancel', 'Cancel button label')}`}
            okLabel={`${fbt('Delete', 'Delete button label')}`}
            onCancelPressed={() => {
              setIsDialogShown(false);
              onCancelPressed();
            }}
            onOkPressed={() => {
              setIsDialogShown(false);
              onDeleteItem();
            }}
          />
        </View>
      </Modal>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  root: {
    padding: 26,
    marginRight: 20,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.DeleteRedBackground,
  },
  icon: {
    marginBottom: 5,
  },
  modal: {
    display: 'flex',
    backgroundColor: 'white',
    borderRadius: 4,
  },
  modalContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
});

export default DeleteCheckListItemButton;
