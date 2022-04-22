// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package strutil

// Stringer adds String method to a basic string.
type Stringer string

// String implements fmt.Stringer interface.
func (s Stringer) String() string {
	return string(s)
}
