/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */
import type {ProjectTypeCard_projectType} from './__generated__/ProjectTypeCard_projectType.graphql';

import Button from '@symphony/design-system/components/Button';
import Clickable from '@symphony/design-system/components/Core/Clickable';
import FormActionWithPermissions from '../../common/FormActionWithPermissions';
import ProjectTypeDeleteButton from './ProjectTypeDeleteButton';
import ProjectTypeWorkOrdersCount from './ProjectTypeWorkOrdersCount';
import React, {useMemo} from 'react';
import Text from '@symphony/design-system/components/Text';
import classNames from 'classnames';
import fbt from 'fbt';
import symphony from '@symphony/design-system/theme/symphony';
import {FormContextProvider} from '../../common/FormContext';
import {createFragmentContainer, graphql} from 'react-relay';
import {makeStyles} from '@material-ui/styles';

const useStyles = makeStyles(() => ({
  root: {
    height: '257px',
    backgroundColor: symphony.palette.white,
    boxShadow: '0px 1px 4px 0px rgba(0,0,0,0.17)',
    padding: '24px 24px 16px 24px',
    overflow: 'hidden',
    borderRadius: '4px',
    display: 'flex',
    flexDirection: 'column',
  },
  nameContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'end',
    marginBottom: '8px',
  },
  name: {
    flexGrow: 1,
    cursor: 'pointer',
    '&:hover': {
      color: symphony.palette.primary,
    },
  },
  iconButton: {
    paddingTop: '1px',
  },
  descriptionContainer: {
    overflow: 'hidden',
    flexGrow: 1,
  },
  description: {
    fontSize: '16px',
    lineHeight: '24px',
    color: '#8895ad',
    marginBottom: '8px',
    overflow: 'hidden',
  },
  buttonContainer: {
    display: 'flex',
  },
  divider: {
    borderTop: '1px solid #edf0f9',
    margin: '16px 0px',
  },
}));

type Props = $ReadOnly<{|
  className?: string,
  projectType: ProjectTypeCard_projectType,
  onEditClicked: () => void,
|}>;

const ProjectTypeCard = ({className, projectType, onEditClicked}: Props) => {
  const {name, description, numberOfProjects, workOrders} = projectType;
  const classes = useStyles();

  const deleteButtonDisabledTooltip = useMemo(
    () =>
      numberOfProjects === 0
        ? null
        : `${fbt(
            'This project template cannot be deleted since is used on existing projects.',
            '',
          )}`,
    [numberOfProjects],
  );
  return (
    <FormContextProvider
      permissions={{
        entity: 'projectTemplate',
      }}>
      <div className={classNames(classes.root, className)}>
        <div className={classes.descriptionContainer}>
          <div className={classes.nameContainer}>
            <Clickable onClick={onEditClicked}>
              <Text weight="medium" variant="h6" className={classes.name}>
                {name}
              </Text>
            </Clickable>
            <ProjectTypeDeleteButton
              disabled={!!deleteButtonDisabledTooltip}
              tooltip={deleteButtonDisabledTooltip}
              className={classes.iconButton}
              projectType={{id: projectType.id, name: projectType.name}}
            />
          </div>
          <Text className={classes.description}>{description}</Text>
        </div>
        <div className={classes.divider} />
        <div className={classes.buttonContainer}>
          <ProjectTypeWorkOrdersCount count={workOrders.length} />
          <FormActionWithPermissions
            permissions={{
              entity: 'projectTemplate',
              action: 'update',
            }}>
            <Button variant="text" skin="primary" onClick={onEditClicked}>
              Edit
            </Button>
          </FormActionWithPermissions>
        </div>
      </div>
    </FormContextProvider>
  );
};

export default createFragmentContainer(ProjectTypeCard, {
  projectType: graphql`
    fragment ProjectTypeCard_projectType on ProjectType {
      id
      name
      description
      numberOfProjects
      workOrders {
        id
      }
    }
  `,
});
