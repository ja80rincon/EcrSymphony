/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {ContextRouter} from 'react-router-dom';
import type {WithStyles} from '@material-ui/core';

import FlowInstanceDetails from './FlowInstanceDetails';
import InventoryQueryRenderer from '../InventoryQueryRenderer';
import React from 'react';
import {graphql} from 'react-relay';
import {withRouter} from 'react-router-dom';
import {withStyles} from '@material-ui/core/styles';

type Props = {|
  flowInstanceId: ?string,
|} & WithStyles<typeof styles> &
  ContextRouter;

type State = {
  isLoadingDocument: boolean,
};

const styles = theme => ({
  root: {
    height: '100%',
    width: '100%',
    padding: '40px 32px',
    overflow: 'hidden',
  },
  tabs: {
    backgroundColor: theme.palette.common.white,
  },
  docs: {
    margin: '24px 24px 0px 24px',
    backgroundColor: theme.palette.common.white,
  },
  titleText: {
    fontWeight: 500,
  },
  section: {
    marginBottom: theme.spacing(3),
  },
  tabContainer: {
    width: 'auto',
  },
  cardContentRoot: {
    '&:last-child': {
      paddingBottom: '0px',
    },
  },
  iconButton: {
    padding: '0px',
    marginLeft: theme.spacing(),
  },
});

const flowInstanceQuery = graphql`
  query FlowInstanceCardQuery($flowInstanceId: ID!) {
    flowInstance: node(id: $flowInstanceId) {
      ... on FlowInstance {
        id
        status
        startDate
        endDate
        bssCode
        serviceInstanceCode
        template {
          id
          name
        }
        blocks {
          id
          status
          startDate
          endDate
          block {
            id
            cid
            uiRepresentation {
              name
            }
            details {
              __typename
              ... on ActionBlock {
                actionType {
                  id
                }
                workerType {
                  name
                }
                workOrderType {
                  name
                }
              }
            }
          }
        }
      }
    }
  }
`;

class FlowInstanceCard extends React.Component<Props, State> {
  state = {
    isLoadingDocument: false,
  };

  render() {
    const {classes, flowInstanceId} = this.props;
    return (
      <InventoryQueryRenderer
        query={flowInstanceQuery}
        variables={{
          flowInstanceId: flowInstanceId,
        }}
        render={props => {
          const {flowInstance} = props;
          return (
            <div className={classes.root}>
              <FlowInstanceDetails flowInstance={flowInstance} />
            </div>
          );
        }}
      />
    );
  }
}

export default withRouter(withStyles(styles)(FlowInstanceCard));
