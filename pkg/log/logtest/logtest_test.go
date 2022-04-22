// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package logtest_test

import (
	"context"
	"testing"

	"github.com/facebookincubator/symphony/pkg/log/logtest"
	"github.com/stretchr/testify/require"
	"go.uber.org/zap"
)

func TestLogger(t *testing.T) {
	require.Implements(t, (*logtest.TestingT)(nil), &testing.T{})
	require.Implements(t, (*logtest.TestingT)(nil), &testing.B{})
	logger := logtest.NewTestLogger(t)
	require.Equal(t, logger.Background(), logger.For(context.Background()))
}

func TestLoggerWithObserver(t *testing.T) {
	logger, observer := logtest.NewTestLogger(t).WithObserver(zap.InfoLevel)
	const msg = "logger with observer"
	logger.Background().Info(msg)
	require.Equal(t, 1, observer.FilterMessage(msg).Len())
}
