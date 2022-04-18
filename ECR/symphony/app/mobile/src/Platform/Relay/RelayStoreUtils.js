/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

'use strict';

import type {WorkOrderFilterInput} from 'Platform/Screens/__generated__/MyTasksScreenLocationsNeedSiteSurveyQuery.graphql.js';

import NetInfo from '@react-native-community/netinfo';
import RelayEnvironment from 'Platform/Relay/RelayEnvironment.js';
import UserActionLogger from '@fbcmobile/ui/Logging/UserActionLogger';
import {ERROR} from 'Platform/Consts/UserActionEvents';
import {createOperationDescriptor, getRequest} from 'relay-runtime';
import {fetchQuery} from 'react-relay-offline';

const graphql = require('babel-plugin-relay/macro');

const myTasksQuery = graphql`
  query RelayStoreUtilsMyTasksQuery($filters: [WorkOrderFilterInput!]!) {
    locations(needsSiteSurvey: true) {
      edges {
        ...TasksList_locations
        node {
          id
          name
          parentCoords {
            latitude
            longitude
          }
          latitude
          longitude
          locationType {
            surveyTemplateCategories {
              id
            }
            id
          }
          surveys {
            id
          }
          locationHierarchy {
            id
            name
          }
        }
      }
    }
    workOrders(first: 50, filterBy: $filters) {
      totalCount
      __typename
      edges {
        node {
          id
          name
          priority
          status
          installDate
          workOrderTemplate {
            name
          }
          location {
            id
            name
            latitude
            longitude
            locationHierarchy {
              id
              name
            }
          }
        }
      }
    }
  }
`;

const preFetchMyTasks = (
  filters: ?Array<WorkOrderFilterInput>,
  onFailure?: (error: Error) => void,
) => {
  NetInfo.fetch().then(state => {
    if (state.isConnected) {
      const operation = createOperationDescriptor(
        getRequest(myTasksQuery),
        // $FlowFixMe - T72031710
        filters,
      );
      fetchQuery(RelayEnvironment, myTasksQuery, {filters})
        .then(results => {
          RelayEnvironment.retain(operation);
          results.workOrders.edges
            .map(edge => edge.node)
            .forEach(task => {
              preFetchWorkOrder(task.id, onFailure).then(() => {});
            });
        })
        .catch((error: Error) => {
          UserActionLogger.logError({
            key: ERROR.ERROR_FETCH_QUERY,
            errorMessage: `fetchQuery failed for query RelayStoreUtilsMyTasksQuery: ${error.toString()}`,
          });
          onFailure && onFailure(error);
        });
    }
  });
};

const workOrderQuery = graphql`
  query RelayStoreUtilsWorkOrderNodeQuery($workOrderId: ID!) {
    node(id: $workOrderId) {
      __typename
      ... on WorkOrder {
        id
        name
        status
        workOrderTemplate {
          name
        }
        location {
          id
          name
          parentCoords {
            latitude
            longitude
          }
          latitude
          longitude
          locationHierarchy {
            id
            name
          }
        }
        creationDate
        installDate
        description
        priority
        status
        project {
          name
        }
        assignedTo {
          name
        }
        comments {
          id
          author {
            email
          }
          text
          createTime
        }
        checkListCategories {
          __typename
          id
          ...WorkOrderChecklistCategoryNavigationListItem_category
          title
          description
          checkList {
            id
            index
            title
            type
            helpText
            stringValue
            checked
            enumValues
            selectedEnumValues
            enumSelectionMode
            yesNoResponse
            wifiData {
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
            cellData {
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
            files {
              id
              fileName
              storeKey
              mimeType
              sizeInBytes
              modified
              uploaded
            }
          }
        }
        properties {
          id
          propertyType {
            id
            name
            index
            isInstanceProperty
            type
            stringValue
            intValue
            floatValue
            booleanValue
            latitudeValue
            longitudeValue
            rangeFromValue
            rangeToValue
          }
          stringValue
          intValue
          floatValue
          booleanValue
          latitudeValue
          longitudeValue
          rangeFromValue
          rangeToValue
        }
      }
    }
  }
`;

const preFetchWorkOrder = async (
  workOrderId: string,
  onFailure?: (error: Error) => void,
) => {
  const woOperation = createOperationDescriptor(getRequest(workOrderQuery), {
    workOrderId: workOrderId,
  });
  fetchQuery(RelayEnvironment, workOrderQuery, {
    workOrderId: workOrderId,
  })
    .then(workOrder => {
      RelayEnvironment.retain(woOperation);
      workOrder.node.checkListCategories &&
        workOrder.node.checkListCategories.forEach(category => {
          preFetchWorkOrderCategory(category.id, onFailure).then(() => {});
        });
    })
    .catch((error: Error) => {
      UserActionLogger.logError({
        key: ERROR.ERROR_FETCH_QUERY,
        errorMessage: `fetchQuery failed for query RelayStoreUtilsWorkOrderNodeQuery: ${error.toString()}`,
      });
      onFailure && onFailure(error);
    });
};

const checklistCategoryQuery = graphql`
  query RelayStoreUtilsWorkOrderChecklistCategoryQuery($categoryId: ID!) {
    node(id: $categoryId) {
      __typename
      ... on CheckListCategory {
        __typename
        id
        title
        description
        checkList {
          id
          index
          ...WorkOrderCheckListItem_item
        }
      }
      id
    }
  }
`;

const preFetchWorkOrderCategory = async (
  categoryId: string,
  onFailure?: (error: Error) => void,
) => {
  const categoryOperation = createOperationDescriptor(
    getRequest(checklistCategoryQuery),
    {categoryId: categoryId},
  );
  fetchQuery(RelayEnvironment, checklistCategoryQuery, {
    categoryId: categoryId,
  })
    .then(_category => {
      RelayEnvironment.retain(categoryOperation);
    })
    .catch((error: Error) => {
      UserActionLogger.logError({
        key: ERROR.ERROR_FETCH_QUERY,
        errorMessage: `fetchQuery failed for query RelayStoreUtilsWorkOrderChecklistCategoryQuery: ${error.toString()}`,
      });
      onFailure && onFailure(error);
    });
};

const workOrdersQuery = graphql`
  query RelayStoreUtilsWorkOrdersQuery($filters: [WorkOrderFilterInput!]!) {
    workOrders(first: 500, filterBy: $filters) {
      __typename
      edges {
        node {
          id
          name
          ...WorkOrderListItem_workOrder
        }
      }
    }
  }
`;

//TODO: add pagination T68915223
const preFetchMyWorkOrders = (
  filters: ?Array<WorkOrderFilterInput>,
  onFailure?: (error: Error) => void,
) => {
  NetInfo.fetch().then(state => {
    if (state.isConnected) {
      const operation = createOperationDescriptor(
        getRequest(workOrdersQuery),
        // $FlowFixMe
        filters,
      );
      fetchQuery(RelayEnvironment, workOrdersQuery, {filters})
        .then(() => {
          RelayEnvironment.retain(operation);
        })
        .catch((error: Error) => {
          UserActionLogger.logError({
            key: ERROR.ERROR_FETCH_QUERY,
            errorMessage: `fetchQuery failed for query RelayStoreUtilsWorkOrdersQuery: ${error.toString()}`,
          });
          onFailure && onFailure(error);
        });
    }
  });
};

export {preFetchMyTasks, preFetchMyWorkOrders};
