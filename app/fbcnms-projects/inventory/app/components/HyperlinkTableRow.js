/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {AppContextType} from '@fbcnms/ui/context/AppContext';
import type {HyperlinkTableRow_hyperlink} from './__generated__/HyperlinkTableRow_hyperlink.graphql';
import type {WithStyles} from '@material-ui/core';
import type {DocumentCategoryNode} from '../common/LocationType';

import AppContext from '@fbcnms/ui/context/AppContext';
import DateTimeFormat from '../common/DateTimeFormat.js';
import HyperlinkTableMenu from './HyperlinkTableMenu';
import InsertLinkIcon from '@material-ui/icons/InsertLink';
import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import classNames from 'classnames';
import symphony from '@symphony/design-system/theme/symphony';
import {createFragmentContainer, graphql} from 'react-relay';
import {withStyles} from '@material-ui/core/styles';

import FormField from '@symphony/design-system/components/FormField/FormField';
import Select from '@symphony/design-system/components/Select/Select';
import Strings from '../common/InventoryStrings';

const styles = () => ({
  cell: {
    height: '48px',
    ...symphony.typography.caption,
  },
  nameCell: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  secondaryCell: {
    color: symphony.palette.D400,
  },
  thumbnail: {
    marginRight: '20px',
    display: 'flex',
    alignItems: 'center',
  },
  icon: {
    fontSize: '24px',
    width: '32px',
  },
  moreIcon: {
    fill: symphony.palette.D400,
  },
});

type Props = {|
  entityId: string,
  hyperlink: HyperlinkTableRow_hyperlink,
  categories: $ReadOnlyArray<DocumentCategoryNode>,
  onChecked: any,
  linkToLocationOptions?: boolean,
|} & WithStyles<typeof styles>;

type State = {
  isImageDialogOpen: boolean,
  isChecked: boolean,
  selectValue: DocumentCategoryNode,
};

class HyperlinkTableRow extends React.Component<Props, State> {
  static contextType = AppContext;
  context: AppContextType;

  constructor(props: Props) {
    super(props);
    this.state = {
      isImageDialogOpen: false,
      isChecked: false,
      selectValue: {id: '', name: ''},
    };
  }

  handleInputChangeLink = () => {
    this.setState({isChecked: !this.state.isChecked}, () => {
      if (this.state.isChecked) {
        if (this.props.onChecked)
          this.props.onChecked({type: 'checkIncrement'});
        if (this.state.selectValue !== '') {
          if (this.props.onChecked)
            this.props.onChecked({
              type: 'valueIncrement',
              link: this.props.hyperlink,
              value: this.state.selectValue,
            });
        }
      } else {
        if (this.props.onChecked)
          this.props.onChecked({type: 'checkDecrement'});
        if (this.state.selectValue !== '') {
          if (this.props.onChecked)
            this.props.onChecked({
              type: 'valueDecrement',
              link: this.props.hyperlink,
              value: this.state.selectValue,
            });
        }
      }
    });
  };

  render() {
    const _setCategory = (value: DocumentCategoryNode) => {
      if (this.props.onChecked) {
        this.props.onChecked({
          type: 'valueIncrement',
          link: this.props.hyperlink,
          value: value,
        });
      }
    };
    const categoriesEnabled = this.context.isFeatureEnabled('file_categories');
    const {classes, hyperlink, entityId, categories} = this.props;
    if (hyperlink === null) {
      return null;
    }
    return (
      <TableRow key={hyperlink.id} hover={false}>
        {categoriesEnabled && (
          <TableCell padding="none" component="th" scope="row">
            {hyperlink?.documentCategory?.name || hyperlink?.category}
          </TableCell>
        )}
        <TableCell
          padding="none"
          component="th"
          scope="row"
          className={classes.cell}>
          <a
            className={classes.nameCell}
            href={hyperlink.url}
            target="_blank"
            title={hyperlink.url}>
            <div className={classes.thumbnail}>
              <InsertLinkIcon color="primary" className={classes.icon} />
            </div>
            {hyperlink.displayName || hyperlink.url}
          </a>
        </TableCell>
        <TableCell className={classes.cell} />
        <TableCell className={classes.cell} />
        <TableCell
          padding="none"
          className={classNames(classes.cell, classes.secondaryCell)}
          component="th"
          scope="row">
          {hyperlink.createTime &&
            DateTimeFormat.dateTime(hyperlink.createTime)}
        </TableCell>
        {this.props.linkToLocationOptions && (
          <TableCell
            padding="none"
            className={classNames(classes.cell, classes.secondaryCell)}
            component="th"
            scope="row">
            <input type="checkbox" onChange={this.handleInputChangeLink} />
          </TableCell>
        )}
        {this.props.linkToLocationOptions && (
          <TableCell
            padding="none"
            className={classNames(classes.cell, classes.secondaryCell)}
            component="th"
            scope="row">
            <FormField label="" disabled={!this.state.isChecked}>
              <Select
                options={categories.map(category => ({
                  key: category.id,
                  value: category,
                  label: category.name || '',
                }))}
                onChange={value => {
                  this.setState(
                    {selectValue: value || {id: '', name: ''}},
                    () => {
                      _setCategory(this.state.selectValue);
                    },
                  );
                }}
                selectedValue={
                  this.state.isChecked ? this.state.selectValue : ''
                }
              />
            </FormField>
          </TableCell>
        )}
        <TableCell
          padding="none"
          className={classes.cell}
          scope="row"
          align="right"
          component="th">
          <HyperlinkTableMenu entityId={entityId} hyperlink={hyperlink} />
        </TableCell>
      </TableRow>
    );
  }
}

export default withStyles(styles)(
  createFragmentContainer(HyperlinkTableRow, {
    hyperlink: graphql`
      fragment HyperlinkTableRow_hyperlink on Hyperlink {
        id
        category
        url
        displayName
        createTime
        documentCategory{
          id
          name
        }
        ...HyperlinkTableMenu_hyperlink
      }
    `,
  }),
);
