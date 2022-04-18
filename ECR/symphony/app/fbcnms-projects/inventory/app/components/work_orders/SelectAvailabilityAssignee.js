/*[object Object]*/

import type {WorkOrderDetails_workOrder} from './__generated__/WorkOrderDetails_workOrder.graphql';

import type {ShortUser} from '../../common/EntUtils';

import MomentUtils from '@date-io/moment';
import moment from 'moment';

import Button from '@symphony/design-system/components/Button';
import CalendarTodayIcon from '@material-ui/core/SvgIcon';
import ExpandingPanel from '@fbcnms/ui/components/ExpandingPanel';
import FormField from '@symphony/design-system/components/FormField/FormField';
import FormFieldWithPermissions from '../../common/FormFieldWithPermissions';
import OrganizationTypeahead from '../typeahead/OrganizationTypeahead';
import React, {useEffect, useState} from 'react';
import Select from '@symphony/design-system/components/Select/Select';
import UserByAppointmentTypeahead from '../typeahead/UserByAppointmentTypeahead';
import UserTypeahead from '../typeahead/UserTypeahead';
import symphony from '@symphony/design-system/theme/symphony';
import useFeatureFlag from '@fbcnms/ui/context/useFeatureFlag';
import {DateTimePicker, MuiPickersUtilsProvider} from '@material-ui/pickers';
import {WorkOrder} from '../../common/WorkOrder';
import {makeStyles} from '@material-ui/styles';

const useStyles = makeStyles(() => ({
  input: {
    paddingBottom: '15px',
  },
  secondaryText: {
    color: symphony.palette.overlay,
  },
  inputFilter: {
    paddingBottom: '22px',
  },
  filterButton: {
    width: '87px',
    alignSelf: 'flex-end',
  },
  actionButtons: {
    display: 'flex',
    alignSelf: 'flex-end',
    flexDirection: 'row',
    margin: '20px 0px',
  },
  cancelButton: {
    marginRight: '8px',
  },
  calendarButton: {
    width: '132px',
    alignSelf: 'flex-end',
  },
  dense: {
    paddingTop: '9px',
    paddingBottom: '9px',
    height: '14px',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
  },
  filterSection: {
    backgroundColor: symphony.palette.background,
    height: 'inherit',
    width: 'inherit',
    margin: '0px -24px',
    padding: '0px 24px',
    display: 'flex',
    flexDirection: 'column',
  },
}));

type Props = $ReadOnly<{|
  workOrder: WorkOrder,
  isOwner: boolean,
  isAssignee: boolean,
  _setWorkOrderDetail: () => void,
  setAppointmentData: () => void,
  title: string,
  propsWorkOrder: ?WorkOrderDetails_workOrder,
|}>;

export type AppointmentData = {
  duration: string,
  date: Date,
  saveAppointment: boolean,
};

const SelectAvailabilityAssignee = (props: Props) => {
  const {
    workOrder,
    _setWorkOrderDetail,
    setAppointmentData,
    isOwner,
    propsWorkOrder,
    isAssignee,
    title,
  } = props;

  const classes = useStyles();
  const [slotStartDate, setSlotStartDate] = useState(moment);
  const [slotEndDate, setSlotEndDate] = useState(moment);
  const [duration, setDuration] = useState('0');
  const [useFilters, setUseFilters] = useState(false);
  const [invalidForm, setInvalidForm] = useState(false);

  const featureFlagFilters = useFeatureFlag('scheduling_filter_dates');
  const multicontractorFlag = useFeatureFlag('multicontractor');

  useEffect(() => {
    setAppointment(false);
  }, []);

  const setInfo = (label: string, user: ShortUser) => {
    _setWorkOrderDetail(label, user);
    setAppointment(true);
  };

  const applyFilters = () => {
    setUseFilters(true);
  };

  const onResetClicked = () => {
    setUseFilters(false);
    setAppointment(false);
  };

  const setAppointment = saveAppointment => {
    setAppointmentData({
      duration,
      date: slotStartDate.toISOString(),
      saveAppointment: saveAppointment,
    });
  };

  const orderDatesValidation = () => {
    durationValidation(duration);
    moment(slotStartDate).isAfter(slotEndDate)
      ? setInvalidForm(true)
      : setInvalidForm(false);
  };

  const durationValidation = duration => {
    const interval = slotEndDate.diff(slotStartDate, 'hours');
    if (interval >= duration) {
      setDuration(duration);
      setInvalidForm(false);
    } else {
      setDuration('0');
      setInvalidForm(true);
    }
  };

  return (
    <ExpandingPanel title={title} className={classes.card}>
      {featureFlagFilters && (
        <div className={classes.card}>
          <Button
            variant="text"
            leftIcon={CalendarTodayIcon}
            className={classes.calendarButton}>
            View Calendar
          </Button>
          <div className={classes.filterSection}>
            <p className={classes.secondaryText}>
              Filter time and duration (optional)
            </p>
            <FormField label="Time slot start">
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <DateTimePicker
                  variant="inline"
                  inputVariant="outlined"
                  value={slotStartDate}
                  onChange={setSlotStartDate}
                  onClose={orderDatesValidation}
                  className={classes.inputFilter}
                  disabled={useFilters}
                />
              </MuiPickersUtilsProvider>
            </FormField>
            <FormField label="Time slot end">
              <MuiPickersUtilsProvider utils={MomentUtils}>
                <DateTimePicker
                  variant="inline"
                  minDate={slotStartDate}
                  inputVariant="outlined"
                  value={slotEndDate}
                  onChange={setSlotEndDate}
                  onClose={orderDatesValidation}
                  className={classes.inputFilter}
                  disabled={useFilters}
                />
              </MuiPickersUtilsProvider>
            </FormField>
            <FormField label="Duration">
              <Select
                options={[
                  {key: '0 hr', label: '0 hr', value: '0'},
                  {key: '0.5 hr', label: '0.5 hr', value: '0.5'},
                  {key: '1 hr', label: '1 hr', value: '1'},
                  {key: '1.5 hr', label: '1.5 hr', value: '1.5'},
                  {key: '2 hr', label: '2 hr', value: '2'},
                  {key: '2.5 hr', label: '2.5 hr', value: '2.5'},
                  {key: '24 hr', label: '24 hr', value: '24'},
                ]}
                disabled={useFilters}
                selectedValue={duration}
                className={classes.inputFilter}
                onChange={duration => durationValidation(duration)}
                onClose={durationValidation}
              />
            </FormField>
            <div className={classes.actionButtons}>
              <Button
                className={classes.cancelButton}
                skin="regular"
                onClick={onResetClicked}
                disabled={!useFilters}>
                Clear Filter
              </Button>
              <Button
                className={classes.filterButton}
                onClick={applyFilters}
                disabled={invalidForm || useFilters}>
                Filter
              </Button>
            </div>
          </div>
        </div>
      )}
      {multicontractorFlag && (
        <FormField className={classes.input} label="Organization">
          <OrganizationTypeahead
            selectedOrganization={workOrder.organizationFk}
            onOrganizationSelected={organization =>
              _setWorkOrderDetail('organizationFk', organization)
            }
            margin="dense"
          />
        </FormField>
      )}
      <FormFieldWithPermissions
        className={classes.input}
        label="Owner"
        permissions={{
          entity: 'workorder',
          action: 'transferOwnership',
          workOrderTypeId: propsWorkOrder?.workOrderType.id,
          ignorePermissions: isOwner,
        }}
        required={true}
        validation={{id: 'owner', value: workOrder.owner?.id}}>
        <UserTypeahead
          selectedUser={workOrder.owner?.id ? workOrder.owner : null}
          onUserSelection={user => _setWorkOrderDetail('owner', user)}
          margin="dense"
        />
      </FormFieldWithPermissions>
      <FormField
        label="Assignee"
        className={classes.input}
        permissions={{
          entity: 'workorder',
          action: 'assign',
          workOrderTypeId: propsWorkOrder?.workOrderType.id,
          ignorePermissions: isOwner || isAssignee,
        }}>
        {useFilters ? (
          <UserByAppointmentTypeahead
            selectedUser={workOrder.assignedTo || undefined}
            onUserSelection={user => setInfo('assignedTo', user)}
            slotStartDate={slotStartDate.toISOString()}
            slotEndDate={slotEndDate.toISOString()}
            duration={duration}
            margin="dense"
          />
        ) : (
          <UserTypeahead
            selectedUser={workOrder.assignedTo || undefined}
            onUserSelection={user => _setWorkOrderDetail('assignedTo', user)}
            margin="dense"
          />
        )}
      </FormField>
    </ExpandingPanel>
  );
};

export default SelectAvailabilityAssignee;
