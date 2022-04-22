/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {WorkOrderProjectTypesQueryResponse} from './__generated__/WorkOrderProjectTypesQuery.graphql';

import AddEditProjectTypeCard from './AddEditProjectTypeCard';
import Button from '@symphony/design-system/components/Button';
import EducationNote from '@symphony/design-system/illustrations/EducationNote';
import EmptyStateBackdrop from '../comparison_view/EmptyStateBackdrop';
import FormActionWithPermissions from '../../common/FormActionWithPermissions';
import InventoryQueryRenderer from '../InventoryQueryRenderer';
import InventoryView from '../InventoryViewContainer';
import ProjectTypeCard from './ProjectTypeCard';
import React, {useState} from 'react';
import fbt from 'fbt';
import {LogEvents, ServerLogger} from '../../common/LoggingUtils';
import {graphql} from 'relay-runtime';
import {makeStyles} from '@material-ui/styles';

const useStyles = makeStyles(() => ({
  typeCards: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    alignContent: 'flex-start',
  },
  typeCard: {
    padding: '8px',
    flexBasis: '16.66%', // 6 cards
  },
  '@media (max-width: 1950px)': {
    typeCard: {
      flexBasis: '20%', // 5 cards
    },
  },
  '@media (max-width: 1600px)': {
    typeCard: {
      flexBasis: '25%', // 4 cards
    },
  },
  '@media (max-width: 1024px)': {
    typeCard: {
      flexBasis: '33.33%', // 3 cards
    },
  },
  '@media (max-width: 650px)': {
    typeCard: {
      flexBasis: '100%', // 1 card
    },
  },
}));

const projectTypesQuery = graphql`
  query WorkOrderProjectTypesQuery {
    projectTypes(first: 500)
      @connection(key: "WorkOrderProjectTypesQuery_projectTypes") {
      edges {
        node {
          id
          ...ProjectTypeCard_projectType
          ...AddEditProjectTypeCard_editingProjectType
        }
      }
    }
    workOrderTypes {
      edges {
        node {
          ...ProjectTypeWorkOrderTemplatesPanel_workOrderTypes
        }
      }
    }
  }
`;

const WorkOrderProjectTypes = () => {
  const classes = useStyles();
  const [editingProjectType, setEditingProjectType] = useState(null);
  const [showAddEditCard, setShowAddEditCard] = useState(false);
  const hideAddEditCard = () => {
    setEditingProjectType(null);
    setShowAddEditCard(false);
  };

  return (
    <InventoryQueryRenderer
      query={projectTypesQuery}
      variables={{}}
      render={(props: WorkOrderProjectTypesQueryResponse) => {
        if (showAddEditCard || editingProjectType) {
          const workOrderTypes = props.workOrderTypes?.edges ?? [];
          return (
            <AddEditProjectTypeCard
              workOrderTypes={workOrderTypes.map(e => e?.node).filter(Boolean)}
              editingProjectType={editingProjectType}
              onCancelClicked={hideAddEditCard}
              onProjectTypeSaved={hideAddEditCard}
            />
          );
        }

        const projectTypeData = (props.projectTypes?.edges ?? [])
          .map(edge => edge.node)
          .filter(Boolean);

        const createProjectTemplateButton = (
          <FormActionWithPermissions
            permissions={{
              entity: 'projectTemplate',
              action: 'create',
            }}>
            <Button
              onClick={() => {
                ServerLogger.info(
                  LogEvents.ADD_PROJECT_TEMPLATE_BUTTON_CLICKED,
                );
                setShowAddEditCard(true);
              }}>
              <fbt desc="">Create Project Template</fbt>
            </Button>
          </FormActionWithPermissions>
        );

        return (
          <InventoryView
            header={{
              title: <fbt desc="">Project Templates</fbt>,
              subtitle: (
                <fbt desc="">
                  Create reusable templates for project types. Project templates
                  are created from more than one work order template.
                </fbt>
              ),
              actionButtons: [createProjectTemplateButton],
            }}
            permissions={{
              entity: 'projectTemplate',
            }}>
            {!!projectTypeData.length ? (
              <div className={classes.typeCards}>
                {projectTypeData.map(projectType => (
                  <div key={projectType.id} className={classes.typeCard}>
                    <ProjectTypeCard
                      projectType={projectType}
                      onEditClicked={() => setEditingProjectType(projectType)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyStateBackdrop
                illustration={<EducationNote />}
                headingText="Start creating project templates">
                {createProjectTemplateButton}
              </EmptyStateBackdrop>
            )}
          </InventoryView>
        );
      }}
    />
  );
};

export default WorkOrderProjectTypes;
