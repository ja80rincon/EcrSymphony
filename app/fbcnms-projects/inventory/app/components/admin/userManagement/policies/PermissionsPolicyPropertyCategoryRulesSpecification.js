/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

import type {PropertyCategoryCRUDPermissions} from '../data/PermissionsPolicies';

import * as React from 'react';
import FormField from '@symphony/design-system/components/FormField/FormField';
import PropertyCategoriesTokenizer from '../../../../common/PropertyCategoriesTokenizer';
import Select from '@symphony/design-system/components/Select/Select';
import Text from '@symphony/design-system/components/Text';
import classNames from 'classnames';
import fbt from 'fbt';
import {
  PERMISSION_RULE_VALUES,
  permissionRuleValue2Bool,
} from '../data/PermissionsPolicies';
import {makeStyles} from '@material-ui/styles';
import {useCallback, useMemo, useState} from 'react';
import {useEffect} from 'react';
import {useFormAlertsContext} from '@symphony/design-system/components/Form/FormAlertsContext';
import type {PermissionsPolicyRulesSectionDisplayProps} from './PermissionsPolicyRulesSection';
import RadioGroup from '@symphony/design-system/components/RadioGroup/RadioGroup';

const ERROR_MESSAGE_HEIGHT = '6px';

const useStyles = makeStyles(() => ({
  policySpecificationContainer: {
    display: 'flex',
    flexDirection: 'column',
    padding: '2px 16px 0 7px',
  },
  policyMethodSelection: {
    display: 'flex',
    flexDirection: 'column',
    width: 'fit-content',
    '& > *': {
      marginBottom: '4px',
    },
  },
  permissionMethodSelect: {
    '&&': {
      paddingLeft: '8px',
      marginRight: '16px',
    },
  },
  propertyCategorySelection: {
    minHeight: '52px',
    marginBottom: `-${ERROR_MESSAGE_HEIGHT}`,
  },
  hidden: {
    display: 'none',
  },
  header: {
    marginBottom: '4px',
    marginLeft: '4px',
    display: 'flex',
    flexDirection: 'column',
  },
  section: {
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
  descriptionRule: {
    paddingBottom: '16px',
  },
}));

type Props = $ReadOnly<{|
  ...PermissionsPolicyRulesSectionDisplayProps,
  propertyCategoryRule: PropertyCategoryCRUDPermissions,
  onChange: PropertyCategoryCRUDPermissions => void,
  disabled?: ?boolean,
  secondLevelRulesClassName?: ?string,
|}>;

const METHOD_ALL_PROP_CATEGORY_VALUE = 0;
const METHOD_SELECTED_PROP_CATEGORY_VALUE = 1;

export default function PermissionsPolicyPropertyCategoryRulesSpecification(
  props: Props,
) {
  const {
    propertyCategoryRule,
    onChange,
    disabled,
    secondLevelRulesClassName,
    title,
    subtitle,
  } = props;
  const classes = useStyles();

  const policyMethods = useMemo(() => {
    const methods = [];
    methods[METHOD_ALL_PROP_CATEGORY_VALUE] = {
      label: <fbt desc="">All property categories</fbt>,
      value: METHOD_ALL_PROP_CATEGORY_VALUE.toString(),
      key: METHOD_ALL_PROP_CATEGORY_VALUE,
      details: '',
    };
    methods[METHOD_SELECTED_PROP_CATEGORY_VALUE] = {
      label: <fbt desc="">Selected</fbt>,
      value: METHOD_SELECTED_PROP_CATEGORY_VALUE.toString(),
      key: METHOD_SELECTED_PROP_CATEGORY_VALUE,
      details: '',
    };
    return methods;
  }, []);

  const selectedPropCategoryCount =
    propertyCategoryRule.read?.propertyCategoryIds?.length || 0;
  const [policyMethod, setPolicyMethod] = useState(
    selectedPropCategoryCount > 0
      ? METHOD_SELECTED_PROP_CATEGORY_VALUE.toString()
      : propertyCategoryRule.read?.isAllowed === PERMISSION_RULE_VALUES.NO
      ? ''
      : METHOD_ALL_PROP_CATEGORY_VALUE.toString(),
  );

  const updateUpdateRuleByMethod = useCallback(
    newPermissionMethod => {
      onChange({
        ...propertyCategoryRule,
        read: {
          ...propertyCategoryRule.read,
          isAllowed:
            newPermissionMethod ===
            METHOD_SELECTED_PROP_CATEGORY_VALUE.toString()
              ? PERMISSION_RULE_VALUES.BY_CONDITION
              : PERMISSION_RULE_VALUES.YES,
          propertyCategoryIds:
            newPermissionMethod ===
            METHOD_SELECTED_PROP_CATEGORY_VALUE.toString()
              ? propertyCategoryRule.read?.propertyCategoryIds
              : null,
        },
      });
    },
    [onChange, propertyCategoryRule],
  );

  const callSetPermissionMethod = useCallback(
    newPermissionMethod => {
      setPolicyMethod(newPermissionMethod);
      updateUpdateRuleByMethod(newPermissionMethod);
    },
    [updateUpdateRuleByMethod],
  );

  useEffect(() => {
    if (
      propertyCategoryRule.read?.isAllowed === PERMISSION_RULE_VALUES.YES &&
      policyMethod === METHOD_SELECTED_PROP_CATEGORY_VALUE.toString()
    ) {
      updateUpdateRuleByMethod(policyMethod);
    }
  }, [
    propertyCategoryRule.read?.isAllowed,
    policyMethod,
    updateUpdateRuleByMethod,
  ]);

  const alerts = useFormAlertsContext();
  const emptyRequiredTypesSelectionErrorMessage = alerts.error.check({
    fieldId: 'property_category_types_selection',
    fieldDisplayName: 'Policies applied property category types selection',
    value:
      permissionRuleValue2Bool(propertyCategoryRule.read?.isAllowed || 'NO') &&
      policyMethod === METHOD_SELECTED_PROP_CATEGORY_VALUE.toString() &&
      selectedPropCategoryCount === 0,
    checkCallback: missingRequiredSelection =>
      missingRequiredSelection
        ? `${fbt('At least one property category must be selected.', '')}`
        : '',
  });

  return (
    <div className={classes.section}>
      <div className={classes.header}>
        <Text variant="subtitle1">{title}</Text>
        <Text variant="body2" color="gray">
          {subtitle}
        </Text>
      </div>
      <div
        className={classNames(
          classes.policySpecificationContainer,
          secondLevelRulesClassName,
        )}>
        <div className={classes.policyMethodSelection}>
          <Text className={classes.descriptionRule}>
            {disabled == true ? (
              <fbt desc="">Property categories this policy applies to</fbt>
            ) : (
              <fbt desc="">
                Choose property categories this policy applies to
              </fbt>
            )}
          </Text>
          <FormField disabled={disabled}>
            <RadioGroup
              options={policyMethods}
              value={policyMethod}
              onChange={callSetPermissionMethod}
              className={classes.radioGroupInline}
              optionClassName={classes.radioGroupInlineItem}
            />
          </FormField>
        </div>
        <div
          className={classNames(classes.propertyCategorySelection, {
            [classes.hidden]:
              policyMethod !== METHOD_SELECTED_PROP_CATEGORY_VALUE.toString(),
          })}>
          <FormField
            disabled={disabled}
            errorText={emptyRequiredTypesSelectionErrorMessage}
            hasError={!!emptyRequiredTypesSelectionErrorMessage}>
            <PropertyCategoriesTokenizer
              selectedLocationTypeIds={
                propertyCategoryRule.read?.propertyCategoryIds
              }
              onSelectedLocationTypesIdsChange={newPropCategoryIds =>
                onChange({
                  ...propertyCategoryRule,
                  read: {
                    ...propertyCategoryRule.read,
                    isAllowed: PERMISSION_RULE_VALUES.BY_CONDITION,
                    propertyCategoryIds: newPropCategoryIds,
                  },
                })
              }
            />
          </FormField>
        </div>
      </div>
    </div>
  );
}
