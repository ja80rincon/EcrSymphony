/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

import type {EditRuleItemFormQuery} from './__generated__/EditRuleItemFormQuery.graphql';

import type {EditRuleLimitMutationVariables} from '../../mutations/__generated__/EditRuleLimitMutation.graphql';
import type {EditRuleMutationVariables} from '../../mutations/__generated__/EditRuleMutation.graphql';
import type {RemoveRuleMutationVariables} from '../../mutations/__generated__/RemoveRuleMutation.graphql';

import RemoveRuleMutation from '../../mutations/RemoveRuleMutation';

import Button from '@symphony/design-system/components/Button';
import Card from '@symphony/design-system/components/Card/Card';
import Checkbox from '@symphony/design-system/components/Checkbox/Checkbox';
import ConfigureTitleSubItem from './common/ConfigureTitleSubItem';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutline';
import EditRuleLimitMutation from '../../mutations/EditRuleLimitMutation';
import EditRuleMutation from '../../mutations/EditRuleMutation';
import Event from '@material-ui/icons/Event';
import FormField from '@symphony/design-system/components/FormField/FormField';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import MomentUtils from '@date-io/moment';
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
import {useDisabledButtonEdit} from './common/useDisabledButton';
import {useFormInput} from './common/useFormInput';
import {useLazyLoadQuery} from 'react-relay/hooks';
import {useStore} from './ThresholdProvider';
import {useValidationEdit} from './common/useValidation';

const EditRuleQuery = graphql`
  query EditRuleItemFormQuery {
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
  hideAddRuleForm: void => void,
  isCompleted: void => void,
  threshold: {
    id: string,
    name: string,
  },
|}>;

const EditRuleItemForm = (props: Props) => {
  const classes = useStyles();
  const {rule} = useStore();
  const {hideAddRuleForm, isCompleted, threshold} = props;

  const [checked, setChecked] = useState(rule.status);
  const [checkedCheckbox, setCheckedCheckbox] = useState(false);
  const data = useLazyLoadQuery<EditRuleItemFormQuery>(EditRuleQuery, {});

  const nameRule = useFormInput(rule.name);
  const gracePeriodRule = useFormInput(rule.gracePeriod);
  const additionalInfoRule = useFormInput(rule.additionalInfo);
  const specificProblemRule = useFormInput(rule.specificProblem);
  const eventTypeRule = useFormInput(rule.eventTypeName);
  const eventSeverityRules = useFormInput(rule.eventSeverityId);
  const comparatorUpper = useFormInput(rule.ruleLimit[0]?.comparator.id);
  const comparatorLower = useFormInput(rule.ruleLimit[1]?.comparator.id);
  const upper = useFormInput(rule.ruleLimit[0]?.number);
  const lower = useFormInput(rule.ruleLimit[1]?.number);

  const [slotStartDate, setSlotStartDate] = useState(
    moment(rule.startDateTime),
  );
  const [slotEndDate, setSlotEndDate] = useState(moment(rule.endDateTime));

  const namesRules = threshold.rule.map(item => item.name);

  const dataInputsObject = [
    nameRule.value.trim(),
    gracePeriodRule.value,
    additionalInfoRule.value.trim(),
    specificProblemRule.value.trim(),
    eventTypeRule.value,
    eventSeverityRules.value,
    comparatorUpper.value,
    comparatorLower.value,
    upper.value,
    lower.value,
  ];
  const inputFilter = () => {
    return (
      namesRules?.filter(
        item => item === nameRule.value.trim() && item !== rule.name.trim(),
      ) || []
    );
  };
  const handleDisable = useDisabledButtonEdit(
    dataInputsObject,
    10,
    inputFilter,
  );

  const validationName = useValidationEdit(inputFilter, 'Rule');

  const handleRemove = id => {
    const variables: RemoveRuleMutationVariables = {
      id: id,
    };
    RemoveRuleMutation(variables, {onCompleted: () => isCompleted()});
  };

  const handleClick = () => {
    const variables: EditRuleMutationVariables = {
      input: {
        id: rule.id,
        name: nameRule.value,
        gracePeriod: Number(gracePeriodRule.value),
        startDateTime: slotStartDate,
        endDateTime: slotEndDate,
        ruleType: data.ruleTypes.edges[0].node.id,
        eventTypeName: eventTypeRule.value,
        specificProblem: specificProblemRule.value,
        additionalInfo: additionalInfoRule.value,
        status: checked,
        eventSeverity: eventSeverityRules.value,
        threshold: rule.thresholdId,
      },
    };
    const variablesUpper: EditRuleLimitMutationVariables = {
      input: {
        id: rule.ruleLimit[0]?.id,
        number: Number(upper.value),
        limitType: 'UPPER',
        comparator: comparatorUpper.value,
        rule: rule.id,
      },
    };
    const variablesLower: EditRuleLimitMutationVariables = {
      input: {
        id: rule.ruleLimit[1]?.id,
        number: Number(lower.value),
        limitType: 'LOWER',
        comparator: comparatorLower.value,
        rule: rule.id,
      },
    };
    EditRuleMutation(variables, {onCompleted: () => isCompleted()});
    EditRuleLimitMutation(variablesUpper, {onCompleted: () => isCompleted()});
    EditRuleLimitMutation(variablesLower, {onCompleted: () => isCompleted()});
  };

  return (
    <div className={classes.root}>
      <Grid container>
        <Grid
          className={classes.header}
          container
          direction="row"
          justifycontent="flex-end"
          alignItems="center">
          <Grid item xs>
            <ConfigureTitleSubItem
              title={fbt('Threshold Catalog/', 'Threshold Catalog')}
              tag={` ${threshold.name}`}
            />
          </Grid>
          <Grid style={{marginRight: '1rem'}}>
            <IconButton>
              <DeleteOutlinedIcon
                onClick={() => {
                  handleRemove(rule.id);
                  hideAddRuleForm();
                }}
                style={{color: symphony.palette.D300}}
              />
            </IconButton>
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
                  Edit Rule
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
                      {...nameRule}
                      required
                      className={classes.textInput}
                      label="Rule Name"
                      type="string"
                      variant="outlined"
                      name="name"
                    />
                  </form>
                </Grid>
                <Grid item xs={12} sm={12} md={6}>
                  <FormField className={classes.formField}>
                    <TextField
                      required
                      disabled
                      value={rule.id}
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
                    {...gracePeriodRule}
                    className={classes.textInput}
                    label="Grace period"
                    type="number"
                    name="gracePeriod"
                    variant="outlined"
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

            <Grid container item xs={12} md={8}>
              <Grid className={classes.titleLimit} item xs={12}>
                <Text weight="bold" variant="h6">
                  Limits Range
                </Text>
              </Grid>

              <Grid container item xs={6}>
                <Grid className={classes.titleLimit} item xs={12}>
                  <Text weight="medium" variant="subtitle2">
                    Upper target
                  </Text>
                </Grid>
                <Grid item xs>
                  <FormField className={classes.formFieldUpper}>
                    <TextField
                      {...comparatorUpper}
                      select
                      name="upperTarget"
                      variant="outlined"
                      className={classes.fieldSelectLimitUpper}>
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
                      {...upper}
                      variant="outlined"
                      type="number"
                      placeholder="Number"
                      className={`${classes.textInput}`}
                      name="upperLimit"
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
                      {...comparatorLower}
                      required
                      select
                      className={classes.fieldSelectLimitLower}
                      variant="outlined"
                      name="lowerTarget">
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
                      {...lower}
                      type="number"
                      variant="outlined"
                      placeholder="Number"
                      className={`${classes.textInput}`}
                      name="lowerLimit"
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
                      {...eventSeverityRules}
                      required
                      select
                      variant="outlined"
                      name="alarmSeverities">
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
                      {...eventTypeRule}
                      required
                      variant="outlined"
                      label="Alarm type name"
                      autoComplete="off"
                      className={classes.textInput}
                      name="alarmType"
                    />
                  </FormField>
                </Grid>
              </Grid>
              <Grid>
                <Grid>
                  <form className={classes.formField}>
                    <TextField
                      {...specificProblemRule}
                      variant="outlined"
                      label="Specific problem"
                      className={classes.textInput}
                      multiline
                      rows={3}
                      name="specificProblem"
                    />
                  </form>
                </Grid>
                <Grid>
                  <form className={classes.formField}>
                    <TextField
                      {...additionalInfoRule}
                      variant="outlined"
                      label="Additional info"
                      className={classes.textInput}
                      multiline
                      rows={3}
                      name="additionalInfo"
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

export default EditRuleItemForm;
