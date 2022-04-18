// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package activity

type ClockOutReason string

const (
	ClockOutReasonPause            ClockOutReason = "PAUSE"
	ClockOutReasonSubmit           ClockOutReason = "SUBMIT"
	ClockOutReasonSubmitIncomplete ClockOutReason = "SUBMIT_INCOMPLETE"
	ClockOutReasonBlocked          ClockOutReason = "BLOCKED"
)

type ClockDetails struct {
	ClockOutReason *ClockOutReason
	DistanceMeters *float64
	Comment        *string
}
