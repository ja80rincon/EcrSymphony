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

import type {ImageURISource} from 'react-native/Libraries/Image/ImageSource';
import type {NuxName} from 'Platform/Components/Nux/NuxConsts';

import LocalStorage from 'Platform/Services/LocalStorage';
import NuxModal from '@fbcmobile/ui/Components/NuxModal';
import React, {useEffect, useState} from 'react';

type Props = {|
  /**
   * name is used to determine whether this NUX was already
   * shown to the user.
   */
  +name: NuxName,
  +title: string,
  +image: ImageURISource | number,
|};

const NuxContainer = ({name, title, image}: Props) => {
  const [isShown, setIsShown] = useState(false);

  useEffect(() => {
    LocalStorage.isNuxViewSet(name).then(wasAlreadyShown => {
      if (!wasAlreadyShown) {
        setIsShown(true);
      }
    });
  });

  if (!isShown) {
    return null;
  }
  return (
    <NuxModal
      title={title}
      image={image}
      onPress={() => {
        setIsShown(false);
        LocalStorage.setNUXView(name);
      }}
    />
  );
};

export default NuxContainer;
