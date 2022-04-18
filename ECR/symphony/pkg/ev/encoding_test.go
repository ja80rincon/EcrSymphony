// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package ev_test

import (
	"context"
	"testing"

	"github.com/facebookincubator/symphony/pkg/ev"
	"github.com/stretchr/testify/require"
)

func TestEncoding(t *testing.T) {
	type message struct {
		I int
		S string
	}
	ctx := context.Background()
	msg := &message{42, t.Name()}
	tests := []struct {
		name string
		obj  interface{}
		ev.Encoder
		ev.Decoder
	}{
		{
			name:    "JSON",
			obj:     msg,
			Encoder: ev.JSONEncoder,
			Decoder: ev.NewDecoder(msg, ev.JSONDecode),
		},
		{
			name:    "Gob",
			obj:     msg,
			Encoder: ev.GobEncoder,
			Decoder: ev.NewDecoder(msg, ev.GobDecode),
		},
		{
			name:    "MsgPack",
			obj:     msg,
			Encoder: ev.MsgPackEncoder,
			Decoder: ev.NewDecoder(msg, ev.MsgPackDecode),
		},
		{
			name:    "String",
			obj:     "foo",
			Encoder: ev.StringEncoder,
			Decoder: ev.StringDecoder,
		},
		{
			name:    "Bytes",
			obj:     []byte("bar"),
			Encoder: ev.BytesEncoder,
			Decoder: ev.BytesDecoder,
		},
	}
	for _, tc := range tests {
		tc := tc
		t.Run(tc.name, func(t *testing.T) {
			b, err := tc.Encode(ctx, tc.obj)
			require.NoError(t, err)
			obj, err := tc.Decode(ctx, b)
			require.NoError(t, err)
			require.Equal(t, tc.obj, obj)
		})
	}
}
