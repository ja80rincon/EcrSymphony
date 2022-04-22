/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {OrganizationTypeaheadQuery} from './__generated__/OrganizationTypeaheadQuery.graphql';
import type {Suggestion} from '@fbcnms/ui/components/Typeahead';

import * as React from 'react';
import RelayEnvironment from '../../common/RelayEnvironment.js';
import Typeahead from '@fbcnms/ui/components/Typeahead';
import emptyFunction from '@fbcnms/util/emptyFunction';
import {debounce} from 'lodash';
import {fetchQuery, graphql} from 'relay-runtime';
import {useState} from 'react';

const SEARCH_DEBOUNCE_TIMEOUT_MS = 200;
const DEBOUNCE_CONFIG = {
  trailing: true,
  leading: true,
};

type Props = $ReadOnly<{|
  className?: string,
  required?: boolean,
  headline?: ?string,
  selectedOrganization?: ?{id: string, name: string},
  margin?: ?string,
  onOrganizationSelected: (?{id: string, name: string}) => void,
|}>;

const organizationSearchQuery = graphql`
  query OrganizationTypeaheadQuery(
    $filters: [OrganizationFilterInput!]!
    $limit: Int
  ) {
    organizations(filterBy: $filters, first: $limit) {
      edges {
        node {
          id
          name
          description
        }
      }
    }
  }
`;

const OrganizationTypeahead = ({
  selectedOrganization,
  onOrganizationSelected,
  headline,
  required,
  className,
  margin,
}: Props) => {
  const [suggestions, setSuggestions] = useState<Array<Suggestion>>([]);

  const debounceFetchSuggestions = debounce(
    (searchTerm: string) => fetchNewSuggestions(searchTerm),
    SEARCH_DEBOUNCE_TIMEOUT_MS,
    DEBOUNCE_CONFIG,
  );

  const fetchNewSuggestions = (searchTerm: string) => {
    fetchQuery<OrganizationTypeaheadQuery>(
      RelayEnvironment,
      organizationSearchQuery,
      {
        filters: [
          {
            filterType: 'NAME',
            operator: 'CONTAINS',
            stringValue: searchTerm,
          },
        ],
        limit: 10,
      },
    ).then(response => {
      if (!response || !response.organizations) {
        return;
      }
      setSuggestions(
        response.organizations.edges
          .map(edge => edge.node)
          .filter(Boolean)
          .map(org => ({
            name: org.name,
            entityId: org.id,
            entityType: 'organization',
            type: 'organization',
          })),
      );
    });
  };

  const onSuggestionsFetchRequested = (searchTerm: string) => {
    debounceFetchSuggestions(searchTerm);
  };

  return (
    <div className={className}>
      <Typeahead
        margin={margin}
        required={!!required}
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onEntitySelected={suggestion =>
          onOrganizationSelected({
            id: suggestion.entityId,
            name: suggestion.name,
          })
        }
        onEntriesRequested={emptyFunction}
        onSuggestionsClearRequested={() => onOrganizationSelected(null)}
        placeholder={headline}
        value={
          selectedOrganization
            ? {
                name: selectedOrganization.name,
                entityId: selectedOrganization.id,
                entityType: '',
                type: 'work_order',
              }
            : null
        }
        variant="small"
      />
    </div>
  );
};

export default OrganizationTypeahead;
