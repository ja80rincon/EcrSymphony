/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

import type {
  EditLocksHandlingProps,
  ErrorHandlingProps,
  PermissionHandlingProps,
} from '@symphony/design-system/components/Form/FormAction';
import type {PermissionEnforcement} from './admin/userManagement/utils/usePermissions';

import * as React from 'react';
import PopoverMenu from '@symphony/design-system/components/Select/PopoverMenu';
import classNames from 'classnames';
import usePermissions from './admin/userManagement/utils/usePermissions';
import {ThreeDotsVerticalIcon} from '@symphony/design-system/icons';
import {makeStyles} from '@material-ui/styles';
import {useCallback, useMemo} from 'react';

export type MenuOption = $ReadOnly<{|
  onClick: () => void,
  caption: React.Node,
  disabled?: ?boolean,
  permissions?: ?PermissionEnforcement,
  ...PermissionHandlingProps,
  ...EditLocksHandlingProps,
  ...ErrorHandlingProps,
|}>;

type Props = $ReadOnly<{|
  options: Array<MenuOption>,
  menuIcon?: React.Node,
  className?: ?string,
  onVisibilityChange?: (isVisible: boolean) => void,
|}>;

const useStyles = makeStyles(() => ({
  menu: {
    width: 'auto',
    whiteSpace: 'nowrap',
  },
  menuButton: {
    minWidth: 'unset',
    paddingLeft: 0,
    paddingRight: 0,
  },
  icon: {
    padding: '4px',
    backgroundColor: 'white',
    borderRadius: '100%',
    cursor: 'pointer',
  },
  disabled: {
    opacity: 0.5,
    cursor: 'default',
  },
}));

const OptionsPopoverButton = (props: Props) => {
  const {options, menuIcon, className, onVisibilityChange} = props;
  const classes = useStyles();
  const isEnabled = useMemo(() => props.options.length > 0, [
    props.options.length,
  ]);
  const handleOptionClick = useCallback(
    optIndex => {
      options[optIndex].onClick();
    },
    [options],
  );
  const permissions = usePermissions();

  const optIsMissingPermissions = opt =>
    opt.permissions != null && !!permissions.check(opt.permissions);

  const menuOptions = options
    .filter(
      opt =>
        !(
          opt.permissions?.hideOnMissingPermissions === true &&
          optIsMissingPermissions(opt)
        ),
    )
    .map((opt, optIndex) => ({
      key: optIndex + '',
      label: opt.caption,
      value: optIndex,
      disabled: opt.disabled === true || optIsMissingPermissions(opt),
      ignorePermissions: opt.ignorePermissions ?? opt.permissions != null,
      ignoreEditLocks: opt.ignoreEditLocks,
      hideOnMissingPermissions: opt.hideOnMissingPermissions,
    }));

  if (menuOptions.length === 0) {
    return null;
  }

  return (
    <PopoverMenu
      disabled={!isEnabled}
      variant="text"
      menuDockRight={true}
      options={menuOptions}
      onChange={handleOptionClick}
      menuClassName={classes.menu}
      className={classNames(classes.menuButton, className)}
      onVisibilityChange={onVisibilityChange}>
      {menuIcon ?? (
        <ThreeDotsVerticalIcon
          className={classNames(className, {
            [classes.icon]: isEnabled,
          })}
        />
      )}
    </PopoverMenu>
  );
};

export default OptionsPopoverButton;
