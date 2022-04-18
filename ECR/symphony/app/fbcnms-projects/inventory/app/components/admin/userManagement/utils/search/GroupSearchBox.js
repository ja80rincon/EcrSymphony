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
import {useGroupSearchContext} from './GroupSearchContext';

type Props = $ReadOnly<{|
  className?: ?String,
|}>;

const GroupSearchBox = (props: Props) => {
  const {className} = props;

  const groupSearch = useGroupSearchContext();

  return (
    <div className={className}>
      <TextInput
        placeholder={`${fbt('Search groups...', '')}`}
        isProcessing={groupSearch.isSearchInProgress}
        value={groupSearch.searchTerm}
        onChange={e => groupSearch.setSearchTerm(e.target.value)}
        onEscPressed={() => groupSearch.clearSearch()}
        suffix={
          groupSearch.isEmptySearchTerm ? null : (
            <InputAffix onClick={groupSearch.clearSearch}>
              <CloseIcon color="gray" />
            </InputAffix>
          )
        }
      />
    </div>
  );
};

export default GroupSearchBox;
