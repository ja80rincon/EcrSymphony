/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {FlowHeader_flowDraft} from './__generated__/FlowHeader_flowDraft.graphql';
import type {WithFlowData} from '../../data/FlowDataContext';

import Logo from '../../../../../common/Logo';
import React from 'react';
import Text from '@symphony/design-system/components/Text';
import {InventoryAPIUrls} from '../../../../../common/InventoryAPI';
import {Link} from 'react-router-dom';
import {createFragmentContainer, graphql} from 'react-relay';
import {makeStyles} from '@material-ui/styles';
import {withFlowData} from '../../data/FlowDataContext';

const useStyles = makeStyles(() => ({
  header: {
    display: 'flex',
    alignItems: 'center',
  },
  name: {
    marginLeft: '22px',
  },
  logo: {
    display: 'flex',
  },
}));

type FlowHeaderProps = $ReadOnly<{|
  collapsed?: ?boolean,
|}> &
  WithFlowData<FlowHeader_flowDraft>;

function FlowHeader(props: FlowHeaderProps) {
  const {flowDraft, collapsed} = props;
  const classes = useStyles();

  return (
    <div className={classes.header}>
      <Link className={classes.logo} to={InventoryAPIUrls.flows()}>
        <Logo />
      </Link>
      {!collapsed && (
        <Text className={classes.name} variant="h6" useEllipsis={true}>
          {flowDraft?.name}
        </Text>
      )}
    </div>
  );
}

export default withFlowData(
  createFragmentContainer(FlowHeader, {
    flowDraft: graphql`
      fragment FlowHeader_flowDraft on FlowDraft {
        name
      }
    `,
  }),
);
