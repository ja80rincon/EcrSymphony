// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package enum_test

import (
	"fmt"
	"reflect"
	"strconv"
	"strings"
	"testing"

	"github.com/99designs/gqlgen/graphql"
	"github.com/facebook/ent/schema/field"
	"github.com/facebookincubator/symphony/pkg/ent/schema/enum"
	"github.com/stretchr/testify/require"
)

type color string

const (
	red   color = "red"
	green color = "green"
)

func (c color) String() string {
	return string(c)
}

func (c *color) Set(s string) {
	*c = color(s)
}

func (color) Values() []string {
	return []string{
		red.String(),
		green.String(),
	}
}

func TestMarshalGQL(t *testing.T) {
	var b strings.Builder
	err := enum.MarshalGQL(&b, red)
	require.NoError(t, err)
	str := b.String()
	require.True(t, strings.HasPrefix(str, `"`))
	require.True(t, strings.HasSuffix(str, `"`))
	str, err = strconv.Unquote(str)
	require.NoError(t, err)
	require.EqualValues(t, red, str)
}

func TestUnmarshalGQL(t *testing.T) {
	t.Run("Valid", func(t *testing.T) {
		var c color
		err := enum.UnmarshalGQL("green", &c)
		require.NoError(t, err)
		require.Equal(t, green, c)
	})
	t.Run("BadType", func(t *testing.T) {
		var c color
		err := enum.UnmarshalGQL(5, &c)
		require.EqualError(t, err, "enums must be strings")
	})
	t.Run("BadValue", func(t *testing.T) {
		var c color
		err := enum.UnmarshalGQL("blue", &c)
		require.EqualError(t, err, "blue is not a valid *enum_test.color")
	})
}

func TestEnum(t *testing.T) {
	enums := []interface {
		field.EnumValues
		enum.Getter
		graphql.Marshaler
	}{
		enum.CheckListItemType(""),
		enum.CheckListItemEnumSelectionMode(""),
		enum.FutureState(""),
	}
	for _, e := range enums {
		e := e
		name := fmt.Sprintf("%T", e)
		if idx := strings.LastIndex(name, "."); idx != -1 {
			name = name[idx+1:]
		}
		t.Run(name, func(t *testing.T) {
			setter, ok := reflect.New(reflect.TypeOf(e)).
				Interface().(enum.Setter)
			require.True(t, ok)
			for _, value := range e.Values() {
				setter.Set(value)
				want, ok := reflect.ValueOf(setter).Elem().
					Interface().(graphql.Marshaler)
				require.True(t, ok)
				var b strings.Builder
				want.MarshalGQL(&b)
				unmarshaller := reflect.New(reflect.TypeOf(e)).
					Interface().(graphql.Unmarshaler)
				str, err := strconv.Unquote(b.String())
				require.NoError(t, err)
				err = unmarshaller.UnmarshalGQL(str)
				require.NoError(t, err)
				got := reflect.ValueOf(unmarshaller).Elem().Interface()
				require.Equal(t, want, got)
			}
		})
	}
}
