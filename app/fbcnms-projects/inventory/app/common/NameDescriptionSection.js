/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

import FormField from '@symphony/design-system/components/FormField/FormField';
import NameInput from '@symphony/design-system/components/Form/NameInput';
import React from 'react';
import TextInput from '@symphony/design-system/components/Input/TextInput';
import fbt from 'fbt';
import {makeStyles} from '@material-ui/styles';

const useStyles = makeStyles(() => ({
  nameField: {
    width: '50%',
  },
}));

type Props = $ReadOnly<{|
  title?: string,
  name?: string,
  namePlaceholder?: ?string,
  description?: ?string,
  descriptionPlaceholder?: string,
  onNameChange?: string => void,
  onDescriptionChange?: string => void,
|}>;

const NameDescriptionSection = ({
  title,
  name,
  namePlaceholder,
  description,
  descriptionPlaceholder,
  onNameChange,
  onDescriptionChange,
}: Props) => {
  const classes = useStyles();
  return (
    <>
      <NameInput
        value={name}
        onChange={event => onNameChange && onNameChange(event.target.value)}
        inputClass={classes.nameField}
        title={title}
        placeholder={namePlaceholder || ''}
      />
      <FormField label={`${fbt('Description', '')}`}>
        <TextInput
          type="multiline"
          placeholder={descriptionPlaceholder}
          rows={4}
          value={description ?? ''}
          onChange={event =>
            onDescriptionChange && onDescriptionChange(event.target.value)
          }
        />
      </FormField>
    </>
  );
};

export default NameDescriptionSection;
