/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {IBlockType} from '../../canvas/graph/shapes/blocks/blockTypes/BaseBlockType';

import Button from '@symphony/design-system/components/Button';
import React, {useCallback} from 'react';
import Text from '@symphony/design-system/components/Text';
import classNames from 'classnames';
import useDragAndDropHandler from '../../../utils/useDragAndDropHandler';
import {makeStyles} from '@material-ui/styles';
import {useEnqueueSnackbar} from '@fbcnms/ui/hooks/useSnackbar';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '32px',
  },
  header: {
    textTransform: 'uppercase',
    minHeight: '20px',
    marginBottom: '16px',
  },
  body: {},
  blockType: {
    width: '100%',
    height: '48px',
    padding: '0',
    display: 'flex',
    justifyContent: 'flex-start',
    cursor: 'move',

    '& > span': {
      width: '100%',
    },
    '&:not(:last-child)': {
      marginBottom: '16px',
    },
  },
}));

export type BlocksCategoryProps = $ReadOnly<{|
  header: string,
  blockTypes: $ReadOnlyArray<IBlockType>,
  collapsed: boolean,
|}>;

export default function BlocksCategory(props: BlocksCategoryProps) {
  const {header, blockTypes, collapsed} = props;
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.header}>
        {!collapsed && (
          <Text variant="overline" color="gray">
            {header}
          </Text>
        )}
      </div>
      <div className={classes.body}>
        {blockTypes.map((blockType, index) => (
          <Block
            key={index}
            blockType={blockType}
            className={classNames(classes.blockType)}
          />
        ))}
      </div>
    </div>
  );
}

type BlockProps = $ReadOnly<{|
  blockType: IBlockType,
  className: string,
|}>;

function Block(props: BlockProps) {
  const {blockType, className} = props;
  const PresentationComponent = blockType.presentationComponent;

  const enqueueSnackbar = useEnqueueSnackbar();

  const callCreateBlock = useCallback(
    (position, translateClientCoordinates) => {
      try {
        blockType.createBlock(position, translateClientCoordinates);
      } catch (err) {
        enqueueSnackbar(err, {variant: 'error'});
      }
    },
    [blockType, enqueueSnackbar],
  );

  const onDrop = useCallback(
    (clientX, clientY) => {
      const position = {
        x: clientX,
        y: clientY,
      };
      callCreateBlock(position, true);
    },
    [callCreateBlock],
  );
  const onClick = useCallback(() => {
    callCreateBlock();
  }, [callCreateBlock]);

  const dragAndDropHandler = useDragAndDropHandler(
    PresentationComponent,
    onDrop,
    onClick,
  );

  return (
    <Button
      skin="regular"
      className={className}
      onMouseDown={dragAndDropHandler}>
      <PresentationComponent />
    </Button>
  );
}
