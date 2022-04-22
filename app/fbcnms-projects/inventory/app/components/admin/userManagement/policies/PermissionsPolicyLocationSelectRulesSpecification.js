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
  LocationCUDPermissions,
  DocumentCRUDPermissions,
} from '../data/PermissionsPolicies';

import * as React from 'react';
import FormField from '@symphony/design-system/components/FormField/FormField';
import SelectLocationTypes from '../../../../common/SelectLocationTypes';

import RadioGroup from '@symphony/design-system/components/RadioGroup/RadioGroup';
import Text from '@symphony/design-system/components/Text';
import classNames from 'classnames';
import fbt from 'fbt';
import {PERMISSION_RULE_VALUES} from '../data/PermissionsPolicies';
import {makeStyles} from '@material-ui/styles';
import {useCallback, useMemo, useState} from 'react';
import {useFormAlertsContext} from '@symphony/design-system/components/Form/FormAlertsContext';

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
  locationTypesSelection: {
    marginTop: '16px',
    minHeight: '52px',
    marginBottom: `-${ERROR_MESSAGE_HEIGHT}`,
  },
  hidden: {
    display: 'none',
  },
  radioGroupInline: {
    display: 'flex',
  },
  radioGroupInlineItem: {
    '&:nth-of-type(even)': {
      marginLeft: '8px',
    },
  },
  paddingBottom: {
    paddingBottom: '16px',
  },
}));

type Props = $ReadOnly<{|
  documentRule: DocumentCRUDPermissions,
  onChange: DocumentCRUDPermissions => void,
  disabled?: ?boolean,
  className?: ?string,
|}>;

const METHOD_ALL_LOCATIONS_VALUE = 0;
const METHOD_SELECTED_LOCATIONS_VALUE = 1;

export default function PermissionsPolicyLocationSelectRulesSpecification(
  props: Props,
) {
  const {documentRule, onChange, disabled, className} = props;
  const classes = useStyles();

  const options = useMemo(() => {
    const methods = [];
    methods[METHOD_ALL_LOCATIONS_VALUE] = {
      label: <fbt desc="">All locations</fbt>,
      value: METHOD_ALL_LOCATIONS_VALUE.toString(),
      key: METHOD_ALL_LOCATIONS_VALUE,
      details: '',
    };
    methods[METHOD_SELECTED_LOCATIONS_VALUE] = {
      label: <fbt desc="">Selected</fbt>,
      value: METHOD_SELECTED_LOCATIONS_VALUE.toString(),
      key: METHOD_SELECTED_LOCATIONS_VALUE,
      details: '',
    };
    return methods;
  }, []);

  const selectedLocationType = documentRule.locationTypeID || 0;

  const [policySelectMethod, setPolicySelectMethod] = useState(
    selectedLocationType > 0
      ? METHOD_SELECTED_LOCATIONS_VALUE.toString()
      : documentRule.read?.isAllowed === 'YES'
      ? METHOD_ALL_LOCATIONS_VALUE.toString()
      : '',
  );

  const updateUpdateRuleByMethod = useCallback(
    newPermissionMethod => {
      onChange({
        ...documentRule,
        locationTypeID:
          newPermissionMethod === METHOD_SELECTED_LOCATIONS_VALUE
            ? documentRule.locationTypeID
            : 0,
        read: {
          ...documentRule.read,
          isAllowed:
            newPermissionMethod === METHOD_SELECTED_LOCATIONS_VALUE
              ? PERMISSION_RULE_VALUES.BY_CONDITION
              : PERMISSION_RULE_VALUES.YES,
          documentCategoryIds:
            newPermissionMethod === METHOD_SELECTED_LOCATIONS_VALUE
              ? documentRule.read?.documentCategoryIds
              : null,
        },
      });
    },
    [onChange, documentRule],
  );

  const callSetPermissionSelectMethod = useCallback(
    newPermissionMethod => {
      setPolicySelectMethod(newPermissionMethod);
      updateUpdateRuleByMethod(newPermissionMethod);
    },
    [updateUpdateRuleByMethod],
  );
  const alerts = useFormAlertsContext();
  const emptyRequiredTypesSelectionErrorMessage = alerts.error.check({
    fieldId: 'location_types_selection',
    fieldDisplayName: 'Policies applied location types selection',
    value:
      policySelectMethod === METHOD_SELECTED_LOCATIONS_VALUE.toString() &&
      !(documentRule.read?.documentCategoryIds || []).length,
    checkCallback: missingRequiredSelection =>
      missingRequiredSelection
        ? `${fbt('At least one location type must be selected.', '')}`
        : '',
  });

  return (
    <div
      className={classNames(classes.policySpecificationContainer, className)}>
      <div className={classes.policyMethodSelection}>
        <Text className={classes.paddingBottom}>
          {disabled === true ? (
            <fbt desc="">Location types this policy applies to</fbt>
          ) : (
            <fbt desc="">Choose location types this policy applies to</fbt>
          )}
        </Text>
        <FormField>
          <RadioGroup
            options={options}
            value={policySelectMethod}
            onChange={callSetPermissionSelectMethod}
            className={classes.radioGroupInline}
            optionClassName={classes.radioGroupInlineItem}
          />
        </FormField>
      </div>
      <div>
        <FormField
          disabled={disabled}
          errorText={emptyRequiredTypesSelectionErrorMessage}
          hasError={!!emptyRequiredTypesSelectionErrorMessage}>
          <SelectLocationTypes
            disabled={
              policySelectMethod === '0' ||
              documentRule.read?.isAllowed === 'NO'
                ? true
                : false
            }
            selectLocationIdOnDocumentCategory={documentRule?.locationTypeID}
            selectedDocumentCategoriesIds={
              documentRule.read?.documentCategoryIds
            }
            onSelectedLocationTypesIdsChange={newDocumentCategoryIds => {
              onChange({
                ...documentRule,
                read: {
                  ...documentRule.read,
                  documentCategoryIds: newDocumentCategoryIds,
                  isAllowed: 'BY_CONDITION',
                },
              });
            }}
            onSelectChange={newLocationId => {
              onChange({
                ...documentRule,
                locationTypeID: parseInt(newLocationId),
              });
            }}
          />
        </FormField>
      </div>
    </div>
  );
}
