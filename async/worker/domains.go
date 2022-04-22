// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package worker

type Domain string

// The following strings are domains where different types of automations can be run
const (
	FlowDomainName   Domain = "flow"
	ExportDomainName Domain = "export"
)

func (d Domain) String() string {
	return string(d)
}
