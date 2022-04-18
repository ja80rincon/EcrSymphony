/**
 * Copyright 2004-present Facebook. All Rights Reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

const types = {
  sendEditRule: 'send - editRule',
};

const initialStore = {
  rule: {
    id: '',
    name: '',
    status: '',
    gracePeriod: '',
    additionalInfo: '',
    specificProblem: '',
    eventTypeName: '',
    startDateTime: '',
    endDateTime: '',
    thresholdId: '',
    thresholdName: '',
    eventSeverityId: '',
    ruleLimit: [],
  },
};

const ThresholdReducer = (state, action) => {
  switch (action.type) {
    case types.sendEditRule:
      return {
        ...state,
        rule: action.payload,
      };
    default:
      return state;
  }
};

export {initialStore, types};
export default ThresholdReducer;
