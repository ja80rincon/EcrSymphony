/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import * as React from 'react';
import BlocksCategory from './BlocksCategory';
import CreateWorkorderBlockType from '../../canvas/graph/shapes/blocks/blockTypes/createWorkorder/CreateWorkorderBlockType';
import DecisionBlockType from '../../canvas/graph/shapes/blocks/blockTypes/decision/DecisionBlockType';
import EndBlockType from '../../canvas/graph/shapes/blocks/blockTypes/end/EndBlockType';
import GoToBlockType from '../../canvas/graph/shapes/blocks/blockTypes/goTo/GoToBlockType';
import ManualStartBlockType from '../../canvas/graph/shapes/blocks/blockTypes/manualStart/ManualStartBlockType';
import SideBar from '@symphony/design-system/components/View/SideBar';
import TriggerWorkforceBlockType from '../../canvas/graph/shapes/blocks/blockTypes/triggerWorkforce/TriggerWorkforceBlockType';
import TrueFalseBlockType from '../../canvas/graph/shapes/blocks/blockTypes/trueFalse/TrueFalseBlockType';
import UpdateInventoryBlockType from '../../canvas/graph/shapes/blocks/blockTypes/updateInventory/UpdateInventoryBlockType';
import UpdateWorkforceBlockType from '../../canvas/graph/shapes/blocks/blockTypes/updateWorkforce/UpdateWorkforceBlockType';
import fbt from 'fbt';
import {makeStyles} from '@material-ui/styles';
import {useGraph} from '../../canvas/graph/graphAPIContext/GraphContext';
import {useMemo, useState} from 'react';

const COLLAPSED_WIDTH = '80px';

const useStyles = makeStyles(() => ({
  header: {
    display: 'flex',
    alignItems: 'center',
  },
  name: {
    marginLeft: '22px',
  },
  collapsed: {
    width: COLLAPSED_WIDTH,
    minWidth: COLLAPSED_WIDTH,
    maxWidth: COLLAPSED_WIDTH,
    flexBasis: COLLAPSED_WIDTH,
  },
  logo: {
    display: 'flex',
  },
}));

type Props = $ReadOnly<{|
  title: React.Node,
|}>;

export default function BlocksBar(props: Props) {
  const {title} = props;
  const flow = useGraph();
  const classes = useStyles();
  const [collapsed, setCollapsed] = useState(false);

  const administrativeTypes = useMemo(
    () => [new ManualStartBlockType(flow), new EndBlockType(flow)],
    [flow],
  );

  const actionTypes = useMemo(
    () => [
      new CreateWorkorderBlockType(flow),
      new UpdateInventoryBlockType(flow),
      new UpdateWorkforceBlockType(flow),
      ,
    ],
    [flow],
  );

  const triggerTypes = useMemo(() => [new TriggerWorkforceBlockType(flow)], [
    flow,
  ]);

  const logicTypes = useMemo(
    () => [
      new TrueFalseBlockType(flow),
      new DecisionBlockType(flow),
      new GoToBlockType(flow),
    ],
    [flow],
  );

  const callback = collapsed => {
    setCollapsed(collapsed);
  };

  return (
    <SideBar
      header={title}
      collapsible={true}
      collapseCallback={callback}
      className={collapsed ? classes.collapsed : ''}>
      <BlocksCategory
        collapsed={collapsed}
        header={fbt('Events', '')}
        blockTypes={administrativeTypes}
      />
      <BlocksCategory
        collapsed={collapsed}
        header={fbt('Triggers', '')}
        blockTypes={triggerTypes}
      />
      <BlocksCategory
        collapsed={collapsed}
        header={fbt('Actions', '')}
        blockTypes={actionTypes}
      />
      <BlocksCategory
        collapsed={collapsed}
        header={fbt('Logic', '')}
        blockTypes={logicTypes}
      />
    </SideBar>
  );
}
