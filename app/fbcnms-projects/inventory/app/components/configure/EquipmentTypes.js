/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {
  EquipmentTypesQuery,
  EquipmentTypesQueryResponse,
} from './__generated__/EquipmentTypesQuery.graphql';

import AddEditEquipmentTypeCard from './AddEditEquipmentTypeCard';
import Button from '@symphony/design-system/components/Button';
import ConfigureTitle from '@fbcnms/ui/components/ConfigureTitle';
import EquipmentTypeItem from './EquipmentTypeItem';
import FormActionWithPermissions from '../../common/FormActionWithPermissions';
import React, {useState} from 'react';
import fbt from 'fbt';
import {FormContextProvider} from '../../common/FormContext';
import {LogEvents, ServerLogger} from '../../common/LoggingUtils';
import {graphql} from 'relay-runtime';
import {makeStyles} from '@material-ui/styles';
import {sortLexicographically} from '@symphony/design-system/utils/displayUtils';
import {useLazyLoadQuery} from 'react-relay/hooks';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: '15px',
  },
  paper: {
    flexGrow: 1,
    overflowY: 'hidden',
  },
  listItem: {
    marginBottom: theme.spacing(),
  },
  addButton: {
    marginLeft: 'auto',
  },
  addButtonContainer: {
    display: 'flex',
  },
  typesList: {
    padding: '24px',
  },
  title: {
    marginLeft: '10px',
  },
  firstRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}));

const equipmentTypesQuery = graphql`
  query EquipmentTypesQuery {
    equipmentTypes(first: 500)
      @connection(key: "EquipmentTypes_equipmentTypes") {
      edges {
        node {
          id
          name
          ...EquipmentTypeItem_equipmentType
          ...AddEditEquipmentTypeCard_editingEquipmentType
        }
      }
    }
  }
`;

type ResponseEquipmentType = $NonMaybeType<
  $ElementType<
    $ElementType<
      $ElementType<
        $ElementType<EquipmentTypesQueryResponse, 'equipmentTypes'>,
        'edges',
      >,
      number,
    >,
    'node',
  >,
>;

const EquipmentTypes = () => {
  const classes = useStyles();
  const {
    equipmentTypes,
  }: EquipmentTypesQueryResponse = useLazyLoadQuery<EquipmentTypesQuery>(
    equipmentTypesQuery,
    {},
  );
  const [
    editingEquipmentType,
    setEditingEquipmentType,
  ] = useState<?ResponseEquipmentType>(null);
  const [showAddEditCard, setShowAddEditCard] = useState(false);

  const showAddEditEquipmentTypeCard = (eqType: ?ResponseEquipmentType) => {
    ServerLogger.info(LogEvents.ADD_EQUIPMENT_TYPE_BUTTON_CLICKED);
    setEditingEquipmentType(eqType);
    setShowAddEditCard(true);
  };

  const hideNewEquipmentTypeCard = () => {
    setEditingEquipmentType(null);
    setShowAddEditCard(false);
  };

  const saveEquipment = () => {
    ServerLogger.info(LogEvents.SAVE_EQUIPMENT_TYPE_BUTTON_CLICKED);
    setEditingEquipmentType(null);
    setShowAddEditCard(false);
  };

  if (showAddEditCard) {
    return (
      <div className={classes.paper}>
        <AddEditEquipmentTypeCard
          onClose={hideNewEquipmentTypeCard}
          onSave={saveEquipment}
          // $FlowFixMe[incompatible-variance] $FlowFixMe T74239404 Found via relay types
          // $FlowFixMe[prop-missing] $FlowFixMe T74239404 Found via relay types
          editingEquipmentType={editingEquipmentType}
        />
      </div>
    );
  }

  const listItems = equipmentTypes.edges
    .map(edge => edge.node)
    .filter(Boolean)
    .sort((eqTypeA, eqTypeB) =>
      sortLexicographically(eqTypeA.name, eqTypeB.name),
    )
    .map((eqType: ResponseEquipmentType) => (
      <div className={classes.listItem} key={`eqType_${eqType.id}`}>
        <EquipmentTypeItem
          equipmentType={eqType}
          onEdit={() => showAddEditEquipmentTypeCard(eqType)}
        />
      </div>
    ));

  return (
    <FormContextProvider
      permissions={{
        entity: 'equipmentType',
      }}>
      <div className={classes.typesList}>
        <div className={classes.firstRow}>
          <ConfigureTitle
            className={classes.title}
            title={fbt('Equipment Types', 'Equipment Types header')}
            subtitle={fbt(
              'Add and manage the types of equipment in your inventory. Add properties and details about them that will make them easier to find when you search.',
              'Equipment Types subheader',
            )}
          />
          <div className={classes.addButtonContainer}>
            <FormActionWithPermissions
              permissions={{entity: 'equipmentType', action: 'create'}}>
              <Button
                className={classes.addButton}
                onClick={() => showAddEditEquipmentTypeCard(null)}>
                <fbt desc="">Add Equipment Type</fbt>
              </Button>
            </FormActionWithPermissions>
          </div>
        </div>
        <div className={classes.root}>
          <div>{listItems}</div>
        </div>
      </div>
    </FormContextProvider>
  );
};

export default EquipmentTypes;
