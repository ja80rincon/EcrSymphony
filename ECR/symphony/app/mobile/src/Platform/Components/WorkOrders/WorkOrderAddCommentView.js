/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

'use strict';

import Button from '@fbcmobile/ui/Components/Core/Button';
import NavigationService from '@fbcmobile/ui/Services/NavigationService';
import React, {useState} from 'react';
import Spinner from 'react-native-spinkit';
import fbt from 'fbt';
import nullthrows from '@fbcmobile/ui/Utils/nullthrows';
import {Colors} from '@fbcmobile/ui/Theme';
import {StyleSheet, TextInput, View} from 'react-native';
import {submitComment} from 'Platform/Components/WorkOrders/WorkOrderUtils';
import {useNetInfo} from '@react-native-community/netinfo';

type Props = $ReadOnly<{|
  +workOrderId: string,
  +onUserSubmittedComment: () => void,
|}>;

const WorkOrderAddCommentView = ({
  workOrderId,
  onUserSubmittedComment,
}: Props) => {
  const [commentText, setCommentText] = useState<?string>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const netInfo = useNetInfo();
  const isDisabled =
    isSubmitting ||
    !netInfo.isConnected ||
    commentText == null ||
    commentText.trim() === '';

  const onSubmitComment = async () => {
    setIsSubmitting(true);
    try {
      await submitComment(workOrderId, nullthrows(commentText))
        .then(() => {
          setCommentText(null);
          onUserSubmittedComment();
        })
        .catch(() => {
          NavigationService.alert(
            'error',
            fbt(
              'Error submitting comment',
              'Error message title shown when submitting a new comment failed.',
            ),
            fbt(
              'There was an error submitting the comment, please try again later',
              'Error message shown when submitting a new comment failed.',
            ),
          );
        });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.root}>
      <View style={styles.inputContainer}>
        <TextInput
          value={commentText ?? ''}
          editable={!isSubmitting}
          placeholder={fbt(
            'Write a comment...',
            'Placeholder for writing a new comment',
          ).toString()}
          multiline={true}
          numberOfLines={4}
          style={styles.textInput}
          onChangeText={(text: string) => setCommentText(text)}
        />
      </View>
      {isSubmitting ? (
        <Spinner size={24} color={Colors.Blue} type={'ThreeBounce'} />
      ) : (
        <Button
          style={styles.sendButton}
          variant="text"
          disabled={isDisabled}
          onPress={onSubmitComment}>
          <fbt desc="Comment submit button">Send</fbt>
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  inputContainer: {
    flex: 1,
  },
  sendButton: {
    paddingHorizontal: 0,
    flex: 0,
    flexBasis: 70,
  },
  textInput: {
    alignItems: 'flex-start',
  },
});

export default WorkOrderAddCommentView;
