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

import type {AuthParams, UserPreferences} from 'Platform/Services/LocalStorage';
import type {DistanceUnit} from 'Platform/Screens/__generated__/PlatformLoginScreenUserQuery.graphql.js';

import * as React from 'react';
import LocalStorage from 'Platform/Services/LocalStorage';
import {NativeModules} from 'react-native';
import {chooseMomentLocale} from '@fbcmobile/ui/Utils/DateUtils';
import {useEffect, useMemo, useState} from 'react';

export const distUnitOptions: {[distUnit: DistanceUnit]: DistanceUnit} = {
  KILOMETER: 'KILOMETER',
  MILE: 'MILE',
};

export type User = {
  tenant: string,
  email: string,
  id: string,
};

export type AppContextType = {
  user: ?User,
  jsLocale: string,
  userPreferences: UserPreferences,
  clearUser: () => void,
  setUser: (user: User) => void,
  setUserPreferences: (settings: UserPreferences) => void,
};

const AppContext = React.createContext<AppContextType>({
  user: null,
  jsLocale: '',
  userPreferences: {
    distUnit: distUnitOptions.KILOMETER,
  },
  clearUser: () => {},
  setUser: () => {},
  setUserPreferences: () => {},
});

type Props = {|
  +children: React.Node,
|};

export function AppContextProvider(props: Props) {
  const [user, setUser] = useState<?User>(null);
  const [userPreferences, setUserPreferences] = useState<UserPreferences>({
    distUnit: distUnitOptions.KILOMETER,
  });

  useEffect(() => {
    LocalStorage.getAuthParams().then((authParams: AuthParams) => {
      if (authParams.email && authParams.tenant && authParams.id) {
        setUser({
          email: authParams.email,
          tenant: authParams.tenant,
          id: authParams.id,
        });
      } else {
        setUser(null);
      }
    });

    LocalStorage.getUserPreferences().then(
      (userPreferences: UserPreferences) => {
        if (userPreferences.distUnit) {
          setUserPreferences({
            distUnit: userPreferences.distUnit,
          });
        } else {
          setUserPreferences({
            distUnit: distUnitOptions.KILOMETER,
          });
        }
      },
    );
  }, []);

  const jsLocale = useMemo(() => {
    const locale: ?string = NativeModules.I18nManager.localeIdentifier;
    const splitLocale = (locale ?? '').split('_');
    let deviceLocale;
    if (splitLocale.length != 2) {
      deviceLocale = 'en-US';
    } else {
      deviceLocale = `${splitLocale[0]}-${splitLocale[1].toUpperCase()}`;
    }
    return chooseMomentLocale(deviceLocale);
  }, []);

  const value = useMemo(
    () => ({
      user,
      jsLocale,
      userPreferences,
      clearUser: () => setUser(null),
      setUser: user => setUser(user),
      setUserPreferences: userPreferences =>
        setUserPreferences(userPreferences),
    }),
    [user, jsLocale, userPreferences],
  );

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
}

export default AppContext;
