/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import React, {useState} from 'react';
import Text from '@symphony/design-system/components/Text';

import type {AddFormulaMutationVariables} from '../../mutations/__generated__/AddFormulaMutation.graphql';
import AddFormulaMutation from '../../mutations/AddFormulaMutation';
import CloseIcon from '@material-ui/icons/Close';
import Switch from '@symphony/design-system/components/switch/Switch';

import Chip from '@material-ui/core/Chip';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import TextField from '@material-ui/core/TextField';
import symphony from '@symphony/design-system/theme/symphony';
import {makeStyles} from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
  },
  icon: {
    fontsize: '10px',
  },
  dialogContent: {
    overflow: 'hidden',
    height: '50vh',
  },
  option: {
    width: '150px',
    height: '40px',
  },
  textField: {
    width: '70%',
    '& .MuiOutlinedInput-root': {
      color: symphony.palette.D300,
      height: '26px',
      '& .Mui-focused.MuiOutlinedInput-notchedOutline': {
        border: '2px solid black',
      },
      '& .MuiOutlinedInput-notchedOutline': {
        borderRadius: '4px',
        borderWidth: '2px',
        borderColor: symphony.palette.D300,
      },
      '& .MuiOutlinedInput-notchedOutline:hover': {
        borderColor: symphony.palette.D100,
      },
    },
  },
  textArea: {
    width: '100%',
    height: '100%',
    '& .MuiOutlinedInput-multiline': {
      height: '100%',
      '& textarea': {
        height: '100% !important',
      },
    },
  },
  styleSearch: {
    [theme.breakpoints.down('md')]: {
      height: 'calc(100% - 120px)',
    },
    height: 'calc(100% - 100px)',
    width: '100%',
    paddingBottom: '1.5rem',
    overflow: 'auto',
    overflowX: 'hidden',
    '&::-webkit-scrollbar': {
      width: '8px',
      height: '8px',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#9DA9BE',
      borderRadius: '4px',
    },
    '&::-webkit-scrollbar-thumb:active': {
      background: '#999999',
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: '#313C48',
      boxShadow: '0 0 2px 1px rgba(0, 0, 0, 0.2)',
    },
    '&::-webkit-scrollbar-track': {
      background: '#e5e5e5',
      borderRadius: '4px',
    },
    '&::-webkit-scrollbar-track:hover, &::-webkit-scrollbar-track:active': {
      background: '#d4d4d4',
    },
  },
}));

type Formula = {
  data: {
    kpi: string,
    vendors: string,
    technology: string,
    networkTypes: string,
  },
};

type TextFormula = {
  formula: string,
  search: string,
};

type Props = $ReadOnly<{|
  open: boolean,
  onClose: () => void,
  dataFormula: Formula,
  isCompleted: void => void,
  dataCounter: any,
  changeChecking: () => void,
|}>;

const AddFormulaDialog = (props: Props) => {
  const {
    onClose,
    dataFormula,
    dataCounter,
    isCompleted,
    changeChecking,
  } = props;
  const [checked, setChecked] = useState();
  const [textFormula, setTextFormula] = useState<TextFormula>({});
  const classes = useStyles();

  function handleChange({target}) {
    setTextFormula({
      ...textFormula,
      [target.name]: target.value,
    });
  }

  const searchCountersFiltered = !textFormula.search
    ? dataCounter
    : dataCounter?.filter(item =>
        item.name
          .toString()
          .toLowerCase()
          .includes(textFormula.search.toLocaleLowerCase()),
      );

  function onDragStart(e, v) {
    e.dataTransfer.dropEffect = 'move';
    e.dataTransfer.setData('text/plain', v);
  }

  function handleClick() {
    const variables: AddFormulaMutationVariables = {
      input: {
        textFormula: textFormula.formula,
        status: true,
        techFk: dataFormula.data.technology,
        kpiFk: dataFormula.data.kpi,
        networkTypeFk: dataFormula.data.networkTypes,
      },
    };
    AddFormulaMutation(variables, {
      onCompleted: () => {
        isCompleted();
      },
    });
  }

  return (
    <Dialog
      maxWidth="lg"
      open={true}
      onClose={onClose}
      fullWidth={true}
      className={classes.root}>
      <DialogActions>
        <Button onClick={onClose} skin="regular">
          <CloseIcon fontSize="small" color="action" />
        </Button>
      </DialogActions>
      <DialogTitle>
        <Grid container>
          <Grid item xs={5}>
            <Text variant="h6">Build Formula</Text>
          </Grid>
          <Grid item xs={7}>
            <TextField
              className={classes.textField}
              placeholder="Add counter"
              color="primary"
              type="text"
              variant="outlined"
              name="search"
              autoComplete="off"
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
        </Grid>
      </DialogTitle>
      <DialogContent className={classes.dialogContent}>
        <Grid container spacing={2}>
          <Grid item xs={5} style={{height: '50vh'}}>
            <Text variant="body2" weight="regular">
              Press the counter to add it to the expression. You can use your
              keyboard or the buttons on the screen to add math symbols and
              numbers.
            </Text>
            <Grid
              container
              direction="row"
              alignItems="flex-start"
              style={{margin: '1rem auto'}}>
              <Grid item xs={3} lg={2} style={{lineHeight: '0px'}}>
                <Text variant="caption" color="lightBlue">
                  Mandatory counter
                </Text>
              </Grid>
              <Grid item xs style={{lineHeight: '0px'}}>
                <Text variant="caption" color="lightBlue">
                  Name counter
                </Text>
              </Grid>
            </Grid>

            <Grid className={classes.styleSearch}>
              {searchCountersFiltered.map((item, index) => {
                return (
                  <Grid container spacing={2} key={index}>
                    <Grid item xs={3} lg={2}>
                      <Switch
                        title={''}
                        checked={item.checked}
                        onChange={setChecked}
                      />
                    </Grid>
                    <Grid item xs={9} lg={10}>
                      <Chip
                        color="primary"
                        key={index}
                        label={item.name}
                        style={{
                          color: 'black',
                          fontWeight: '500',
                        }}
                        draggable="true"
                        onDragStart={e => onDragStart(e, item.name)}
                      />
                    </Grid>
                  </Grid>
                );
              })}
            </Grid>
          </Grid>
          <Grid item xs={7}>
            <TextField
              className={classes.textArea}
              name="formula"
              variant="outlined"
              multiline
              autoComplete="off"
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions style={{height: '100px', paddingRight: '26px'}}>
        <Button
          className={classes.option}
          variant="outlined"
          color="primary"
          onClick={() => {
            handleClick();
            onClose();
            changeChecking();
          }}>
          Save Formula
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddFormulaDialog;
