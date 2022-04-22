// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package cmd

import (
	"context"

	"go.uber.org/zap"
)

// Context is a command execution context.
type Context struct {
	context.Context
	*zap.Logger
}
