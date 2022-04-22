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
import SideBar from '@symphony/design-system/components/View/SideBar';
import Text from '@symphony/design-system/components/Text';
import classNames from 'classnames';
import symphony from '@symphony/design-system/theme/symphony';
import {makeStyles} from '@material-ui/styles';

const useStyles = makeStyles(() => ({
  menuItem: {
    flexShrink: 0,
    padding: '8px 16px',
    border: '1px solid transparent',
    borderRadius: '4px',
    '&:hover': {
      backgroundColor: symphony.palette.background,
      cursor: 'pointer',
    },
    '&:not(:last-child)': {
      marginBottom: '2px',
    },
  },
  activeItem: {
    backgroundColor: symphony.palette.background,
  },
}));

export type MenuItem = $ReadOnly<{|
  label: React.Node,
  tooltip?: ?string,
|}>;

type Props = $ReadOnly<{|
  header?: ?React.Node,
  items: Array<MenuItem>,
  activeItemIndex?: number,
  onActiveItemChanged: (activeItem: MenuItem, activeItemIndex: number) => void,
|}>;

export default function SideMenu(props: Props) {
  const {header, items, activeItemIndex, onActiveItemChanged} = props;
  const classes = useStyles();

  return (
    <SideBar header={header}>
      {items.map((item, itemIndex) => (
        <div
          key={`sideMenuItem_${itemIndex}`}
          title={item.tooltip}
          onClick={() =>
            onActiveItemChanged &&
            onActiveItemChanged(items[itemIndex], itemIndex)
          }
          className={classNames(classes.menuItem, {
            [classes.activeItem]: activeItemIndex === itemIndex,
          })}>
          <Text
            variant="body1"
            useEllipsis={true}
            color={activeItemIndex === itemIndex ? 'primary' : 'gray'}>
            {item.label}
          </Text>
        </div>
      ))}
    </SideBar>
  );
}
