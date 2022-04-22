// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package model

import (
	"encoding/base64"
	"fmt"
	"io"
	"strconv"

	"github.com/vmihailenco/msgpack/v5"
	"go.uber.org/zap/zapcore"
)

// ID combines tenant name with an ent id.
type ID struct {
	Tenant string `msgpack:"t"`
	ID     int    `msgpack:"i,omitempty"`
}

// String returns the textual representation of an id.
func (id ID) String() string {
	b, _ := msgpack.Marshal(id)
	return base64.RawStdEncoding.EncodeToString(b)
}

// MarshalGQL implements graphql.Marshaler interface.
func (id ID) MarshalGQL(w io.Writer) {
	_, _ = io.WriteString(w, strconv.Quote(id.String()))
}

// UnmarshalGQL implements graphql.Unmarshaler interface.
func (id *ID) UnmarshalGQL(v interface{}) error {
	s, ok := v.(string)
	if !ok {
		return fmt.Errorf("id %T must be a string", v)
	}
	b, err := base64.RawStdEncoding.DecodeString(s)
	if err != nil {
		return fmt.Errorf("cannot decode id: %w", err)
	}
	if err := msgpack.Unmarshal(b, id); err != nil {
		return fmt.Errorf("cannot unmarshal id: %w", err)
	}
	return nil
}

// MarshalLogObject implements zapcore.ObjectMarshaler interface.
func (id ID) MarshalLogObject(enc zapcore.ObjectEncoder) error {
	enc.AddString("tenant", id.Tenant)
	enc.AddInt("id", id.ID)
	return nil
}
