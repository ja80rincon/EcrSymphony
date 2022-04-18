/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import DetailsPanelSection from '../DetailsPanelSection';
import FormAction from '@symphony/design-system/components/Form/FormAction';
import React from 'react';
import Switch from '@symphony/design-system/components/switch/Switch';
import fbt from 'fbt';

type Props = $ReadOnly<{|
  className?: string,
|}>;

export default function FlowNewInstances(props: Props) {
  const {className} = props;

  return (
    <DetailsPanelSection
      title={fbt('Allow new instances', '')}
      body={fbt('New instances of this flow can be created.', '')}
      className={className}
      actionItems={[
        <FormAction>
          <Switch title=" " checked={false} />
        </FormAction>,
      ]}
    />
  );
}
