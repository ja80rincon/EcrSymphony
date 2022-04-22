/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import * as React from 'react';
import FormField from '@symphony/design-system/components/FormField/FormField';
import TextInput from '@symphony/design-system/components/Input/TextInput';
import useSideEffectCallback from './useSideEffectCallback';
import {useEffect, useState} from 'react';

export type FormFieldTextInputProps = $ReadOnly<{|
  validationId?: string,
  label: string,
  placeholder?: string,
  hasSpacer?: boolean,
  type?: string,
  rows?: number,
  value: string,
  onValueChanged?: ?(string) => void,
  className?: ?string,
  disabled?: ?boolean,
  hasError?: boolean,
  errorText?: ?string,
  immediateUpdate?: boolean,
|}>;

const FormFieldTextInput = (props: FormFieldTextInputProps) => {
  const {
    value: propValue,
    onValueChanged,
    validationId,
    label,
    placeholder,
    hasSpacer,
    type,
    rows,
    className,
    hasError,
    errorText,
    disabled,
    immediateUpdate = true,
  } = props;
  const [fieldValue, setFieldValue] = useState<string>('');
  useEffect(() => setFieldValue(propValue), [propValue]);

  const callOnValueChanged = useSideEffectCallback(
    onValueChanged ? () => onValueChanged(fieldValue) : null,
  );
  const updateOnValueChange = updatedValue => {
    const isOnGoingChange = updatedValue != null;
    const currentValue = isOnGoingChange ? updatedValue : fieldValue;
    const trimmedValue = (currentValue && currentValue.trim()) || '';
    if (!isOnGoingChange && trimmedValue != currentValue) {
      setFieldValue(trimmedValue);
    }
    if (trimmedValue == propValue) {
      return;
    }
    callOnValueChanged();
  };

  const isRequired = validationId != null;
  return (
    <FormField
      className={className || undefined}
      label={label}
      hasSpacer={hasSpacer}
      required={isRequired}
      validation={
        isRequired
          ? {
              id: validationId || '',
              value: fieldValue,
            }
          : undefined
      }
      hasError={hasError}
      errorText={errorText}>
      <TextInput
        type={type}
        rows={rows}
        placeholder={placeholder}
        value={fieldValue}
        disabled={disabled ?? false}
        onChange={e => {
          setFieldValue(e.target.value);
          if (immediateUpdate) {
            updateOnValueChange(e.target.value);
          }
        }}
        onBlur={!immediateUpdate ? () => updateOnValueChange() : undefined}
      />
    </FormField>
  );
};

export default FormFieldTextInput;
