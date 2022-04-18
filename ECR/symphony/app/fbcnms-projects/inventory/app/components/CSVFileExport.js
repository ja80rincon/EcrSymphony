/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

import type {CSVFileExportKeyQuery} from './__generated__/CSVFileExportKeyQuery.graphql';
import type {CSVFileExportQuery} from './__generated__/CSVFileExportQuery.graphql';
import type {FiltersQuery} from './comparison_view/ComparisonViewTypes';
import type {WithAlert} from '@fbcnms/ui/components/Alert/withAlert';
import type {WithStyles} from '@material-ui/core';

import Button from '@symphony/design-system/components/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import React, {useState} from 'react';
import RelayEnvironment from '../common/RelayEnvironment';
import axios from 'axios';
import classNames from 'classnames';
import withAlert from '@fbcnms/ui/components/Alert/withAlert';
import {DocumentAPIUrls} from '../common/DocumentAPI';
import {fetchQuery, graphql} from 'relay-runtime';
import {withStyles} from '@material-ui/core/styles';

const styles = {
  exportButton: {
    paddingLeft: '8px',
    paddingRight: '8px',
  },
  exportButtonContainer: {
    display: 'flex',
  },
  exportButtonContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    '& $hiddenContent': {
      maxHeight: '0px',
      overflowY: 'hidden',
    },
  },
  hiddenContent: {},
};

export const csvFileExportQuery = graphql`
  query CSVFileExportQuery($taskId: ID!) {
    task: node(id: $taskId) {
      ... on ExportTask {
        id
        status
        progress
      }
    }
  }
`;

export const csvFileExportKeyQuery = graphql`
  query CSVFileExportKeyQuery($taskId: ID!) {
    task: node(id: $taskId) {
      ... on ExportTask {
        storeKey
      }
    }
  }
`;

const PATH_PREFIX = '/graph/export';
const EXPORT_TASK_REFRESH_INTERVAL_MS = 3000;

type Props = {|
  exportPath: string,
  title: string,
  filters: ?FiltersQuery,
|} & WithStyles<typeof styles> &
  WithAlert;

const CSVFileExport = (props: Props) => {
  const {classes, title, exportPath} = props;
  const [isDownloading, setIsDownloading] = useState(false);
  const [isAsyncTaskInProgress, setIsAsyncTaskInProgress] = useState(false);

  const filters = props.filters?.map(f => {
    if (f.name == 'property') {
      const property = f.propertyValue;
      f.propertyValue = property;
    }
    return f;
  });

  const downloadFile = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', '');
    link.click();
  };

  const handleAsyncExport = (taskId: string, intervalId: IntervalID) => {
    fetchQuery<CSVFileExportQuery>(RelayEnvironment, csvFileExportQuery, {
      taskId,
    }).then(response => {
      if (
        response == null ||
        response.task == null ||
        response.task.status === 'FAILED'
      ) {
        clearInterval(intervalId);
        setIsAsyncTaskInProgress(false);
        props.alert('Failed to export file: File creation error');
        return;
      } else if (response.task.status === 'SUCCEEDED') {
        clearInterval(intervalId);
        setIsAsyncTaskInProgress(false);
        fetchQuery<CSVFileExportKeyQuery>(
          RelayEnvironment,
          csvFileExportKeyQuery,
          {
            taskId,
          },
        ).then(response => {
          if (
            response == null ||
            response.task == null ||
            response.task.storeKey == null
          ) {
            props.alert('Failed to download file');
            return;
          }
          downloadFile(DocumentAPIUrls.get_url(response.task.storeKey));
        });
      }
    });
  };

  const onClick = async () => {
    const path = PATH_PREFIX + exportPath;
    setIsDownloading(true);
    try {
      await axios
        .get(path, {
          params: {
            filters: JSON.stringify(filters),
          },
          responseType: 'blob',
        })
        .then(response => {
          setIsDownloading(false);
          response.data.text().then(text => {
            if (text == null || text === '') {
              return;
            }
            const taskId = JSON.parse(text)['TaskID'];
            if (!isAsyncTaskInProgress) {
              setIsAsyncTaskInProgress(true);
              const intervalId = setInterval(
                () => handleAsyncExport(taskId, intervalId),
                EXPORT_TASK_REFRESH_INTERVAL_MS,
              );
            }
          });
        });
    } catch (error) {
      props.alert(error.response?.data?.error || error);
      setIsDownloading(false);
    }
  };

  return (
    <div className={classes.exportButtonContainer}>
      <Button className={classes.exportButton} variant="text" onClick={onClick}>
        <div className={classes.exportButtonContent}>
          <span
            className={classNames({
              [classes.hiddenContent]: isDownloading || isAsyncTaskInProgress,
            })}>
            {title}
          </span>
          <CircularProgress
            size={24}
            color="inherit"
            className={classNames({
              [classes.hiddenContent]: !isAsyncTaskInProgress,
            })}
          />
        </div>
      </Button>
    </div>
  );
};

export default withStyles(styles)(withAlert(CSVFileExport));
