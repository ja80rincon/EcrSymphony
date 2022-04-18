// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package kongtoml_test

import (
	"strings"
	"testing"

	"github.com/alecthomas/kong"
	"github.com/facebookincubator/symphony/pkg/kongtoml"
	"github.com/stretchr/testify/require"
)

func TestLoader(t *testing.T) {
	const doc = `
title = "test"

[log]
level = "info"
format = "json"

[user]
name = "foo"
aliases = ["bar", "baz"]
`
	resolver, err := kongtoml.Loader(strings.NewReader(doc))
	require.NoError(t, err)

	var cli struct {
		Title string
		Log   struct {
			Level  string
			Format string
		} `prefix:"log." embed:""`
		User struct {
			Name    string
			Aliases []string
		} `prefix:"user." embed:""`
	}
	parser, err := kong.New(&cli, kong.Resolvers(resolver))
	require.NoError(t, err)
	_, err = parser.Parse(nil)
	require.NoError(t, err)

	require.Equal(t, "test", cli.Title)
	require.Equal(t, "info", cli.Log.Level)
	require.Equal(t, "json", cli.Log.Format)
	require.Equal(t, "foo", cli.User.Name)
	require.ElementsMatch(t, []string{"bar", "baz"}, cli.User.Aliases)
}
