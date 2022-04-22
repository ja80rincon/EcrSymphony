/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

import type {PermissionsPolicy} from '../data/PermissionsPolicies';
import type {WithAlert} from '@fbcnms/ui/components/Alert/withAlert';

import * as React from 'react';
import Breadcrumbs from '@fbcnms/ui/components/Breadcrumbs';
import Button from '@symphony/design-system/components/Button';
import Card from '@symphony/design-system/components/Card/Card';
import DeleteIcon from '@symphony/design-system/icons/Actions/DeleteIcon';
import FormAction from '@symphony/design-system/components/Form/FormAction';
import Grid from '@material-ui/core/Grid';
import IconButton from '@symphony/design-system/components/IconButton';
import InventoryErrorBoundary from '../../../../common/InventoryErrorBoundary';
import LockIcon from '@symphony/design-system/icons/Indications/LockIcon';
import PermissionsPolicyDetailsPane from './PermissionsPolicyDetailsPane';
import PermissionsPolicyGroupsPane from './PermissionsPolicyGroupsPane';
import PermissionsPolicyRulesPane from './PermissionsPolicyRulesPane';
import Strings from '@fbcnms/strings/Strings';
import Text from '@symphony/design-system/components/Text';
import ViewContainer from '@symphony/design-system/components/View/ViewContainer';
import classNames from 'classnames';
import fbt from 'fbt';
import withAlert from '@fbcnms/ui/components/Alert/withAlert';
import withSuspense from '../../../../common/withSuspense';
import {
  EMPTY_POLICY,
  PERMISSION_RULE_VALUES,
  WORKORDER_SYSTEM_POLICY,
  WORKORDER_SYSTEM_POLICY_ID,
  addPermissionsPolicy,
  deletePermissionsPolicy,
  editPermissionsPolicy,
  usePermissionsPolicy,
} from '../data/PermissionsPolicies';
import {FormContextProvider} from '../../../../common/FormContext';
import {NEW_DIALOG_PARAM, POLICY_TYPES} from '../utils/UserManagementUtils';
import {PERMISSION_POLICIES_VIEW_NAME} from './PermissionsPoliciesView';
import {SYSTEM_DEFAULT_POLICY_PREFIX} from './PermissionsPoliciesTable';
import {generateTempId} from '../../../../common/EntUtils';
import {makeStyles} from '@material-ui/styles';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {useEnqueueSnackbar} from '@fbcnms/ui/hooks/useSnackbar';
import {useFormAlertsContext} from '@symphony/design-system/components/Form/FormAlertsContext';
import {useLocation} from 'react-router-dom';
import {useParams} from 'react-router';

const useStyles = makeStyles(() => ({
  container: {
    maxHeight: '100%',
  },
  vertical: {
    '&>:not(:first-child)': {
      marginTop: '16px',
    },
  },
  defaultPolicyMessage: {
    display: 'flex',
    flexDirection: 'row',
    '&>:not(:first-child)': {
      marginLeft: '8px',
    },
  },
  defaultPolicyMessageHeader: {
    display: 'block',
  },
}));

type Props = $ReadOnly<{|
  redirectToPoliciesView: () => void,
  onClose: () => void,
  ...WithAlert,
|}>;

const initialBasicRule = {
  isAllowed: PERMISSION_RULE_VALUES.NO,
};

const initialCUDRule = {
  create: {
    ...initialBasicRule,
  },
  update: {
    ...initialBasicRule,
  },
  delete: {
    ...initialBasicRule,
  },
};

const initialLocationCUDRule = {
  ...initialCUDRule,
  update: {
    ...initialBasicRule,
    locationTypeIds: null,
  },
};

//TODO: cHECK IDS null
const initialdocumentCategoryCRUDRule = {
  locationTypeID: 0,
  create: {
    ...initialBasicRule,
    documentCategoryIds: null,
  },
  delete: {
    ...initialBasicRule,
    documentCategoryIds: null,
  },
  update: {
    ...initialBasicRule,
    documentCategoryIds: null,
  },
  read: {
    ...initialBasicRule,
    documentCategoryIds: null,
  },
};

const initialPropertyCategoryCRUDRule = {
  read: {
    ...initialBasicRule,
    propertyCategoryIds: null,
  },
  create: {
    ...initialBasicRule,
    propertyCategoryIds: null,
  },
  update: {
    ...initialBasicRule,
    propertyCategoryIds: null,
  },
  delete: {
    ...initialBasicRule,
    propertyCategoryIds: null,
  },
};

const initialInventoryRules = {
  read: {
    isAllowed: PERMISSION_RULE_VALUES.YES,
  },
  location: {
    ...initialLocationCUDRule,
  },
  documentCategory: {
    ...initialdocumentCategoryCRUDRule,
  },
  propertyCategory: {
    ...initialPropertyCategoryCRUDRule,
  },
  equipment: {
    ...initialCUDRule,
  },
  equipmentType: {
    ...initialCUDRule,
  },
  locationType: {
    ...initialCUDRule,
  },
  portType: {
    ...initialCUDRule,
  },
  serviceType: {
    ...initialCUDRule,
  },
};

const initialWorkforceCUDRules = {
  ...initialCUDRule,
  assign: {
    ...initialBasicRule,
  },
  transferOwnership: {
    ...initialBasicRule,
  },
};

const initialWorkforceRules = {
  read: {
    ...initialBasicRule,
    projectTypeIds: null,
    workOrderTypeIds: null,
    organizationIds: null,
  },
  data: {
    ...initialWorkforceCUDRules,
  },
  templates: {
    ...initialCUDRule,
  },
};

const getInitialNewPolicy: (policyType: ?string) => PermissionsPolicy = (
  policyType: ?string,
) => {
  let type = POLICY_TYPES.InventoryPolicy.key;
  if (policyType === POLICY_TYPES.WorkforcePolicy.key) {
    type = POLICY_TYPES.WorkforcePolicy.key;
  }

  return {
    id: generateTempId(),
    name: '',
    description: '',
    type,
    isGlobal: false,
    groups: [],
    policy: EMPTY_POLICY,
    inventoryRules:
      type === POLICY_TYPES.InventoryPolicy.key ? initialInventoryRules : null,
    workforceRules:
      type === POLICY_TYPES.WorkforcePolicy.key ? initialWorkforceRules : null,
  };
};

function PermissionsPolicyCard(props: Props) {
  const {redirectToPoliciesView, onClose} = props;
  const location = useLocation();
  const {id: policyId} = useParams();
  const fetchedPolicy = usePermissionsPolicy(policyId || '');
  const isOnNewPolicy = policyId?.startsWith(NEW_DIALOG_PARAM) || false;
  const isOnSystemDefault =
    policyId?.startsWith(WORKORDER_SYSTEM_POLICY_ID) || false;
  const queryParams = new URLSearchParams(location.search);
  const [policy, setPolicy] = useState<?PermissionsPolicy>(
    isOnNewPolicy
      ? getInitialNewPolicy(queryParams.get('type'))
      : isOnSystemDefault
      ? WORKORDER_SYSTEM_POLICY
      : null,
  );

  const enqueueSnackbar = useEnqueueSnackbar();
  const handleError = useCallback(
    (error: string) => {
      enqueueSnackbar(error, {variant: 'error'});
    },
    [enqueueSnackbar],
  );

  useEffect(() => {
    if (isOnNewPolicy || isOnSystemDefault) {
      return;
    }
    if (fetchedPolicy == null) {
      if (policyId != null) {
        handleError(
          `${fbt(
            `Policy with id ${fbt.param(
              'policy id url param',
              policyId,
            )} does not exist.`,
            '',
          )}`,
        );
      }
      redirectToPoliciesView();
    }
    if (fetchedPolicy?.id === policy?.id) {
      return;
    }
    setPolicy(fetchedPolicy);
  }, [
    fetchedPolicy,
    handleError,
    isOnNewPolicy,
    isOnSystemDefault,
    policy,
    policyId,
    redirectToPoliciesView,
  ]);

  const header = useMemo(() => {
    const breadcrumbs = [
      {
        id: 'policies',
        name: `${PERMISSION_POLICIES_VIEW_NAME}`,
        onClick: redirectToPoliciesView,
      },
      {
        id: 'policyName',
        name: isOnNewPolicy ? `${fbt('New Policy', '')}` : policy?.name || '',
      },
    ];
    const actions =
      policy?.isSystemDefault === true
        ? [
            <FormAction ignorePermissions={true} ignoreEditLocks={true}>
              <Button onClick={onClose}>{Strings.common.doneButton}</Button>
            </FormAction>,
          ]
        : [
            <FormAction ignorePermissions={true}>
              <Button skin="regular" onClick={onClose}>
                {Strings.common.cancelButton}
              </Button>
            </FormAction>,
            <FormAction disableOnFromError={true}>
              <Button
                onClick={() => {
                  if (policy == null) {
                    return;
                  }

                  const saveAction = isOnNewPolicy
                    ? addPermissionsPolicy
                    : editPermissionsPolicy;
                  saveAction(policy).then(onClose).catch(handleError);
                }}>
                {Strings.common.saveButton}
              </Button>
            </FormAction>,
          ];
    if (!isOnNewPolicy && policy?.isSystemDefault !== true) {
      actions.unshift(
        <FormAction>
          <IconButton
            icon={DeleteIcon}
            skin="gray"
            onClick={() => {
              if (policy == null) {
                return;
              }
              props
                .confirm(
                  <fbt desc="">
                    Are you sure you want to delete this policy?
                  </fbt>,
                )
                .then(confirm => {
                  if (!confirm) {
                    return;
                  }
                  return deletePermissionsPolicy(policy.id).then(onClose);
                })
                .catch(handleError);
            }}
          />
        </FormAction>,
      );
    }
    return {
      title: <Breadcrumbs breadcrumbs={breadcrumbs} />,
      subtitle: policy?.isSystemDefault
        ? fbt('View global policy details.', '')
        : fbt('Define this policy and apply it to groups. ', ''),
      actionButtons: actions,
    };
  }, [
    redirectToPoliciesView,
    isOnNewPolicy,
    policy,
    onClose,
    handleError,
    props,
  ]);

  if (policy == null) {
    return null;
  }
  return (
    <InventoryErrorBoundary>
      <FormContextProvider permissions={{adminRightsRequired: true}}>
        <ViewContainer header={header} useBodyScrollingEffect={false}>
          <PermissionsPolicyCardBody policy={policy} onChange={setPolicy} />
        </ViewContainer>
      </FormContextProvider>
    </InventoryErrorBoundary>
  );
}

type PermissionsPolicyCardBodyProps = $ReadOnly<{|
  policy: PermissionsPolicy,
  onChange: PermissionsPolicy => void,
|}>;

function PermissionsPolicyCardBody(props: PermissionsPolicyCardBodyProps) {
  const {policy, onChange} = props;
  const classes = useStyles();

  const systemGlobalPolicyAlert = `${fbt(
    'This policy applies to all users and cannot be changed or removed.',
    '',
  )}`;
  const alerts = useFormAlertsContext();
  alerts.editLock.check({
    fieldId: 'system_default_policy',
    fieldDisplayName: 'Workforce Global Policy',
    value: policy.isSystemDefault,
    checkCallback: isSystemDefault =>
      isSystemDefault ? systemGlobalPolicyAlert : '',
  });

  const policyDetailsPart = (
    <PermissionsPolicyDetailsPane policy={policy} onChange={onChange} />
  );

  if (policy.isSystemDefault) {
    return (
      <Grid container spacing={2} className={classes.container}>
        <Grid item xs={12} className={classes.container}>
          <Card
            variant="message"
            contentClassName={classes.defaultPolicyMessage}>
            <LockIcon />
            <div>
              <Text
                variant="subtitle1"
                className={classes.defaultPolicyMessageHeader}>
                {SYSTEM_DEFAULT_POLICY_PREFIX}
              </Text>
              <Text variant="body2">{systemGlobalPolicyAlert}</Text>
            </div>
          </Card>
          {policyDetailsPart}
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container spacing={2} className={classes.container}>
      <Grid
        item
        xs={8}
        sm={8}
        lg={8}
        xl={8}
        className={classNames(classes.container, classes.vertical)}>
        {policyDetailsPart}
        <PermissionsPolicyRulesPane policy={policy} onChange={onChange} />
      </Grid>
      <Grid item xs={4} sm={4} lg={4} xl={4} className={classes.container}>
        <PermissionsPolicyGroupsPane policy={policy} onChange={onChange} />
      </Grid>
    </Grid>
  );
}

export default withSuspense(withAlert(PermissionsPolicyCard));
