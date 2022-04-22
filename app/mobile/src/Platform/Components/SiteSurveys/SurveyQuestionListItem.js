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

import type {Coords} from '@fbcmobile/ui/Utils/MapUtils';
import type {
  FileInput,
  SurveyQuestionResponse,
} from 'Platform/Relay/Mutations/__generated__/CreateSurveyMutation.graphql.js';
import type {NumberInputType} from '@fbcmobile/ui/Components/FormInput/NumberInput';
import type {PhotoResponse} from '@fbcmobile/ui/Components/FormInput/PhotoPicker/PhotoPicker';
import type {
  SurveyCellScanData,
  SurveyWiFiScanData,
} from 'Platform/Relay/Mutations/__generated__/CreateSurveyMutation.graphql.js';
import type {SurveyQuestionListItem_question} from 'Platform/Components/SiteSurveys/__generated__/SurveyQuestionListItem_question.graphql';
import type {SurveyQuestionType} from 'Platform/Components/SiteSurveys/__generated__/SurveyQuestionListItem_question.graphql';

import BooleanInput from '@fbcmobile/ui/Components/FormInput/BooleanInput';
import CellScanInput from '@fbcmobile/ui/Components/FormInput/SignalScan/CellScanInput';
import CoordsInput from '@fbcmobile/ui/Components/FormInput/CoordsInput';
import DateInput from '@fbcmobile/ui/Components/FormInput/DateInput';
import FormInput from '@fbcmobile/ui/Components/FormInput/FormInput';
import NumberInput from '@fbcmobile/ui/Components/FormInput/NumberInput';
import PhotoPicker from '@fbcmobile/ui/Components/FormInput/PhotoPicker/PhotoPicker';
import React, {useRef, useState} from 'react';
import Text from '@fbcmobile/ui/Components/Core/Text';
import TextFormInput from '@fbcmobile/ui/Components/FormInput/TextFormInput';
import WiFiScanInput from '@fbcmobile/ui/Components/FormInput/SignalScan/WiFiScanInput';
import fbt from 'fbt';
import graphql from 'babel-plugin-relay/macro';
import {TextInput} from 'react-native';
import {View} from 'react-native';
import {cacheSurveyResponse} from 'Platform/Relay/Mutations/CreateSurveyUtils.js';
import {createFragmentContainer} from 'react-relay-offline';

type Props = {
  +question: SurveyQuestionListItem_question,
  +locationId: string,
  +locationTypeName: string,
  +categoryId: string,
  +categoryTitle: string,
  +categoryDescription: string,
  +response: ?SurveyQuestionResponse,
};

const SurveyQuestionListItem = (props: Props) => {
  const [currentQuestionText, setCurrentQuestionText] = useState<?string>(null);
  const [currentQuestionBool, setCurrentQuestionBool] = useState<?boolean>(
    null,
  );
  const [currentQuestionCoords, setCurrentQuestionCoords] = useState<?Coords>(
    null,
  );
  const [currentQuestionNum, setCurrentQuestionNum] = useState<?number>(null);
  const [currentQuestionDate, setCurrentQuestionDate] = useState<?number>(null);
  const [photoData, setPhotoData] = useState<?string>(null);
  const [cellData, setCellData] = useState<?Array<SurveyCellScanData>>(null);
  const [wifiData, setWifiData] = useState<?Array<SurveyWiFiScanData>>(null);
  const inputRef = useRef<?React$ElementRef<typeof TextInput>>(null);

  const {
    question: {questionTitle, questionDescription, questionType, index},
    locationId,
    locationTypeName,
    categoryId,
    categoryTitle,
    categoryDescription,
    response,
  } = props;

  const onChangeText = (text: ?string, type: SurveyQuestionType) => {
    setCurrentQuestionText(text);
    if (type === 'TEXT') {
      cacheSurveyResponse(
        locationId,
        locationTypeName,
        questionTitle,
        questionType,
        {
          ...response,
          formIndex: parseInt(categoryId),
          formName: categoryTitle,
          formDescription: categoryDescription,
          questionText: questionTitle,
          questionFormat: questionType,
          questionIndex: index,
          textData: text,
        },
      );
    }
    if (type === 'EMAIL') {
      cacheSurveyResponse(
        locationId,
        locationTypeName,
        questionTitle,
        questionType,
        {
          ...response,
          formIndex: parseInt(categoryId),
          formName: categoryTitle,
          formDescription: categoryDescription,
          questionText: questionTitle,
          questionFormat: questionType,
          questionIndex: index,
          emailData: text,
        },
      );
    }
    if (type === 'PHONE') {
      cacheSurveyResponse(
        locationId,
        locationTypeName,
        questionTitle,
        questionType,
        {
          ...response,
          formIndex: parseInt(categoryId),
          formName: categoryTitle,
          formDescription: categoryDescription,
          questionText: questionTitle,
          questionFormat: questionType,
          questionIndex: index,
          phoneData: text,
        },
      );
    }
  };

  const onChangeBool = (boolData: ?boolean) => {
    setCurrentQuestionBool(boolData);
    cacheSurveyResponse(
      locationId,
      locationTypeName,
      questionTitle,
      questionType,
      {
        ...response,
        formIndex: parseInt(categoryId),
        formName: categoryTitle,
        formDescription: categoryDescription,
        questionText: questionTitle,
        questionFormat: questionType,
        questionIndex: index,
        boolData: boolData,
      },
    );
  };

  const onChangeCoords = (coords: ?Coords) => {
    setCurrentQuestionCoords(coords);
    cacheSurveyResponse(
      locationId,
      locationTypeName,
      questionTitle,
      questionType,
      {
        ...response,
        formIndex: parseInt(categoryId),
        formName: categoryTitle,
        formDescription: categoryDescription,
        questionText: questionTitle,
        questionFormat: questionType,
        questionIndex: index,
        latitude: coords?.latitude,
        longitude: coords?.longitude,
        locationAccuracy: coords?.locationAccuracy,
        altitude: coords?.altitude,
      },
    );
  };

  const onChangeNumber = (num: ?number, type: NumberInputType) => {
    setCurrentQuestionNum(num);
    if (type === 'FLOAT') {
      cacheSurveyResponse(
        locationId,
        locationTypeName,
        questionTitle,
        questionType,
        {
          ...response,
          formIndex: parseInt(categoryId),
          formName: categoryTitle,
          formDescription: categoryDescription,
          questionText: questionTitle,
          questionFormat: questionType,
          questionIndex: index,
          floatData: num,
        },
      );
    }
    if (type === 'INTEGER') {
      cacheSurveyResponse(
        locationId,
        locationTypeName,
        questionTitle,
        questionType,
        {
          ...response,
          formIndex: parseInt(categoryId),
          formName: categoryTitle,
          formDescription: categoryDescription,
          questionText: questionTitle,
          questionFormat: questionType,
          questionIndex: index,
          intData: num,
        },
      );
    }
  };
  const onChangeDate = (date: ?number) => {
    setCurrentQuestionDate(date);
    cacheSurveyResponse(
      locationId,
      locationTypeName,
      questionTitle,
      questionType,
      {
        ...response,
        formIndex: parseInt(categoryId),
        formName: categoryTitle,
        formDescription: categoryDescription,
        questionText: questionTitle,
        questionFormat: questionType,
        questionIndex: index,
        dateData: date,
      },
    );
  };

  const onPhotoSelect = (photoData: ?PhotoResponse) => {
    setPhotoData(photoData?.data);

    const fileInput: ?FileInput = photoData
      ? {
          id: photoData.uri,
          fileName: photoData.fileName,
          sizeInBytes: photoData.fileSize,
          modificationTime: photoData.timestamp,
          uploadTime: 0,
          fileType: 'IMAGE',
          storeKey: 'keyNotSet',
          mimeType: photoData.mimeType,
        }
      : null;
    cacheSurveyResponse(
      locationId,
      locationTypeName,
      questionTitle,
      questionType,
      {
        ...response,
        formIndex: parseInt(categoryId),
        formName: categoryTitle,
        formDescription: categoryDescription,
        questionText: questionTitle,
        questionFormat: questionType,
        questionIndex: index,
        photoData: fileInput,
      },
    );
  };

  const onCellScanned = (cellData: ?Array<SurveyCellScanData>) => {
    setCellData(cellData);
    cacheSurveyResponse(
      locationId,
      locationTypeName,
      questionTitle,
      questionType,
      {
        ...response,
        formIndex: parseInt(categoryId),
        formName: categoryTitle,
        formDescription: categoryDescription,
        questionText: questionTitle,
        questionFormat: questionType,
        questionIndex: index,
        cellData: cellData,
      },
    );
  };

  const onWifiScanned = (wifiData: ?Array<SurveyWiFiScanData>) => {
    setWifiData(wifiData);
    cacheSurveyResponse(
      locationId,
      locationTypeName,
      questionTitle,
      questionType,
      {
        ...response,
        formIndex: parseInt(categoryId),
        formName: categoryTitle,
        formDescription: categoryDescription,
        questionText: questionTitle,
        questionFormat: questionType,
        questionIndex: index,
        wifiData: wifiData,
      },
    );
  };

  return (
    <View style={styles.root}>
      <FormInput
        title={questionTitle}
        description={questionDescription}
        onPress={() => {
          inputRef.current && inputRef.current.focus();
        }}>
        {_getComponentForType(
          response,
          questionType,
          currentQuestionText,
          currentQuestionBool,
          currentQuestionCoords,
          currentQuestionNum,
          currentQuestionDate,
          photoData,
          cellData,
          wifiData,
          onChangeText,
          onChangeBool,
          onChangeCoords,
          onChangeNumber,
          onChangeDate,
          onPhotoSelect,
          onCellScanned,
          onWifiScanned,
          inputRef,
        )}
      </FormInput>
    </View>
  );
};

function _getComponentForType(
  response: ?SurveyQuestionResponse,
  questionType: SurveyQuestionType,
  currentQuestionText: ?string,
  currentQuestionBool: ?boolean,
  currentQuestionCoords: ?Coords,
  currentQuestionNum: ?number,
  currentQuestionDate: ?number,
  photoData: ?string,
  cellData: ?Array<SurveyCellScanData>,
  wifiData: ?Array<SurveyWiFiScanData>,
  onChangeText: (value: ?string, type: SurveyQuestionType) => void,
  onChangeBool: (value: ?boolean) => void,
  onChangeCoords: (value: ?Coords) => void,
  onChangeNumber: (value: ?number, type: NumberInputType) => void,
  onChangeDate: (value: ?number) => void,
  onPhotoSelect: (photoData: ?PhotoResponse) => void,
  onCellScanned: (cellData: Array<SurveyCellScanData>) => void,
  onWifiScanned: (wifiData: Array<SurveyWiFiScanData>) => void,
  inputRef: ?React$ElementRef<typeof TextInput>,
) {
  switch (questionType) {
    case 'CELLULAR':
      return (
        <CellScanInput
          cellData={cellData || response?.cellData}
          onCellScanned={onCellScanned}
        />
      );
    case 'WIFI':
      return (
        <WiFiScanInput
          wifiData={wifiData || response?.wifiData}
          onWiFiScanned={onWifiScanned}
        />
      );
    case 'PHOTO':
      return (
        <PhotoPicker
          photoData={photoData || response?.photoData?.id}
          onSelect={onPhotoSelect}
        />
      );
    case 'PHONE':
      return (
        <TextFormInput
          multiline={false}
          onChangeText={onChangeText}
          value={currentQuestionText || response?.phoneData}
          inputType="PHONE"
          ref={inputRef}
        />
      );
    case 'EMAIL':
      return (
        <TextFormInput
          multiline={false}
          onChangeText={onChangeText}
          value={currentQuestionText || response?.emailData}
          inputType="EMAIL"
          ref={inputRef}
        />
      );
    case 'BOOL':
      return (
        <BooleanInput
          value={
            currentQuestionBool != null
              ? currentQuestionBool
              : response?.boolData
              ? response?.boolData
              : false
          }
          onChangeBool={onChangeBool}
        />
      );
    case 'COORDS':
      return (
        <CoordsInput
          onChangeCoords={onChangeCoords}
          value={
            currentQuestionCoords
              ? currentQuestionCoords
              : response &&
                response.latitude != null &&
                response.longitude != null &&
                response.locationAccuracy != null &&
                response.altitude != null
              ? {
                  longitude: response.longitude,
                  latitude: response.latitude,
                  locationAccuracy: response.locationAccuracy,
                  altitude: response.altitude,
                }
              : null
          }
        />
      );
    case 'FLOAT':
      return (
        <NumberInput
          onChangeNumber={onChangeNumber}
          value={
            currentQuestionNum == null
              ? response?.floatData
              : currentQuestionNum
          }
          inputType="FLOAT"
        />
      );
    case 'INTEGER':
      return (
        <NumberInput
          onChangeNumber={onChangeNumber}
          value={
            currentQuestionNum == null ? response?.intData : currentQuestionNum
          }
          inputType="INTEGER"
        />
      );
    case 'DATE':
      return (
        <DateInput
          onChangeDate={onChangeDate}
          unixTimestamp={currentQuestionDate || response?.dateData}
        />
      );
    case 'TEXTAREA':
      return (
        <TextFormInput
          multiline={true}
          numberOfLines={5}
          onChangeText={onChangeText}
          value={currentQuestionText || response?.textData}
          ref={inputRef}
        />
      );
    case 'TEXT':
      return (
        <TextFormInput
          multiline={false}
          onChangeText={onChangeText}
          value={currentQuestionText || response?.textData}
          ref={inputRef}
        />
      );
    default:
      return (
        <Text>
          <fbt desc="Error message that appears when a user tries to type in a form field that's not supposed to work yet">
            This form field is not currently supported.
          </fbt>
        </Text>
      );
  }
}

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    flexGrow: 1,
  },
};

export default createFragmentContainer(SurveyQuestionListItem, {
  question: graphql`
    fragment SurveyQuestionListItem_question on SurveyTemplateQuestion {
      id
      questionTitle
      questionDescription
      questionType
      index
    }
  `,
});
