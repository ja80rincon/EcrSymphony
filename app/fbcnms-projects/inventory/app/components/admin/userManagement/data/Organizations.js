/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 * @flow
 * @format
 */
import type {DeleteOrganizationMutationResponse} from '../../../../mutations/__generated__/DeleteOrganizationMutation.graphql';
import type {EditOrganizationMutationResponse} from '../../../../mutations/__generated__/EditOrganizationMutation.graphql';
import type {OrganizationsQuery} from './__generated__/OrganizationsQuery.graphql';

import AddOrganizationMutation from '../../../../mutations/AddOrganizationMutation';
import DeleteOrganizationMutation from '../../../../mutations/DeleteOrganizationMutation';
import EditOrganizationMutation from '../../../../mutations/EditOrganizationMutation';
import {OrganizationsSearchQuery} from './__generated__/OrganizationsSearchQuery.graphql';
import {getGraphError} from '../../../../common/EntUtils';
import {graphql} from 'relay-runtime';
import {useLazyLoadQuery} from 'react-relay/hooks';

export type Organization = OptionalRefTypeWrapper<organization>;

const organizationsQuery = graphql`
  query OrganizationsQuery {
    organizations {
      edges {
        node {
          ...UserManagementUtils_organization @relay(mask: false)
        }
      }
    }
  }
`;

const organizationQuery = graphql`
  query OrganizationsSearchQuery($orgId: ID!) {
    organization: node(id: $orgId) {
      ... on Organization {
        ...UserManagementUtils_organization @relay(mask: false)
      }
    }
  }
`;

export function useOrganizations(): $ReadOnlyArray<Organization> {
  const data = useLazyLoadQuery<OrganizationsQuery>(organizationsQuery, {});
  const organizationsData = data.organizations?.edges || [];
  return organizationsData.map(p => p.node).filter(Boolean);
}

export function useOrganization(orgId: string): Organization {
  const data = useLazyLoadQuery<OrganizationsSearchQuery>(organizationQuery, {
    orgId,
  });
  return data.organization;
}

export function deleteOrganization(
  orgId: string,
): Promise<DeleteOrganizationMutationResponse> {
  return new Promise<DeleteOrganizationMutationResponse>((resolve, reject) => {
    const callbacks: MutationCallbacks<DeleteOrganizationMutationResponse> = {
      onCompleted: (response, errors) => {
        if (errors && errors[0]) {
          reject(getGraphError(errors[0]));
        }
        resolve(response);
      },
      onError: e => {
        reject(getGraphError(e));
      },
    };

    DeleteOrganizationMutation(
      {
        id: orgId,
      },
      callbacks,
    );
  });
}

//MOCK
export function editOrganization(
  newOrganizationValue: Organization,
): Promise<EditOrganizationMutationResponse> {
  return new Promise<EditOrganizationMutationResponse>((resolve, reject) => {
    const callbacks: MutationCallbacks<EditOrganizationMutationResponse> = {
      onCompleted: (response, errors) => {
        if (errors && errors[0]) {
          reject(getGraphError(errors[0]));
        }
        resolve(response);
      },
      onError: e => {
        reject(getGraphError(e));
      },
    };

    EditOrganizationMutation(
      {
        input: {
          id: newOrganizationValue.id,
          name: newOrganizationValue.name,
          description: newOrganizationValue.description,
        },
      },
      callbacks,
    );
  });
}

export function addOrganization(
  newOrganizationValue: Organization,
): Promise<AddOrganizationMutationResponse> {
  return new Promise<AddOrganizationMutationResponse>((resolve, reject) => {
    const callbacks: MutationCallbacks<AddOrganizationMutationResponse> = {
      onCompleted: (response, errors) => {
        if (errors && errors[0]) {
          reject(getGraphError(errors[0]));
        }
        resolve(response);
      },
      onError: e => {
        reject(getGraphError(e));
      },
    };

    AddOrganizationMutation(
      {
        input: {
          name: newOrganizationValue.name,
          description: newOrganizationValue.description,
        },
      },
      callbacks,
    );
  });
}
