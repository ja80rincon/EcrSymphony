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

import {client, getTenantID} from './client';
import {gql} from 'graphql-request';

const logger = require('@fbcnms/logging').getLogger(module);

export type Feature = {
  name: string,
  tenant: string,
  enabled: boolean,
};

export async function getFeatures(tenant: string): Promise<Array<Feature>> {
  const query = gql`
    query GetTenantFeatures($name: String!) {
      tenant(name: $name) {
        name
        features {
          name
          enabled
        }
      }
    }
  `;
  return await client.request(query, {name: tenant}).then(data => {
    const tenant = data.tenant;
    return tenant.features.map(feature => ({
      name: feature.name,
      tenant: tenant.name,
      enabled: feature.enabled,
    }));
  });
}

export async function createFeature(
  name: string,
  tenant: string,
  enabled: boolean,
): Promise<void> {
  const tenantId = await getTenantID(tenant);
  const mutation = gql`
    mutation CreateFeature($name: String!, $tenantId: ID!, $enabled: Boolean!) {
      createFeature(
        input: {name: $name, enabled: $enabled, tenants: [$tenantId]}
      ) {
        features {
          name
          enabled
          tenant {
            name
          }
        }
      }
    }
  `;
  const feature = await client
    .request(mutation, {
      name: name,
      tenantId: tenantId,
      enabled: enabled,
    })
    .then(data => data.createFeature.features[0]);
  logger.info(
    `created feature: name=${feature.name}, tenant=${feature.tenant.name}, enabled=${feature.enabled}`,
  );
}

async function getFeatureID(name: string, tenant: string): Promise<string> {
  const query = gql`
    query GetFeatureID($tenant: String!, $feature: String!) {
      tenant(name: $tenant) {
        features(filterBy: {names: [$feature]}) {
          id
        }
      }
    }
  `;
  return await client
    .request(query, {tenant: tenant, feature: name})
    .then(data => data.tenant.features[0].id);
}

export async function updateFeature(
  name: string,
  tenant: string,
  enabled: boolean,
): Promise<void> {
  const featureId = await getFeatureID(name, tenant);
  const mutation = gql`
    mutation UpdateFeature($id: ID!, $enabled: Boolean!) {
      updateFeature(input: {id: $id, enabled: $enabled}) {
        feature {
          name
          enabled
          tenant {
            name
          }
        }
      }
    }
  `;
  const feature = await client
    .request(mutation, {id: featureId, enabled: enabled})
    .then(data => data.updateFeature.feature);
  logger.info(
    `updated feature: name=${feature.name}, tenant=${feature.tenant.name}, enabled=${feature.enabled}`,
  );
}

export async function deleteFeature(
  name: string,
  tenant: string,
): Promise<void> {
  const featureId = await getFeatureID(name, tenant);
  const mutation = gql`
    mutation DeleteFeature($id: ID!) {
      deleteFeature(input: {id: $id}) {
        clientMutationId
      }
    }
  `;
  await client.request(mutation, {id: featureId});
}
