/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

import type {AddRuleLimitMutationVariables} from '../../mutations/__generated__/AddRuleLimitMutation.graphql';
import type {
  AddRuleMutationResponse,
  AddRuleMutationVariables,
} from '../../mutations/__generated__/AddRuleMutation.graphql';

import type {AddRuleItemFormQuery} from './__generated__/AddRuleItemFormQuery.graphql';
import type {MutationCallbacks} from '../../mutations/MutationCallbacks';

import AddRuleLimitMutation from '../../mutations/AddRuleLimitMutation';
import AddRuleMutation from '../../mutations/AddRuleMutation';
import Button from '@symphony/design-system/components/Button';
import Card from '@symphony/design-system/components/Card/Card';
import Checkbox from '@symphony/design-system/components/Checkbox/Checkbox';
import ConfigureTitleSubItem from './common/ConfigureTitleSubItem';
import Event from '@material-ui/icons/Event';
import FormField from '@symphony/design-system/components/FormField/FormField';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import React, {useState} from 'react';
import Switch from '@symphony/design-system/components/switch/Switch';
import Text from '@symphony/design-system/components/Text';
import TextField from '@material-ui/core/TextField';
import fbt from 'fbt';
import moment from 'moment';
import symphony from '@symphony/design-system/theme/symphony';
import {DateTimePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';
import {MenuItem} from '@material-ui/core';
import {graphql} from 'relay-runtime';
import {makeStyles} from '@material-ui/styles';
import {useDisabledButton} from './common/useDisabledButton';
import {useLazyLoadQuery} from 'react-relay/hooks';
import {useValidation} from './common/useValidation';

import InputAdornment from '@material-ui/core/InputAdornment';
import MomentUtils from '@date-io/moment';

const AddRuleQuery = graphql`
  query AddRuleItemFormQuery {
    eventSeverities {
      edges {
        node {
          id
          name
        }
      }
    }
    comparators {
      edges {
        node {
          id
          name
        }
      }
    }
    ruleTypes {
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
  root: {
    flexGrow: 1,
    margin: '40px',
  },
  header: {
    margin: '0 0px 1rem 1.4rem',
  },
  containerGlobal: {
    '& .cardContainer': {
      padding: '14px',
    },
  },
  headerCardEdit: {
    padding: '17px 10px 17px 0',
  },
  checkDate: {
    padding: '0 0 7px 7px',
  },
  fieldSelectLimitUpper: {
    '& .MuiSelect-select:focus': {
      borderRadius: '4px',
      background: '#FFFFFF',
      border: '2px solid #00AF5B',
    },
    fontWeight: '700',
  },
  fieldSelectLimitLower: {
    '& .MuiSelect-select:focus': {
      borderRadius: '4px',
      background: '#FFFFFF',
      border: '2px solid #FA383E',
    },
    fontWeight: '700',
  },
  formFieldUpper: {
    padding: '0 10px ',
    '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#00AF5B',
    },
    '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
      transform: 'translate(14px, -3px) scale(0.85)',
    },
    '& .MuiFormControl-root': {
      width: '100%',
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: '#00AF5B',
      },
    },
    '& .MuiOutlinedInput-input': {
      padding: '6px 0 6px 10px',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      borderRadius: '4px',
      border: '2px solid #00AF5B',
    },
  },
  formFieldLower: {
    padding: '0 10px ',
    '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#FA383E',
    },
    '& .MuiInputLabel-outlined.MuiInputLabel-shrink': {
      transform: 'translate(14px, -3px) scale(0.85)',
    },
    '& .MuiFormControl-root': {
      width: '100%',
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: '#FA383E',
      },
    },
    '& .MuiOutlinedInput-input': {
      padding: '6px 0 6px 10px',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      borderRadius: '4px',
      border: '2px solid #FA383E',
    },
  },
  formField: {
    padding: '0 10px 36px 10px',
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
  cardHeader: {
    margin: '0px 0px 0px 10px',
  },
  titleSwitch: {
    '& .followingText': {
      color: '#3984FF',
      fontSize: '12px',
    },
  },
  textInput: {
    width: '100%',
    minHeight: '36px',
  },
  actionAddRule: {
    marginRight: '1.5rem',
    width: '98px',
    alignSelf: 'flex-end',
  },
  selectAlarm: {
    '& .MuiOutlinedInput-root ': {
      color: '#FFFFFF',
      height: '38px',
    },
    '& .MuiSelect-iconOutlined': {
      color: '#FFFFFF',
    },
    '& .MuiSelect-select': {
      padding: '9px 0 0 10px',
    },
    width: '100%',
    fontWeight: '700',
    borderRadius: '4px',
    background: '#556072',
  },
  secondSection: {
    marginTop: '20px',
    borderTop: '1px solid #D2DAE7',
  },
  sectionAlarm: {
    paddingTop: '10px',
  },
  fieldAlarmSeverity: {
    padding: '0 10px 0 10px',
  },
  titleLimit: {
    padding: '0 0 5px 10px',
  },
}));

type Props = $ReadOnly<{|
  threshold: {
    id: string,
    name: string,
  },
  hideAddRuleForm: void => void,
  isCompleted: void => void,
|}>;

type Rule = {
  data: {
    id: string,
    name: string,
    status: boolean,
    gracePeriod: number,
    specificProblem: string,
    additionalInfo: string,
    alarmSeverities: string,
    alarmType: string,
    upperTarget: string,
    upperLimit: string,
    lowerTarget: string,
    lowerLimit: string,
    startTime: string,
    endTime: string,
  },
};

const AddRuleItemForm = (props: Props) => {
  const classes = useStyles();
  const {threshold, hideAddRuleForm, isCompleted} = props;

  const [rule, setRule] = useState<Rule>({data: {}});
  const [checked, setChecked] = useState(true);
  const [slotStartDate, setSlotStartDate] = useState(moment);
  const [slotEndDate, setSlotEndDate] = useState(moment);
  const [checkedCheckbox, setCheckedCheckbox] = useState(false);
  const data = useLazyLoadQuery<AddRuleItemFormQuery>(AddRuleQuery, {});

  const ruleTypeId = data.ruleTypes?.edges[0].node?.id;

  const namesRules = threshold?.rule.map(item => item.name);

  const FIELD_MIN = 10;

  const handleDisable = useDisabledButton(rule.data, namesRules, FIELD_MIN);

  const validationName = useValidation(rule.data.name, namesRules, 'Rule');

  function handleChange({target}) {
    setRule({
      data: {
        ...rule.data,
        [target.name]: target.value.trim(),
      },
    });
  }

  function handleClick() {
    const variables: AddRuleMutationVariables = {
      input: {
        name: rule.data.name,
        status: checked,
        gracePeriod: rule.data.gracePeriod,
        startDateTime: slotStartDate,
        endDateTime: slotEndDate,
        ruleType: ruleTypeId,
        eventTypeName: rule.data.alarmType,
        specificProblem: rule.data.specificProblem,
        additionalInfo: rule.data.additionalInfo,
        eventSeverity: rule.data.alarmSeverities,
        threshold: threshold.id,
      },
    };

    const response: MutationCallbacks<AddRuleMutationResponse> = {
      onCompleted: response => {
        const variablesUpper: AddRuleLimitMutationVariables = {
          input: {
            number: Number(rule.data.upperLimit),
            limitType: 'UPPER',
            comparator: rule.data.upperTarget,
            rule: response.addRule.id,
          },
        };
        const variablesLower: AddRuleLimitMutationVariables = {
          input: {
            number: Number(rule.data.lowerLimit),
            limitType: 'LOWER',
            comparator: rule.data.lowerTarget,
            rule: response.addRule.id,
          },
        };
        AddRuleLimitMutation(variablesUpper, {
          onCompleted: () => isCompleted(),
        });
        AddRuleLimitMutation(variablesLower, {
          onCompleted: () => isCompleted(),
        });
        isCompleted();
      },
    };

    AddRuleMutation(variables, response);
  }
  return (
    <div className={classes.root}>
      <Grid container>
        <Grid
          className={classes.header}
          container
          direction="row"
          alignItems="center">
          <Grid item xs>
            <ConfigureTitleSubItem
              title={fbt('Threshold Catalog/', 'Threshold Catalog')}
              tag={` ${threshold.name}`}
            />
          </Grid>
          <Grid>
            <FormField>
              <Button
                className={classes.actionAddRule}
                onClick={() => {
                  handleClick();
                  hideAddRuleForm();
                }}
                disabled={handleDisable}>
                Save
              </Button>
            </FormField>
          </Grid>
          <Grid>
            <FormField>
              <Button
                className={classes.actionAddRule}
                onClick={() => {
                  hideAddRuleForm();
                }}
                skin="brightGray">
                Cancel
              </Button>
            </FormField>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Card margins={'none'} className={classes.containerGlobal}>
            <Grid
              className={classes.headerCardEdit}
              container
              direction="row"
              justifycontent="space-evenly"
              alignItems="center">
              <Grid item xs>
                <Text
                  weight={'bold'}
                  variant={'h6'}
                  className={classes.cardHeader}>
                  Build Rule
                </Text>
              </Grid>
              <Grid>
                <Switch
                  className={classes.titleSwitch}
                  title={'Enabled'}
                  checked={checked}
                  onChange={setChecked}
                />
              </Grid>
            </Grid>

            <Grid container item xs={12}>
              <Grid container item xs={12} md={8}>
                <Grid item xs={12} md={6}>
                  <form className={classes.formField} autoComplete="off">
                    <TextField
                      {...validationName}
                      required
                      className={classes.textInput}
                      label="Rule Name"
                      type="string"
                      variant="outlined"
                      name="name"
                      onChange={handleChange}
                    />
                  </form>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormField className={classes.formField}>
                    <TextField
                      required
                      disabled
                      className={classes.textInput}
                      name="id"
                      label="ID"
                      variant="outlined"
                    />
                  </FormField>
                </Grid>
              </Grid>
              <Grid item xs={12} md={2}>
                <form className={classes.formField} autoComplete="off">
                  <TextField
                    required
                    className={classes.textInput}
                    label="Grace period"
                    type="number"
                    name="gracePeriod"
                    variant="outlined"
                    onChange={handleChange}
                  />
                </form>
              </Grid>
              <Grid item xs={12} md={2}>
                <form className={classes.formField} autoComplete="off">
                  <TextField
                    required
                    variant="outlined"
                    label="Type of Rule"
                    value="Simple"
                    className={classes.textInput}
                    name="TypeOfRule"
                    disabled
                  />
                </form>
              </Grid>
            </Grid>

            <Grid container item xs={12} md={8}>
              <Grid className={classes.checkDate} item xs={12}>
                <Checkbox
                  checked={checkedCheckbox}
                  title="Definite time period"
                  onChange={selection =>
                    setCheckedCheckbox(selection === 'checked')
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <FormField className={classes.formField}>
                  <MuiPickersUtilsProvider utils={MomentUtils}>
                    <DateTimePicker
                      disabled={!checkedCheckbox}
                      label="Start"
                      variant="inline"
                      inputVariant="outlined"
                      value={slotStartDate}
                      onChange={setSlotStartDate}
                      format="yyyy/MM/DD HH:mm a"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton>
                              <Event style={{color: symphony.palette.D400}} />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </MuiPickersUtilsProvider>
                </FormField>
              </Grid>
              <Grid item xs={6}>
                <FormField className={classes.formField}>
                  <MuiPickersUtilsProvider utils={MomentUtils}>
                    <DateTimePicker
                      disabled={!checkedCheckbox}
                      label="End"
                      variant="inline"
                      inputVariant="outlined"
                      value={slotEndDate}
                      onChange={setSlotEndDate}
                      format="yyyy/MM/DD HH:mm a"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton>
                              <Event style={{color: symphony.palette.D400}} />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </MuiPickersUtilsProvider>
                </FormField>
              </Grid>
            </Grid>

            <Grid container item xs={12} sm={12} md={8}>
              <Grid className={classes.titleLimit} item xs={12}>
                <Text weight="bold" variant="h6">
                  Limits Range
                </Text>
              </Grid>

              <Grid container item xs={6} sm={6} lg={6} xl={6}>
                <Grid className={classes.titleLimit} item xs={12}>
                  <Text weight="medium" variant="subtitle2">
                    Upper target
                  </Text>
                </Grid>
                <Grid item xs>
                  <FormField className={classes.formFieldUpper}>
                    <TextField
                      select
                      name="upperTarget"
                      variant="outlined"
                      defaultValue=""
                      className={classes.fieldSelectLimitUpper}
                      onChange={handleChange}>
                      {data.comparators.edges.map((item, index) => (
                        <MenuItem key={index} value={item.node?.id}>
                          {item.node?.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </FormField>
                </Grid>
                <Grid item xs>
                  <FormField className={classes.formFieldUpper}>
                    <TextField
                      variant="outlined"
                      type="number"
                      placeholder="Number"
                      className={`${classes.textInput}`}
                      name="upperLimit"
                      onChange={handleChange}
                    />
                  </FormField>
                </Grid>
              </Grid>

              <Grid container item xs={6}>
                <Grid className={classes.titleLimit} item xs={12}>
                  <Text weight="medium" variant="subtitle2">
                    Lower limit
                  </Text>
                </Grid>
                <Grid item xs>
                  <FormField className={classes.formFieldLower}>
                    <TextField
                      select
                      className={classes.fieldSelectLimitLower}
                      name="lowerTarget"
                      onChange={handleChange}
                      defaultValue=""
                      variant="outlined">
                      {data.comparators.edges.map((item, index) => (
                        <MenuItem key={index} value={item.node?.id}>
                          {item.node?.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </FormField>
                </Grid>
                <Grid item xs>
                  <FormField className={classes.formFieldLower}>
                    <TextField
                      type="number"
                      variant="outlined"
                      placeholder="Number"
                      className={`${classes.textInput}`}
                      name="lowerLimit"
                      onChange={handleChange}
                    />
                  </FormField>
                </Grid>
              </Grid>
            </Grid>

            <Grid className={classes.secondSection}>
              <Grid
                className={classes.sectionAlarm}
                container
                item
                xs={12}
                md={8}>
                <Grid className={classes.titleLimit} item xs={12}>
                  <Text weight="medium" variant="subtitle2">
                    Alarm severity
                  </Text>
                </Grid>
                <Grid item xs={6} className={classes.fieldAlarmSeverity}>
                  <FormField className={classes.selectAlarm}>
                    <TextField
                      required
                      select
                      defaultValue=""
                      variant="outlined"
                      name="alarmSeverities"
                      onChange={handleChange}>
                      {data.eventSeverities.edges.map((item, index) => (
                        <MenuItem key={index} value={item.node?.id}>
                          {item.node?.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </FormField>
                </Grid>
                <Grid item xs={6}>
                  <FormField className={classes.formField}>
                    <TextField
                      required
                      variant="outlined"
                      label="Alarm type name"
                      autoComplete="off"
                      className={classes.textInput}
                      name="alarmType"
                      onChange={handleChange}
                    />
                  </FormField>
                </Grid>
              </Grid>
              <Grid>
                <Grid>
                  <form className={classes.formField}>
                    <TextField
                      variant="outlined"
                      label="Specific problem"
                      className={classes.textInput}
                      multiline
                      rows={3}
                      name="specificProblem"
                      onChange={handleChange}
                    />
                  </form>
                </Grid>
                <Grid>
                  <form className={classes.formField}>
                    <TextField
                      variant="outlined"
                      label="Additional info"
                      className={classes.textInput}
                      multiline
                      rows={3}
                      name="additionalInfo"
                      onChange={handleChange}
                    />
                  </form>
                </Grid>
              </Grid>
            </Grid>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default AddRuleItemForm;
