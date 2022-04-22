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

import type {CachedCheckListItem} from 'Platform/Components/WorkOrders/CheckListItemTypes';

import FormInput from '@fbcmobile/ui/Components/FormInput/FormInput';
import Modal from 'react-native-modal';
import ModalActions from '@fbcmobile/ui/Components/Core/Modal/ModalActions';
import ModalContent from '@fbcmobile/ui/Components/Core/Modal/ModalContent';
import ModalHeader from '@fbcmobile/ui/Components/Core/Modal/ModalHeader';
import React, {useContext, useMemo, useState} from 'react';
import Text from '@fbcmobile/ui/Components/Core/Text';
import WorkOrderChecklistCacheContext from 'Platform/Screens/WorkOrder/WorkOrderChecklistCacheContext';
import fbt from 'fbt';
import {Checkbox, RadioButton} from 'react-native-material-ui';
import {Dimensions, ScrollView, StyleSheet, View} from 'react-native';

type Props = {|
  +workOrderId: string,
  +categoryId: string,
  +item: CachedCheckListItem,
  +hasError: boolean,
|};

const itemStyle = {
  container: {
    marginBottom: 10,
  },
  label: {
    flex: 1,
  },
};
const modalHeight = Dimensions.get('window').height / 1.5;

const MultipleChoiceCheckListItem = ({
  workOrderId,
  categoryId,
  item,
  hasError,
}: Props) => {
  const [isChoiceDialogOpen, setIsChoiceDialogOpen] = useState(false);
  const {setCachedChecklistItem} = useContext(WorkOrderChecklistCacheContext);
  const initialSelectedEnumValues = item.selectedEnumValues ?? [];
  const [selectedEnumValues, setSelectedEnumValues] = useState<Array<string>>(
    initialSelectedEnumValues,
  );

  const enumValues = useMemo(
    () => (!!item.enumValues ? item.enumValues.split(',') : []),
    [item.enumValues],
  );

  const onSelectOption = (value: string) => (checked: boolean) => {
    setSelectedEnumValues(selectedEnumValues => {
      if (item.enumSelectionMode === 'single') {
        return [value];
      }

      return checked
        ? [...selectedEnumValues, value]
        : selectedEnumValues.filter(v => v !== value);
    });
  };

  return (
    <FormInput
      title={item.title}
      description={item.helpText}
      touchableDisabled={false}
      onPress={() => setIsChoiceDialogOpen(true)}
      hasError={hasError}
      isMandatory={item.isMandatory ?? false}>
      <View>
        {!!selectedEnumValues && (
          <Text variant="h2">{selectedEnumValues.join(', ')}</Text>
        )}
      </View>
      <Modal
        isVisible={isChoiceDialogOpen}
        backdropOpacity={0.6}
        propagateSwipe={true}>
        <View style={[styles.modal, {height: modalHeight}]}>
          <ModalHeader
            title={item.title}
            onClosePressed={() => setIsChoiceDialogOpen(false)}
          />
          <ModalContent style={styles.modalContent}>
            <ScrollView>
              {item.enumSelectionMode === 'single'
                ? enumValues.map(value => (
                    <RadioButton
                      key={value}
                      label={value}
                      checked={selectedEnumValues.includes(value)}
                      value={value}
                      onSelect={onSelectOption(value)}
                      style={itemStyle}
                    />
                  ))
                : null}
              {item.enumSelectionMode === 'multiple'
                ? enumValues.map(value => (
                    <Checkbox
                      key={value}
                      label={value}
                      checked={selectedEnumValues.includes(value)}
                      value={value}
                      onCheck={onSelectOption(value)}
                      style={itemStyle}
                    />
                  ))
                : null}
              <View style={styles.gap} />
            </ScrollView>
          </ModalContent>
          <ModalActions
            cancelLabel={`${fbt('Clear', 'Clear button label')}`}
            okLabel={`${fbt('Save', 'Save button label')}`}
            onCancelPressed={() => setSelectedEnumValues([])}
            onOkPressed={() => {
              setIsChoiceDialogOpen(false);
              setCachedChecklistItem(workOrderId, categoryId, item.id, {
                ...item,
                selectedEnumValues,
              });
            }}
          />
        </View>
      </Modal>
    </FormInput>
  );
};

const styles = StyleSheet.create({
  modal: {
    display: 'flex',
    backgroundColor: 'white',
    borderRadius: 4,
  },
  modalContent: {
    flex: 1,
  },
  gap: {
    flexGrow: 1,
  },
});

export default MultipleChoiceCheckListItem;
