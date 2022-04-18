/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {FocusEvent} from '@symphony/design-system/components/Input/TextInput';

import FormContext from '../../common/FormContext';
import FormField from '@symphony/design-system/components/FormField/FormField';
import InputAffix from '@symphony/design-system/components/Input/InputAffix';
import React from 'react';
import TextInput from '@symphony/design-system/components/Input/TextInput';
import classNames from 'classnames';
import {makeStyles} from '@material-ui/styles';

type Range = {
  rangeFrom: ?number,
  rangeTo: ?number,
};

type Props = $ReadOnly<{|
  label?: ?string,
  value: Range,
  className: string,
  required: boolean,
  disabled: boolean,
  onBlur: (e: FocusEvent<HTMLInputElement>) => ?void,
  onRangeToChange: (event: SyntheticInputEvent<>) => void,
  onRangeFromChange: (event: SyntheticInputEvent<>) => void,
  autoFocus?: boolean,
|}>;

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    width: '280px',
  },
  input: {
    marginLeft: '0px',
    marginRight: theme.spacing(),
    width: '100%',
  },
  lngField: {
    marginLeft: '16px',
  },
  formField: {
    flexGrow: 1,
  },
}));

const RangePropertyValueInput = (props: Props) => {
  const {className, disabled, required, value, autoFocus, label} = props;
  const classes = useStyles();

  const {rangeFrom, rangeTo} = value;
  const fieldIdPrefix = `range-${label || 'field'}-`;
  return (
    <FormContext.Consumer>
      {form => {
        const errorFrom = form.alerts.error.check({
          fieldId: `${fieldIdPrefix}From`,
          fieldDisplayName: 'From',
          value: parseFloat(rangeFrom),
          required: required,
        });
        const errorTo = form.alerts.error.check({
          fieldId: `${fieldIdPrefix}To`,
          fieldDisplayName: 'To',
          value: parseFloat(rangeTo),
          required: required,
        });

        return (
          <FormField label={label || ''} required={required}>
            <div className={classNames(classes.container, className)}>
              <FormField
                className={classes.formField}
                required={required}
                errorText={errorFrom}
                hasError={!!errorFrom}>
                <TextInput
                  autoFocus={autoFocus}
                  disabled={disabled}
                  prefix={<InputAffix>From</InputAffix>}
                  className={classes.input}
                  onEnterPressed={e => {
                    // $FlowFixMe
                    props.onBlur(e);
                  }}
                  value={parseFloat(rangeFrom)}
                  type="number"
                  onChange={props.onRangeFromChange}
                />
              </FormField>
              <FormField
                required={required}
                errorText={errorTo}
                hasError={!!errorTo}
                className={classNames(classes.lngField, classes.formField)}>
                <TextInput
                  disabled={disabled}
                  prefix={<InputAffix>To</InputAffix>}
                  className={classes.input}
                  onEnterPressed={e => {
                    // $FlowFixMe
                    props.onBlur(e);
                  }}
                  type="number"
                  value={parseFloat(rangeTo)}
                  onChange={props.onRangeToChange}
                />
              </FormField>
            </div>
          </FormField>
        );
      }}
    </FormContext.Consumer>
  );
};

export default RangePropertyValueInput;
