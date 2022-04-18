// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package worker

import (
	"context"
	"fmt"

	"github.com/facebookincubator/symphony/pkg/viewer"
)

// GetGlobalWorkflowID return workflow id that is cross tenants
func GetGlobalWorkflowID(ctx context.Context, runID int) string {
	v := viewer.FromContext(ctx)
	return fmt.Sprintf("%s/%d", v.Tenant(), runID)
}
