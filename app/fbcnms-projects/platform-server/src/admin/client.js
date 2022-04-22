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

import {ADMIN_HOST} from '../config';
import {GraphQLClient, gql} from 'graphql-request';

export const client = new GraphQLClient(`http://${ADMIN_HOST}/query`);

export async function getTenantID(name: string): Promise<string> {
  const query = gql`
    query GetTenantID($name: String!) {
      tenant(name: $name) {
        id
      }
    }
  `;
  const data = await client.request(query, {name: name});
  return data.tenant.id;
}
