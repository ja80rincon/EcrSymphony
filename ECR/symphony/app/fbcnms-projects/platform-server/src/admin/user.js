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

export async function createUser(
  tenant: string,
  email: string,
  admin: boolean,
): Promise<void> {
  const tenantId = await getTenantID(tenant);
  const mutation = gql`
    mutation CreateUser($tenantId: ID!, $authId: String!, $role: UserRole) {
      upsertUser(
        input: {
          tenantId: $tenantId
          authId: $authId
          role: $role
          status: ACTIVE
        }
      ) {
        user {
          authId
          role
        }
      }
    }
  `;
  const user = await client
    .request(mutation, {
      tenantId: tenantId,
      authId: email,
      role: admin ? 'ADMIN' : 'USER',
    })
    .then(data => data.upsertUser.user);
  logger.info(
    `created user: tenant=${tenant}, email=${user.authId}, role=${user.role}`,
  );
}

async function deactivateUser(tenantId: string, email: string): Promise<void> {
  const mutation = gql`
    mutation DeactivateUser($tenantId: ID!, $authId: String!) {
      upsertUser(
        input: {tenantId: $tenantId, authId: $authId, status: DEACTIVATED}
      ) {
        user {
          authId
        }
      }
    }
  `;
  await client.request(mutation, {
    tenantId: tenantId,
    authId: email,
  });
}

export async function deactivateUsers(
  tenant: string,
  emails: Array<string>,
): Promise<void> {
  const tenantId = await getTenantID(tenant);
  await Promise.all(
    emails.map(email =>
      deactivateUser(tenantId, email).then(_ =>
        logger.info(`deactivated user: tenant=${tenant}, email=${email}`),
      ),
    ),
  );
}
