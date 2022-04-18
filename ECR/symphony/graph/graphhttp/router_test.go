// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package graphhttp

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/log/logtest"
	"github.com/facebookincubator/symphony/pkg/viewer"

	"github.com/gorilla/mux"
	"github.com/stretchr/testify/require"
)

func TestRouter(t *testing.T) {
	cfg := routerConfig{logger: logtest.NewTestLogger(t)}
	cfg.viewer.tenancy = viewer.NewFixedTenancy(&ent.Client{})
	router := newRouter(cfg)

	tests := []struct {
		target, name string
	}{
		{"/query", "root"},
		{"/import/object", "import"},
	}
	for _, tc := range tests {
		req := httptest.NewRequest(http.MethodGet, tc.target, nil)
		var match mux.RouteMatch
		require.True(t, router.Match(req, &match))
		require.NotNil(t, match.Handler)
		require.Equal(t, tc.name, match.Route.GetName())
	}
}
