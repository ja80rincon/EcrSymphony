/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

import type {FormFieldTextInputProps} from '../../../../../admin/userManagement/utils/FormFieldTextInput';

import Button from '@symphony/design-system/components/Button';
import FormAction from '@symphony/design-system/components/Form/FormAction';
import FormFieldTextInput from '../../../../../admin/userManagement/utils/FormFieldTextInput';
import React, {useCallback, useEffect, useState} from 'react';
import Strings from '@fbcnms/strings/Strings';
import {FormContextProvider} from '../../../../../../common/FormContext';
import {fbt} from 'fbt';
import {makeStyles} from '@material-ui/styles';

const useStyles = makeStyles(() => ({
  wrapper: {
    width: '480px',
  },
  inputField: {
    minHeight: '98px',
  },
  actionButtons: {
    padding: '4px 0 24px 0',
    bottom: 0,
    display: 'flex',
    justifyContent: 'flex-end',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  actionButton: {
    '&:not(:last-child)': {
      marginRight: '8px',
    },
  },
}));

type Props = $ReadOnly<{|
  ...FormFieldTextInputProps,
  onClose: () => void,
  onSave: (newName: string) => void,
|}>;

function FormFieldTextDialog(props: Props) {
  return (
    <FormContextProvider permissions={{adminRightsRequired: true}}>
      <DialogContent {...props} />
    </FormContextProvider>
  );
}

function DialogContent(props: Props) {
  const classes = useStyles();
  const {onClose, onSave, value: originalValue, label, ...rest} = props;

  const [value, setValue] = useState(originalValue);
  useEffect(() => {
    setValue(originalValue);
  }, [originalValue]);

  const callSave = useCallback(() => {
    if (value === originalValue) {
      onClose();
      return;
    }
    onSave(value);
  }, [value, onSave, originalValue, onClose]);

  return (
    <div className={classes.wrapper}>
      <FormFieldTextInput
        className={classes.inputField}
        label={label}
        hasSpacer={true}
        value={value}
        onValueChanged={newValue => setValue(newValue)}
        {...rest}
      />
      <div className={classes.actionButtons}>
        <Button
          className={classes.actionButton}
          onClick={() => {
            setValue(originalValue);
            onClose();
          }}
          skin="gray">
          {Strings.common.cancelButton}
        </Button>
        <FormAction disableOnFromError={true}>
          <Button className={classes.actionButton} onClick={callSave}>
            <fbt desc="">Apply</fbt>
          </Button>
        </FormAction>
      </div>
    </div>
  );
}

export default FormFieldTextDialog;
