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
import Text from '@symphony/design-system/components/Text';

type Props = $ReadOnly<{|
  title: string,
  content: React.Node,
  className?: string,
|}>;

const TextField = (props: Props) => {
  const {title, content, className} = props;
  return (
    <div className={className}>
      <div>
        <Text variant="caption" color="gray">
          {title}
        </Text>
      </div>
      <div>
        <Text variant="body2" useEllipsis>
          {content}
        </Text>
      </div>
    </div>
  );
};

export default TextField;
