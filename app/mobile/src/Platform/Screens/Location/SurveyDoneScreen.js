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

import type {NavigationScreenConfig} from 'react-navigation';
import type {NavigationStackProp} from 'react-navigation';

import NavigationService from '@fbcmobile/ui/Services/NavigationService';
import React, {useState} from 'react';
import fbt from 'fbt';
import nullthrows from 'nullthrows';
import {Button, Text} from '@99xt/first-born';
import {Colors} from '@fbcmobile/ui/Theme';
import {Icon} from 'react-native-material-ui';
import {View} from 'react-native';
import {submitSurveys} from 'Platform/Relay/Mutations/CreateSurveyUtils.js';

type Props = {
  +navigation: NavigationStackProp<{
    params: {
      locationId: string,
      onUploadLater?: () => {},
      onUploadNow?: (uploaded: boolean, error?: Error) => {},
    },
  }>,
};

const SurveyDoneScreen = (props: Props) => {
  const [uploading, setUploading] = useState<boolean>(false);
  const {navigation} = props;
  const locationId = nullthrows(navigation.getParam('locationId'));
  const onUploadLater = navigation.getParam('onUploadLater');
  const onUploadNow = navigation.getParam('onUploadNow');

  const _uploadSurveyLater = () => {
    navigation && navigation.pop();
    onUploadLater && onUploadLater();
  };

  const _uploadSurveyNow = () => {
    if (!uploading) {
      setUploading(true);
      submitSurveys(
        locationId,
        () => {
          setUploading(false);
          navigation && navigation.pop();
          onUploadNow && onUploadNow(true);
        },
        _ => {
          setUploading(false);
          NavigationService.alert(
            'error',
            fbt(
              'Upload error',
              'Error message shown when an error ocurred while uploading the site surveys',
            ),
            fbt(
              'An error occurred while uploading the survey. Please try again later.',
              'Error dialog text shown when an upload failed.',
            ),
          );
        },
      );
    }
  };

  return (
    <View style={styles.root}>
      <View style={styles.completedContainer}>
        <Icon
          name="check-circle"
          iconSet="MaterialIcons"
          style={styles.checkmarkIcon}
          size={60}
        />
        <Text style={styles.completed} bold>
          <fbt desc="Completed title label">Completed</fbt>
        </Text>
        <Text style={styles.thanks}>
          <fbt desc="Text indicating the survey is complete and can be uploaded now or later">
            Thanks for completing the site survey. You may upload the results
            now or later.
          </fbt>
        </Text>
      </View>
      <Button color={Colors.Secondary} onPress={() => _uploadSurveyLater()}>
        <Text bold style={styles.buttonText}>
          <fbt desc="Upload Later button label">Upload Later</fbt>
        </Text>
      </Button>
      <Button color={Colors.Blue} onPress={() => _uploadSurveyNow()}>
        <Text bold>
          {uploading ? (
            <fbt desc="Text that shows while surveys are being uploaded">
              Uploading...
            </fbt>
          ) : (
            <fbt desc="Upload Now label">Upload Now</fbt>
          )}
        </Text>
      </Button>
    </View>
  );
};

const styles = {
  root: {
    display: 'flex',
    flexGrow: 1,
    flex: 1,
    backgroundColor: Colors.BackgroundWhite,
  },
  completedContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    flexGrow: 2,
    justifyContent: 'center',
  },
  checkmarkIcon: {
    marginRight: 10,
  },
  completed: {
    fontSize: 30,
  },
  thanks: {
    fontSize: 14,
    textAlign: 'center',
  },
  buttonText: {
    color: Colors.Blue,
  },
};

const options: NavigationScreenConfig<*> = {
  headerShown: true,
  headerTitle: '',
};

SurveyDoneScreen.navigationOptions = options;

export default SurveyDoneScreen;
