/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

import type {FormAlertsContextType} from '@symphony/design-system/components/Form/FormAlertsContext';
import type {PermissionEnforcement} from '../components/admin/userManagement/utils/usePermissions';

import * as React from 'react';
import usePermissions from '../components/admin/userManagement/utils/usePermissions';
import {
  DEFAULT_CONTEXT_VALUE as DEFAULT_ALERTS,
  FormAlertsContextProvider,
  useFormAlertsContext,
} from '@symphony/design-system/components/Form/FormAlertsContext';
import {createContext, useContext} from 'react';

type FromContextType = $ReadOnly<{|
  alerts: FormAlertsContextType,
|}>;

const DEFAULT_CONTEXT_VALUE = {
  alerts: DEFAULT_ALERTS,
};

const FormContext = createContext<FromContextType>(DEFAULT_CONTEXT_VALUE);

type Props = $ReadOnly<{|
  children: React.Node,
  permissions: PermissionEnforcement,
|}>;

function FormWrapper(props: Props) {
  const {children, permissions} = props;
  const permissionsRules = usePermissions();
  const alerts = useFormAlertsContext();

  permissionsRules.check(permissions, 'Form Permissions');

  return (
    <FormContext.Provider value={{alerts}}>{children}</FormContext.Provider>
  );
}

export function FormContextProvider(props: Props) {
  return (
    <FormAlertsContextProvider>
      <FormWrapper {...props} />
    </FormAlertsContextProvider>
  );
}

export const useFormContext = () => useContext(FormContext);

export default FormContext;
