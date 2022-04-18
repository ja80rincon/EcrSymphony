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
import type {AddKpiMutationVariables} from '../../mutations/__generated__/AddKpiMutation.graphql';

import AddKpiMutation from '../../mutations/AddKpiMutation';

// DESIGN SYSTEM //
import type {AddKpiItemFormQuery} from './__generated__/AddKpiItemFormQuery.graphql';

import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Button from '@symphony/design-system/components/Button';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FormField from '@symphony/design-system/components/FormField/FormField';
import Text from '@symphony/design-system/components/Text';
import TextField from '@material-ui/core/TextField';
import symphony from '@symphony/design-system/theme/symphony';
import {MenuItem} from '@material-ui/core';
import {graphql} from 'relay-runtime';
import {makeStyles} from '@material-ui/styles';
import {useDisabledButton} from './common/useDisabledButton';
import {useLazyLoadQuery} from 'react-relay/hooks';
import {useValidation} from './common/useValidation';

const useStyles = makeStyles(() => ({
  root: {
    padding: '6px 0',
    margin: '0 0 16px 0',
    borderRadius: '4px',
    boxShadow: '0px 1px 4px 0px rgb(0 0 0 / 17%)',
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
  inputField: {
    width: '100%',
  },
  selectField: {
    width: '100%',
  },
  addCounter: {
    margin: '0 0 5px 0',
    width: '111px',
    alignSelf: 'flex-end',
  },
}));

type Node = {
  node: {
    name: string,
  },
};

type Props = $ReadOnly<{|
  isCompleted: void => void,
  kpiNames?: Array<Node>,
|}>;

type Kpis = {
  data: {
    id: string,
    name: string,
    status: boolean,
    domain: string,
    description: string,
    category: string,
  },
};

const AddDomainsKpiQuery = graphql`
  query AddKpiItemFormQuery {
    domains {
      edges {
        node {
          id
          name
        }
      }
    }
    kpiCategories {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;

export default function AddKpiItemForm(props: Props) {
  const {kpiNames, isCompleted} = props;
  const classes = useStyles();

  const [kpis, setKpis] = useState<Kpis>({data: {}});
  const [showChecking, setShowChecking] = useState(false);
  const [open, setOpen] = useState(true);
  const names = kpiNames?.map(item => item?.node.name);

  const data = useLazyLoadQuery<AddKpiItemFormQuery>(AddDomainsKpiQuery, {});

  const handleDisable = useDisabledButton(kpis.data, names, 5);

  const validationName = useValidation(kpis.data.name, names, 'Kpi');

  // this function is for inputs or selects that accept metod trim()
  function handleChange({target}) {
    setKpis({
      data: {
        ...kpis.data,
        [target.name]: target.value.trim(),
      },
    });
  }
  //It worked only for the status select for being a boolean
  function handleChangeStatus({target}) {
    setKpis({
      data: {
        ...kpis.data,
        [target.name]: target.value,
      },
    });
  }

  function handleClick() {
    const variables: AddKpiMutationVariables = {
      input: {
        name: kpis.data.name.trim(),
        status: kpis.data.status,
        domainFk: kpis.data.domain,
        description: kpis.data.description.trim(),
        kpiCategoryFK: kpis.data.category,
      },
    };
    setShowChecking(true);
    AddKpiMutation(variables, {
      onCompleted: () => {
        isCompleted();
        setKpis({data: {}});
      },
    });
  }

  function handleOpen(event) {
    event.stopPropagation();
    setOpen(!open);
  }

  const setReturn = () => {
    setShowChecking(false);
  };

  if (showChecking) {
    return (
      <AddedSuccessfullyMessage
        card_header="Add KPI"
        title="KPI"
        text_button="Add new KPI"
        setReturn={setReturn}
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
        <Text variant="h6">
          Add KPI
        </Text>
      </AccordionSummary>
      <AccordionDetails>
        <form className={classes.formField} autoComplete="off">
          <TextField
            {...validationName}
            required
            className={classes.inputField}
            id="kpi-name"
            label="Kpi name"
            variant="outlined"
            name="name"
            onChange={handleChange}
          />
          <TextField
            required
            id="outlined-select-status"
            select
            className={classes.selectField}
            label="Status"
            onChange={handleChangeStatus}
            defaultValue=""
            name="status"
            variant="outlined">
            <MenuItem value={true}>Enabled</MenuItem>
            <MenuItem value={false}>Disabled</MenuItem>
          </TextField>
          <TextField
            required
            id="outlined-select-domain"
            select
            className={classes.selectField}
            label="Domain"
            onChange={handleChange}
            defaultValue=""
            name="domain"
            variant="outlined">
            {data?.domains.edges.map((item, index) => (
              <MenuItem key={index} value={item.node?.id}>
                {item.node?.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            required
            id="outlined-select-category"
            select
            className={classes.selectField}
            label="Category"
            onChange={handleChange}
            defaultValue=""
            name="category"
            variant="outlined">
            {data?.kpiCategories.edges.map((item, index) => (
              <MenuItem key={index} value={item.node?.id}>
                {item.node?.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            multiline
            required
            className={classes.inputField}
            id="description"
            label="Description"
            variant="outlined"
            name="description"
            rows={10}
            inputProps={{maxLength: 120}}
            onChange={handleChange}
          />
          <FormField>
            <Button
              className={classes.addCounter}
              onClick={handleClick}
              disabled={handleDisable}>
              Add KPI
            </Button>
          </FormField>
        </form>
      </AccordionDetails>
    </Accordion>
  );
}
