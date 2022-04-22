// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolver

import (
	"context"
	"time"

	"github.com/facebookincubator/symphony/pkg/ent"
)

type surveyResolver struct{}

func ts2int(t time.Time) int {
	return int(t.Unix())
}

func tsptr2intptr(t *time.Time) *int {
	if t != nil {
		ts := ts2int(*t)
		return &ts
	}
	return nil
}

func (surveyResolver) CreationTimestamp(_ context.Context, s *ent.Survey) (*int, error) {
	return tsptr2intptr(s.CreationTimestamp), nil
}

func (surveyResolver) CompletionTimestamp(_ context.Context, s *ent.Survey) (int, error) {
	return ts2int(s.CompletionTimestamp), nil
}

func (surveyResolver) LocationID(ctx context.Context, obj *ent.Survey) (int, error) {
	return obj.QueryLocation().OnlyID(ctx)
}

type surveyCellScanResolver struct{}

func (surveyCellScanResolver) Timestamp(_ context.Context, scs *ent.SurveyCellScan) (ts *int, _ error) {
	return tsptr2intptr(scs.Timestamp), nil
}

type surveyWiFiScanResolver struct{}

func (surveyWiFiScanResolver) Timestamp(_ context.Context, sws *ent.SurveyWiFiScan) (int, error) {
	return ts2int(sws.Timestamp), nil
}
