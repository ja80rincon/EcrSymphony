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
  BasicPermissionRule,
  CUDPermissions,
  DocumentCRUDPermissions,
} from '../data/PermissionsPolicies';
import type {PermissionsPolicyRulesSectionDisplayProps} from './PermissionsPolicyRulesSection';
import * as React from 'react';

import Text from '@symphony/design-system/components/Text';
import classNames from 'classnames';
import {makeStyles} from '@material-ui/styles';
import {useEffect, useState} from 'react';

const useStyles = makeStyles(() => ({
  section: {
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    marginBottom: '4px',
    marginLeft: '4px',
    display: 'flex',
    flexDirection: 'column',
  },
  rule: {
    marginTop: '8px',
    marginLeft: '4px',
  },
  dependantRules: {
    marginLeft: '34px',
    display: 'flex',
    flexDirection: 'column',
  },
}));

type Props = $ReadOnly<{|
  ...PermissionsPolicyRulesSectionDisplayProps,
  rule: DocumentCRUDPermissions,
  onChange?: DocumentCRUDPermissions => void,

  policySpecifications?: React.Node,
|}>;

export default function PermissionsPolicySelectRulesSection(props: Props) {
  const {
    title,
    subtitle,
    rule: ruleProp,
    policySpecifications,
    disabled,
    className,

    onChange,
    children,
  } = props;
  const classes = useStyles();
  const [rule, setRule] = useState<DocumentCRUDPermissions>(ruleProp);
  useEffect(() => setRule(ruleProp), [ruleProp]);

  if (rule == null) {
    return null;
  }
  return (
    <div className={classNames(classes.section, className)}>
      <div className={classes.header}>
        <Text variant="subtitle1">{title}</Text>
        <Text variant="body2" color="gray">
          {subtitle}
        </Text>
      </div>
      {policySpecifications}
    </div>
  );
}
