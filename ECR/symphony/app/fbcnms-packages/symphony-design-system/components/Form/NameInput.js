/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import FormAlertsContext from '@symphony/design-system/components/Form/FormAlertsContext';
import FormField from '@symphony/design-system/components/FormField/FormField';
import React, {useContext, useMemo} from 'react';
import TextInput from '@symphony/design-system/components/Input/TextInput';
import shortid from 'shortid';

type Props = $ReadOnly<{|
  value: ?string,
  onChange?: (e: SyntheticInputEvent<HTMLInputElement>) => void,
  inputClass?: string,
  title?: string,
  placeholder?: string,
  disabled?: boolean,
  onBlur?: () => void,
  hasSpacer?: boolean,
|}>;

const NameInput = (props: Props) => {
  const {
    title = 'Name',
    onChange,
    value,
    inputClass,
    placeholder,
    disabled,
    onBlur,
    hasSpacer,
  } = props;
  const onNameChanded = event => {
    if (!onChange) {
      return;
    }
    onChange(event);
  };
  const fieldId = useMemo(() => shortid.generate(), []);
  const validationContext = useContext(FormAlertsContext);
  const errorText = validationContext.error.check({
    fieldId,
    fieldDisplayName: title,
    value: value,
    required: true,
  });
  const solidValue = value || '';
  return (
    <FormField
      label={title}
      required={true}
      hasError={!!errorText}
      errorText={errorText}
      validation={{
        id: fieldId,
        value: solidValue,
      }}
      hasSpacer={hasSpacer ?? true}>
      <TextInput
        name={fieldId}
        autoFocus={true}
        type="string"
        className={inputClass}
        value={solidValue}
        placeholder={placeholder}
        onChange={onNameChanded}
        disabled={disabled}
        onBlur={onBlur}
      />
    </FormField>
  );
};

export default NameInput;
