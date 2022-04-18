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

type State = {|
  canRender: boolean,
|};

export default function withMountingDelay<TComponent: React.ComponentType<*>>(
  Component: TComponent,
): React.ComponentType<React.ElementConfig<TComponent>> {
  return class extends React.Component<React.ElementConfig<TComponent>, State> {
    constructor(props) {
      super(props);
      this.state = {canRender: false};
    }

    componentDidMount() {
      setTimeout(() => {
        this.setState({
          canRender: true,
        });
      });
    }

    render(): React.Node {
      if (this.state.canRender == false) {
        return null;
      }

      return <Component {...this.props} />;
    }
  };
}
