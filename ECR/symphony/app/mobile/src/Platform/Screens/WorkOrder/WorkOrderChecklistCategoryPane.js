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

import type {NavigationScreenProp} from 'react-navigation';
import type {WorkOrderChecklistCategoryPane_category} from './__generated__/WorkOrderChecklistCategoryPane_category.graphql';
import type {WorkOrderChecklistCategoryPane_workOrder} from './__generated__/WorkOrderChecklistCategoryPane_workOrder.graphql';

import Banner from '@fbcmobile/ui/Components/Core/Banner';
import Button from '@fbcmobile/ui/Components/Core/Button';
import Colors from '@fbcmobile/ui/Theme/Colors';
import Divider from '@fbcmobile/ui/Components/Core/Divider';
import Images from 'Platform/Images';
import List from '@fbcmobile/ui/Components/List';
import NuxContainer from 'Platform/Components/Nux/NuxContainer';
import React, {useCallback, useState} from 'react';
import Text from '@fbcmobile/ui/Components/Core/Text';
import Toolbar from '@fbcmobile/ui/Components/Toolbar';
import WorkOrderEditableCategoryChecklist from 'Platform/Components/WorkOrders/WorkOrderEditableCategoryChecklist';
import WorkOrderViewOnlyCategoryChecklist from 'Platform/Components/WorkOrders/WorkOrderViewOnlyCategoryChecklist';
import fbt from 'fbt';
import {NUX_NAMES} from 'Platform/Components/Nux/NuxConsts';
import {ScrollView, StyleSheet, View} from 'react-native';
import {createFragmentContainer} from 'react-relay-offline';
import {
  useIsWorkOrderChecklistCategoryItemsDone,
  useWorkOrderEditingCapability,
} from 'Platform/Components/WorkOrders/WorkOrderUtils';

const graphql = require('babel-plugin-relay/macro');

type Props = {|
  +workOrder: WorkOrderChecklistCategoryPane_workOrder,
  +category: WorkOrderChecklistCategoryPane_category,
  +navigation: NavigationScreenProp<{}>,
|};

const WorkOrderChecklistCategoryPane = ({
  navigation,
  workOrder,
  category,
}: Props) => {
  const {isViewOnly} = useWorkOrderEditingCapability(
    workOrder.id,
    workOrder.assignedTo?.authID,
    workOrder.status,
  );
  const [doesFormHaveErrors, setDoesFormHaveErrors] = useState(false);
  const [errorBannerKey, setErrorBannerKey] = useState(0);
  const [validateValues, setValidateValues] = useState(false);
  const isWorkOrderChecklistItemsDone = useIsWorkOrderChecklistCategoryItemsDone(
    workOrder.id,
    category.id,
  );

  const goBack = useCallback(() => {
    // TODO (T69519911): think about discarding changes
    navigation.goBack();
  }, [navigation]);

  const onSave = useCallback(() => {
    if (isViewOnly) {
      navigation.goBack();
    }

    if (!isWorkOrderChecklistItemsDone) {
      setValidateValues(true);
      setDoesFormHaveErrors(true);
      setErrorBannerKey(prevKey => prevKey + 1);
      return;
    } else {
      setDoesFormHaveErrors(false);
      navigation.goBack();
    }
  }, [navigation, isViewOnly, isWorkOrderChecklistItemsDone]);

  return (
    <View style={styles.root}>
      {!isViewOnly ? (
        <NuxContainer
          name={NUX_NAMES.DUPLICATE_CHECKLIST}
          title={fbt(
            'Swipe right to make a copy of an item',
            'New user experience message. By swiping the list item right, the user can duplicate it.',
          ).toString()}
          image={Images.duplicate_checklist_hand}
        />
      ) : null}
      <Toolbar
        style={styles.toolbar}
        searchable={false}
        showExtraActions={false}
        leftElement="arrow-back"
        onIconClicked={goBack}
        title={category.title}
        extraRightElement={
          !isViewOnly
            ? {
                node: (
                  <View key={`save_${category.id}`}>
                    <Button
                      variant="text"
                      onPress={onSave}
                      style={styles.saveButton}>
                      <Text weight="medium">
                        <fbt desc="Text of a button that saves data on a form">
                          Save
                        </fbt>
                      </Text>
                    </Button>
                  </View>
                ),
              }
            : null
        }
      />
      {doesFormHaveErrors ? (
        <Banner
          key={errorBannerKey}
          skin="red"
          message={fbt(
            'This form has required questions.',
            'Message shown to the technician after they try to save a checklist form that has errors',
          ).toString()}
        />
      ) : null}
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          {category.description != null && (
            <Text variant="h6" weight="light" style={styles.description}>
              {category.description}
            </Text>
          )}
          <Divider />
        </View>
        <View>
          <List
            emptyLabel={`${fbt(
              'No checklist items for this category',
              'Empty state for a list of checklist items',
            )}`}>
            {isViewOnly ? (
              <WorkOrderViewOnlyCategoryChecklist
                workOrder={workOrder}
                category={category}
              />
            ) : (
              <WorkOrderEditableCategoryChecklist
                workOrderId={workOrder.id}
                categoryId={category.id}
                validateValues={validateValues}
              />
            )}
          </List>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  toolbar: {
    height: 'auto',
  },
  content: {
    flex: 1,
    paddingLeft: 20,
    backgroundColor: Colors.BackgroundWhite,
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    paddingRight: 20,
  },
  description: {
    marginTop: 4,
    marginBottom: 15,
  },
  saveButton: {
    marginRight: 10,
    position: 'relative',
    alignSelf: 'flex-end',
  },
});

export default createFragmentContainer(WorkOrderChecklistCategoryPane, {
  workOrder: graphql`
    fragment WorkOrderChecklistCategoryPane_workOrder on WorkOrder {
      id
      status
      assignedTo {
        authID
      }
    }
  `,
  category: graphql`
    fragment WorkOrderChecklistCategoryPane_category on CheckListCategory {
      id
      title
      description
      ...WorkOrderViewOnlyCategoryChecklist_category
      checkList {
        id
        index
        isMandatory
        type
        selectedEnumValues
        stringValue
        checked
        yesNoResponse
        wifiData {
          timestamp
          frequency
          channel
          bssid
          strength
          ssid
          band
          channelWidth
          capabilities
          latitude
          longitude
        }
        cellData {
          networkType
          signalStrength
          timestamp
          baseStationID
          networkID
          systemID
          cellID
          locationAreaCode
          mobileCountryCode
          mobileNetworkCode
          primaryScramblingCode
          operator
          arfcn
          physicalCellID
          trackingAreaCode
          timingAdvance
          earfcn
          uarfcn
          latitude
          longitude
        }
        files {
          id
          fileName
          storeKey
          mimeType
          sizeInBytes
          modified
          uploaded
          annotation
        }
        ...WorkOrderCheckListItem_item
      }
    }
  `,
});
