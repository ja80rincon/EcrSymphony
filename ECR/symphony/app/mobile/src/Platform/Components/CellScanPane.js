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

import type {
  CellScanPaneMutation,
  CellScanPaneMutationResponse,
  SurveyCellScanData,
} from 'Platform/Components/__generated__/CellScanPaneMutation.graphql.js';
import type {PayloadError} from 'relay-runtime';

import LocalStorage from 'Platform/Services/LocalStorage';
import MapboxGL from '@react-native-mapbox-gl/maps';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import RelayEnvironment from 'Platform/Relay/RelayEnvironment.js';
import SplashScreen from '@fbcmobile/ui/Screens/SplashScreen';
import UserActionLogger from '@fbcmobile/ui/Logging/UserActionLogger';
import fbt from 'fbt';
import {Button, Text} from '@99xt/first-born';
import {CellScanModule} from '@fbcmobile/signalscan';
import {Colors} from '@fbcmobile/ui/Theme';
import {ERROR, EVENT} from 'Platform/Consts/UserActionEvents';
import {PermissionsAndroid, View} from 'react-native';

import getOperators from 'mcc-mnc-list-js';
import usePermissions from '@fbcmobile/ui/Hooks/usePermissions';
import {commitMutation} from 'react-relay';
import {multiPoint} from '@turf/helpers';

const graphql = require('babel-plugin-relay/macro');

// https://docs.mapbox.com/help/glossary/zoom-level/
const ZOOM_LEVEL = 15;
// https://en.wikipedia.org/wiki/Decimal_degrees
const COORD_PRECISION = 4; // precision: ~10 meters

const SAVED_CELL_LOCATION_STYLE: CircleLayerStyle = {
  circleRadius: 5,
  circleColor: Colors.Gray70,
};

const NEW_CELL_LOCATION_STYLE: CircleLayerStyle = {
  circleRadius: 5,
  circleColor: Colors.Orange,
};

type CircleLayerStyle = {
  circleRadius: number,
  circleColor: string,
};

type UserLocation = {
  latitude: number,
  longitude: number,
};

type SingleCellScan = {
  latitude: number,
  longitude: number,
  data: Array<SurveyCellScanData>,
};

export type CellScanCollection = {
  lastUpdate: number,
  cells: {[string]: SingleCellScan},
};

type Props = {
  +isFocused: boolean,
  +locationId: string,
};

type CellScanState = 'idle' | 'saving' | 'uploading' | 'scanning';

const mutation = graphql`
  mutation CellScanPaneMutation($data: [SurveyCellScanData]!, $location: ID!) {
    addCellScans(data: $data, locationID: $location) {
      id
    }
  }
`;

const CellScanPane = (props: Props) => {
  const {locationId} = props;
  const [scanState, setScanState] = useState<CellScanState>('idle');
  const [userLocation, setUserLocation] = useState<?UserLocation>(null);
  const [collectedCells, setCollectedCells] = useState<?CellScanCollection>(
    null,
  );
  const [savedCells, setSavedCells] = useState<Array<CellScanCollection>>([]);
  const [numErrors, setNumErrors] = useState<number>(0);
  const scanLock = useRef<boolean>(false);

  const savedCellScans: Array<SingleCellScan> = useMemo(() => {
    return savedCells
      .map(savedCell =>
        Object.keys(savedCell.cells).map(key => savedCell.cells[key]),
      )
      .reduce((allCells, currentCells) => allCells.concat(currentCells), []);
  }, [savedCells]);

  const {permissionsGranted} = usePermissions([
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
  ]);

  const scan = useCallback(() => {
    if (userLocation == null) {
      return;
    }
    CellScanModule.getCellScanResults().then(result => {
      if (CellScanModule.ERROR_KEY in result) {
        setNumErrors(numErrors + 1);
        return;
      }
      const newScan = {};
      const latitude = userLocation.latitude;
      const longitude = userLocation.longitude;
      newScan[getCoordText(userLocation)] = {
        latitude: latitude,
        longitude: longitude,
        data: Object.keys(result).map(index =>
          convertToGraphQL(result[index], latitude, longitude),
        ),
      };
      setCollectedCells({
        lastUpdate: new Date().getTime(),
        cells: collectedCells
          ? Object.assign(collectedCells.cells, newScan)
          : newScan,
      });
    });
  }, [collectedCells, numErrors, userLocation]);

  const loadSavedCellScans = useCallback(() => {
    LocalStorage.getAllCellScans(locationId).then(setSavedCells);
  }, [locationId]);

  useEffect(() => loadSavedCellScans(), [loadSavedCellScans]);

  useEffect(() => {
    if (scanState === 'scanning') {
      if (scanLock.current == false) {
        scanLock.current = true;
        scan();
      }
    }
  }, [scan, scanState, userLocation]);

  useEffect(() => {
    scanLock.current = false;
  }, [collectedCells]);

  useEffect(() => {
    const saveCollectedCellScans = () => {
      if (collectedCells != null) {
        LocalStorage.storeCellScan(locationId, collectedCells).then(_ => {
          loadSavedCellScans();
          setCollectedCells(null);
          setScanState('idle');
        });
      } else {
        setScanState('idle');
      }
    };
    if (scanState === 'saving') {
      CellScanModule.stopCellScan();
      saveCollectedCellScans();
    }
  }, [
    scanState,
    loadSavedCellScans,
    setCollectedCells,
    setScanState,
    locationId,
    collectedCells,
  ]);

  useEffect(() => {
    scanLock.current = false;
  }, [numErrors]);

  const uploadCellScans = () => {
    setScanState('uploading');
    const cellScans: Array<SurveyCellScanData> = savedCellScans
      .map(savedCellScan => savedCellScan.data)
      .reduce((allCells, currentCells) => allCells.concat(currentCells), []);
    commitMutation<CellScanPaneMutation>(RelayEnvironment, {
      mutation,
      variables: {
        location: locationId,
        data: cellScans,
      },
      onCompleted: (
        response: ?CellScanPaneMutationResponse,
        errors: ?Array<PayloadError>,
      ) => {
        // onCompleted is still called if server throws exception during mutation
        if (errors == null) {
          LocalStorage.removeAllCellScans(locationId).then(_ =>
            loadSavedCellScans(),
          );
          UserActionLogger.logEvent({
            key: EVENT.SUCCESS_COMMIT_CELL_SCAN_MUTATION,
            logMessage: `addCellScans succeeded: ${
              response == null ? 'null' : JSON.stringify(response)
            }}`,
          });
        } else {
          UserActionLogger.logEvent({
            key: ERROR.ERROR_COMMIT_CELL_SCAN_MUTATION,
            logMessage: `addCellScans failed: ${errors[0].message}`,
          });
        }
        setScanState('idle');
      },
      onError: (error: Error) => {
        UserActionLogger.logError({
          key: ERROR.ERROR_COMMIT_CELL_SCAN_MUTATION,
          errorMessage: `addCellScans failed: ${error.toString()}`,
        });
        setScanState('idle');
      },
    });
  };

  const onActionButtonPress = () => {
    switch (scanState) {
      case 'idle':
        setScanState('scanning');
        break;
      case 'scanning':
        setScanState('saving');
        break;
    }
  };

  function getActionButtonText() {
    switch (scanState) {
      case 'idle':
        return (
          <fbt desc="Text of button that starts a cell scan">Start Scan</fbt>
        );
      case 'saving':
        return (
          <fbt desc="Text of the button while the form is getting saved">
            Saving
          </fbt>
        );
      case 'uploading':
        return (
          <fbt desc="Text of the button while the form is being uploaded to the servers">
            Uploading
          </fbt>
        );
      case 'scanning':
        return (
          <fbt desc="Text of the button when a cell scan is in process">
            Stop Scan
          </fbt>
        );
      default:
        return '';
    }
  }

  if (permissionsGranted == null) {
    return <SplashScreen />;
  }
  return permissionsGranted ? (
    <View style={styles.root}>
      <View style={styles.mapContainer}>
        <MapboxGL.MapView style={styles.map} rotateEnabled={false}>
          <MapboxGL.UserLocation
            onUpdate={location =>
              setUserLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              })
            }
          />
          {savedCells.map(savedCell =>
            getCellScanCircleLayer(savedCell, SAVED_CELL_LOCATION_STYLE),
          )}
          {collectedCells &&
            getCellScanCircleLayer(collectedCells, NEW_CELL_LOCATION_STYLE)}
          <MapboxGL.Camera
            animationDuration={200}
            zoomLevel={ZOOM_LEVEL}
            centerCoordinate={
              userLocation == null
                ? null
                : [userLocation.longitude, userLocation.latitude]
            }
          />
        </MapboxGL.MapView>
      </View>
      <Text style={styles.info}>{getCoordText(userLocation)}</Text>
      <Text style={styles.info}>
        <fbt desc="Label text showing the total number of saved data samples">
          Saved samples:
          <fbt:param name="Number of saved cell scans">
            {savedCellScans.length}
          </fbt:param>
        </fbt>
      </Text>
      <Text style={styles.info}>
        <fbt desc="Label text showing the total number of collected data samples">
          Collected samples:
          <fbt:param name="Number of collected cell scans">
            {collectedCells ? Object.keys(collectedCells.cells).length : 0}
          </fbt:param>
        </fbt>
      </Text>
      <View style={styles.buttonContainer}>
        <View style={styles.scanButtonContainer}>
          {userLocation ? (
            <Button color={Colors.Blue} onPress={onActionButtonPress}>
              <Text bold>{getActionButtonText()}</Text>
            </Button>
          ) : (
            <Button color={Colors.Secondary} disabled>
              <Text bold style={styles.secondaryButton}>
                <fbt desc="Button text indicating we are waiting for user location from GPS">
                  Getting location...
                </fbt>
              </Text>
            </Button>
          )}
        </View>
        {savedCellScans.length > 0 && scanState === 'idle' && (
          <Button
            outline
            transparent
            color={Colors.Blue}
            onPress={uploadCellScans}>
            <Text>
              <fbt desc="Button text for uploading cell scans">Upload</fbt>
            </Text>
          </Button>
        )}
      </View>
    </View>
  ) : (
    <View style={styles.root}>
      <Text>
        <fbt desc="Text explaining why a permission is needed.">
          Allow the app to access this phone's location and read phone state in
          order to scan cellular networks.
        </fbt>
      </Text>
    </View>
  );
};

function getCoordText(location: ?UserLocation) {
  return location == null
    ? ''
    : fbt(
        'Latitude: ' +
          fbt.param(
            'Latitude value',
            location.latitude.toFixed(COORD_PRECISION),
          ) +
          ', Longitude: ' +
          fbt.param(
            'Longitude value',
            location.longitude.toFixed(COORD_PRECISION),
          ),
        'Labels for coordinates',
      );
}

function getCellScanCircleLayer(
  cellCollection: CellScanCollection,
  style: CircleLayerStyle,
) {
  const updateTime = cellCollection.lastUpdate;
  return (
    <MapboxGL.ShapeSource
      key={updateTime}
      id={`cell-scans-${updateTime}`}
      cluster={false}
      shape={multiPoint(
        Object.keys(cellCollection.cells).map(key => {
          const cell = cellCollection.cells[key];
          return [cell.longitude, cell.latitude];
        }),
      )}>
      <MapboxGL.CircleLayer
        id={`cell-scans-circle-${updateTime}`}
        sourceLayerID={`cell-scans-layer-${updateTime}`}
        style={style}
      />
    </MapboxGL.ShapeSource>
  );
}

function convertToGraphQL(
  cell: SurveyCellScanData,
  latitude: number,
  longitude: number,
): SurveyCellScanData {
  let operator = null;
  if (cell.mobileCountryCode && cell.mobileNetworkCode) {
    const operators = getOperators(
      cell.mobileCountryCode,
      cell.mobileNetworkCode,
    );
    if (operators != null && operators.length > 0) {
      operator = operators[0].operator;
    }
  }
  return {
    networkType: cell.networkType,
    signalStrength: cell.signalStrength,
    timestamp: Math.floor(new Date().getTime() / 1000),
    baseStationID: cell.baseStationID,
    networkID: cell.networkID,
    systemID: cell.systemID,
    cellID: cell.cellID,
    locationAreaCode: cell.locationAreaCode,
    mobileCountryCode: cell.mobileCountryCode,
    mobileNetworkCode: cell.mobileNetworkCode,
    primaryScramblingCode: cell.primaryScramblingCode,
    operator,
    arfcn: cell.arfcn,
    physicalCellID: cell.physicalCellID,
    trackingAreaCode: cell.trackingAreaCode,
    timingAdvance: cell.timingAdvance,
    earfcn: cell.earfcn,
    uarfcn: cell.uarfcn,
    latitude,
    longitude,
  };
}

const styles = {
  root: {
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    top: 10,
    bottom: 10,
    left: 10,
    right: 10,
  },
  mapContainer: {
    flexGrow: 1,
    marginBottom: 10,
  },
  map: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  info: {
    color: Colors.Gray70,
    marginBottom: 10,
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  secondaryButton: {
    color: Colors.Blue,
  },
  scanButtonContainer: {
    flexGrow: 1,
  },
};

export default React.memo<Props>(CellScanPane);
