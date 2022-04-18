// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package ev

import (
	"bytes"
	"context"
	"encoding/gob"
	"encoding/json"
	"errors"
	"reflect"

	"github.com/vmihailenco/msgpack/v5"
)

// Encode is a function type for marshaling/encoding an arbitrary type into
// a slice of bytes.
type Encode func(context.Context, interface{}) ([]byte, error)

// Encode implements encoder interface for Encode functions.
func (f Encode) Encode(ctx context.Context, obj interface{}) ([]byte, error) {
	return f(ctx, obj)
}

// Encoder encodes a particular Go object into a slice of bytes.
type Encoder interface {
	Encode(context.Context, interface{}) ([]byte, error)
}

// NewEncoder returns an encoder that uses fn to encode an object
// of type obj into a slice of bytes.
func NewEncoder(fn Encode) Encoder {
	return fn
}

var (
	// JSONEncoder encodes JSON.
	JSONEncoder = NewEncoder(JSONEncode)

	// GobEncoder encodes gobs.
	GobEncoder = NewEncoder(GobEncode)

	// MsgPackEncoder encodes msg packs.
	MsgPackEncoder = NewEncoder(MsgPackEncode)

	// StringEncoder encodes strings.
	StringEncoder = NewEncoder(StringEncode)

	// BytesEncoder encodes bytes.
	BytesEncoder = NewEncoder(BytesEncode)
)

// JSONEncode can be passed to NewEncoder when encoding JSON.
func JSONEncode(_ context.Context, obj interface{}) ([]byte, error) {
	return json.Marshal(obj)
}

// GobEncode can be passed to NewEncoder when encoding gobs.
func GobEncode(_ context.Context, obj interface{}) ([]byte, error) {
	var b bytes.Buffer
	if err := gob.NewEncoder(&b).Encode(obj); err != nil {
		return nil, err
	}
	return b.Bytes(), nil
}

// MsgPackEncode can be passed to NewEncoder when encoding msg packs.
func MsgPackEncode(_ context.Context, obj interface{}) ([]byte, error) {
	return msgpack.Marshal(obj)
}

// StringEncode encodes a string into raw bytes.
func StringEncode(_ context.Context, obj interface{}) ([]byte, error) {
	s, ok := obj.(string)
	if !ok {
		return nil, errors.New("obj must be a string")
	}
	return []byte(s), nil
}

// BytesEncode returns obj as a slice of bytes.
func BytesEncode(_ context.Context, obj interface{}) ([]byte, error) {
	b, ok := obj.([]byte)
	if !ok {
		return nil, errors.New("obj must be a byte slice")
	}
	return b, nil
}

// Decode is a function type for unmarshaling/decoding a slice of bytes into
// an arbitrary type. Decode functions are used when creating a Decoder via
// NewDecoder.
type Decode func(context.Context, []byte, interface{}) error

// Decoder decodes a slice of bytes into a particular Go object.
type Decoder interface {
	Decode(context.Context, []byte) (interface{}, error)
}

// decoder implements the decoder interface using reflection.
type decoder struct {
	typ    reflect.Type
	decode Decode
}

// NewDecoder returns a Decoder that uses fn to decode a slice of bytes into
// an object of type obj.
func NewDecoder(obj interface{}, fn Decode) Decoder {
	return decoder{
		typ:    reflect.TypeOf(obj),
		decode: fn,
	}
}

// Decode decodes b into a new instance of the target type.
func (d decoder) Decode(ctx context.Context, b []byte) (interface{}, error) {
	v := reflect.New(d.typ)
	if err := d.decode(ctx, b, v.Interface()); err != nil {
		return nil, err
	}
	return v.Elem().Interface(), nil
}

var (
	// StringDecoder decodes into strings.
	StringDecoder = NewDecoder("", StringDecode)

	// BytesDecoder copies the slice of bytes.
	BytesDecoder = NewDecoder([]byte{}, BytesDecode)
)

// JSONDecode can be passed to NewDecoder when decoding JSON.
func JSONDecode(_ context.Context, data []byte, obj interface{}) error {
	return json.Unmarshal(data, obj)
}

// GobDecode can be passed to NewDecoder when decoding gobs.
func GobDecode(_ context.Context, data []byte, obj interface{}) error {
	return gob.NewDecoder(bytes.NewReader(data)).Decode(obj)
}

// MsgPackDecode can be passed to NewDecoder when decoding msg packs.
func MsgPackDecode(_ context.Context, data []byte, obj interface{}) error {
	return msgpack.Unmarshal(data, obj)
}

// StringDecode decodes raw bytes b into a string.
func StringDecode(_ context.Context, b []byte, obj interface{}) error {
	v, ok := obj.(*string)
	if !ok {
		return errors.New("obj must be a string ptr")
	}
	*v = string(b)
	return nil
}

// BytesDecode copies the slice of bytes b into obj.
func BytesDecode(_ context.Context, b []byte, obj interface{}) error {
	v, ok := obj.(*[]byte)
	if !ok {
		return errors.New("obj must be a byte slice ptr")
	}
	*v = b
	return nil
}
