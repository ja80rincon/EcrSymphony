/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */
import type {AutomationFlowCard_flow} from './__generated__/AutomationFlowCard_flow.graphql';

import * as React from 'react';
import Link from '@symphony/design-system/components/Link';
import StatusTag from './StatusTag';
import Text from '@symphony/design-system/components/Text';
import fbt from 'fbt';
import symphony from '@symphony/design-system/theme/symphony';
import {InventoryAPIUrls} from '../../../../common/InventoryAPI';
import {createFragmentContainer, graphql} from 'react-relay';
import {makeStyles} from '@material-ui/styles';

export const FLOW_STATUSES = {
  UNPUBLISHED: {
    key: 'UNPUBLISHED',
    label: fbt('Unpublished', ''),
    backgroundColor: symphony.palette.D50,
    color: symphony.palette.secondary,
  },
  PUBLISHED: {
    key: 'PUBLISHED',
    label: fbt('Published', ''),
    backgroundColor: symphony.palette.G600,
    color: symphony.palette.white,
  },
  ARCHIVED: {
    key: 'ARCHIVED',
    label: fbt('Archived', ''),
    backgroundColor: symphony.palette.D700,
    color: symphony.palette.white,
  },
  // eslint-disable-next-line relay/no-future-added-value
  '%future added value': {
    key: '',
    label: '',
    backgroundColor: symphony.palette.white,
    color: symphony.palette.secondary,
  },
};

const useStyles = makeStyles(() => ({
  flowCard: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'column',
    maxWidth: '560px',
    height: '280px',
    border: `1px solid ${symphony.palette.D100}`,
    borderRadius: '4px',
    padding: '24px 24px 16px 24px',
    backgroundColor: symphony.palette.white,
  },
  topPanel: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  flowName: {
    height: '48px',
    display: 'block',
    marginRight: '24px',
  },
  statuses: {
    display: 'flex',
    flexDirection: 'column',
    textAlign: 'center',
  },
  draftTag: {
    marginTop: '5px',
  },
  description: {
    height: '69px',
    paddingTop: '16px',
    paddingBottom: '8px',
    display: 'block',
  },
  detailsSection: {
    display: 'flex',
    justifyContent: 'space-between',
    paddingTop: '16px',
    color: symphony.palette.secondary,
    '&:not(:last-child)': {
      borderBottom: `1px solid ${symphony.palette.D50}`,
      paddingBottom: '16px',
    },
  },
  runningInstancesCount: {
    backgroundColor: symphony.palette.primary,
    borderRadius: '12px',
    padding: '2px 10px',
    height: 'fit-content',
  },
}));

type Props = $ReadOnly<{|
  flow: AutomationFlowCard_flow,
|}>;

function AutomationFlowCard(props: Props) {
  const {id, name, description, status, newInstancesPolicy, draft} = props.flow;
  const hasDraft = draft ? !draft.sameAsFlow : false;
  // TODO: when available get these from the AutomationFlowCard_flow
  const runningInstances = 0;

  const classes = useStyles();
  const editFlowUrl = draft
    ? InventoryAPIUrls.flow(draft.id)
    : InventoryAPIUrls.flow(id);
  return (
    <div className={classes.flowCard}>
      <div>
        <div className={classes.topPanel}>
          <Link
            href={editFlowUrl}
            inNewTab={true}
            variant="h6"
            textClassName={classes.flowName}>
            {name}
          </Link>
          <div className={classes.statuses}>
            <StatusTag status={status} />
            {hasDraft && status !== FLOW_STATUSES.UNPUBLISHED.key ? (
              <Text variant="caption" color="gray" className={classes.draftTag}>
                <fbt desc="">Draft changes</fbt>
              </Text>
            ) : null}
          </div>
        </div>
        <Text variant="body1" color="gray" className={classes.description}>
          {description}
        </Text>
      </div>
      <div>
        {status === FLOW_STATUSES.PUBLISHED.key ? (
          <div className={classes.detailsSection}>
            <Text variant="body1">
              <fbt desc="">Allow new instances</fbt>
            </Text>
            <Text variant="body2">
              {newInstancesPolicy === 'ENABLED' ? (
                <fbt desc="">yes</fbt>
              ) : (
                <fbt desc="">no</fbt>
              )}
            </Text>
          </div>
        ) : null}
        {status === FLOW_STATUSES.PUBLISHED.key ||
        status === FLOW_STATUSES.ARCHIVED.key ? (
          <div className={classes.detailsSection}>
            <Text variant="body1">
              <fbt desc="">Running instances</fbt>
            </Text>
            {runningInstances === 0 ? (
              <Text variant="body1" color="gray">
                <fbt desc="">None</fbt>
              </Text>
            ) : (
              <Text
                variant="body2"
                color="light"
                className={classes.runningInstancesCount}>
                {runningInstances}
              </Text>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default createFragmentContainer(AutomationFlowCard, {
  flow: graphql`
    fragment AutomationFlowCard_flow on Flow {
      id
      name
      description
      status
      newInstancesPolicy
      draft {
        id
        sameAsFlow
      }
    }
  `,
});
