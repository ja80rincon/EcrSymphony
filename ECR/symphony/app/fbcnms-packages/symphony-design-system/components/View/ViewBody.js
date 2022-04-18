/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {CombinedRefs} from '../../hooks/useCombinedRefs';

import * as React from 'react';
import classNames from 'classnames';
import useCombinedRefs from '../../hooks/useCombinedRefs';
import {makeStyles} from '@material-ui/styles';
import {useEffect, useRef, useState} from 'react';

export const SIDE_PADDING = 32;
const scrollWidth = 12;
const useStyles = makeStyles(() => ({
  viewWrapper: {
    flexGrow: 1,
    overflowX: 'hidden',
    overflowY: 'auto',
    display: 'flex',
    '&:not($plain)': {
      padding: `8px ${SIDE_PADDING}px 4px ${SIDE_PADDING}px`,
      '&$withScrollY': {
        paddingRight: `${SIDE_PADDING - scrollWidth}px`,
      },
    },
  },
  withScrollY: {},
  idented: {},
  plain: {},
}));

export const VARIANTS = {
  idented: 'idented',
  plain: 'plain',
};

export type Variant = $Keys<typeof VARIANTS>;

type Props = $ReadOnly<{|
  children: React.Node,
  className?: ?string,
  variant?: ?Variant,
|}>;

const ViewBody = React.forwardRef<Props, HTMLElement>((props, ref) => {
  const {children, className, variant = VARIANTS.idented} = props;
  const classes = useStyles();
  const refs: CombinedRefs = [useRef(null), ref];
  const combinedRef = useCombinedRefs(refs);
  const [hasScrollY, setHasScrollY] = useState(false);

  useEffect(() => {
    window.requestAnimationFrame(() => {
      const element = combinedRef.current;
      setHasScrollY(element && element.scrollHeight > element.offsetHeight);
    });
  });

  return (
    <div
      ref={combinedRef}
      className={classNames(
        {
          [classes.withScrollY]: hasScrollY,
        },
        variant ? classes[variant] : null,
        classes.viewWrapper,
        className,
      )}>
      {children}
    </div>
  );
});

export default ViewBody;
