/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {Property} from '../common/Property';
import type {PropertyType} from '../common/PropertyType';
import type {
  PropertyCategory,
  PropertyCategoryNode,
} from '../common/PropertyCategory';
import {
  usePropertyCategoryNodes,
  GENERAL_CATEGORY_LABEL,
} from '../common/PropertyCategory';
import type {
  PropertyByCategoriesQuery,
  PropertyByCategoriesQueryVariables,
  PropertyByCategoriesQueryResponse,
} from '../common/__generated__/PropertyByCategoriesQuery.graphql';
import type {WithStyles} from '@material-ui/core';
import PropertyFormField from './form/PropertyFormField';
import React from 'react';
import Text from '@symphony/design-system/components/Text';
import {createFragmentContainer, graphql} from 'react-relay';
import {getInitialPropertyFromType} from '../common/PropertyType';
import {
  getNonInstancePropertyTypes
} from '../common/Property';
import {withStyles} from '@material-ui/core/styles';
import MultiSelect from '@symphony/design-system/components/Select/MultiSelect';
import {useMemo, useEffect, useState} from 'react';
import {useFormContext} from '../common/FormContext';
import fbt from 'fbt';
import {
  usePropertyByCategoriesNodes,
  fetchPropertyByCategories,
} from '../common/Property';
import {extractEntityIdFromUrl} from '../common/RouterUtils';
import {getPropertyValue} from '../common/Property';
import NodePropertyValue from './NodePropertyValue';
import LocationPropertyCategoryTable from './location/LocationPropertyCategoryTable';
import ExpandingPanel from '@fbcnms/ui/components/ExpandingPanel';

type Props = {||} & WithStyles<typeof styles>;

const styles = theme => ({
  title: {
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontSize: '20px',
    lineHeight: '23px',
    textTransform: 'capitalize',
  },
  filtertext: {
    fontSize: '14px',
    lineHeight: '16px',
    marginRight: '20px',
  },
  containerTitle: {
    marginTop: '45px',
    paddingBottom: '20px',
  },
  comboboxContainer: {
    margin: '0px 24px',
    marginBottom: '20px',
  },
  expandingPanel: {
    boxShadow: 'none',
    // borderBottom: '1px solid #9DA9BE',
  },
  borderLine: {
    borderBottom: '1px solid #9DA9BE',
    margin: '0px 25px',
  },
});

const DynamicPropertyCategoriesTable = (props: Props) => {
  const {classes} = props;
  const form = useFormContext();

  const [propCategories, setPropCategories] = useState(
    usePropertyCategoryNodes({
      orderBy: {
        field: 'INDEX',
        direction: 'ASC',
      },
    }),
  );
  const [selectedValues, setSelectedValues] = useState([]);
  let isVisible = false;
  const [filters, setFilters] = useState<any>({
    filters: [
      {
        filterType: 'LOCATION_ID',
        operator: 'IS',
        intValue: extractEntityIdFromUrl('location', location.search),
      },
    ],
  });
  const [properties, setProperties] = useState<any>();

  const propCategoryToOptions = (
    propCatories: $ReadOnlyArray<PropertyCategoryNode>,
  ) =>
    propCatories.map(e => ({
      label: e.name || '',
      value: e.id || '',
      key: e.id,
    }));
  const noCategory = {
    key: '',
    label: GENERAL_CATEGORY_LABEL.toLowerCase(),
    value: GENERAL_CATEGORY_LABEL,
  };
  const options = useMemo(() => {
    const result = [noCategory, ...propCategoryToOptions(propCategories)];
    return result;
  }, [propCategories, noCategory]);

  useEffect(() => {
    setSelectedValues(options);
  }, []);

  useEffect(() => {
    let ids = selectedValues
      .filter(e => e.value !== GENERAL_CATEGORY_LABEL)
      .map(e => e.value);
    const locationID = extractEntityIdFromUrl('location', location.search);
    const generalCategory = selectedValues.filter(
      e => e.value === GENERAL_CATEGORY_LABEL,
    );

    const filterInput = {
      filters: [
        {
          filterType: 'LOCATION_ID',
          operator: 'IS',
          intValue: Number(locationID),
        },
      ],
    };
    if (ids.length > 0) {
      filterInput.filters.push({
        filterType: 'PROPERTY_CATEGORY_ID',
        operator: 'IS_ONE_OF',
        idSet: ids,
      });
    }
    if (generalCategory.length > 0) {
      filterInput.filters.push({
        filterType: 'PROPERTY_CATEGORY_IS_NIL',
        operator: 'IS',
        stringValue: 'General',
      });
    }
    setFilters(filterInput);
    fetchPropertyByCategories(filterInput).then(processProperties);
  }, [selectedValues]);

  const selectIsVisible = value => {
    isVisible = value;
  };

  const updateOnChange = (newValues: any) => {
    setSelectedValues(newValues);
  };

  useEffect(() => {}, [properties]);

  const processProperties = function name(
    categories: PropertyByCategoriesQueryResponse,
  ) {
    const allProps = categories.propertiesByCategories.map(el => {
      const props: $ReadOnlyArray<Property> = (el?.properties: any);
      const propTypes: $ReadOnlyArray<PropertyType> = (el?.propertyType: any);

      const newProperties = [
        ...props,
        ...propTypes.map(x => getInitialPropertyFromType(x)),
      ];
      return {
        id: el?.id,
        name: el?.name,
        properties: newProperties,
      };
    });
    setProperties(allProps);
  };

  return (
    <div>
      <div className={classes.comboboxContainer}>
        <Text variant="subtitle1" className={classes.filtertext}>
          Filter by:
        </Text>
        <MultiSelect
          className={classes.select}
          label={
            <fbt desc="">
              <fbt:plural count={selectedValues.length} many="Categories ">
                Category
              </fbt:plural>
            </fbt>
          }
          options={options}
          onChange={option => {
            const newValues = selectedValues
              .map(v => v.value)
              .includes(option.value)
              ? selectedValues.filter(v => v.value !== option.value)
              : [...selectedValues, option];
            updateOnChange(newValues);
          }}
          isVisible={selectIsVisible}
          selectedValues={selectedValues}
          disabled={form.alerts.missingPermissions.detected}
        />
      </div>
      <div>
        {!!properties &&
          properties?.length > 0 &&
          properties.map((prop, i) => (
            <div key={`property_${i}`}>
              <ExpandingPanel
                allowExpandCollapse={true}
                defaultExpanded={false}
                title={prop?.name}
                className={classes.expandingPanel}>
                <div>
                  <LocationPropertyCategoryTable properties={prop.properties} />
                </div>
              </ExpandingPanel>
              <div className={classes.borderLine}></div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default withStyles(styles)(DynamicPropertyCategoriesTable);
