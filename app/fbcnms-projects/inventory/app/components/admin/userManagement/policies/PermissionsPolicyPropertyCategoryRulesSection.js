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
  CUDPermissions,
  PropertyCategoryCRUDPermissions,
} from '../data/PermissionsPolicies';
import type {PermissionsPolicyRulesSectionDisplayProps} from './PermissionsPolicyRulesSection';

import * as React from 'react';
import PermissionsPolicyPropertyCategoryRulesSpecification from './PermissionsPolicyPropertyCategoryRulesSpecification';
import PermissionsPolicyRulesSection from './PermissionsPolicyRulesSection';
import symphony from '@symphony/design-system/theme/symphony';
import {makeStyles} from '@material-ui/styles';
import {useCallback, useMemo, useEffect} from 'react';

const useStyles = makeStyles(() => ({
  secondLevelBox: {
    backgroundColor: symphony.palette.background,
    borderStyle: 'solid',
    borderWidth: '1px',
    borderColor: symphony.palette.D100,
    borderLeftWidth: '2px',
    borderLeftColor: symphony.palette.primary,
    paddingTop: '16px',
    paddingBottom: '10px',
    borderRadius: '2px',
    marginTop: '8px',
    paddingLeft: '22px',
  },
}));

type Props = $ReadOnly<{|
  ...PermissionsPolicyRulesSectionDisplayProps,
  propertyCategoryRule: PropertyCategoryCRUDPermissions,
  onChange?: PropertyCategoryCRUDPermissions => void,
|}>;

export default function PermissionsPolicyPropertyCategoryRulesSection(
  props: Props,
) {
  const {
    propertyCategoryRule,
    onChange,
    disabled,
    ...permissionsPolicyRulesSectionDisplayProps
  } = props;
  const classes = useStyles();
  const callOnChange = useCallback(
    (updatedRule: PropertyCategoryCRUDPermissions) => {
      if (onChange == null) {
        return;
      }
      onChange(updatedRule);
    },
    [onChange],
  );

  return (
    <PermissionsPolicyPropertyCategoryRulesSpecification
      secondLevelRulesClassName={classes.secondLevelBox}
      propertyCategoryRule={propertyCategoryRule}
      onChange={callOnChange}
      disabled={disabled}
      {...permissionsPolicyRulesSectionDisplayProps}
    />
  );
}
