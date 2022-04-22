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

import AddedSuccessfullyMessage from './common/AddedSuccessfullyMessage';

import type {AddThresholdMutationVariables} from '../../mutations/__generated__/AddThresholdMutation.graphql';

import AddTresholdMutation from '../../mutations/AddThresholdMutation';

import Button from '@symphony/design-system/components/Button';
import Card from '@symphony/design-system/components/Card/Card';
import CardHeader from '@symphony/design-system/components/Card/CardHeader';
import FormField from '@symphony/design-system/components/FormField/FormField';
import TextField from '@material-ui/core/TextField';
import symphony from '@symphony/design-system/theme/symphony';
import {MenuItem} from '@material-ui/core';

import type {AddThresholdItemFormQuery} from './__generated__/AddThresholdItemFormQuery.graphql';

import {graphql} from 'react-relay';
import {makeStyles} from '@material-ui/styles';
import {useDisabledButton} from './common/useDisabledButton';
import {useLazyLoadQuery} from 'react-relay/hooks';
import {useValidation} from './common/useValidation';

const useStyles = makeStyles(() => ({
  header: {
    margin: '4px 0 24px 0',
  },
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
  textInput: {
    minHeight: '36px',
  },
  addCounter: {
    margin: '0',
    width: '120px',
    alignSelf: 'flex-end',
  },
  input: {
    width: '100%',
  },
  select: {
    width: '100%',
  },
}));

const KpiDataFormThresholdQuery = graphql`
  query AddThresholdItemFormQuery {
    kpis {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;

type Node = {
  node: {
    name: string,
    kpi: {
      name: string,
      id: string,
    },
  },
};

type Props = $ReadOnly<{|
  thresholdNames?: Array<Node>,
  isCompleted: void => void,
|}>;

type Thresholds = {
  data: {
    id: string,
    name: string,
    status: boolean,
    description: string,
    kpi: string,
  },
};

export default function AddThresholdItemForm(props: Props) {
  const {thresholdNames, isCompleted} = props;
  const classes = useStyles();

  const [thresholds, setThresholds] = useState<Thresholds>({data: {}});
  const [showChecking, setShowChecking] = useState(false);
  const response = useLazyLoadQuery<AddThresholdItemFormQuery>(
    KpiDataFormThresholdQuery,
    {},
  );
  const kpiResponse = response.kpis?.edges.map(item => item.node);
  const names = thresholdNames?.map(item => item.node.name);
  const kpiExisting = thresholdNames?.map(item => item.node.kpi);
  const kpiSelect = kpiResponse.filter(
    item => !kpiExisting?.map(kpi => kpi?.name).includes(item?.name),
  );
  const handleDisable = useDisabledButton(thresholds.data, names, 3);

  const validationName = useValidation(
    thresholds.data.name,
    names,
    'Threshold',
  );

  function handleChange({target}) {
    setThresholds({
      data: {
        ...thresholds.data,
        [target.name]: target.value.trim(),
      },
    });
  }

  function handleClick() {
    const variables: AddThresholdMutationVariables = {
      input: {
        name: thresholds.data.name,
        status: true,
        description: thresholds.data.description,
        kpi: thresholds.data.kpi,
      },
    };
    setShowChecking(true);
    AddTresholdMutation(variables, {
      onCompleted: () => {
        isCompleted();
        setThresholds({data: {}});
      },
    });
  }

  const setReturn = () => {
    setShowChecking(false);
  };

  if (showChecking) {
    return (
      <AddedSuccessfullyMessage
        card_header="Add Threshold"
        title="Threshold"
        text_button="Add new threshold"
        setReturn={setReturn}
      />
    );
  }

  return (
    <Card>
      <CardHeader className={classes.header}>Add Threshold</CardHeader>
      <form className={classes.formField} autoComplete="off">
        <TextField
          required
          {...validationName}
          className={classes.input}
          id="threshold-name"
          label="Threshold Name"
          variant="outlined"
          name="name"
          onChange={handleChange}
        />
        <TextField
          required
          id="outlined-select-kpi"
          select
          className={classes.select}
          label="Associated KPI"
          onChange={handleChange}
          defaultValue=""
          name="kpi"
          variant="outlined">
          {kpiSelect.map((kpiDataResponse, index) => (
            <MenuItem key={index} value={kpiDataResponse?.id}>
              {kpiDataResponse?.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          multiline
          required
          className={classes.input}
          id="description"
          label="Description"
          variant="outlined"
          name="description"
          rows={4}
          inputProps={{maxLength: 120}}
          onChange={handleChange}
        />
      </form>
      <FormField>
        <Button
          className={classes.addCounter}
          onClick={handleClick}
          disabled={handleDisable}>
          Add Threshold
        </Button>
      </FormField>
    </Card>
  );
}
