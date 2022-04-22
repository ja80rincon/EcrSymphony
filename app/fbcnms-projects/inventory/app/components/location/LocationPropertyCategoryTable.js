/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */


import type {Property} from '../../common/Property';
import type {WithStyles} from '@material-ui/core';
import Table from '@symphony/design-system/components/Table/Table';
import React from 'react';
import Text from '@symphony/design-system/components/Text';
import {withStyles} from '@material-ui/core/styles';
import MultiSelect from '@symphony/design-system/components/Select/MultiSelect';
import fbt from 'fbt';
import {createFragmentContainer, graphql} from 'react-relay';
import {useMemo, useEffect, useState} from 'react';
import AppContext from '@fbcnms/ui/context/AppContext';
import Button from '@symphony/design-system/components/Button';
import CommonStrings from '@fbcnms/strings/Strings';
import PropertyFormValue from '../form/PropertyFormValue';
type Props = {|
    properties: Array<Property>,
|} & WithStyles<typeof styles>;

const styles = theme => ({
  title: {
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontSize: '20px',
    lineHeight: '23px',
    textTransform: 'capitalize',
  },
  field: {
    width: '50%',
    marginBottom: '12px',
    paddingRight: '16px',
  },
  table: {
    minWidth: 70,
    paddingLeft: '32px',
    maxHeight: '250px',
    overflow: 'auto',
  },
  columname: {
    color: '#3984FF',
    fontSize: '14px'
  },
  containerTable: {
    borderTop: '1px solid #9DA9BE',
  },
});

const LocationPropertyCategoryTable = (props: Props) => {
  const {classes, properties} = props;
  
  const columns = useMemo(() => {
    const colsToReturn = [
      {
        key: 'name',
        title: <span className={classes.columname}><fbt desc="Property Type">Name</fbt></span>,
        render: row => (
          <Text variant="subtitle2" >
            {row?.propertyType?.name}
          </Text>
        ),
      },
      {
        key: 'value',
        title: <span className={classes.columname}><fbt desc="Property Value">Value</fbt></span>,
        render: row =>(
          <PropertyFormValue property={row}/>
        ),
      },
    ];
    return colsToReturn;
  }, [
  ]);

  if (properties.length === 0) {
    return null;
  }
  return (
    <div className={classes.containerTable}>
    <Table
        variant="embedded"
        dataRowsSeparator="border"
        className={classes.table}
        columns={columns}
        data={properties}
      />
    </div>
  );
};

export default withStyles(styles)(LocationPropertyCategoryTable);
