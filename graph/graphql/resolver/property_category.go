// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolver

import (
	"context"

	"github.com/facebookincubator/symphony/pkg/ent"
)

type propertyCategoryResolver struct{}

func (p propertyCategoryResolver) NumberOfProperties(ctx context.Context, obj *ent.PropertyCategory) (*int, error) {
	count, err := obj.QueryPropertiesType().Count(ctx)
	if err != nil {
		return nil, err
	}
	return &count, nil
}
