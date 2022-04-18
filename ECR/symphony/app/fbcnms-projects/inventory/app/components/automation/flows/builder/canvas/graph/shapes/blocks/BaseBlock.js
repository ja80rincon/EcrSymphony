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

import type {IConnector} from '../connectors/BaseConnector';
import type {ILinkModel} from '../../facades/shapes/edges/Link';
import type {
  IVertexModel,
  IVertexView,
  VertexPort,
} from '../../facades/shapes/vertexes/BaseVertext';
import type {Paper} from '../../facades/Paper';

import BaseConnector from '../connectors/BaseConnector';
import {DISPLAY_SETTINGS} from '../../utils/helpers';
import {PORTS_GROUPS} from '../../facades/shapes/vertexes/BaseVertext';
import {V} from 'jointjs';

const DUPLICATION_SHIFT = {
  x: 84,
  y: 84,
};

const selectionHighlighting = {
  highlighter: {
    name: 'addClass',
    options: {
      className: DISPLAY_SETTINGS.classes.isSelected,
    },
  },
};

export interface IBlock {
  +id: string;
  +select: () => void;
  +deselect: () => void;
  +model: IVertexModel;
  +view: IVertexView;
  +type: string;
  +name: string;
  +isSelected: boolean;
  +getPorts: () => $ReadOnlyArray<VertexPort>;
  +getInputPort: () => ?VertexPort;
  +getOutputPorts: () => $ReadOnlyArray<VertexPort>;
  +getPortByID: (portID: string) => ?VertexPort;
  +setName: string => void;
  +outConnectors: Array<IConnector>;
  +addConnector: (
    sourcePort: ?(string | number),
    target: IBlock,
    model?: ?ILinkModel,
  ) => ?IConnector;
  +removeConnector: IConnector => void;
  +addToGraph: () => void;
  +copy: () => IBlock;
  +clone: () => IBlock;
}

export default class BaseBlock implements IBlock {
  paper: Paper;
  model: IVertexModel;
  view: IVertexView;
  type: string;
  name: string;
  isSelected: boolean;
  id: string;
  outConnectors: Array<IConnector>;
  isInGraph: boolean = false;

  constructor(model: IVertexModel, paper: Paper, addToGraph: boolean = true) {
    this.paper = paper;
    this.model = model;

    this.outConnectors = [];

    this.name = model.attributes.attrs.label.text;

    if (addToGraph) {
      this.addToGraph();
    }

    this.type = model.attributes.type;
    this.id = model.id;
  }

  setName(newName: string) {
    this.name = newName;
    this.model.attr('label/text', newName);
  }

  select() {
    this.isSelected = true;

    this.view.highlight(undefined, selectionHighlighting);
  }

  deselect() {
    this.isSelected = false;

    this.view.unhighlight(undefined, selectionHighlighting);
  }

  getPorts(): $ReadOnlyArray<VertexPort> {
    return this.model.attributes.ports.items;
  }

  getInputPort(): ?VertexPort {
    return this.getPorts().find(p => p.group === PORTS_GROUPS.INPUT);
  }

  getOutputPorts(): $ReadOnlyArray<VertexPort> {
    return this.getPorts().filter(p => p.group === PORTS_GROUPS.OUTPUT);
  }

  getPortByID(portID: string): ?VertexPort {
    return this.getPorts().find(p => p.id === portID);
  }

  removeConnector(connector: IConnector) {
    const index = this.outConnectors.findIndex(con => con.id === connector.id);
    if (index < 0) {
      return;
    }

    connector.model.remove();
    delete this.outConnectors[index];
  }

  addConnector(
    sourcePort: ?(string | number),
    target: IBlock,
    model?: ?ILinkModel,
  ) {
    const targetPort = target.getInputPort();
    if (targetPort == null) {
      return;
    }

    const outputPorts = this.getOutputPorts();

    const index =
      sourcePort != null
        ? typeof sourcePort === 'number'
          ? sourcePort
          : outputPorts.findIndex(p => p.id === sourcePort)
        : outputPorts.findIndex(
            (_p, pIndex) => this.outConnectors[pIndex] == null,
          );
    if (index < 0) {
      return;
    }

    const connector = new BaseConnector(
      this.paper,
      {
        source: this,
        sourcePort: outputPorts[index].id,
        target,
        targetPort: targetPort.id,
      },
      model,
      this.isInGraph,
    );

    this.outConnectors[index] = connector;

    return connector;
  }

  addToGraph() {
    if (this.isInGraph) {
      return;
    }

    const graph = this.paper.model;
    this.model.addTo(graph);

    this.updateView();

    this.isInGraph = true;
  }

  updateView() {
    const view = this.paper.findViewByModel(this.model);
    if (isVertexView(view)) {
      this.view = view;
    }

    V(this.view.el).addClass(DISPLAY_SETTINGS.classes.defaultBlock);
  }

  copy() {
    return this.clone(false);
  }

  clone(addToGraph?: boolean = true) {
    const clonedModel = this.model.clone();
    clonedModel.position(
      this.model.attributes.position.x + DUPLICATION_SHIFT.x,
      this.model.attributes.position.y + DUPLICATION_SHIFT.y,
    );

    const clonedBlock = new BaseBlock(clonedModel, this.paper, addToGraph);
    clonedBlock.setName(this.name);

    return clonedBlock;
  }
}

function isVertexView(v): %checks {
  return !!v.portContainerMarkup;
}
