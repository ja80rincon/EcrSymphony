/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {Property} from '../../common/Property';
import type {WithStyles} from '@material-ui/core';
import * as React from 'react';
import FormField from '@fbcnms/ui/components/FormField';
import NodePropertyValue from '../NodePropertyValue';
import {createFragmentContainer, graphql} from 'react-relay';
import {getPropertyValue} from '../../common/Property';
import {withStyles} from '@material-ui/core/styles';

type Props = {|
  property: Property,
|} & WithStyles<typeof styles>;

const styles = theme => ({});

const PropertyFormValue = (props: Props) => {
  const {classes, property} = props;
  const propType = property.propertyType ? property.propertyType : property;
  return propType.type === 'node' && propType.nodeType != null ? (
    <NodePropertyValue type={propType.nodeType} value={property.nodeValue} />
  ) : (
    getPropertyValue(property) ?? ''
  );
};

export default withStyles(styles)(PropertyFormValue);
