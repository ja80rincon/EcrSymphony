/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {Location} from '../common/Location';

import 'react-perfect-scrollbar/dist/css/styles.css';
import * as React from 'react';
import InventoryTreeNode from './InventoryTreeNode';
import PerfectScrollbar from 'react-perfect-scrollbar';
import RelayEnvironment from '../common/RelayEnvironment';
import Text from '@symphony/design-system/components/Text';
import {FormContextProvider} from '../common/FormContext';
import {fetchQuery, graphql} from 'relay-runtime';
import {makeStyles} from '@material-ui/styles';
import {useMemo, useState} from 'react';

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    paddingTop: '20px',
    display: 'flex',
    flexGrow: 1,
    flexDirection: 'column',
    overflow: 'hidden',
    height: '100%',
  },
  treeContainer: {
    backgroundColor: theme.palette.common.white,
    display: 'flex',
    flexDirection: 'column',
    flexBasis: 0,
    flexGrow: 1,
    overflowY: 'auto',
  },
  headerRoot: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    paddingTop: '6px',
    paddingBottom: '6px',
    paddingLeft: '24px',
  },
  titleContainer: {
    paddingRight: '24px',
    marginLeft: '24px',
  },
  title: {
    display: 'block',
    fontWeight: 'bold',
    fontSize: '16px',
  },
  subtitle: {
    color: theme.palette.gray13,
  },
  panel: {
    width: '100%',
    paddingRight: 0,
    paddingLeft: 0,
    '&:before': {
      opacity: 0,
    },
  },
  headerContainer: {
    display: 'flex',
    flexGrow: 1,
  },
  addLocationToRootTitle: {
    color: theme.palette.text.secondary,
    flexGrow: 1,
    fontSize: '12px',
    lineHeight: '14px',
  },
  dummyContainer: {
    alignItems: 'center',
    display: 'flex',
    marginRight: '24px',
    width: '100%',
  },
}));

const locationHierarchyQuery = graphql`
  query InventoryTreeViewLocationHierarchyQuery($locationId: ID!) {
    location: node(id: $locationId) {
      ... on Location {
        locationHierarchy {
          id
        }
      }
    }
  }
`;

type Props = $ReadOnly<{|
  /** The root nodes to render as a tree view */
  tree: Location[],
  /** Title to be displayed **/
  title?: string,
  /** Subtitle to be displayed **/
  subtitle?: string,
  /** Content to the right on the title **/
  dummyRootTitle?: ?string,
  /** Callback function fired when a tree leaf is clicked. */
  onClick: ?(any) => void,
  /** Will be shown on the right of every node on hover. */
  getHoverRightContent: ?(Object) => ?React.Node,
  selectedId: ?string,
|}>;

const InventoryTreeView = (props: Props) => {
  const {
    tree,
    title,
    subtitle,
    dummyRootTitle,
    selectedId,
    getHoverRightContent,
  } = props;
  const classes = useStyles();
  const [locationHierarchy, setLocationHierarchy] = useState([]);

  useMemo(() => {
    if (selectedId === null) {
      setLocationHierarchy([]);
      return;
    }
    fetchQuery(RelayEnvironment, locationHierarchyQuery, {
      locationId: selectedId,
    }).then(data =>
      setLocationHierarchy(data.location.locationHierarchy.map(l => l.id)),
    );
  }, [selectedId]);

  const renderDummyTitleNode = (dummyNodeTitle: string) => {
    const hoverRightContent =
      getHoverRightContent && getHoverRightContent(null);
    return (
      <div className={classes.headerRoot} key={'dummy_node'}>
        <div className={classes.headerContainer}>
          <div className={classes.dummyContainer}>
            <Text className={classes.addLocationToRootTitle}>
              {dummyNodeTitle}
            </Text>
            {hoverRightContent}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={classes.root}>
      <div className={classes.titleContainer}>
        <Text className={classes.title}>{title}</Text>
        <Text className={classes.subtitle} variant="subtitle2">
          {subtitle}
        </Text>
      </div>
      <div className={classes.treeContainer}>
        <PerfectScrollbar>
          <FormContextProvider
            permissions={{
              entity: 'location',
              action: 'create',
              ignoreTypes: true,
            }}>
            <div>
              {dummyRootTitle !== null && dummyRootTitle !== undefined
                ? renderDummyTitleNode(dummyRootTitle)
                : null}
              {tree.map(location => (
                <InventoryTreeNode
                  key={location.id}
                  element={location}
                  selectedHierarchy={locationHierarchy}
                  onClick={props.onClick}
                  parent={null}
                  depth={0}
                  getHoverRightContent={getHoverRightContent}
                />
              ))}
            </div>
          </FormContextProvider>
        </PerfectScrollbar>
      </div>
    </div>
  );
};

export default InventoryTreeView;
