/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {CustomGeoJSONFeature} from '../map/MapView';
import type {Location} from '../../common/Location';
import type {MapLayer} from '../map/MapView';
import type {ShortUser} from '../../common/EntUtils';
import type {WorkOrder} from '../../common/WorkOrder';
import type {
  WorkOrderLocation,
  WorkOrderProperties,
  WorkOrderWithLocation,
} from '../map/MapUtil';

import * as React from 'react';
import MapView from './../map/MapView';
import WorkOrderMapButtons from './WorkOrderMapButtons.js';
import WorkOrderPopover from './WorkOrderPopover';
import nullthrows from 'nullthrows';
import useRouter from '@fbcnms/ui/hooks/useRouter';
import {createFragmentContainer, graphql} from 'react-relay';
import {makeStyles} from '@material-ui/styles';
import {useEffect} from 'react';
import {useMemo, useState} from 'react';
import {withRouter} from 'react-router-dom';
import {workOrderToGeoJSONSource} from './../map/MapUtil';

type Props = $ReadOnly<{|
  workOrders: Array<WorkOrder>,
|}>;

const useStyles = makeStyles(() => ({
  workOrderPopover: {
    minWidth: '410px',
    maxWidth: '50vw',
  },
}));

const LOCATIONS_DISTRIBUTION_FACTOR = 0.01;

const distributeLocations = (
  location: Location,
  setLocations: Set<string>,
): WorkOrderLocation => {
  let lat = location.latitude + Math.random() * LOCATIONS_DISTRIBUTION_FACTOR;
  if (!setLocations.has(location.name)) {
    setLocations.add(location.name);
    lat = location.latitude;
  }
  return {
    ...location,
    randomizedLatitude: lat,
  };
};

const WorkOrdersMap = (props: Props) => {
  const {workOrders} = props;
  const classes = useStyles();
  const [selectedView, setSelectedView] = useState('status');
  const router = useRouter();
  const setLocations = useMemo(() => new Set(), []);
  const [workOrdersWithLocations, setWorkOrdersWithLocations] = useState([]);
  const [layers, setLayers] = useState<
    Array<MapLayer<WorkOrderProperties & {primaryKey: string, color: string}>>,
  >([]);

  useEffect(() => {
    if (!workOrders) {
      return;
    }

    setWorkOrdersWithLocations(
      workOrders
        .filter(w => w.location !== null)
        .map(w => ({
          workOrder: w,
          location: distributeLocations(
            {
              ...nullthrows(w.location),
              randomizedLatitude: w.location?.latitude || 0,
            },
            setLocations,
          ),
        })),
    );
  }, [workOrders, setLocations]);

  useEffect(() => {
    setLayers([
      {
        styles: {
          icon: {
            iconImage: 'suitcase-15',
            textField: selectedView == 'status' ? '' : ['get', 'text'],
            textTransform: 'uppercase',
            iconIgnorePlacement: false,
            textColor: ['get', 'textColor'],
            textFont: (['Roboto Bold', 'Arial Unicode MS Bold']: Array<string>),
          },
        },
        source: workOrderToGeoJSONSource('0', workOrdersWithLocations, {
          primaryKey: '0',
          color: 'blue',
        }),
      },
    ]);
  }, [selectedView, workOrdersWithLocations]);

  const onWorkOrderChanged = (
    key: 'assigneeId' | 'installDate',
    value: ?string,
    workOrderId: string,
  ) => {
    setWorkOrdersWithLocations(
      workOrdersWithLocations.map(workOrder => {
        if (workOrder.workOrder.id === workOrderId) {
          return updateWorkOrderDetails(workOrder, key, value);
        }
        return workOrder;
      }),
    );
  };

  const updateWorkOrderDetails = (
    workOrder: WorkOrderWithLocation,
    key: 'assigneeId' | 'installDate',
    value: ?string,
  ): WorkOrderWithLocation => {
    return {
      location: workOrder.location,
      workOrder: {
        ...workOrder.workOrder,
        // $FlowFixMe Set state for each field
        [key]: value,
      },
    };
  };

  const userFormat = (userInput: string | ShortUser) => {
    const user: ShortUser =
      typeof userInput === 'string' ? JSON.parse(userInput) : userInput;
    return user;
  };

  const locationFormat = (
    locationInput: string | WorkOrderLocation,
  ): WorkOrderLocation => {
    const location: WorkOrderLocation =
      typeof locationInput === 'string'
        ? JSON.parse(locationInput)
        : locationInput;
    return location;
  };

  const featurePropertiesToWorkOrderProperties = (properties: {
    ...WorkOrderProperties,
    primaryKey: string,
    color: string,
  }): WorkOrderProperties => {
    return {
      ...properties,
      assignedTo: userFormat(properties.assignedTo ?? '{}'),
      owner: userFormat(properties.owner),
      location: locationFormat(properties.location),
    };
  };

  return (
    <MapView
      mapButton={
        <WorkOrderMapButtons onClick={value => setSelectedView(value)} />
      }
      mode="streets"
      layers={layers}
      showMapSatelliteToggle={true}
      showGeocoder={true}
      workOrdersView={true}
      getFeaturePopoutContent={(
        feature: CustomGeoJSONFeature<
          WorkOrderProperties & {primaryKey: string, color: string},
        >,
      ) => {
        // For flow
        if (feature.properties == null) {
          return null;
        }
        const workOrder = featurePropertiesToWorkOrderProperties(
          feature.properties,
        );
        return (
          <WorkOrderPopover
            onWorkOrderChanged={onWorkOrderChanged}
            displayFullDetails={true}
            containerClassName={classes.workOrderPopover}
            selectedView={selectedView}
            workOrder={workOrder}
            onWorkOrderClick={() => {
              router.history.push(
                `/workorders/search?workorder=${feature.properties?.id ?? ''}`,
              );
            }}
          />
        );
      }}
      getFeatureHoverPopoutContent={feature => (
        <WorkOrderPopover
          displayFullDetails={false}
          workOrder={featurePropertiesToWorkOrderProperties(
            nullthrows(feature.properties),
          )}
        />
      )}
    />
  );
};

export default withRouter(
  createFragmentContainer(WorkOrdersMap, {
    workOrders: graphql`
      fragment WorkOrdersMap_workOrders on WorkOrder @relay(plural: true) {
        id
        name
        description
        owner {
          id
          email
        }
        status
        priority
        project {
          id
          name
        }
        assignedTo {
          id
          email
        }
        installDate
        location {
          id
          name
          latitude
          longitude
        }
        lastCheckInActivity: activities(
          filter: {activityType: CLOCK_IN, limit: 1, orderDirection: DESC}
        ) {
          activityType
          createTime
          clockDetails {
            distanceMeters
          }
        }
        lastCheckOutActivity: activities(
          filter: {activityType: CLOCK_OUT, limit: 1, orderDirection: DESC}
        ) {
          activityType
          createTime
          clockDetails {
            distanceMeters
          }
        }
      }
    `,
  }),
);
