// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package kongtoml

import (
	"io"
	"strings"

	"github.com/alecthomas/kong"
	"github.com/pelletier/go-toml"
)

// Loader returns a Resolver that retrieves values from a TOML source.
func Loader(r io.Reader) (kong.Resolver, error) {
	tree, err := toml.LoadReader(r)
	if err != nil {
		return nil, err
	}
	fn := func(_ *kong.Context, _ *kong.Path, flag *kong.Flag) (interface{}, error) {
		key := strings.ReplaceAll(flag.Name, "-", "_")
		return tree.Get(key), nil
	}
	return kong.ResolverFunc(fn), nil
}
