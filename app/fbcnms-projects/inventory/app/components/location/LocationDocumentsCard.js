/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {
  LocationDocumentsCard_location$data,
  LocationDocumentsCard_location$key,
} from './__generated__/LocationDocumentsCard_location.graphql';
import type {CategoryItem} from '../DocumentsAddButton';

import AddHyperlinkButton from '../AddHyperlinkButton';
import Card from '@symphony/design-system/components/Card/Card';
import CardHeader from '@symphony/design-system/components/Card/CardHeader';
import DocumentsAddButton from '../DocumentsAddButton';
import EntityDocumentsTable from '../EntityDocumentsTable';
import InventoryStrings from '../../common/InventoryStrings';
import React, {useMemo} from 'react';
import classNames from 'classnames';
import {graphql, useFragment} from 'react-relay/hooks';
import {makeStyles} from '@material-ui/styles';

const useStyles = makeStyles(_theme => ({
  cardHasNoContent: {
    marginBottom: '0px',
  },
  actionButtonsContainer: {
    '&>*': {
      marginLeft: '8px',
    },
  },
}));

type Props = $ReadOnly<{|
  className?: string,
  location: LocationDocumentsCard_location$key,
|}>;

const LocationDocumentsCard = (props: Props) => {
  const {className, location} = props;
  const classes = useStyles();

  const data: LocationDocumentsCard_location$data = useFragment(
    graphql`
      fragment LocationDocumentsCard_location on Location {
        id
        images {
          ...EntityDocumentsTable_files
        }
        files {
          ...EntityDocumentsTable_files
        }
        hyperlinks {
          ...EntityDocumentsTable_hyperlinks
        }
        locationType {
          documentCategories {
            id
            name
          }
        }
      }
    `,
    location,
  );
  const documents = useMemo(
    () => [...data.files.filter(Boolean), ...data.images.filter(Boolean)],
    [data],
  );
  const categories = useMemo(
    () => [...data.locationType.documentCategories.map((item: any) => ({id: item.id, name: item.name}))],
    [data],
  );
  return (
    <Card className={className}>
      <CardHeader
        className={classNames({
          [classes.cardHasNoContent]: documents.length === 0,
        })}
        rightContent={
          <div className={classes.actionButtonsContainer}>
            <AddHyperlinkButton
              entityType="LOCATION"
              entityId={data.id}
              categories={categories}
            />
            <DocumentsAddButton
              entityType="LOCATION"
              entityId={data.id}
              categories={categories}
            />
          </div>
        }>
        {InventoryStrings.documents.viewHeader}
      </CardHeader>
      <EntityDocumentsTable
        entityType="LOCATION"
        entityId={data.id}
        files={documents}
        hyperlinks={data.hyperlinks}
      />
    </Card>
  );
};

export default LocationDocumentsCard;
