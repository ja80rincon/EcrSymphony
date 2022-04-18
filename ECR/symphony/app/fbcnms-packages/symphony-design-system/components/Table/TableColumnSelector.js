/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {SvgIconComponent} from '@symphony/design-system/components/Button';

import MultiSelectMenu from '@symphony/design-system/components/Select/MultiSelectMenu';
import React, {useState} from 'react';
import symphony from '@symphony/design-system/theme/symphony';
import {FilterIcon} from '@symphony/design-system/icons';
import {makeStyles} from '@material-ui/styles';

type ColumnDataType = $ReadOnly<{|
  key: string,
  title: string,
  value: string,
  isSelected: boolean,
|}>;
const useStyles = makeStyles(() => {
  const ICON_WRAPPER_SIDE_PX = 30;
  const DROPDOWN_OFFSET = 10;

  return {
    selectMenu: {
      position: 'absolute',
      top: `${ICON_WRAPPER_SIDE_PX + DROPDOWN_OFFSET}px`,
      right: '0px',
      minWidth: '200px',
      zIndex: 1,
    },
    icon: {
      '&:hover': {
        cursor: 'pointer',
        fill: symphony.palette.B700,
      },
    },
    iconWrapper: {
      height: `${ICON_WRAPPER_SIDE_PX}px`,
      width: `${ICON_WRAPPER_SIDE_PX}px`,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    wrapperStyle: {
      position: 'relative',
      '&:focus': {
        outline: 'none',
      },
    },
  };
});

const TableColumnSelector = (props: {
  icon?: SvgIconComponent,
  columnDataList: Array<ColumnDataType>,
  handleOnChange: ColumnDataType => void,
  wrapperStyle?: {[key: string]: string},
}) => {
  const [dropdown, setDropdown] = useState(false);
  const {icon: Icon, columnDataList, handleOnChange, wrapperStyle} = props;
  const DropdownIcon = Icon || FilterIcon;
  const classes = useStyles(props);

  return (
    <div
      className={classes.wrapperStyle}
      style={wrapperStyle}
      tabIndex={-1}
      onBlur={() => setDropdown(false)}>
      <div
        className={classes.iconWrapper}
        onClick={() => setDropdown(!dropdown)}>
        <DropdownIcon className={classes.icon} />
      </div>
      {dropdown && (
        <MultiSelectMenu
          className={classes.selectMenu}
          onChange={({key, value, isSelected, label}) =>
            handleOnChange({
              key: String(key),
              value,
              isSelected: isSelected ?? false,
              title: String(label),
            })
          }
          options={columnDataList.map(column => ({
            key: column.key,
            label: column.title,
            isSelected: column.isSelected,
            value: column.value,
          }))}
          selectedValues={columnDataList
            .map(column => ({
              key: column.key,
              label: column.title,
              isSelected: column.isSelected,
              value: column.value,
            }))
            .filter(option => option.isSelected)}
        />
      )}
    </div>
  );
};

export default TableColumnSelector;
