/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

import type {
  InventoryPolicy,
  DocumentCRUDPermissions,
} from '../data/PermissionsPolicies';
import type {PermissionsPolicyRulesSectionDisplayProps} from './PermissionsPolicyRulesSection';

import React from 'react';
import PermissionsPolicyLocationSelectRulesSpecification from './PermissionsPolicyLocationSelectRulesSpecification';
import PermissionsPolicySelectRulesSection from './PermissionsPolicySelectRulesSection';
import symphony from '@symphony/design-system/theme/symphony';
import {makeStyles} from '@material-ui/styles';
import {useCallback, useMemo} from 'react';

const useStyles = makeStyles(() => ({
  secondLevelBox: {
    backgroundColor: symphony.palette.background,
    borderStyle: 'solid',
    borderWidth: '1px',
    borderColor: symphony.palette.D100,
    borderLeftWidth: '2px',
    borderLeftColor: symphony.palette.primary,
    paddingLeft: '22px',
    paddingTop: '16px',
    paddingBottom: '10px',
    borderRadius: '2px',
    marginTop: '8px',
  },
}));

type Props = $ReadOnly<{|
  ...PermissionsPolicyRulesSectionDisplayProps,
  documentRule: DocumentCRUDPermissions,
  onChange?: DocumentCRUDPermissions => void,
|}>;

const PermissionsPolicyLocationDocumentCategoryRulesSection = (
  props: Props,
) => {
  const {
    onChange,
    documentRule,
    disabled,
    ...permissionsPolicyRulesSectionDisplayProps
  } = props;
  const classes = useStyles();

  const rule: DocumentCRUDPermissions = useMemo(
    () => ({
      locationTypeID: documentRule.locationTypeID,
      create: documentRule.create,
      read: documentRule.read,
      update: documentRule.update,
      delete: documentRule.delete,
    }),
    [documentRule.create],
  );

  const callOnChange = useCallback(
    (updatedRule: DocumentCRUDPermissions) => {
      if (onChange == null) {
        return;
      }
      onChange(updatedRule);
    },
    [onChange],
  );

  return (
    <PermissionsPolicySelectRulesSection
      rule={rule}
      onChange={() => {}}
      secondLevelRulesClassName={classes.secondLevelBox}
      policySpecifications={
        <PermissionsPolicyLocationSelectRulesSpecification
          documentRule={documentRule}
          onChange={callOnChange}
          disabled={disabled}
          className={classes.secondLevelBox}
        />
      }
      {...permissionsPolicyRulesSectionDisplayProps}
    />
  );
};

export default PermissionsPolicyLocationDocumentCategoryRulesSection;
