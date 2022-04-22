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
import IconButton from '@symphony/design-system/components/IconButton';
import Text from '@symphony/design-system/components/Text';
import classNames from 'classnames';
import fbt from 'fbt';
import symphony from '@symphony/design-system/theme/symphony';
import {CollapseIcon, ExpandIcon} from '@symphony/design-system/icons';
import {makeStyles} from '@material-ui/styles';
import {useCallback, useMemo, useState} from 'react';

const MAJOR_SIZE = '248px';

const useStyles = makeStyles(() => ({
  root: {
    flexBasis: MAJOR_SIZE,
    flexGrow: 0,
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    width: MAJOR_SIZE,
    minWidth: MAJOR_SIZE,
    maxWidth: MAJOR_SIZE,
  },
  header: {
    flexGrow: 0,
    padding: '17px 23px',
    backgroundColor: symphony.palette.white,
  },
  body: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '12px 16px',
    backgroundColor: symphony.palette.white,
    overflowX: 'hidden',
    overflowY: 'auto',
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '20px 28px',
    height: '64px',
    backgroundColor: symphony.palette.white,
  },
}));

export type MenuItem = $ReadOnly<{|
  label: React.Node,
  tooltip?: ?string,
|}>;

type Props = $ReadOnly<{|
  header?: ?React.Node,
  children?: ?React.Node,
  className?: ?string,
  headerClassName?: ?string,
  bodyClassName?: ?string,
  collapsible?: boolean,
  collapseCallback?: boolean => void,
|}>;

export default function SideBar(props: Props) {
  const {
    header,
    children,
    className,
    headerClassName,
    bodyClassName,
    collapseCallback,
    collapsible = collapseCallback ? true : false,
  } = props;
  const classes = useStyles();
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapse = useCallback(() => {
    setCollapsed(prevState => {
      if (collapseCallback) {
        collapseCallback(!prevState);
      }
      return !prevState;
    });
  }, [collapseCallback]);

  const tooltip = useMemo(() => {
    if (collapsed) {
      return fbt('Expand', '');
    } else {
      return fbt('Collapse', '');
    }
  }, [collapsed]);

  return (
    <div className={classNames(classes.root, className)}>
      <Text
        className={classNames(classes.header, headerClassName)}
        variant="body1"
        weight="medium">
        {header}
      </Text>
      <div className={classNames(classes.body, bodyClassName)}>{children}</div>
      {collapsible && (
        <div className={classNames(classes.footer)}>
          <IconButton
            onClick={toggleCollapse}
            icon={collapsed ? ExpandIcon : CollapseIcon}
            tooltip={tooltip}
            skin="regular"
          />
        </div>
      )}
    </div>
  );
}
