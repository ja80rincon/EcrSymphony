/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

import type {AddFormulaItemFormQuery} from './__generated__/AddFormulaItemFormQuery.graphql';

import * as React from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AddedSuccessfullyMessage from './common/AddedSuccessfullyMessage';
import Button from '@symphony/design-system/components/Button';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FormField from '@symphony/design-system/components/FormField/FormField';
import symphony from '@symphony/design-system/theme/symphony';

import Text from '@symphony/design-system/components/Text';
import TextField from '@material-ui/core/TextField';
import {MenuItem} from '@material-ui/core';
import {graphql} from 'react-relay';
import {makeStyles} from '@material-ui/styles';
import {useDisabledButton} from './common/useDisabledButton';
import {useLazyLoadQuery} from 'react-relay/hooks';
import {useState} from 'react';

const useStyles = makeStyles(() => ({
  root: {
    padding: '6px 0',
    borderRadius: '4px',
    boxShadow: '0px 1px 4px 0px rgb(0 0 0 / 17%)',
    '&::before': {
      display: 'none',
    },
  },
  accordionSummary: {
    marginLeft: '12px',
    '& .MuiIconButton-edgeEnd': {
      marginRight: '-3px',
    },
  },
  formField: {
    width: '100%',
    padding: '0 12px',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: symphony.palette.D200,
    },
    '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: symphony.palette.B600,
    },
    '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
      transform: 'translate(14px, -3px) scale(0.75)',
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
  addCounter: {
    margin: '0 0 15px 0',
    width: '111px',
    alignSelf: 'flex-end',
  },
  selectKpi: {
    width: '100%',
  },
}));

const AddFormulaQuery = graphql`
  query AddFormulaItemFormQuery {
    kpis {
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
    techs {
      edges {
        node {
          id
          name
        }
      }
    }
    networkTypes {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;

type Props = $ReadOnly<{|
  handleClick: any,
  parentCallback: any,
  checking: boolean,
  changeChecking: () => void,
  isCompleted: () => void,
|}>;

type Formula = {
  kpi: string,
  vendors: string,
  technology: string,
  networkTypes: string,
};

export default function AddFormulaItemForm(props: Props) {
  const {
    handleClick,
    parentCallback,
    checking,
    changeChecking,
    isCompleted,
  } = props;
  const [formula, setFormula] = useState<Formula>({});
  const [open, setOpen] = useState(false);
  const data = useLazyLoadQuery<AddFormulaItemFormQuery>(AddFormulaQuery, {});
  const classes = useStyles();

  const handleDisable = useDisabledButton(formula, null, 4);

  function handleChange({target}) {
    setFormula({
      ...formula,
      [target.name]: target.value,
    });
  }

  function handleCallback() {
    parentCallback(formula);
  }

  function handleOpen (event) {
    event.stopPropagation();
    setOpen(!open);
  }

  if (checking) {
    return (
      <AddedSuccessfullyMessage
        card_header="Add Formula"
        title="Formula"
        text_button="Add new Formula"
        setReturn={() => {
          changeChecking();
          isCompleted();
          setFormula({});
        }}
      />
    );
  }

  return (
    <Accordion className={classes.root} expanded={open} onChange={handleOpen}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        className={classes.accordionSummary}
        id="panel1a-header">
        <Text variant="h6">Add formula</Text>
      </AccordionSummary>
      <AccordionDetails>
        <form className={classes.formField} autoComplete="off">
          <TextField
            required
            id="outlined-select-kpi"
            select
            className={classes.selectKpi}
            label="KPI"
            onChange={handleChange}
            defaultValue=""
            name="kpi"
            variant="outlined">
            {data.kpis?.edges.map((item, index) => (
              <MenuItem key={index} value={item.node?.id}>
                {item.node?.name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            required
            id="outlined-select-vendors"
            select
            className={classes.selectKpi}
            label="Vendors"
            onChange={handleChange}
            defaultValue=""
            name="vendors"
            variant="outlined">
            {data.vendors?.edges.map((item, index) => (
              <MenuItem key={index} value={item.node?.id}>
                {item.node?.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            required
            id="outlined-select-technology"
            select
            className={classes.selectKpi}
            label="Technology"
            onChange={handleChange}
            defaultValue=""
            name="technology"
            variant="outlined">
            {data.techs?.edges.map((item, index) => (
              <MenuItem key={index} value={item.node?.id}>
                {item.node?.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            required
            id="outlined-select-vendors"
            select
            className={classes.selectKpi}
            label="Network Type"
            onChange={handleChange}
            defaultValue=""
            name="networkTypes"
            variant="outlined">
            {data.networkTypes?.edges.map((item, index) => (
              <MenuItem key={index} value={item.node?.id}>
                {item.node?.name}
              </MenuItem>
            ))}
          </TextField>
          <FormField>
            <Button
              className={classes.addCounter}
              onClick={() => {
                handleCallback();
                handleClick();
              }}
              disabled={handleDisable}>
              Build formula
            </Button>
          </FormField>
        </form>
      </AccordionDetails>
    </Accordion>
  );
}
