/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {Theme} from '@material-ui/core';

import FormField from '@symphony/design-system/components/FormField/FormField';
import InputAffix from '@symphony/design-system/components/Input/InputAffix';
import React from 'react';
import TextInput from '@symphony/design-system/components/Input/TextInput';
import classNames from 'classnames';
import {makeStyles} from '@material-ui/styles';
import {useFormContext} from '../../common/FormContext';

type Props = $ReadOnly<{|
  value: any,
  className?: string,
  label?: ?string,
  required?: boolean,
  disabled?: boolean,
  onLatitudeChange: (event: SyntheticInputEvent<any>) => void,
  onLongitudeChange: (event: SyntheticInputEvent<any>) => void,
  fullWidth?: boolean,
  autoFocus?: boolean,
|}>;

const useStyles = makeStyles((theme: Theme) => ({
  container: {
    display: 'flex',
    width: '280px',
  },
  fullWidth: {
    width: '100%',
  },
  input: {
    marginLeft: '0px',
    marginRight: theme.spacing(),
    width: '100%',
  },
  lngField: {
    marginLeft: '16px',
  },
  field: {
    flexGrow: 1,
  },
}));

const GPSPropertyValueInput = (props: Props) => {
  const classes = useStyles();
  const {
    className,
    disabled = false,
    required = false,
    autoFocus,
    fullWidth,
    label = '',
  } = props;
  const {latitude, longitude} = props.value || {
    latitude: '',
    longitude: '',
  };
  const fieldIdPrefix = `gpsLocation-${label || 'field'}-`;
  const form = useFormContext();
  const errorLatitude = form.alerts.error.check({
    fieldId: `${fieldIdPrefix}Latitude`,
    fieldDisplayName: 'Latitude',
    value: latitude,
    required: required,
    range: {
      from: -90,
      to: 90,
    },
  });
  const errorLongitude = form.alerts.error.check({
    fieldId: `${fieldIdPrefix}Longitude`,
    fieldDisplayName: 'Longitude',
    value: longitude,
    required: required,
    range: {
      from: -180,
      to: 180,
    },
  });
  return (
    <FormField label={label || ''} required={required}>
      <div
        className={classNames(classes.container, className, {
          [classes.fullWidth]: fullWidth,
        })}>
        <FormField
          required={required}
          errorText={errorLatitude}
          hasError={!!errorLatitude}
          className={classes.field}>
          <TextInput
            autoFocus={autoFocus}
            prefix={<InputAffix>Lat.</InputAffix>}
            disabled={disabled}
            className={classes.input}
            value={latitude}
            type="number"
            onChange={props.onLatitudeChange}
          />
        </FormField>
        <FormField
          required={required}
          errorText={errorLongitude}
          hasError={!!errorLongitude}
          className={classNames(classes.lngField, classes.field)}>
          <TextInput
            prefix={<InputAffix>Long.</InputAffix>}
            disabled={disabled}
            className={classes.input}
            type="number"
            value={longitude}
            onChange={props.onLongitudeChange}
          />
        </FormField>
      </div>
    </FormField>
  );
};

export default GPSPropertyValueInput;
