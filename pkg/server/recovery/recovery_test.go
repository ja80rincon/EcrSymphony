// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package recovery_test

import (
	"context"
	"errors"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/facebookincubator/symphony/pkg/server/recovery"
	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/require"
)

type testRecoverer struct {
	mock.Mock
}

func (tr *testRecoverer) HandlePanic(ctx context.Context, p interface{}) error {
	args := tr.Called(ctx, p)
	return args.Error(0)
}

func TestRecoveryHandler(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()
	err := errors.New("bad handler")

	var recoverer testRecoverer
	recoverer.On("HandlePanic", ctx, err).
		Return(err).
		Once()
	defer recoverer.AssertExpectations(t)

	handler := &recovery.Handler{
		Handler: http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			panic(err)
		}),
		HandlerFunc: recoverer.HandlePanic,
	}
	req := httptest.NewRequest(http.MethodGet, "/", nil).WithContext(ctx)
	rec := httptest.NewRecorder()
	handler.ServeHTTP(rec, req)

	require.Equal(t, http.StatusInternalServerError, rec.Code)
	require.EqualError(t, err, strings.TrimSuffix(rec.Body.String(), "\n"))
}
