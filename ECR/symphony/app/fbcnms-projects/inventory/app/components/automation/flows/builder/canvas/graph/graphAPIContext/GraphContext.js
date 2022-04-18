/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */
'use strict';

import type {Graph} from '../facades/Graph';
import type {GraphCoreAPI} from './graphCoreAPI';
import type {GraphDisplayAPI} from './graphDisplayAPI';
import type {GraphEventsAPI} from './graphEventsAPI';
import type {GraphGettersAPI} from './graphGettersAPI';
import type {IBlock} from '../shapes/blocks/BaseBlock';
import type {IConnector} from '../shapes/connectors/BaseConnector';
import type {IShapesFactory} from '../shapes/ShapesFactory';
import type {Paper} from '../facades/Paper';
import type {Position} from '../facades/Helpers';
import type {TRefObjectFor} from '@symphony/design-system/types/TRefFor.flow';

import * as React from 'react';
import graphCoreAPIProvider from './graphCoreAPI';
import graphDisplayAPIProvider from './graphDisplayAPI';
import graphEventsAPIProvider from './graphEventsAPI';
import graphGettersAPIProvider from './graphGettersAPI';
import {useContext, useRef} from 'react';

export type GraphContextType = {
  ...GraphCoreAPI,
  ...GraphEventsAPI,
  ...GraphGettersAPI,
  ...GraphDisplayAPI,
};

const dummy = {current: null};

const GraphContextDefaults = Object.assign(
  {},
  graphCoreAPIProvider(dummy),
  graphEventsAPIProvider(dummy),
  graphGettersAPIProvider(dummy),
  graphDisplayAPIProvider(dummy),
);

const GraphContext = React.createContext<GraphContextType>(
  GraphContextDefaults,
);

type Props = $ReadOnly<{|
  children: React.Node,
|}>;

export type FlowWrapper = {|
  +graph: Graph,
  +paper: Paper,
  +blocks: Map<string, IBlock>,
  +connectors: Map<string, IConnector>,
  +shapesFactory: IShapesFactory,
  paperScale: number,
  paperTranslation: Position,
  paperIsLocked: boolean,
|};

export type FlowWrapperReference = TRefObjectFor<?FlowWrapper>;

export function GraphContextProvider(props: Props) {
  const {children} = props;
  const flowWrapper = useRef<?FlowWrapper>();

  const value = Object.assign(
    {},
    graphCoreAPIProvider(flowWrapper),
    graphEventsAPIProvider(flowWrapper),
    graphGettersAPIProvider(flowWrapper),
    graphDisplayAPIProvider(flowWrapper),
  );

  return (
    <GraphContext.Provider value={value}>{children}</GraphContext.Provider>
  );
}

export function useGraph() {
  return useContext(GraphContext);
}

export default GraphContext;
