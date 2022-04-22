/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import * as React from 'react';
import CloseIcon from '@symphony/design-system/icons/Navigation/CloseIcon';
import InputAffix from '@symphony/design-system/components/Input/InputAffix';
import TextInput from '@symphony/design-system/components/Input/TextInput';
import fbt from 'fbt';
import {useUserSearchContext} from './UserSearchContext';

type Props = $ReadOnly<{|
  className?: ?String,
|}>;

const UserSearchBox = (props: Props) => {
  const {className} = props;

  const userSearch = useUserSearchContext();

  return (
    <div className={className}>
      <TextInput
        type="string"
        placeholder={`${fbt('Search users...', '')}`}
        isProcessing={userSearch.isSearchInProgress}
        value={userSearch.searchTerm}
        onChange={e => userSearch.setSearchTerm(e.target.value)}
        onEscPressed={() => userSearch.clearSearch()}
        suffix={
          userSearch.isEmptySearchTerm ? null : (
            <InputAffix onClick={userSearch.clearSearch}>
              <CloseIcon color="gray" />
            </InputAffix>
          )
        }
      />
    </div>
  );
};

export default UserSearchBox;
