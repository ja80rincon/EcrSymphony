/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

import React, {useState} from 'react';

// COMPONENTS //
import AddedSuccessfullyMessage from './common/AddedSuccessfullyMessage';

// MUTATIONS //
import type {AddCounterItemFormQuery} from './__generated__/AddCounterItemFormQuery.graphql';
import type {AddCounterMutationVariables} from '../../mutations/__generated__/AddCounterMutation.graphql';

import {useLazyLoadQuery} from 'react-relay/hooks';

import AddCounterMutation from '../../mutations/AddCounterMutation';

// DESIGN SYSTEM //
import Button from '@symphony/design-system/components/Button';
import Card from '@symphony/design-system/components/Card/Card';
import CardHeader from '@symphony/design-system/components/Card/CardHeader';
import FormField from '@symphony/design-system/components/FormField/FormField';
import symphony from '@symphony/design-system/theme/symphony';

import TextField from '@material-ui/core/TextField';
import {MenuItem} from '@material-ui/core';
import {graphql} from 'relay-runtime';
import {makeStyles} from '@material-ui/styles';
import {useDisabledButton} from './common/useDisabledButton';
import {useValidation} from './common/useValidation';

const AddCountersQuery = graphql`
  query AddCounterItemFormQuery {
    counterFamilies {
      edges {
        node {
          id
          name
        }
      }
    }
    vendors {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;

const useStyles = makeStyles(() => ({
  formField: {
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: symphony.palette.D200,
    },
    '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: symphony.palette.B600,
    },
    '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
      transform: 'translate(14px, -3px) scale(0.85)',
    },
    '& .MuiFormControl-root': {
      marginBottom: '36px',
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: symphony.palette.B600,
      },
    },
    '& .MuiOutlinedInput-input': {
      paddingTop: '7px',
      paddingBottom: '7px',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
    },
    '& label': {
      fontSize: '14px',
      lineHeight: '8px',
    },
  },
  header: {
    margin: '4px 0 24px 0',
  },
  addCounter: {
    margin: '0',
    width: '111px',
    alignSelf: 'flex-end',
  },
  inputField: {
    width: '100%',
  },
  selectField: {
    width: '100%',
  },
}));

type Node = {
  node: {
    name: string,
  },
};

type Props = $ReadOnly<{|
  isCompleted: void => void,
  counterNames?: Array<Node>,
|}>;

type Counters = {
  data: {
    name: string,
    id: string,
    nms: string,
    family: string,
    vendor: string,
  },
};

export default function AddCounterItemForm(props: Props) {
  const {isCompleted, counterNames} = props;
  const classes = useStyles();
  const [counters, setCounters] = useState<Counters>({data: {}});
  const [showChecking, setShowChecking] = useState(false);

  const data = useLazyLoadQuery<AddCounterItemFormQuery>(AddCountersQuery, {});
  const names = counterNames?.map(item => item.node.name);

  const handleDisable = useDisabledButton(counters.data, names, 5);

  const validationName = useValidation(counters.data.name, names, 'Counter');

  function handleChange({target}) {
    setCounters({
      data: {
        ...counters.data,
        [target.name]: target.value.trim(),
      },
    });
  }

  function handleClick() {
    const variables: AddCounterMutationVariables = {
      input: {
        name: counters.data.name,
        externalID: counters.data.id,
        networkManagerSystem: counters.data.nms,
        counterFamily: counters.data.family,
        vendorFk: counters.data.vendor,
      },
    };
    setShowChecking(true);
    AddCounterMutation(variables, {
      onCompleted: () => {
        isCompleted();
        setCounters({data: {}});
      },
    });
  }

  const setReturn = () => {
    setShowChecking(false);
  };

  if (showChecking) {
    return (
      <AddedSuccessfullyMessage
        card_header="Add Counter"
        title="Counter"
        text_button="Add new counter"
        setReturn={setReturn}
      />
    );
  }

  return (
    <Card>
      <CardHeader className={classes.header}>Add Counter</CardHeader>
      <form className={classes.formField} autoComplete="off">
        <TextField
          {...validationName}
          required
          className={classes.inputField}
          id="counter-name"
          label="Counter name"
          variant="outlined"
          name="name"
          onChange={handleChange}
        />
        <TextField
          required
          className={classes.inputField}
          id="counter-id"
          label="Counter ID"
          variant="outlined"
          name="id"
          onChange={handleChange}
        />
        <TextField
          required
          id="outlined-select-family"
          select
          className={classes.selectField}
          label="Family name"
          onChange={handleChange}
          name="family"
          defaultValue=""
          variant="outlined">
          {data.counterFamilies.edges.map((item, index) => (
            <MenuItem key={index} value={item.node?.id}>
              {item.node?.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          id="outlined-select-vendor"
          select
          className={classes.selectField}
          label="Vendor name*"
          onChange={handleChange}
          name="vendor"
          defaultValue=""
          variant="outlined">
          {data.vendors.edges.map((item, index) => (
            <MenuItem key={index} value={item.node?.id}>
              {item.node?.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          required
          className={classes.inputField}
          id="network-manager-system"
          label="Network Manager System"
          variant="outlined"
          name="nms"
          onChange={handleChange}
        />
      </form>
      <FormField>
        <Button
          className={classes.addCounter}
          onClick={handleClick}
          disabled={handleDisable}>
          Add Counter
        </Button>
      </FormField>
    </Card>
  );
}
