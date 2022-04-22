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

import type {ExpressRequest, ExpressResponse} from 'express';
import type {FeatureID} from '@fbcnms/types/features';

import {DEV_MODE} from '../src/config';
import {Organization} from '@fbcnms/sequelize-models';
import {arrayConfigs, isFeatureEnabled} from '@fbcnms/platform-server/features';

const express = require('express');

async function fetchFeatures() {
  const organizations = await Organization.findAll();
  const features = {};
  for (const org of organizations) {
    const reqInfo = {
      isDev: DEV_MODE,
      organization: org.name,
    };
    const results = await Promise.all(
      arrayConfigs.map(async (config): Promise<?FeatureID> => {
        const enabled = await isFeatureEnabled(reqInfo, config.id, org.name);
        return !!enabled ? config.id : null;
      }),
    );
    features[org.name] = results.filter(Boolean);
  }
  return features;
}

const app = express<ExpressRequest, ExpressResponse>();

app.get('/features', async (req, res) => {
  const features = await fetchFeatures();
  res.send(features);
});

export default app;
