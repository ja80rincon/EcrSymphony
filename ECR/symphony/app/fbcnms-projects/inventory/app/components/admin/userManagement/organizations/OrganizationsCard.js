/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

import type {Organization} from '../data/Organization';
import type {WithAlert} from '@fbcnms/ui/components/Alert/withAlert';

import * as React from 'react';
import Breadcrumbs from '@fbcnms/ui/components/Breadcrumbs';
import Button from '@symphony/design-system/components/Button';
import DeleteIcon from '@symphony/design-system/icons/Actions/DeleteIcon';
import FormAction from '@symphony/design-system/components/Form/FormAction';
import Grid from '@material-ui/core/Grid';
import IconButton from '@symphony/design-system/components/IconButton';
import InventoryErrorBoundary from '../../../../common/InventoryErrorBoundary';
import OrganizationsDetailsPane from './OrganizationsDetailsPane';
import OrganizationsMembersPane from './OrganizationsMembersPane';
import Strings from '@fbcnms/strings/Strings';
import ViewContainer from '@symphony/design-system/components/View/ViewContainer';
import classNames from 'classnames';
import fbt from 'fbt';
import withAlert from '@fbcnms/ui/components/Alert/withAlert';
import withSuspense from '../../../../common/withSuspense';
import {NEW_DIALOG_PARAM} from '../utils/UserManagementUtils';
import {ORGANIZATION_HEADER} from './OrganizationsView';
import {
  addOrganization,
  deleteOrganization,
  editOrganization,
  useOrganization,
} from '../data/Organizations';
import {generateTempId} from '../../../../common/EntUtils';
import {makeStyles} from '@material-ui/styles';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {useEnqueueSnackbar} from '@fbcnms/ui/hooks/useSnackbar';
import {useRouteMatch} from 'react-router-dom';

const useStyles = makeStyles(() => ({
  container: {
    maxHeight: '100%',
  },
  vertical: {
    '&>:not(:first-child)': {
      marginTop: '16px',
    },
  },
}));

type Props = $ReadOnly<{|
  redirectToOrganizationsView: () => void,
  onClose: () => void,
  ...WithAlert,
|}>;

const initialNewOrganization: Organization = {
  id: generateTempId(),
  name: '',
  description: '',
  members: [],
};

function OrganizationsCard(props: Props) {
  const {redirectToOrganizationsView, onClose} = props;
  const classes = useStyles();
  const match = useRouteMatch();

  const organizationId = match.params.id;
  const fetchedOrganization = useOrganization(organizationId || '');

  const isOnNewOrganization = organizationId === NEW_DIALOG_PARAM;
  const [organization, setOrganization] = useState<?Organization>(
    isOnNewOrganization ? {...initialNewOrganization} : null,
  );

  const enqueueSnackbar = useEnqueueSnackbar();
  const handleError = useCallback(
    (error: string) => {
      enqueueSnackbar(error, {variant: 'error'});
    },
    [enqueueSnackbar],
  );

  useEffect(() => {
    if (isOnNewOrganization || organization != null) {
      return;
    }
    if (fetchedOrganization == null) {
      if (organizationId != null) {
        handleError(
          `${fbt(
            `Organization with id ${fbt.param(
              'organization id url param',
              organizationId,
            )} does not exist.`,
            '',
          )}`,
        );
      }
      redirectToOrganizationsView();
    }
    setOrganization(fetchedOrganization);
  }, [
    fetchedOrganization,
    organization,
    organizationId,
    handleError,
    isOnNewOrganization,
    redirectToOrganizationsView,
  ]);

  const header = useMemo(() => {
    const breadcrumbs = [
      {
        id: 'organizations',
        name: `${ORGANIZATION_HEADER}`,
        onClick: redirectToOrganizationsView,
      },
      {
        id: 'organizationName',
        name: isOnNewOrganization
          ? `${fbt('New Organization', '')}`
          : organization?.name || '',
      },
    ];
    const actions = [
      <FormAction ignorePermissions={true}>
        <Button skin="regular" onClick={onClose}>
          {Strings.common.cancelButton}
        </Button>
      </FormAction>,
      <FormAction disableOnFromError={true}>
        <Button
          onClick={() => {
            if (organization == null) {
              return;
            }
            const saveAction = isOnNewOrganization
              ? addOrganization
              : editOrganization;
            saveAction(organization).then(onClose).catch(handleError);
          }}>
          {Strings.common.saveButton}
        </Button>
      </FormAction>,
    ];
    if (!isOnNewOrganization) {
      actions.unshift(
        <FormAction>
          <IconButton
            skin="gray"
            icon={DeleteIcon}
            onClick={() => {
              if (organization == null) {
                return;
              }
              props
                .confirm(
                  <fbt desc="">
                    Are you sure you want to delete this organization?
                  </fbt>,
                )
                .then(confirm => {
                  if (!confirm) {
                    return;
                  }
                  return deleteOrganization(organization.id).then(onClose);
                })
                .catch(handleError);
            }}
          />
        </FormAction>,
      );
    }
    return {
      title: <Breadcrumbs breadcrumbs={breadcrumbs} />,
      subtitle: fbt('Manage organization details', ''),
      actionButtons: actions,
    };
  }, [
    organization,
    handleError,
    isOnNewOrganization,
    onClose,
    props,
    redirectToOrganizationsView,
  ]);

  if (organization == null) {
    return null;
  }
  return (
    <InventoryErrorBoundary>
      <ViewContainer header={header} useBodyScrollingEffect={false}>
        <Grid container spacing={2} className={classes.container}>
          <Grid
            item
            xs={8}
            className={classNames(classes.container, classes.vertical)}>
            <OrganizationsDetailsPane
              organization={organization}
              onChange={setOrganization}
            />
          </Grid>
          <Grid item xs={4} className={classes.container}>
            {!isOnNewOrganization && (
              <OrganizationsMembersPane
                organization={organization}
                onChange={setOrganization}
              />
            )}
          </Grid>
        </Grid>
      </ViewContainer>
    </InventoryErrorBoundary>
  );
}

export default withSuspense(withAlert(OrganizationsCard));
