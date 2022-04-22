import * as React from 'react';
import OrganizationsTable from './OrganizationsTable';
import fbt from 'fbt';

export const ORGANIZATION_HEADER = fbt(
  'Organizations',
  'Header for view showing organizations and tenants',
);

export const ORGANIZATION_SUBHEADER = fbt(
  'Create and manage groups and apply policies to them.',
  'Subheader for view showing system groups and organizations',
);

const OrganizationsView = ({ ...rest }) => {
  return <OrganizationsTable {...rest}/>;
}

export default OrganizationsView;
