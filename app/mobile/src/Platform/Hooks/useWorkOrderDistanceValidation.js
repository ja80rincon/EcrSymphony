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

import Geolocation from 'react-native-geolocation-service';
import UserActionLogger from '@fbcmobile/ui/Logging/UserActionLogger';
import getDistance from 'geolib/es/getDistance';
import {ERROR} from 'Platform/Consts/UserActionEvents';
import {LOCATION_REQUEST_TIMEOUT_MS} from 'Platform/Consts/Constants';
import {LoadingBackdropContext} from '@fbcmobile/ui/Components/Core/LoadingBackdropContextProvider';
import {useCallback, useContext} from 'react';

const MAXIMUM_DISTANCE_METERS = 200;

const useWorkOrderDistanceValidation = (): ((
  coords: {|
    +latitude: number,
    +longitude: number,
  |},
  onDistanceValidated: (isValid: boolean, distanceMeters: number) => void,
) => void) => {
  const {setIsLoading} = useContext(LoadingBackdropContext);

  const validateDistance = useCallback(
    (coords, onDistanceValidated) => {
      setIsLoading(true);
      Geolocation.getCurrentPosition(
        position => {
          setIsLoading(false);
          const distance = getDistance(position.coords, coords);
          onDistanceValidated(distance <= MAXIMUM_DISTANCE_METERS, distance);
        },
        error => {
          UserActionLogger.logError({
            key: ERROR.ERROR_GETTING_GEOLOCATION,
            errorMessage: error.message,
          });
          setIsLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: LOCATION_REQUEST_TIMEOUT_MS,
          maximumAge: 0,
        },
      );
    },
    [setIsLoading],
  );

  return validateDistance;
};

export default useWorkOrderDistanceValidation;
