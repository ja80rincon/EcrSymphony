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
import type {AddKqiSourceMutationVariables} from '../../mutations/__generated__/AddKqiSourceMutation.graphql';

import AddKqiSourceMutation from '../../mutations/AddKqiSourceMutation';

// DESING SYSTEM //
import Button from '@symphony/design-system/components/Button';
import Card from '@symphony/design-system/components/Card/Card';
import CardHeader from '@symphony/design-system/components/Card/CardHeader';
import FormField from '@symphony/design-system/components/FormField/FormField';

import Text from '@symphony/design-system/components/Text';
import TextField from '@material-ui/core/TextField';
import {makeStyles} from '@material-ui/styles';
import {useDisabledButton} from './common/useDisabledButton';
import {useValidation} from './common/useValidation';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(0),
  },
  formField: {
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#B8C2D3',
    },
    '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#3984FF',
    },
    '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
      transform: 'translate(14px, -3px) scale(0.85)',
    },
    '& .MuiFormControl-root': {
      marginBottom: '41px',
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: '#3984FF',
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
  header: {
    margin: '4px 0 24px 0',
  },
  addCounter: {
    marginBottom: '17px',
    width: '135px',
    alignSelf: 'flex-end',
  },
}));
type Node = {
  node: {
    name: string,
  },
};
type Props = $ReadOnly<{|
  kqiSourcesNames: Array<Node>,
  isCompleted: () => void,
|}>;

type KqiSources = {
  data: {
    id: string,
    name: string,
  },
};

export const KqiSourceAddForm = (props: Props) => {
  const {kqiSourcesNames, isCompleted} = props;
  const classes = useStyles();
  const [kqiSource, setKqiSource] = useState<KqiSources>({data: {}});
  const [showChecking, setShowChecking] = useState(false);

  const names = kqiSourcesNames?.map(item => item.node.name);

  const handleDisable = useDisabledButton(kqiSource.data, names, 1);
  const validationName = useValidation(
    kqiSource.data.name,
    names,
    'KQI Source',
  );
  function handleChange({target}) {
    setKqiSource({
      data: {
        ...kqiSource.data,
        [target.name]: target.value.trim(),
      },
    });
  }

  function handleClick() {
    const variables: AddKqiSourceMutationVariables = {
      input: {
        name: kqiSource.data.name,
      },
    };
    setKqiSource({data: {}});
    setShowChecking(true);
    AddKqiSourceMutation(variables, {onCompleted: () => isCompleted()});
  }

  const setReturn = () => {
    setShowChecking(false);
  };

  if (showChecking) {
    return (
      <AddedSuccessfullyMessage
        card_header="Add KQI Source"
        title="KQI Source"
        text_button="Add new KQI Source"
        setReturn={setReturn}
      />
    );
  }

  return (
    <Card className={classes.root}>
      <CardHeader className={classes.header}>
        <Text useEllipsis={true} variant="h6">
          Add KQI Source
        </Text>
      </CardHeader>
      <form className={classes.formField} autoComplete="off">
        <TextField
          {...validationName}
          required
          fullWidth
          className={classes.textInput}
          label="Name"
          variant="outlined"
          name="name"
          onChange={handleChange}
        />
      </form>
      <FormField>
        <Button
          className={classes.addCounter}
          onClick={handleClick}
          disabled={handleDisable}>
          Save KQI Source
        </Button>
      </FormField>
    </Card>
  );
};
