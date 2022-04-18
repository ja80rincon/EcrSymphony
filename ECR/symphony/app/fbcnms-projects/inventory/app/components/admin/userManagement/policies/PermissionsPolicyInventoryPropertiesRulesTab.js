/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

import type {InventoryPolicy} from '../data/PermissionsPolicies';

import * as React from 'react';
import AppContext from '@fbcnms/ui/context/AppContext';
import PermissionsPolicyPropertyCategoryRulesSection from './PermissionsPolicyPropertyCategoryRulesSection';
import Switch from '@symphony/design-system/components/switch/Switch';
import classNames from 'classnames';
import fbt from 'fbt';
import {
  bool2PermissionRuleValue,
  permissionRuleValue2Bool,
} from '../data/PermissionsPolicies';
import Text from '@symphony/design-system/components/Text';
import RadioGroup from '@symphony/design-system/components/RadioGroup/RadioGroup';
import Select from '@symphony/design-system/components/Select/Select';
import Tokenizer from '@symphony/design-system/components/Token/Tokenizer';
import {makeStyles} from '@material-ui/styles';

const useStyles = makeStyles(() => ({
  root: {
    marginLeft: '4px',
    maxHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  readRule: {
    marginLeft: '4px',
  },
  section: {
    marginTop: '32px',
  },
  radioGroup: {
    marginLeft: '4px',
    maxHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  radioGroupInline: {
    display: 'flex',
  },
  radioGroupInlineItem: {
    '&:nth-of-type(even)': {
      marginLeft: '8px',
    },
  },
  sectionHeader: {
    paddingTop: '16px',
    marginBottom: '16px',
    '&>span': {
      display: 'block',
    },
  },
  select: {
    maxWidth: '350px',
  },
}));

type Props = $ReadOnly<{|
  policy: ?InventoryPolicy,
  onChange?: InventoryPolicy => void,
  className?: ?string,
|}>;

export default function PermissionsPolicyInventoryPropertiesRulesTab(
  props: Props,
) {
  const {policy, onChange, className} = props;
  const classes = useStyles();
  if (policy == null) {
    return null;
  }

  const readAllowed = permissionRuleValue2Bool(policy.read.isAllowed);
  const isDisabled = onChange == null;

  return (
    <div className={classNames(classes.root, className)}>
      <PermissionsPolicyPropertyCategoryRulesSection
        title={fbt('Property Categories', '')}
        subtitle={fbt(
          'Location properties are categorized according for all the locations. Users with access on a category, will see and edit properties of that category.',
          '',
        )}
        disabled={isDisabled || !readAllowed}
        propertyCategoryRule={policy.propertyCategory}
        className={classes.section}
        onChange={
          onChange != null
            ? propertyCategory =>
                onChange({
                  ...policy,
                  propertyCategory,
                })
            : undefined
        }
      />
    </div>
  );
}
