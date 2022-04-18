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

export async function createTenant(name: string): Promise<void> {
  const mutation = gql`
    mutation CreateTenant($name: String!) {
      createTenant(input: {name: $name}) {
        tenant {
          name
        }
      }
    }
  `;
  const tenant = await client
    .request(mutation, {name: name})
    .then(data => data.createTenant.tenant);
  logger.info(`created tenant: name=${tenant.name}`);
}

export async function deleteTenant(name: string): Promise<void> {
  const id = await getTenantID(name);
  const mutation = gql`
    mutation DeleteTenant($id: ID!) {
      deleteTenant(input: {id: $id}) {
        clientMutationId
      }
    }
  `;
  await client.request(mutation, {id: id});
  logger.info(`deleted tenant: name=${name}`);
}
