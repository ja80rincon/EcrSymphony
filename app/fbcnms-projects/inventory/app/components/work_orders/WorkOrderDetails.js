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
  AddHyperlinkMutationResponse,
  AddHyperlinkMutationVariables,
} from '../../mutations/__generated__/AddHyperlinkMutation.graphql';
import type {AddImageMutationResponse} from '../../mutations/__generated__/AddImageMutation.graphql';
import type {AddImageMutationVariables} from '../../mutations/__generated__/AddImageMutation.graphql';
import type {CheckListItem} from '../checklist/checkListCategory/ChecklistItemsDialogMutateState.js';
import type {ChecklistCategoriesMutateStateActionType} from '../checklist/ChecklistCategoriesMutateAction';
import type {ChecklistCategoriesStateType} from '../checklist/ChecklistCategoriesMutateState';
import type {ContextRouter} from 'react-router-dom';
import type {MutationCallbacks} from '../../mutations/MutationCallbacks.js';
import type {Property} from '../../common/Property';
import type {WithAlert} from '@fbcnms/ui/components/Alert/withAlert';
import type {WorkOrderDetails_workOrder} from './__generated__/WorkOrderDetails_workOrder.graphql.js';

import AddHyperlinkButton from '../AddHyperlinkButton';
import AddHyperlinkMutation from '../../mutations/AddHyperlinkMutation';
import AddImageMutation from '../../mutations/AddImageMutation';
import AppContext from '@fbcnms/ui/context/AppContext';
import ApplyIcon from '@symphony/design-system/icons/Actions/ApplyIcon';
import CheckListCategoryExpandingPanel from '../checklist/checkListCategory/CheckListCategoryExpandingPanel';
import ChecklistCategoriesMutateDispatchContext from '../checklist/ChecklistCategoriesMutateDispatchContext';
import CircularProgress from '@material-ui/core/CircularProgress';
import CommentsActivitiesBox from '../comments/CommentsActivitiesBox';
import EntityDocumentsTable from '../EntityDocumentsTable';
import ExpandingPanel from '@fbcnms/ui/components/ExpandingPanel';
import FileUploadButton from '../FileUpload/FileUploadButton';
import FormContext, {FormContextProvider} from '../../common/FormContext';
import FormField from '@symphony/design-system/components/FormField/FormField';
import Grid from '@material-ui/core/Grid';
import IconButton from '@symphony/design-system/components/IconButton';
import LinkIcon from '@symphony/design-system/icons/Actions/LinkIcon';
import LocationBreadcrumbsTitle from '../location/LocationBreadcrumbsTitle';
import LocationMapSnippet from '../location/LocationMapSnippet';
import LocationTypeahead from '../typeahead/LocationTypeahead';
import NameDescriptionSection from '../../common/NameDescriptionSection';
import ProjectTypeahead from '../typeahead/ProjectTypeahead';
import PropertyValueInput from '../form/PropertyValueInput';
import React, {useContext, useMemo, useReducer, useState} from 'react';
import Select from '@symphony/design-system/components/Select/Select';
import Strings from '@fbcnms/strings/Strings';
import Text from '@symphony/design-system/components/Text';
import TextInput from '@symphony/design-system/components/Input/TextInput';
import UploadIcon from '@symphony/design-system/icons/Actions/UploadIcon';
import WorkOrderDetailsPane from './WorkOrderDetailsPane';
import WorkOrderHeader from './WorkOrderHeader';
import fbt from 'fbt';
import symphony from '@symphony/design-system/theme/symphony';
import withAlert from '@fbcnms/ui/components/Alert/withAlert';
import {NAVIGATION_OPTIONS} from '../location/LocationBreadcrumbsTitle';
import {createFragmentContainer, graphql} from 'react-relay';
import {formatDateForTextInput} from '@fbcnms/ui/utils/displayUtils';
import {
  getInitialState,
  reducer,
} from '../checklist/ChecklistCategoriesMutateReducer';
import {makeStyles} from '@material-ui/styles';
import {priorityValues, useStatusValues} from '../../common/FilterTypes';
import {sortPropertiesByIndex, toMutableProperty} from '../../common/Property';
import {useMainContext} from '../MainContext';
import {withRouter} from 'react-router-dom';

import SelectAvailabilityAssignee, {
  AppointmentData,
} from './SelectAvailabilityAssignee';


import {isChecklistItemDone} from '../checklist/ChecklistUtils.js';
import {useDocumentCategoryByLocationTypeNodes} from '../../common/LocationType';
import {useSnackbar} from 'notistack';

type Props = $ReadOnly<{|
  workOrder: WorkOrderDetails_workOrder,
  onWorkOrderRemoved: () => void,
  onCancelClicked: () => void,
  ...WithAlert,
  ...ContextRouter,
|}>;

const FileTypeEnum = {
  IMAGE: 'IMAGE',
  FILE: 'FILE',
};

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  input: {
    paddingBottom: '24px',
  },
  gridInput: {
    display: 'inline-flex',
  },
  cards: {
    overflowY: 'auto',
    overflowX: 'hidden',
    flexGrow: 1,
    flexBasis: 0,
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
  },
  separator: {
    borderBottom: `1px solid ${symphony.palette.D50}`,
    margin: '0 0 16px -24px',
    paddingBottom: '24px',
    width: 'calc(100% + 48px)',
  },
  uploadButtonContainer: {
    display: 'flex',
    marginRight: '8px',
    marginTop: '4px',
  },
  uploadButton: {
    cursor: 'pointer',
    fill: symphony.palette.primary,
  },
  minimizedButton: {
    marginRight: '4px',
    marginLeft: '8px',
  },
  dense: {
    paddingTop: '9px',
    paddingBottom: '9px',
    height: '14px',
  },
  breadcrumbs: {
    marginBottom: '16px',
  },
  propertiesGrid: {
    marginTop: '16px',
  },
  commentsBoxContainer: {
    padding: '0px',
  },
  inExpandingPanelFix: {
    paddingLeft: '16px',
    paddingRight: '40px',
  },
  commentsLog: {
    maxHeight: '400px',
  },
  map: {
    minHeight: '232px',
  },
}));

const WorkOrderDetails = ({
  workOrder: propsWorkOrder,
  onWorkOrderRemoved,
  onCancelClicked,
  confirm,
  alert,
}: Props) => {
  const classes = useStyles();
  const [workOrder, setWorkOrder] = useState<WorkOrderDetails_workOrder>(
    propsWorkOrder,
  );
  const locationTypeID = workOrder.location?.locationType.id;

  const locationType = !!locationTypeID
    ? useDocumentCategoryByLocationTypeNodes(locationTypeID)
    : null;
  const [properties, setProperties] = useState<Array<Property>>(
    propsWorkOrder.properties
      .filter(Boolean)
      .slice()
      .map<Property>(toMutableProperty)
      .sort(sortPropertiesByIndex),
  );

  const {enqueueSnackbar} = useSnackbar();

  const linkFiles = () => {
    countDispatch({type: 'apply', value: '', file: null, link: null});
    if (state.files.length) {
      enqueueSnackbar('Linking files');
      onGroupDuplicates(state?.files).map(item => {
        linkFileToLocation(
          propsWorkOrder.location?.id,
          item,
          item.storeKey,
          item.category,
        );
      });
    }
    if (state.links.length) {
      enqueueSnackbar('Linking hyperlinks');
      onGroupDuplicates(state?.links).map(item => {
        addNewHyperlinkToLocation(
          propsWorkOrder.location?.id,
          item,
          item.category,
        );
      });
    }
  };

  const onGroupDuplicates = attach => {
    const result = attach.reduce((acc, item) => {
      acc[item.id] = [...(acc[item.id] ?? []), item];
      return acc;
    }, []);

    return Object.values(result).map((item: Object) => item[item.length - 1]);
  };

  function reducerCounter(
    state,
    action: {file: Object, link: Object, type: string, value: string},
  ) {
    switch (action.type) {
      case 'checkIncrement':
        return {
          valueCount: state.valueCount,
          checkCount: state.checkCount + 1,
          files: state.files,
          links: state.links,
          isApplyButtonEnabled: true,
        };
      case 'checkDecrement':
        if (state.checkCount > 0) {
          return {
            valueCount: state.valueCount,
            checkCount: state.checkCount - 1,
            files: state.files,
            links: state.links,
            isApplyButtonEnabled: true,
          };
        } else {
          return {
            valueCount: state.valueCount,
            checkCount: 0,
            files: state.files,
            links: state.links,
            isApplyButtonEnabled: true,
          };
        }
      case 'valueIncrement':
        const newFile = action.file
          ? {id: action.file.id, ...action.file, category: action.value}
          : false;
        const newFiles = newFile
          ? state.files.concat(newFile)
          : state.files
          ? state.files
          : [];
        const newLink = action.link
          ? {id: action.link.id, ...action.link, category: action.value}
          : false;
        const newLinks = newLink
          ? state.links.concat(newLink)
          : state.links
          ? state.links
          : [];
        return {
          valueCount: state.valueCount + 1,
          checkCount: state.checkCount,
          files: newFiles,
          links: newLinks,
          isApplyButtonEnabled: true,
        };
      case 'valueDecrement':
        if (state.valueCount > 0) {
          return {
            valueCount: state.valueCount - 1,
            checkCount: state.checkCount,
            files: state.files?.filter(item => item?.id !== action.file?.id),
            links: state.links?.filter(item => item?.id !== action.link?.id),
            isApplyButtonEnabled: true,
          };
        } else {
          return {
            valueCount: 0,
            checkCount: state.checkCount,
            files: state.files,
            links: state.links,
            isApplyButtonEnabled: true,
          };
        }
      case 'apply':
        return {
          valueCount: state.valueCount,
          checkCount: state.checkCount,
          files: state.files,
          links: state.links,
          isApplyButtonEnabled: false,
        };
      default:
        throw new Error();
    }
  }
  const [state, countDispatch] = useReducer(reducerCounter, {
    checkCount: 0,
    valueCount: 0,
    files: [],
    links: [],
    isApplyButtonEnabled: true,
  });

  const [locationId, setLocationId] = useState(propsWorkOrder.location?.id);
  const [isLoadingDocument, setIsLoadingDocument] = useState(false);
  const {isFeatureEnabled} = useContext(AppContext);

  const {me, userHasAdminPermissions} = useMainContext();

  const [editingCategories, dispatch] = useReducer<
    ChecklistCategoriesStateType,
    ChecklistCategoriesMutateStateActionType,
    $ElementType<WorkOrderDetails_workOrder, 'checkListCategories'>,
  >(reducer, propsWorkOrder.checkListCategories, getInitialState);

  const onDocumentUploaded = (file, key) => {
    const workOrderId = propsWorkOrder.id;
    const variables: AddImageMutationVariables = {
      input: {
        entityType: 'WORK_ORDER',
        entityId: workOrderId,
        imgKey: key,
        fileName: file.name,
        fileSize: file.size,
        modified: new Date(file.lastModified).toISOString(),
        contentType: file.type,
      },
    };

    const updater = store => {
      const newNode = store.getRootField('addImage');
      const workOrderProxy = store.get(workOrderId);
      if (newNode == null || workOrderProxy == null) {
        return;
      }

      const fileType = newNode.getValue('fileType');
      if (fileType === FileTypeEnum.IMAGE) {
        const imageNodes = workOrderProxy.getLinkedRecords('images') || [];
        workOrderProxy.setLinkedRecords([...imageNodes, newNode], 'images');
      } else {
        const fileNodes = workOrderProxy.getLinkedRecords('files') || [];
        workOrderProxy.setLinkedRecords([...fileNodes, newNode], 'files');
      }
    };

    const callbacks: MutationCallbacks<AddImageMutationResponse> = {
      onCompleted: () => {
        setIsLoadingDocument(false);
      },
      onError: () => {},
    };

    AddImageMutation(variables, callbacks, updater);
  };

  const linkFileToLocation = (locationId, file, key, category) => {
    const locId = locationId;

    if (!locId) {
      return;
    }

    const variables: AddImageMutationVariables = {
      input: {
        entityType: 'LOCATION',
        entityId: locId,
        imgKey: key,
        fileName: file.fileName,
        fileSize: file.sizeInBytes,
        modified: file.uploaded,
        contentType: file.fileType,
        category: category.name,
        documentCategoryId: category.id,
      },
    };

    const updater = store => {
      const newNode = store.getRootField('addImage');
      const locationProxy = store.get(locId);
      if (newNode == null || locationProxy == null) {
        return;
      }

      const fileType = newNode.getValue('fileType');
      if (fileType === FileTypeEnum.IMAGE) {
        const imageNodes = locationProxy.getLinkedRecords('images') || [];
        locationProxy.setLinkedRecords([...imageNodes, newNode], 'images');
      } else {
        const fileNodes = locationProxy.getLinkedRecords('files') || [];
        locationProxy.setLinkedRecords([...fileNodes, newNode], 'files');
      }
    };

    const callbacks: MutationCallbacks<AddImageMutationResponse> = {
      onCompleted: () => {
        enqueueSnackbar(
          file.fileName +
            ' linked to location with category "' +
            category.name +
            '"',
        );
      },
      onError: () => {
        enqueueSnackbar(
          'There was an error linking ' +
            file.fileName +
            ' to location with category "' +
            category.name +
            '"',
        );
      },
    };

    AddImageMutation(variables, callbacks, updater);
  };

  const addNewHyperlinkToLocation = (locationId, link, category) => {
    const locId = locationId;

    if (!locId) {
      return;
    }

    const variables: AddHyperlinkMutationVariables = {
      input: {
        entityId: locId,
        entityType: 'LOCATION',
        url: link.url,
        displayName: link?.displayName,
        category: category.name,
        documentCategoryId: category.id,
      },
    };

    const updater = store => {
      const newNode = store.getRootField('addHyperlink');
      const workOrderProxy = store.get(locId);
      if (newNode == null || workOrderProxy == null) {
        return;
      }

      const hyperlinkNodes =
        workOrderProxy.getLinkedRecords('hyperlinks') || [];
      workOrderProxy.setLinkedRecords(
        [...hyperlinkNodes, newNode],
        'hyperlinks',
      );
    };

    const callbacks: MutationCallbacks<AddHyperlinkMutationResponse> = {
      onCompleted: () => {
        enqueueSnackbar(
          `${link?.displayName} linked to location with category ${category.name}`,
        );
      },
      onError: () => {
        enqueueSnackbar(
          `There was an error linking ${link?.displayName} to location with category ${category.name}`,
        );
      },
    };

    AddHyperlinkMutation(variables, callbacks, updater);
  };

  const setWorkOrderStatus = value => {
    if (!value || value === workOrder.status) {
      return;
    }

    const verification = new Promise((resolve, reject) => {
      if (value !== closedStatus.value) {
        resolve();
      } else {
        confirm({
          title: fbt(
            // eslint-disable-next-line prettier/prettier
            "Are you sure you want to mark this work order as '" +
              fbt.param('the closed status', closedStatus.label) +
              "'?",
            'Verification message title',
          ),
          message: fbt(
            // eslint-disable-next-line prettier/prettier
            "Once saved with '" +
              fbt.param('the closed status', closedStatus.label) +
              "' status, the work order will be locked for editing.",
            'Verification message details',
          ),
          confirmLabel: Strings.common.okButton,
        }).then(async confirmed => {
          if (confirmed) {
            const items: Array<CheckListItem> = editingCategories.flatMap(
              x => x.checkList || [],
            );
            const isNotDone = await verifyMandatoryItems(items);
            if (isNotDone) {
              alert(
                `There are mandatory checklist items pending to be answered. Please complete them before closing the Work Order.`,
              );
              return;
            }
            resolve();
          } else {
            reject();
          }
        });
      }
    });

    verification
      .then(() => {
        setWorkOrder({...workOrder, status: value});
      })
      .catch(x => console.error('error', x));
  };

  const verifyMandatoryItems = async (itemsArray: Array<CheckListItem>) => {
    return itemsArray.some(value => {
      const isMandatory = value.isMandatory;
      if (!isMandatory) {
        return false;
      }
      const isDone = isChecklistItemDone(value);

      return !isDone;
    });
  };

  const _setWorkOrderDetail = (
    key:
      | 'name'
      | 'description'
      | 'owner'
      | 'installDate'
      | 'assignedTo'
      | 'priority'
      | 'project'
      | 'organizationFk',
    value,
  ) => {
    setWorkOrder(prevWorkOrder => ({...prevWorkOrder, [`${key}`]: value}));
  };

  const {location} = workOrder;
  const actionsEnabled = isFeatureEnabled('planned_equipment');
  const mandatoryPropertiesOnCloseEnabled = isFeatureEnabled(
    'mandatory_properties_on_work_order_close',
  );

  const isOwner = me?.user?.email === propsWorkOrder?.owner?.email;
  const isAssignee = me?.user?.email === propsWorkOrder?.assignedTo?.email;
  const updatePermission = me?.permissions.workforcePolicy.data.update;
  const templateId = propsWorkOrder.workOrderType.id;
  const assigneeCanCompleteWorkOrder =
    propsWorkOrder.workOrderTemplate?.assigneeCanCompleteWorkOrder;

  const {statusValues, closedStatus, canceledStatus} = useStatusValues();
  const filteredStatusValues = useMemo(() => {
    if (
      userHasAdminPermissions ||
      isOwner ||
      updatePermission?.isAllowed === 'YES' ||
      (updatePermission?.isAllowed === 'BY_CONDITION' &&
        updatePermission.workOrderTypeIds?.includes(templateId)) ||
      (isAssignee && assigneeCanCompleteWorkOrder)
    ) {
      return statusValues;
    }
    return statusValues
      .filter(status => status.key !== closedStatus.key)
      .filter(status => status.key !== canceledStatus.key);
  }, [
    userHasAdminPermissions,
    isOwner,
    updatePermission,
    isAssignee,
    assigneeCanCompleteWorkOrder,
  ]);

  const [appointmentData, setAppointmentData] = useState<AppointmentData>({
    duration: 0,
    date: null,
    saveAppointment: false,
  });

  return (
    <div className={classes.root}>
      <FormContextProvider
        permissions={{
          entity: 'workorder',
          action: 'update',
          workOrderTypeId: propsWorkOrder.workOrderType.id,
          ignorePermissions: isOwner || isAssignee,
        }}>
        <WorkOrderHeader
          workOrderName={propsWorkOrder.name}
          workOrder={workOrder}
          properties={properties}
          checkListCategories={editingCategories}
          locationId={locationId}
          onWorkOrderRemoved={onWorkOrderRemoved}
          onCancelClicked={onCancelClicked}
          appointmentData={appointmentData}
          onPriorityChanged={value => _setWorkOrderDetail('priority', value)}
          onStatusChanged={setWorkOrderStatus}
        />
        <FormContext.Consumer>
          {form => {
            form.alerts.editLock.check({
              fieldId: 'status',
              fieldDisplayName: 'Status',
              value: propsWorkOrder.status,
              checkCallback: value =>
                value === closedStatus.value || value === canceledStatus.value
                  ? `Work order is on '${closedStatus.label}' state`
                  : '',
            });
            return (
              <div className={classes.cards}>
                <Grid container spacing={2}>
                  <Grid item xs={8} sm={8} lg={8} xl={8}>
                    <ExpandingPanel title="Details">
                      <NameDescriptionSection
                        name={workOrder.name}
                        description={workOrder.description}
                        onNameChange={value =>
                          _setWorkOrderDetail('name', value)
                        }
                        onDescriptionChange={value =>
                          _setWorkOrderDetail('description', value)
                        }
                      />
                      <Grid
                        container
                        spacing={2}
                        className={classes.propertiesGrid}>
                        <Grid item xs={12} sm={6} lg={4} xl={4}>
                          <FormField label="Project">
                            <ProjectTypeahead
                              className={classes.gridInput}
                              selectedProject={
                                workOrder.project
                                  ? {
                                      id: workOrder.project.id,
                                      name: workOrder.project.name,
                                    }
                                  : null
                              }
                              margin="dense"
                              onProjectSelection={project =>
                                _setWorkOrderDetail('project', project)
                              }
                            />
                          </FormField>
                        </Grid>
                        <Grid item xs={12} sm={6} lg={4} xl={4}>
                          <FormField label="Type">
                            <TextInput
                              disabled={true}
                              className={classes.gridInput}
                              value={workOrder.workOrderType.name}
                            />
                          </FormField>
                        </Grid>
                        <Grid item xs={12} sm={6} lg={4} xl={4}>
                          <FormField label="Priority">
                            <Select
                              options={priorityValues}
                              selectedValue={workOrder.priority}
                              onChange={value =>
                                _setWorkOrderDetail('priority', value)
                              }
                            />
                          </FormField>
                        </Grid>
                        <Grid item xs={12} sm={6} lg={4} xl={4}>
                          <FormField
                            label="Status"
                            disabled={form.alerts.error.detected}>
                            <Select
                              options={filteredStatusValues}
                              selectedValue={workOrder.status}
                              onChange={value => setWorkOrderStatus(value)}
                            />
                          </FormField>
                        </Grid>
                        <Grid item xs={12} sm={6} lg={4} xl={4}>
                          <FormField label="Created On">
                            <TextInput
                              type="date"
                              className={classes.gridInput}
                              value={formatDateForTextInput(
                                workOrder.creationDate,
                              )}
                            />
                          </FormField>
                        </Grid>
                        <Grid item xs={12} sm={6} lg={4} xl={4}>
                          <FormField label="Due Date">
                            <TextInput
                              type="date"
                              className={classes.gridInput}
                              value={formatDateForTextInput(
                                workOrder.installDate,
                              )}
                              onChange={event => {
                                const value =
                                  event.target.value !== ''
                                    ? new Date(event.target.value).toISOString()
                                    : '';
                                _setWorkOrderDetail('installDate', value);
                              }}
                            />
                          </FormField>
                        </Grid>
                        <Grid item xs={12} sm={6} lg={4} xl={4}>
                          <FormField label="Location">
                            <LocationTypeahead
                              headline={null}
                              className={classes.gridInput}
                              margin="dense"
                              selectedLocation={
                                location
                                  ? {
                                      id: location.id,
                                      name: location.name,
                                    }
                                  : null
                              }
                              onLocationSelection={location =>
                                setLocationId(location?.id ?? null)
                              }
                            />
                          </FormField>
                        </Grid>
                        <Grid item xs={12} sm={6} lg={4} xl={4}>
                          <FormField label="Scheduled at">
                            <TextInput
                              type="date"
                              className={classes.gridInput}
                            />
                          </FormField>
                        </Grid>
                        {properties.map((property, index) => (
                          <Grid
                            key={property.id}
                            item
                            xs={12}
                            sm={6}
                            lg={4}
                            xl={4}>
                            <PropertyValueInput
                              required={
                                !!property.propertyType.isMandatory &&
                                (workOrder.status === closedStatus.value ||
                                  !mandatoryPropertiesOnCloseEnabled)
                              }
                              disabled={
                                !property.propertyType.isInstanceProperty
                              }
                              label={property.propertyType.name}
                              className={classes.gridInput}
                              inputType="Property"
                              property={property}
                              onChange={property =>
                                setProperties(prevProperties => [
                                  ...prevProperties.slice(0, index),
                                  property,
                                  ...prevProperties.slice(index + 1),
                                ])
                              }
                              headlineVariant="form"
                              fullWidth={true}
                            />
                          </Grid>
                        ))}
                      </Grid>
                      <>
                        {location && (
                          <>
                            <div className={classes.separator} />
                            <Text weight="regular" variant="subtitle2">
                              Location
                            </Text>
                            <LocationBreadcrumbsTitle
                              // $FlowFixMe[incompatible-variance] $FlowFixMe T74239404 Found via relay types
                              // $FlowFixMe[prop-missing] $FlowFixMe T74239404 Found via relay types
                              // $FlowFixMe[incompatible-type] $FlowFixMe T74239404 Found via relay types
                              locationDetails={location}
                              size="small"
                              navigateOnClick={NAVIGATION_OPTIONS.NEW_TAB}
                            />
                            <Grid container spacing={2}>
                              <Grid item xs={12} md={12}>
                                <LocationMapSnippet
                                  className={classes.map}
                                  location={{
                                    id: location.id,
                                    name: location.name,
                                    latitude: location.latitude,
                                    longitude: location.longitude,
                                    locationType: {
                                      mapType: location.locationType.mapType,
                                      mapZoomLevel: (
                                        location.locationType.mapZoomLevel || 8
                                      ).toString(),
                                    },
                                  }}
                                />
                              </Grid>
                            </Grid>
                          </>
                        )}
                      </>
                    </ExpandingPanel>
                    {actionsEnabled && (
                      <ExpandingPanel title="Actions">
                        <WorkOrderDetailsPane workOrder={workOrder} />
                      </ExpandingPanel>
                    )}
                    <ExpandingPanel
                      title="Attachments"
                      rightContent={
                        <div className={classes.uploadButtonContainer}>
                          {!!locationType ? (
                            <IconButton
                              icon={ApplyIcon}
                              disabled={state.isApplyButtonEnabled === false}
                              onClick={() => {
                                linkFiles();
                              }}
                            />
                          ) : null}
                          <AddHyperlinkButton
                            className={classes.minimizedButton}
                            variant="text"
                            entityType="WORK_ORDER"
                            categories={[]}
                            allowCategories={false}
                            entityId={workOrder.id}>
                            <IconButton icon={LinkIcon} />
                          </AddHyperlinkButton>
                          {isLoadingDocument ? (
                            <CircularProgress size={24} />
                          ) : (
                            <FileUploadButton
                              onFileUploaded={onDocumentUploaded}
                              onProgress={() => setIsLoadingDocument(true)}>
                              {openFileUploadDialog => (
                                <IconButton
                                  className={classes.minimizedButton}
                                  onClick={openFileUploadDialog}
                                  icon={UploadIcon}
                                />
                              )}
                            </FileUploadButton>
                          )}
                        </div>
                      }>
                      <EntityDocumentsTable
                        entityType="WORK_ORDER"
                        entityId={workOrder.id}
                        // $FlowFixMe[incompatible-type] $FlowFixMe T74239404 Found via relay types
                        files={[
                          ...propsWorkOrder.files,
                          ...propsWorkOrder.images,
                        ]}
                        categories={locationType || [{id: '', name: ''}]}
                        hyperlinks={propsWorkOrder.hyperlinks}
                        onChecked={countDispatch}
                        linkToLocationOptions={!!locationType}
                      />
                    </ExpandingPanel>
                    <ChecklistCategoriesMutateDispatchContext.Provider
                      value={dispatch}>
                      <CheckListCategoryExpandingPanel
                        categories={editingCategories}
                      />
                    </ChecklistCategoriesMutateDispatchContext.Provider>
                  </Grid>
                  <Grid item xs={4} sm={4} lg={4} xl={4}>
                    <SelectAvailabilityAssignee
                      workOrder={workOrder}
                      isOwner={isOwner}
                      isAssignee={isAssignee}
                      title={'Team'}
                      setAppointmentData={setAppointmentData}
                      _setWorkOrderDetail={_setWorkOrderDetail}
                      propsWorkOrder={propsWorkOrder}
                    />

                    <ExpandingPanel
                      title={fbt('Activity & Comments', '')}
                      detailsPaneClass={classes.commentsBoxContainer}
                      className={classes.card}>
                      <CommentsActivitiesBox
                        boxElementsClass={classes.inExpandingPanelFix}
                        commentsLogClass={classes.commentsLog}
                        relatedEntityId={propsWorkOrder.id}
                        relatedEntityType="WORK_ORDER"
                        // $FlowFixMe[incompatible-type] $FlowFixMe T74239404 Found via relay types
                        comments={propsWorkOrder.comments}
                        activities={propsWorkOrder.activities}
                      />
                    </ExpandingPanel>
                  </Grid>
                </Grid>
              </div>
            );
          }}
        </FormContext.Consumer>
      </FormContextProvider>
    </div>
  );
};

export default withRouter(
  withAlert(
    createFragmentContainer(WorkOrderDetails, {
      workOrder: graphql`
        fragment WorkOrderDetails_workOrder on WorkOrder {
          id
          name
          description
          organizationFk {
            id
            name
            description
          }
          workOrderType {
            name
            id
          }
          workOrderTemplate {
            assigneeCanCompleteWorkOrder
          }
          location {
            name
            id
            latitude
            longitude
            locationType {
              id
              mapType
              mapZoomLevel
            }
            ...LocationBreadcrumbsTitle_locationDetails
          }
          owner {
            id
            email
          }
          assignedTo {
            id
            email
          }
          creationDate
          installDate
          status
          priority
          ...WorkOrderDetailsPane_workOrder
          properties {
            ...PropertyFormField_property @relay(mask: false)
          }
          images {
            ...EntityDocumentsTable_files
          }
          files {
            ...EntityDocumentsTable_files
          }
          hyperlinks {
            ...EntityDocumentsTable_hyperlinks
          }
          comments {
            ...CommentsActivitiesBox_comments
          }
          activities {
            ...CommentsActivitiesBox_activities
          }
          project {
            name
            id
            type {
              id
              name
            }
          }
          checkListCategories {
            id
            title
            description
            checkList {
              id
              index
              isMandatory
              type
              title
              helpText
              checked
              enumValues
              stringValue
              enumSelectionMode
              selectedEnumValues
              yesNoResponse
              files {
                id
                fileName
                sizeInBytes
                modified
                uploaded
                fileType
                storeKey
                category
                annotation
              }
              cellData {
                id
                networkType
                signalStrength
                timestamp
                baseStationID
                networkID
                systemID
                cellID
                locationAreaCode
                mobileCountryCode
                mobileNetworkCode
                primaryScramblingCode
                operator
                arfcn
                physicalCellID
                trackingAreaCode
                timingAdvance
                earfcn
                uarfcn
                latitude
                longitude
              }
              wifiData {
                id
                timestamp
                frequency
                channel
                bssid
                strength
                ssid
                band
                channelWidth
                capabilities
                latitude
                longitude
              }
            }
          }
        }
      `,
    }),
  ),
);
