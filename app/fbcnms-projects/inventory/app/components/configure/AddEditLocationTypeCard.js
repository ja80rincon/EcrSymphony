/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {AddEditLocationTypeCard_editingLocationType} from './__generated__/AddEditLocationTypeCard_editingLocationType.graphql';
import type {AddLocationTypeMutationResponse} from '../../mutations/__generated__/AddLocationTypeMutation.graphql';
import type {LocationType} from '../../common/LocationType';
import type {MutationCallbacks} from '../../mutations/MutationCallbacks.js';
import type {PayloadError} from 'relay-runtime';
import type {WithAlert} from '@fbcnms/ui/components/Alert/withAlert';
import type {WithSnackbarProps} from 'notistack';
import type {WithStyles} from '@material-ui/core';

import AddLocationTypeMutation from '../../mutations/AddLocationTypeMutation';
import Button from '@symphony/design-system/components/Button';
import CardSection from '../CardSection';
import EditLocationTypeMutation from '../../mutations/EditLocationTypeMutation';
import EditLocationTypeSurveyTemplateCategoriesMutation from '../../mutations/EditLocationTypeSurveyTemplateCategoriesMutation';
import FormField from '@symphony/design-system/components/FormField/FormField';
import FormLabel from '@material-ui/core/FormLabel';
import Grid from '@material-ui/core/Grid';
import LocationMapViewProperties from '../location/LocationMapViewProperties';
import PageFooter from '@fbcnms/ui/components/PageFooter';
import PropertyTypeTable from '../form/PropertyTypeTable';
import CategoryTypeTable from '../form/CategoryTypeTable';
import React from 'react';
import SectionedCard from '@fbcnms/ui/components/SectionedCard';
import SnackbarItem from '@fbcnms/ui/components/SnackbarItem';
import Text from '@symphony/design-system/components/Text';
import TextInput from '@symphony/design-system/components/Input/TextInput';
import fbt from 'fbt';
import update from 'immutability-helper';
import withAlert from '@fbcnms/ui/components/Alert/withAlert';
import {ConnectionHandler} from 'relay-runtime';
import {FormContextProvider} from '../../common/FormContext';
import {createFragmentContainer, graphql} from 'react-relay';
import {getGraphError} from '../../common/EntUtils';
import {getPropertyDefaultValue} from '../../common/PropertyType';
import {sortByIndex} from '../draggable/DraggableUtils';
import {withSnackbar} from 'notistack';
import {withStyles} from '@material-ui/core/styles';

const styles = theme => ({
  header: {
    marginBottom: '21px',
    paddingBottom: '0px',
  },
  nameInput: {
    display: 'inline-flex',
    marginBottom: '16px',
    width: '305px',
  },
  section: {
    marginBottom: '28px',
  },
  closeButton: {
    marginRight: theme.spacing(),
  },
  headerText: {
    fontSize: '20px',
    lineHeight: '24px',
    fontWeight: 500,
  },
  cards: {
    height: 'calc(100% - 60px)',
    padding: '8px 24px',
    overflowY: 'auto',
  },
  checkbox: {
    marginRight: '8px',
  },
});

type Props = WithSnackbarProps &
  WithStyles<typeof styles> &
  WithAlert & {|
    open: boolean,
    onClose: () => void,
    onSave: (locationType: any) => void,
    editingLocationType?: AddEditLocationTypeCard_editingLocationType,
  |};

type State = {
  error: string,
  editingLocationType: LocationType,
  isSaving: boolean,
};

class AddEditLocationTypeCard extends React.Component<Props, State> {
  state = {
    error: '',
    editingLocationType: this.getEditingLocationType(),
    isSaving: false,
  };

  _nameInputRef = React.createRef();

  componentDidMount() {
    this._nameInputRef.current && this._nameInputRef.current.focus();
  }

  render() {
    const {classes, onClose} = this.props;
    const {editingLocationType} = this.state;

    const propertyTypes = editingLocationType.propertyTypes
      .slice()
      .sort(sortByIndex);
    const categoryTypes = editingLocationType.documentCategories
      .slice()
      .sort(sortByIndex);
    const error = this.state.error ? (
      <FormLabel error>{this.state.error}</FormLabel>
    ) : null;

    const {mapType, mapZoomLevel} = editingLocationType;
    const isOnEdit = !!this.props.editingLocationType;

    return (
      <FormContextProvider
        permissions={{
          entity: 'locationType',
          action: isOnEdit ? 'update' : 'create',
        }}>
        <div className={classes.cards}>
          <SectionedCard>
            <div className={classes.header}>
              <Text className={classes.headerText}>
                {isOnEdit ? 'Edit Location Type' : 'New Location Type'}
              </Text>
            </div>
            <div>
              {error}
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FormField label={`${fbt('Location Name', '')}`} required>
                    <TextInput
                      className={classes.nameInput}
                      value={editingLocationType.name}
                      onChange={this.nameChanged}
                      ref={this._nameInputRef}
                    />
                  </FormField>
                </Grid>
              </Grid>
              <LocationMapViewProperties
                mapType={mapType}
                mapZoomLevel={mapZoomLevel}
                onMapTypeChanged={this.mapTypeChanged}
                onMapZoomLevelChanged={this.mapZoomLevelChanged}
              />
            </div>
          </SectionedCard>

          <SectionedCard>
            <Grid container direction="column" spacing={3}>
              <Grid item xs={12} xl={7}>
                <CardSection className={classes.section} title="Properties">
                  <PropertyTypeTable
                    supportCategories
                    propertyTypes={propertyTypes}
                    onPropertiesChanged={this._propertyChangedHandler}
                  />
                </CardSection>
              </Grid>
            </Grid>
          </SectionedCard>

          <SectionedCard>
            <Grid container direction="column" spacing={3}>
              <Grid item xs={12} xl={7}>
                <CardSection
                  className={classes.section}
                  title="Documents Category">
                  <CategoryTypeTable
                    propertyTypes={categoryTypes}
                    onPropertiesChanged={this._documentCategoryChangedHandler}
                  />
                </CardSection>
              </Grid>
            </Grid>
          </SectionedCard>
        </div>
        <PageFooter>
          <Button skin="regular" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={this.isSaveDisabled()} onClick={this.onSave}>
            Save
          </Button>
        </PageFooter>
      </FormContextProvider>
    );
  }

  isSaveDisabled() {
    return (
      !this.state.editingLocationType.name ||
      this.state.isSaving ||
      !this.state.editingLocationType.propertyTypes.every(propType => {
        return (
          propType.isInstanceProperty || !!getPropertyDefaultValue(propType)
        );
      })
    );
  }

  // eslint-disable-next-line flowtype/no-weak-types
  deleteTempId = (definition: any) => {
    const newDef = {...definition};

    if (definition.id && definition.id.includes('@tmp')) {
      newDef['id'] = undefined;
    }
    return newDef;
  };

  buildAddLocationTypeMutationVariables = () => {
    const {
      name,
      mapType,
      mapZoomLevel,
      propertyTypes,
      surveyTemplateCategories,
      documentCategories,
    } = this.state.editingLocationType;

    return {
      input: {
        name,
        mapType,
        mapZoomLevel: parseInt(mapZoomLevel, 10),
        properties: propertyTypes
          .filter(propType => !!propType.name)
          .map(prop => {
            const property = prop.id.includes('@tmp');
            const reasign = {
              ...prop,
              propertyCategoryID: prop.propertyCategory?.id.includes('@tmp')
                ? null
                : prop.propertyCategory?.id,
            };
            delete reasign['propertyCategory'];
            const variable = property ? this.deleteTempId(reasign) : reasign;

            return variable;
          }),
        surveyTemplateCategories: surveyTemplateCategories
          .filter(category => !!category.categoryTitle)
          .map(category => ({
            ...this.deleteTempId(category),
            surveyTemplateQuestions: (
              category.surveyTemplateQuestions || []
            ).map(this.deleteTempId),
          })),
        documentCategories: documentCategories
          .filter(propType => !!propType.name)
          .map(this.deleteTempId),
      },
    };
  };

  withoutProperty(obj, property) {
    const {[property]: unused, ...rest} = obj;

    return rest;
  }

  buildEditLocationTypeMutationVariables = () => {
    const {
      id,
      name,
      mapType,
      mapZoomLevel,
      propertyTypes,
      documentCategories,
    } = this.state.editingLocationType;

    return {
      input: {
        id,
        name,
        mapType,
        mapZoomLevel: parseInt(mapZoomLevel, 10),
        properties: propertyTypes
          .filter(propType => !!propType.name)
          .map(prop => {
            const property = prop.id.includes('@tmp');
            const reasign = {
              ...prop,
              propertyCategoryID: prop.propertyCategory?.id.includes('@tmp')
                ? null
                : prop.propertyCategory?.id,
            };
            delete reasign['propertyCategory'];

            const variable = property ? this.deleteTempId(reasign) : reasign;

            return variable;
          }),
        documentCategories: documentCategories
          .filter(propType => !!propType.name)
          .map(cat => {
            const category = cat.id.includes('@tmp')
              ? {
                  ['numberOfDocuments']: cat.numberOfDocuments,
                  ...this.deleteTempId(cat),
                }
              : this.withoutProperty(cat, 'numberOfDocuments');

            return category;
          }),
      },
    };
  };

  buildEditLocationTypeSurveyTemplateCategoriesMutationVariables = () => {
    const {id, surveyTemplateCategories} = this.state.editingLocationType;
    return {
      id: id,
      surveyTemplateCategories: surveyTemplateCategories
        .filter(category => !!category.categoryTitle)
        .map(category => ({
          ...this.deleteTempId(category),
          surveyTemplateQuestions: (category.surveyTemplateQuestions || []).map(
            this.deleteTempId,
          ),
        })),
    };
  };

  onSave = () => {
    const {name} = this.state.editingLocationType;
    if (!name) {
      this.setState({error: 'Name cannot be empty'});
      return;
    }
    this.setState({isSaving: true});
    if (this.props.editingLocationType) {
      this.editLocationType();
    } else {
      this.addNewLocationType();
    }
  };

  editLocationType = () => {
    const onError = (error: PayloadError) => {
      this.setState({isSaving: false});
      const errorMessage = getGraphError(error);
      this.props.enqueueSnackbar(errorMessage, {
        children: key => (
          <SnackbarItem id={key} message={errorMessage} variant="error" />
        ),
      });
    };

    const handleErrors = errors => {
      if (errors && errors[0]) {
        onError(errors[0]);
      }
    };

    // eslint-disable-next-line max-len
    const surveyVariables = this.buildEditLocationTypeSurveyTemplateCategoriesMutationVariables();
    const callbacks = {
      onCompleted: (response, errors) => {
        if (!handleErrors(errors)) {
          const variables = this.buildEditLocationTypeMutationVariables();
          EditLocationTypeMutation(variables, {
            onError,
            onCompleted: (response, errors) => {
              if (!handleErrors(errors)) {
                this.setState({isSaving: false});
                this.props.onSave &&
                  this.props.onSave(response.editLocationType);
              }
            },
          });
        }
      },
      onError,
    };

    EditLocationTypeSurveyTemplateCategoriesMutation(
      surveyVariables,
      callbacks,
    );
  };

  addNewLocationType = () => {
    const variables = this.buildAddLocationTypeMutationVariables();
    const callbacks: MutationCallbacks<AddLocationTypeMutationResponse> = {
      onCompleted: (response, errors) => {
        this.setState({isSaving: false});
        if (errors && errors[0]) {
          this.props.enqueueSnackbar(errors[0].message, {
            children: key => (
              <SnackbarItem
                id={key}
                message={errors[0].message}
                variant="error"
              />
            ),
          });
        } else {
          this.props.onSave && this.props.onSave(response.addLocationType);
          this.setState({error: ''});
        }
      },
      onError: (error: Error) => {
        this.setState({error: error.message, isSaving: false});
      },
    };
    const updater = store => {
      const rootQuery = store.getRoot();
      const newNode = store.getRootField('addLocationType');
      if (!newNode) {
        return;
      }
      const types = ConnectionHandler.getConnection(
        rootQuery,
        'Catalog_locationTypes',
      );
      if (types != null) {
        const edge = ConnectionHandler.createEdge(
          store,
          types,
          newNode,
          'LocationTypesEdge',
        );
        ConnectionHandler.insertEdgeBefore(types, edge);
      }
    };
    AddLocationTypeMutation(variables, callbacks, updater);
  };

  fieldChangedHandler = (field: 'name' | 'mapType' | 'mapZoomLevel') => event =>
    this.setState({
      editingLocationType: {
        ...this.state.editingLocationType,
        // $FlowFixMe Set state for each field
        [field]: event.target.value,
      },
    });

  mapTypeChanged = mapType =>
    this.setState({
      editingLocationType: {
        ...this.state.editingLocationType,
        mapType,
      },
    });
  mapZoomLevelChanged = mapZoomLevel =>
    this.setState({
      editingLocationType: {
        ...this.state.editingLocationType,
        mapZoomLevel,
      },
    });
  nameChanged = this.fieldChangedHandler('name');

  _propertyChangedHandler = properties => {
    this.setState(prevState => {
      return {
        error: '',
        editingLocationType: update(prevState.editingLocationType, {
          propertyTypes: {$set: properties},
        }),
      };
    });
  };

  _documentCategoryChangedHandler = categories => {
    this.setState(prevState => {
      return {
        error: '',
        editingLocationType: update(prevState.editingLocationType, {
          documentCategories: {$set: categories},
        }),
      };
    });
  };

  getEditingLocationType(): LocationType {
    //TODO: check type
    const {editingLocationType} = this.props;
    const propertyTypes = (editingLocationType?.propertyTypes ?? [])
      .filter(Boolean)
      .map(p => ({
        id: p.id,
        name: p.name,
        index: p.index || 0,
        type: p.type,
        nodeType: p.nodeType,
        booleanValue: p.booleanValue,
        stringValue: p.stringValue,
        intValue: p.intValue,
        floatValue: p.floatValue,
        latitudeValue: p.latitudeValue,
        longitudeValue: p.longitudeValue,
        isEditable: p.isEditable,
        isMandatory: p.isMandatory,
        isInstanceProperty: p.isInstanceProperty,
        propertyCategory: p.propertyCategory,
      }));

    const surveyTemplateCategories = (
      editingLocationType?.surveyTemplateCategories || []
    )
      .filter(Boolean)
      .map(c => ({
        id: c.id,
        categoryTitle: c.categoryTitle,
        categoryDescription: c.categoryDescription,
        surveyTemplateQuestions: (c.surveyTemplateQuestions || [])
          .filter(Boolean)
          .map(q => ({
            id: q.id,
            questionTitle: q.questionTitle,
            questionDescription: q.questionDescription,
            questionType: q.questionType,
            index: q.index,
          })),
      }));
    const documentCategories = (editingLocationType?.documentCategories || [])
      .filter(Boolean)
      .map(d => ({
        id: d.id,
        name: d.name,
        index: d.index,
        numberOfDocuments: d.numberOfDocuments,
      }));
    return {
      id: editingLocationType?.id ?? 'LocationType@tmp0',
      name: editingLocationType?.name ?? '',
      isSite: false,
      mapType: editingLocationType?.mapType ?? 'map',
      mapZoomLevel: String(editingLocationType?.mapZoomLevel ?? 8),
      numberOfLocations: editingLocationType?.numberOfLocations ?? 0,
      documentCategories:
        documentCategories.length > 0
          ? documentCategories
          : [
              {
                id: 'DocumentCategories@tmp',
                name: '',
                index: editingLocationType?.documentCategories?.length ?? 0,
              },
            ],
      propertyTypes:
        propertyTypes.length > 0
          ? propertyTypes
          : [
              {
                id: 'PropertyType@tmp',
                name: '',
                index: editingLocationType?.propertyTypes?.length ?? 0,
                type: 'string',
                nodeType: null,
                booleanValue: false,
                stringValue: null,
                intValue: null,
                floatValue: null,
                latitudeValue: null,
                longitudeValue: null,
                isMandatory: false,
                isEditable: true,
                isInstanceProperty: true,
              },
            ],
      surveyTemplateCategories:
        surveyTemplateCategories.length > 0
          ? surveyTemplateCategories
          : [
              {
                id: 'Category@tmp',
                categoryTitle: '',
                categoryDescription: '',
                surveyTemplateQuestions: [],
              },
            ],
    };
  }
}

export default withStyles(styles)(
  withAlert(
    withSnackbar(
      createFragmentContainer(AddEditLocationTypeCard, {
        editingLocationType: graphql`
          fragment AddEditLocationTypeCard_editingLocationType on LocationType {
            id
            name
            mapType
            mapZoomLevel
            numberOfLocations
            propertyTypes {
              id
              name
              type
              nodeType
              index
              stringValue
              intValue
              booleanValue
              floatValue
              latitudeValue
              longitudeValue
              rangeFromValue
              rangeToValue
              isEditable
              isMandatory
              isInstanceProperty
              propertyCategory {
                id
                name
              }
            }
            documentCategories {
              id
              name
              index
              numberOfDocuments
            }
            surveyTemplateCategories {
              id
              categoryTitle
              categoryDescription
              surveyTemplateQuestions {
                id
                questionTitle
                questionDescription
                questionType
                index
              }
            }
          }
        `,
      }),
    ),
  ),
);
