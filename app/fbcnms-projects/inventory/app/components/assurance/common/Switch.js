/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import React from 'react';
import Switch from '@material-ui/core/Switch';

type Props = $ReadOnly<{|
  status: boolean,
|}>;

function SwitchLabels(props: Props) {
  const {status} = props;
  const [state, setState] = React.useState({
    checked: status,
  });

  const handleChange = event => {
    setState({...state, [event.target.name]: event.target.checked});
  };

  return (
    <Switch
      checked={state.checked}
      onChange={handleChange}
      name="checked"
      color="primary"
    />
  );
}
export default SwitchLabels;
