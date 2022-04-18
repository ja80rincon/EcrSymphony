/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */
import * as React from 'react';
import ErrorBoundaryStyle from './ErrorBoundaryStyle';
import {LogEvents, ServerLogger} from './LoggingUtils';
type Props = $ReadOnly<{|
  children: React.Node,
|}>;

export const ProjectErrorBoundary = (props: Props) => {
  return (
    <ErrorBoundaryStyle
      {...props}
      onError={error => {
        ServerLogger.error(LogEvents.CLIENT_FATAL_ERROR, {
          message: error.message,
          stack: error.stack,
        });
      }}
    />
  );
};
export default ProjectErrorBoundary;
