/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

import type {Organization} from '../data/Organizations';

import * as React from 'react';
import Card from '@symphony/design-system/components/Card/Card';
import FormField from '@symphony/design-system/components/FormField/FormField';
import FormFieldTextInput from '../utils/FormFieldTextInput';
import Grid from '@material-ui/core/Grid';
import Select from '@symphony/design-system/components/Select/Select';
import ViewContainer from '@symphony/design-system/components/View/ViewContainer';
import fbt from 'fbt';
import {isTempId} from '../../../../common/EntUtils';
import {makeStyles} from '@material-ui/styles';
import {useMemo} from 'react';

const useStyles = makeStyles(() => ({
  viewContainer: {
    paddingBottom: '16px',
  },
  nameField: {
    marginRight: '8px',
  },
  descriptionField: {
    marginTop: '8px',
  },
}));

type Props = $ReadOnly<{|
  organization: Organization,
  onChange: Organization => void,
  className?: ?string,
|}>;

export default function OrganizationsDetailsPane(props: Props) {
  const {organization, className, onChange} = props;
  const classes = useStyles();
  const isNewOrganization = isTempId(organization.id);

  return (
    <Card className={className} margins="none">
      <ViewContainer
        className={classes.viewContainer}
        header={{title: <fbt desc="">Organization Details</fbt>}}>
        <Grid container>
          <Grid item xs={12} sm={6} lg={6} xl={6}>
            <FormFieldTextInput
              className={classes.nameField}
              label={`${fbt('Organization Name', '')}`}
              validationId="name"
              value={organization.name}
              onValueChanged={name => {
                onChange({
                  ...organization,
                  name,
                });
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormFieldTextInput
              className={classes.descriptionField}
              label={`${fbt('Organization Description', '')}`}
              value={organization.description || ''}
              onValueChanged={description => {
                onChange({
                  ...organization,
                  description,
                });
              }}
            />
          </Grid>
        </Grid>
      </ViewContainer>
    </Card>
  );
}
