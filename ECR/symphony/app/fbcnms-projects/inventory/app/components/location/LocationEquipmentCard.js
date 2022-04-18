/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

import type {Equipment} from '../../common/Equipment';

import Button from '@symphony/design-system/components/Button';
import Card from '@symphony/design-system/components/Card/Card';
import CardHeader from '@symphony/design-system/components/Card/CardHeader';
import EquipmentTable from '../equipment/EquipmentTable';
import FormActionWithPermissions from '../../common/FormActionWithPermissions';
import React from 'react';
import classNames from 'classnames';
import {makeStyles} from '@material-ui/styles';

const useStyles = makeStyles(_theme => ({
  cardHasNoContent: {
    marginBottom: '0px',
  },
}));

type Props = $ReadOnly<{|
  className?: string,
  equipments: Array<Equipment>,
  selectedWorkOrderId: ?string,
  onEquipmentSelected: Equipment => void,
  onWorkOrderSelected: (workOrderId: string) => void,
  onAddEquipment: () => void,
|}>;

const LocationEquipmentCard = (props: Props) => {
  const {
    equipments,
    className,
    selectedWorkOrderId,
    onEquipmentSelected,
    onWorkOrderSelected,
    onAddEquipment,
  } = props;
  const classes = useStyles();
  return (
    <Card className={className}>
      <CardHeader
        className={classNames({
          [classes.cardHasNoContent]: equipments.filter(Boolean).length === 0,
        })}
        rightContent={
          <FormActionWithPermissions
            permissions={{entity: 'equipment', action: 'create'}}>
            <Button onClick={onAddEquipment}>Add Equipment</Button>
          </FormActionWithPermissions>
        }>
        Equipment
      </CardHeader>
      <EquipmentTable
        // $FlowFixMe[prop-missing] $FlowFixMe T74239404 Found via relay types
        equipments={equipments}
        selectedWorkOrderId={selectedWorkOrderId}
        // $FlowFixMe[incompatible-type] $FlowFixMe T74239404 Found via relay types
        // $FlowFixMe[incompatible-variance] $FlowFixMe T74239404 Found via relay types
        // $FlowFixMe[prop-missing] $FlowFixMe T74239404 Found via relay types
        onEquipmentSelected={onEquipmentSelected}
        onWorkOrderSelected={onWorkOrderSelected}
      />
    </Card>
  );
};

export default LocationEquipmentCard;
