/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

import type {WithAlert} from '@fbcnms/ui/components/Alert/withAlert';
import type {WithStyles} from '@material-ui/core';

import * as React from 'react';
import WarningIcon from '@material-ui/icons/Warning';

import Text from '@symphony/design-system/components/Text';
import {withStyles} from '@material-ui/core/styles';
import withAlert from '@fbcnms/ui/components/Alert/withAlert';
import IconButton from '@symphony/design-system/components/IconButton';
import symphony from '@symphony/design-system/theme/symphony';
import {DeleteIcon, EditIcon} from '@symphony/design-system/icons';

type Props = {
  children: React.Node,
  onError?: ?(error: Error) => void,
} & WithAlert &
  WithStyles<typeof styles>;

type State = {
  error: ?Error,
};

const styles = {
  root: {
    padding: '8px',
    display: 'flex',
    alignItems: 'center',
  },
  errorIcon: {
    marginRight: '8px',
  },
  warningText: {
    paddingTop: '12px',
    paddingBottom: '12px',
    display: 'inherit',
  },
  iconButton: {
    marginRight: '16px',
    color: symphony.palette.Y600,
  },
  bgWarningColor: {
    position: 'relative',

    '&:after': {
      content: '""',
      width: '100%',
      height: '100%',
      backgroundColor: symphony.palette.Y600,
      opacity: 0.2,
      position: 'absolute',
      top: 0,
      left: 0,
      zIndex: 1,
    },
  },
  borderWarningColor: {
    border: '1px solid',
    borderColor: symphony.palette.Y600,
    borderRadius: '4px',
    padding: '18px',
    marginTop: '18px',
    marginBottom: '18px',
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    zIndex: 2,
  },
};

class ErrorBoundaryStyle extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {error: null};
  }

  componentDidCatch(error: Error) {
    this.setState({
      error: error,
    });
    this.props.onError && this.props.onError(error);
    this.onModalError();
  }
  onModalError = () => {
    this.props
      .alert(
        <div className={this.props.classes.bgWarningColor}>
          <div className={this.props.classes.borderWarningColor}>
            <WarningIcon
              size="small"
              className={this.props.classes.iconButton}
            />

            <div>
              <Text
                variant="subtitle1"
                useEllipsis={true}
                color={'regular'}
                weight={'bold'}>
                Warning
              </Text>
              <Text
                variant="subtitle1"
                useEllipsis={false}
                color={'regular'}
                className={this.props.classes.warningText}>
                You are trying to sort by elements you are not allowed to see.
                Please include a filter by template before sorting
              </Text>
            </div>
          </div>
        </div>,
        'Accept',
      )
      .then(confirm => {
        window.location.reload(false);
      });
  };

  render() {
    const {classes} = this.props;
    if (this.state.error) {
      return <div className={classes.root}></div>;
    }
    return this.props.children;
  }
}

export default withAlert(withStyles(styles)(ErrorBoundaryStyle));
