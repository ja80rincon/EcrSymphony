/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

import type {CSVFileExportKeyQuery} from '../__generated__/CSVFileExportKeyQuery.graphql';
import type {CSVFileExportQuery} from '../__generated__/CSVFileExportQuery.graphql';
import type {WithAlert} from '@fbcnms/ui/components/Alert/withAlert';

import Button from '@symphony/design-system/components/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import GetAppIcon from '@material-ui/icons/GetApp';
import React, {useState} from 'react';
import RelayEnvironment from '../../common/RelayEnvironment';
import axios from 'axios';
import withAlert from '@fbcnms/ui/components/Alert/withAlert';
import {DocumentAPIUrls} from '../../common/DocumentAPI';
import {UploadAPIUrls} from '../../common/UploadAPI';
import {csvFileExportKeyQuery, csvFileExportQuery} from '../CSVFileExport';
import {fetchQuery} from 'relay-runtime';
import {makeStyles} from '@material-ui/styles';
import {useEnqueueSnackbar} from '@fbcnms/ui/hooks/useSnackbar';

const useStyles = makeStyles(_theme => ({
  exportButton: {
    minWidth: 'unset',
    paddingTop: '2px',
    height: '36px',
    marginRight: '12px',
  },
  circularProgress: {
    display: 'block',
    margin: '6px 12px auto auto',
  },
}));

const PATH = UploadAPIUrls.exported_work_order();
const EXPORT_TASK_REFRESH_INTERVAL_MS = 3000;
const EXPORT_TASK_MAX_POLLS = 50;

const downloadFile = (url: string) => {
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', '');
  link.click();
};

type Props = $ReadOnly<{|
  id: string,
|}> &
  WithAlert;

const WorkOrderExportButton = (props: Props) => {
  const {id} = props;
  const classes = useStyles();
  const enqueueSnackbar = useEnqueueSnackbar();
  const [isAsyncTaskInProgress, setIsAsyncTaskInProgress] = useState(false);

  const handleError = error =>
    enqueueSnackbar(error.response?.data?.error || error, {variant: 'error'});

  let polls = 0;
  const handleAsyncExport = (
    taskId: string,
    workOrderId: string,
    intervalId: IntervalID,
  ) => {
    polls++;
    fetchQuery<CSVFileExportQuery>(RelayEnvironment, csvFileExportQuery, {
      taskId,
    }).then(response => {
      if (
        response == null ||
        response.task == null ||
        response.task.status === 'FAILED' ||
        polls === EXPORT_TASK_MAX_POLLS
      ) {
        clearInterval(intervalId);
        setIsAsyncTaskInProgress(false);
        props.alert(
          polls === EXPORT_TASK_MAX_POLLS
            ? 'Failed to export file: Your data is too large'
            : 'Failed to export file: File creation error',
        );
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
    try {
      await axios
        .get(PATH, {
          params: {
            id: id,
          },
          responseType: 'blob',
        })
        .then(response =>
          response.data.text().then(text => {
            if (text == null || text === '') {
              return;
            }
            const taskId = JSON.parse(text)['TaskID'];
            if (!isAsyncTaskInProgress) {
              setIsAsyncTaskInProgress(true);
              const intervalId = setInterval(
                () => handleAsyncExport(taskId, id, intervalId),
                EXPORT_TASK_REFRESH_INTERVAL_MS,
              );
            }
          }),
        );
    } catch (error) {
      setIsAsyncTaskInProgress(false);
      handleError(error);
    }
  };

  return (
    (!isAsyncTaskInProgress && (
      <Button
        variant="text"
        skin="gray"
        className={classes.exportButton}
        onClick={onClick}>
        <GetAppIcon />
      </Button>
    )) || (
      <CircularProgress
        className={classes.circularProgress}
        size={22}
        color="inherit"
      />
    )
  );
};

export default withAlert(WorkOrderExportButton);
