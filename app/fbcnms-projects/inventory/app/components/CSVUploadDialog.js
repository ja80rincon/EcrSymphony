/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

import type {WithStyles} from '@material-ui/core';

import * as React from 'react';
import AppContext from '@fbcnms/ui/context/AppContext';
import Button from '@symphony/design-system/components/Button';
import CSVFileUpload from './CSVFileUpload';
import CircularProgress from '@material-ui/core/CircularProgress';
import DialogActions from '@material-ui/core/DialogActions';
import DialogConfirm from '@fbcnms/ui/components/DialogConfirm';
import DialogError from '@fbcnms/ui/components/DialogError';
import Text from '@symphony/design-system/components/Text';
import UploadAnywayDialog from '@fbcnms/ui/components/UploadAnywayDialog';
import UploadErrorsList from '@fbcnms/ui/components/UploadErrorsList';
import axios from 'axios';
import fbt from 'fbt';
import {LogEvents, ServerLogger} from '../common/LoggingUtils';
import {UploadAPIUrls} from '../common/UploadAPI';
import {useContext, useState} from 'react';
import {withStyles} from '@material-ui/core/styles';
import {useMainContext} from './MainContext';

type Props = {|mode?: string|} & WithStyles<typeof styles>;

const styles = _ => ({
  uploadContent: {
    padding: '20px',
  },
  link: {
    paddingLeft: '28px',
  },
  link: {
    paddingLeft: '28px',
  },
  circle: {
    display: 'flex',
    justifyContent: 'center',
  },
});

const deprecatedUploadsParams = [
  {
    text: 'Upload Equipment',
    uploadPath: UploadAPIUrls.equipment(),
    entity: 'equipmentDeprecated',
  },
  {
    text: 'Upload Position Def',
    uploadPath: UploadAPIUrls.position_definition(),
    entity: 'positionDef',
  },
  {
    text: 'Upload Port Def',
    uploadPath: UploadAPIUrls.port_definition(),
    entity: 'portDef',
  },
  {
    text: 'Upload Port Connections',
    uploadPath: UploadAPIUrls.port_connect(),
    entity: 'portConnect',
  },
];

const uploadParams = [
  {
    text: 'Upload Locations - deprecated',
    uploadPath: UploadAPIUrls.locations(),
    entity: 'locationDeprecated',
  },
  {
    text: 'Upload Exported Equipment',
    uploadPath: UploadAPIUrls.exported_equipment(),
    entity: 'equipment',
  },
  {
    text: 'Upload Exported Ports',
    uploadPath: UploadAPIUrls.exported_ports(),
    entity: 'port',
  },
  {
    text: 'Upload Exported Links',
    uploadPath: UploadAPIUrls.exported_links(),
    entity: 'link',
  },
  {
    text: 'Upload Exported Locations',
    uploadPath: UploadAPIUrls.exported_locations(),
    entity: 'location',
  },
  {
    text: 'Upload Exported Service',
    uploadPath: UploadAPIUrls.exported_service(),
    entity: 'service',
  },
];

const uploadProjects = [
  {
    text: 'Projects upload',
    uploadPath: UploadAPIUrls.exported_projects(),
    entity: 'exportedProjects',
  },
];

type MessageType = {|
  text: ?string,
  type: ?'success' | 'error' | 'warning',
|};

const CSVUploadDialog = (props: Props) => {
  const {classes} = props;
  const mainContext = useMainContext();
  const loggedInUserID = mainContext.me?.user?.id || '';

  const {mode} = props;

  const [errors, setErrors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [linesToSkip, setLinesToSkip] = useState([]);
  const [entity, setEntity] = useState(null);
  const [files, setFiles] = useState([]);
  const [verifyBeforeCommit, setVerifyBeforeCommit] = useState(false);

  const [messageToDisplay, setMessageToDisplay] = useState<?MessageType>({
    text: null,
    type: null,
  });

  const documentsLink = (path: string) => (
    // $FlowFixMe - use Link
    <Text
      className={classes.link}
      onClick={() =>
        ServerLogger.info(
          LogEvents.DOCUMENTATION_LINK_CLICKED_FROM_EXPORT_DIALOG,
        )
      }>
      <a href={'/docs/docs/' + path}>Go to documentation page</a>
    </Text>
  );
  const fullProjectsUpload = idUser => {
    let tmpPath = '';
    if (window.CONFIG.appData.user.tenant === 'ipt') {
      tmpPath = 'https://portal-web-prod.ipt.pe/main/bulkloadproject';
    } else if (window.CONFIG.appData.user.tenant === 'everis-lab')
      tmpPath = 'https://portal-web-dev.ipt.pe/main/bulkloadproject';

    return (
      <Text className={classes.link}>
        <a href={`${tmpPath}?idUser=${idUser}`}>Full Projects Upload</a>
      </Text>
    );
  };

  const generalEndProcess = () => {
    setIsLoading(false);
    setEntity(null);
    setFiles([]);
  };

  const onSuccess = (msg: string) => {
    setMessageToDisplay({
      text: msg,
      type: 'success',
    });
    generalEndProcess();
  };

  const onFail = (msg: string) => {
    setMessageToDisplay({
      text: msg,
      type: 'error',
    });
    setErrors([]);
    generalEndProcess();
  };

  const onWarning = (msg, errors) => {
    setMessageToDisplay({
      text: msg,
      type: 'warning',
    });
    setIsLoading(false);
    setLinesToSkip(errors);
  };

  const onWarningOnly = (msg: string) => {
    setMessageToDisplay({
      text: msg,
      type: 'warning',
    });
    generalEndProcess();
  };

  const onAbort = () => {
    setMessageToDisplay({
      text: null,
      type: null,
    });
    setErrors([]);
    setLinesToSkip([]);
    generalEndProcess();
  };

  const onContinueAnyway = () => {
    uploadFile(false);
  };

  const getImportScripts = context => {
    if (mode === 'projects') {
      return uploadProjects;
    }
    const deprecatedImportsEnabled =
      context && context.isFeatureEnabled('deprecated_imports');
    return deprecatedImportsEnabled
      ? deprecatedUploadsParams.concat(uploadParams)
      : uploadParams;
  };

  const getUploadPath = currentEntity => {
    const importScripts = getImportScripts();
    const path = importScripts
      .filter(obj => obj.entity == currentEntity)
      .map(obj => obj.uploadPath);
    return path[0];
  };

  const uploadFile = async (verifyBefore, currentFiles, currentEntity) => {
    const config = {
      onUploadProgress: _progressEvent => {
        setIsLoading(true);
        setMessageToDisplay({
          text: null,
          type: null,
        });
      },
      headers: {
        //setting custom CSV file charset from tenant (default utf-8)
        'X-Mime-Charset': window.CONFIG.appData.csvCharset,
      },
    };
    if (currentEntity) {
      setEntity(currentEntity);
    } else {
      currentEntity = entity;
    }
    if (currentFiles) {
      setFiles(currentFiles);
    } else {
      currentFiles = files;
    }
    const uploadPath = getUploadPath(currentEntity);

    const formData = new FormData();
    Array.from(currentFiles).forEach((file, idx) => {
      const name = 'file_' + idx;
      formData.append(name, file);
      idx++;
    });

    formData.append('skip_lines', JSON.stringify(linesToSkip.map(e => e.line)));
    formData.append('verify_before_commit', verifyBefore.toString());

    try {
      const response = await axios.post(uploadPath, formData, config);
      const responseData = response.data;
      const summary = responseData.summary;
      setErrors(responseData.errors ?? []);

      if (summary && summary.successLines === 0 && summary.allLines > 0) {
        onWarningOnly(
          fbt(
            'Uploaded ' +
              fbt.param('number of saved lines', summary.successLines) +
              ' of ' +
              fbt.param('number of all lines', summary.allLines) +
              ' ' +
              fbt.param('type that was saved', currentEntity) +
              ' items. ',
            'message for a Warning import',
          ),
        );
        return;
      }

      if (
        (responseData.errors != null && !verifyBefore) ||
        (responseData.summary.committed && summary.successLines > 0)
      ) {
        onSuccess(
          fbt(
            'Successfully uploaded ' +
              fbt.param('number of saved lines', summary.successLines) +
              ' of ' +
              fbt.param('number of all lines', summary.allLines) +
              ' ' +
              fbt.param('type that was saved', currentEntity) +
              ' items. ',
            'message for a successful import',
          ),
        );
        return;
      }
      if (responseData.errors.length != null && verifyBefore) {
        onWarning(
          fbt(
            'The following ' +
              fbt.param(
                'number of lines',
                responseData.errors.length == 1
                  ? 'line'
                  : responseData.errors.length.toString() + ' lines',
              ) +
              ' can’t be uploaded to Inventory. You can upload the rest of the file or fix the issues and try again.',
            'do you want to abort or continue saving the lines we can',
          ),
          responseData.errors,
        );
        return;
      }
    } catch (error) {
      if (error.response.status === 504 || error.response.status === 502) {
        onFail(
          fbt(
            'File failed to upload as it is too big. Please try upload in smaller chuncks. Some rows may have been uploaded',
            'upload timeout message',
          ),
        );
        return;
      } else {
        const message = error.response?.data;
        onFail(message);
      }
    }
  };

  const onFilePicked = (e, entity) => {
    setErrors([]);
    setFiles([]);
    const f = e.target.files;
    if (!f || f.length === 0) {
      return;
    }

    const verifyBeforeCommit =
      mode === 'projects'
        ? false
        : deprecatedUploadsParams.find(e => e.entity == entity) == null;
    setVerifyBeforeCommit(verifyBeforeCommit);

    uploadFile(verifyBeforeCommit, f, entity);
  };

  const appContext = useContext(AppContext);

  const importScripts = getImportScripts(appContext);
  const fullProjectsEnabled = appContext.isFeatureEnabled('ipt_import_project');

  return isLoading ? (
    <div className={classes.circle}>
      <CircularProgress />
    </div>
  ) : (
    <>
      {documentsLink('csv-upload.html')}
      {messageToDisplay && messageToDisplay.type == 'error' && (
        <DialogError message={messageToDisplay.text} />
      )}
      {messageToDisplay && messageToDisplay.type == 'success' && (
        <>
          <DialogConfirm message={messageToDisplay.text ?? ''} />
          {errors.length + linesToSkip.length > 0 && (
            <UploadErrorsList errors={errors} skipped={linesToSkip} />
          )}
          <DialogActions>
            <Button onClick={onAbort} skin="primary">
              OK
            </Button>
          </DialogActions>
        </>
      )}
      {messageToDisplay && messageToDisplay.type == 'warning' && (
        <>
          <DialogError message={messageToDisplay.text} color={'warning'} />
          <UploadErrorsList errors={errors} />
          {verifyBeforeCommit ? (
            <UploadAnywayDialog onAbort={onAbort} onUpload={onContinueAnyway} />
          ) : (
            <DialogActions>
              <Button onClick={onAbort} skin="primary">
                OK
              </Button>
            </DialogActions>
          )}
        </>
      )}
      {['success', 'warning'].includes(messageToDisplay?.type) ? null : (
        <div className={classes.uploadContent}>
          {importScripts.map(entity => (
            <CSVFileUpload
              key={entity.uploadPath}
              button={<Button variant="text">{entity.text}</Button>}
              entity={entity.entity}
              onFileChanged={(e, entity) => onFilePicked(e, entity)}
              uploadPath={entity.uploadPath}
            />
          ))}
        </div>
      )}
      {fullProjectsEnabled && fullProjectsUpload(loggedInUserID)}
    </>
  );
};

export default withStyles(styles)(CSVUploadDialog);
