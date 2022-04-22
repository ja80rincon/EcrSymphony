/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

import * as React from 'react';
import FormElementContext from './FormElementContext';
import {joinNullableStrings} from '@fbcnms/util/strings';
import {useFormAlertsContext} from '../Form/FormAlertsContext';
import {useMemo} from 'react';

export type PermissionHandlingProps = $ReadOnly<{|
  ignorePermissions?: ?boolean,
  hideOnMissingPermissions?: ?boolean,
|}>;

export type ErrorHandlingProps = $ReadOnly<{|
  disableOnFromError?: ?boolean,
|}>;

export type EditLocksHandlingProps = $ReadOnly<{|
  ignoreEditLocks?: ?boolean,
  hideOnEditLocks?: ?boolean,
|}>;

export type FormActionProps = $ReadOnly<{|
  children: React.Node,
  disabled?: boolean,
  tooltip?: ?string,
|}>;

type Props = $ReadOnly<{|
  ...FormActionProps,
  ...PermissionHandlingProps,
  ...ErrorHandlingProps,
  ...EditLocksHandlingProps,
|}>;

const FormAction = (props: Props) => {
  const {
    children,
    disabled: disabledProp = false,
    tooltip: tooltipProp,
    ignorePermissions = false,
    ignoreEditLocks = false,
    hideOnEditLocks = false,
    hideOnMissingPermissions = true,
    disableOnFromError = false,
  } = props;

  const validationContext = useFormAlertsContext();
  const missingPermissions =
    ignorePermissions !== true && validationContext.missingPermissions.detected;
  const hasEdittingLocks =
    validationContext.editLock.detected && !ignoreEditLocks;
  const edittingLocked = missingPermissions || hasEdittingLocks;
  const shouldHide =
    (missingPermissions && hideOnMissingPermissions == true) ||
    (hasEdittingLocks && hideOnEditLocks);
  const haveDisablingError =
    validationContext.error.detected && disableOnFromError;
  const disabled: boolean =
    disabledProp || edittingLocked || haveDisablingError == true;
  const tooltip = useMemo(
    () =>
      joinNullableStrings([
        tooltipProp,
        haveDisablingError == true ? validationContext.error.message : null,
        edittingLocked == true
          ? validationContext.missingPermissions.message
          : null,
      ]),
    [
      edittingLocked,
      haveDisablingError,
      tooltipProp,
      validationContext.missingPermissions.message,
      validationContext.error.message,
    ],
  );
  return (
    <FormElementContext.Provider value={{disabled, tooltip}}>
      {shouldHide === true ? null : children}
    </FormElementContext.Provider>
  );
};

export default FormAction;
