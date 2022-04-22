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

import CounterInput from '@fbcmobile/ui/Components/Core/CounterInput';
import Images from 'Platform/Images';
import Modal from 'react-native-modal';
import ModalActions from '@fbcmobile/ui/Components/Core/Modal/ModalActions';
import ModalContent from '@fbcmobile/ui/Components/Core/Modal/ModalContent';
import ModalHeader from '@fbcmobile/ui/Components/Core/Modal/ModalHeader';
import React, {useState} from 'react';
import Text from '@fbcmobile/ui/Components/Core/Text';
import fbt from 'fbt';
import {Colors} from '@fbcmobile/ui/Theme';
import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';

type Props = {|
  +onDuplicateItem: (numDuplicates: number) => void,
  +onCancelPressed: () => void,
|};

const DuplicateCheckListItemButton = ({
  onDuplicateItem,
  onCancelPressed,
}: Props) => {
  const [isDialogShown, setIsDialogShown] = useState(false);
  const [numDuplicates, setNumDuplicates] = useState(1);
  return (
    <TouchableOpacity
      style={styles.root}
      onPress={() => setIsDialogShown(true)}>
      <Image style={styles.icon} source={Images.duplicate_icon} />
      <Text variant="h7" weight="medium" color="primary">
        <fbt desc="Button text. Pressing it duplicates the selected checklist item.">
          Copy
        </fbt>
      </Text>
      <Modal
        isVisible={isDialogShown}
        backdropOpacity={0.6}
        propagateSwipe={true}>
        <View style={styles.modal}>
          <ModalHeader
            title={fbt(
              'How many copies do you want to create?',
              'Dialog header. Asks the user how many duplications of the checklist item should we make',
            )}
            showCloseButton={false}
          />
          <ModalContent style={styles.modalContent}>
            <CounterInput
              count={numDuplicates}
              minCount={1}
              maxCount={10}
              onCountChanged={setNumDuplicates}
            />
          </ModalContent>
          <ModalActions
            cancelLabel={`${fbt('Cancel', 'Cancel button label')}`}
            okLabel={`${fbt('Copy', 'Button label for copying an item')}`}
            onCancelPressed={() => {
              setIsDialogShown(false);
              onCancelPressed();
            }}
            onOkPressed={() => {
              setIsDialogShown(false);
              onDuplicateItem(numDuplicates);
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
    backgroundColor: Colors.BlueBackground,
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

export default DuplicateCheckListItemButton;
