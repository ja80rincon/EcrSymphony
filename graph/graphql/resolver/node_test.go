// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolver_test

import (
	"encoding/json"
	"testing"

	"github.com/99designs/gqlgen/client"
	"github.com/stretchr/testify/require"
	"github.com/vektah/gqlparser/v2/gqlerror"
)

func TestQueryNode(t *testing.T) {
	resolver := newTestResolver(t)
	defer resolver.Close()
	c := resolver.GraphClient()

	var lt struct{ AddLocationType struct{ ID string } }
	c.MustPost(`mutation { addLocationType(input: {name: "City"}) { id } }`, &lt)

	var l struct{ AddLocation struct{ ID string } }
	c.MustPost(
		`mutation($type: ID!) { addLocation(input: {name: "TLV", type: $type}) { id } }`,
		&l, client.Var("type", lt.AddLocationType.ID),
	)

	t.Run("LocationType", func(t *testing.T) {
		var rsp struct{ Node struct{ Name string } }
		c.MustPost(
			`query($id: ID!) { node(id: $id) { ... on LocationType { name } } }`,
			&rsp,
			client.Var("id", lt.AddLocationType.ID),
		)
		require.Equal(t, "City", rsp.Node.Name)
	})
	t.Run("Location", func(t *testing.T) {
		var rsp struct{ Location struct{ Name string } }
		c.MustPost(
			`query($id: ID!) { location: node(id: $id) { ... on Location { name } } }`,
			&rsp,
			client.Var("id", l.AddLocation.ID),
		)
		require.Equal(t, "TLV", rsp.Location.Name)
	})
	t.Run("NonExistent", func(t *testing.T) {
		var rsp struct{ Node struct{ ID string } }
		err, ok := c.Post(`query { node(id: "-1") { id } }`, &rsp).(client.RawJsonError)
		require.True(t, ok)
		var errs gqlerror.List
		require.NoError(t, json.Unmarshal(err.RawMessage, &errs))
		require.Equal(t, "Could not resolve to a node with the global id of '-1'", errs[0].Message)
		require.Equal(t, "NOT_FOUND", errs[0].Extensions["code"])
	})
}
