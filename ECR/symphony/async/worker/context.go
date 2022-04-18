// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package worker

import (
	"context"
	"fmt"
	"strings"

	"github.com/AlekSi/pointer"
	"github.com/facebookincubator/symphony/pkg/authz"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/privacy"
	"github.com/facebookincubator/symphony/pkg/ent/user"
	"github.com/facebookincubator/symphony/pkg/log"
	"github.com/facebookincubator/symphony/pkg/viewer"
	"go.uber.org/cadence/workflow"
	"go.uber.org/zap"
)

// implements workflow.ContextPropagator that is an interface that determines what information from
// context to pass along
type contextPropagator struct {
	tenancy viewer.Tenancy
}

type ctxKey struct{}

type workflowViewer struct {
	Tenant         string
	UserName       *string
	AutomationName *string
	Role           string
	Features       *string
}

// NewContext returns a new context with the given Viewer attached.
func NewWorkflowContext(ctx workflow.Context, v viewer.Viewer) workflow.Context {
	wfv := workflowViewer{
		Tenant: v.Tenant(),
		Role:   v.Role().String(),
	}
	if _, ok := v.(*viewer.UserViewer); ok {
		wfv.UserName = pointer.ToString(v.Name())
	} else {
		wfv.AutomationName = pointer.ToString(v.Name())
	}
	features := v.Features()
	if len(features) != 0 {
		wfv.Features = pointer.ToString(features.String())
	}
	return workflow.WithValue(ctx, ctxKey{}, wfv)
}

// NewContextPropagator returns context propagator based on given tenancy
func NewContextPropagator(tenancy viewer.Tenancy) workflow.ContextPropagator {
	return contextPropagator{tenancy: tenancy}
}

// Inject injects information from a Go Context into headers
func (contextPropagator) Inject(ctx context.Context, hw workflow.HeaderWriter) error {
	v := viewer.FromContext(ctx)
	if v == nil {
		return fmt.Errorf("viewer is nil")
	}
	hw.Set(viewer.TenantHeader, []byte(v.Tenant()))
	if _, ok := v.(*viewer.UserViewer); ok {
		hw.Set(viewer.UserHeader, []byte(v.Name()))
	} else {
		hw.Set(viewer.AutomationHeader, []byte(v.Name()))
	}
	hw.Set(viewer.RoleHeader, []byte(v.Role().String()))
	features := v.Features()
	if len(features) != 0 {
		hw.Set(viewer.FeaturesHeader, []byte(features.String()))
	}
	return nil
}

// Extract extracts context information from headers and returns a context
// object
func (cp contextPropagator) Extract(ctx context.Context, hr workflow.HeaderReader) (context.Context, error) {
	headers := make(map[string]string)
	if err := hr.ForEachKey(func(s string, bytes []byte) error {
		headers[s] = string(bytes)
		return nil
	}); err != nil {
		return nil, err
	}
	tenant, ok := headers[viewer.TenantHeader]
	if !ok {
		return nil, fmt.Errorf("missing tenant header")
	}
	client, err := cp.tenancy.ClientFor(ctx, tenant)
	if err != nil {
		return nil, fmt.Errorf("cannot get tenancy client. tenant: %s", tenant)
	}
	ctx = ent.NewContext(ctx, client)

	var (
		opts = make([]viewer.Option, 0, 1)
		v    viewer.Viewer
	)
	if features, ok := headers[viewer.FeaturesHeader]; ok {
		opts = append(opts, viewer.WithFeatures(strings.Split(features, ",")...))
	}
	if authID, ok := headers[viewer.UserHeader]; ok {
		client := ent.FromContext(ctx).User
		u, err := client.Query().
			Where(user.AuthID(authID)).
			Only(privacy.DecisionContext(ctx, privacy.Allow))
		if err != nil {
			return nil, fmt.Errorf("failed to find user. authID: %s", authID)
		}
		v = viewer.NewUser(tenant, u, opts...)
	} else if automation, ok := headers[viewer.AutomationHeader]; ok {
		roleHeader, ok := headers[viewer.RoleHeader]
		if !ok {
			return nil, fmt.Errorf("missing role header")
		}
		role := user.Role(roleHeader)
		if err := user.RoleValidator(role); err != nil {
			return nil, fmt.Errorf("invalid role. role: %s", role)
		}
		v = viewer.NewAutomation(tenant, automation, role, opts...)
	} else {
		return nil, fmt.Errorf("failed to find entity header")
	}
	ctx = log.NewFieldsContext(ctx, zap.Object("viewer", v))
	ctx = viewer.NewContext(ctx, v)
	permissions, err := authz.Permissions(authz.NewContext(ctx, authz.AdminPermissions()))
	if err != nil {
		return ctx, fmt.Errorf("cannot get permissions. tenant: %s, viewer: %s", tenant, v.Name())
	}
	return authz.NewContext(ctx, permissions), nil
}

// InjectFromWorkflow injects information from workflow context into headers
func (contextPropagator) InjectFromWorkflow(ctx workflow.Context, hw workflow.HeaderWriter) error {
	wfv, ok := ctx.Value(ctxKey{}).(workflowViewer)
	if !ok {
		return fmt.Errorf("workflow viewer not found in context")
	}
	hw.Set(viewer.TenantHeader, []byte(wfv.Tenant))
	switch {
	case wfv.UserName != nil:
		hw.Set(viewer.UserHeader, []byte(*wfv.UserName))
	case wfv.AutomationName != nil:
		hw.Set(viewer.AutomationHeader, []byte(*wfv.AutomationName))
	default:
		return fmt.Errorf("no user or automation viewer found")
	}
	hw.Set(viewer.RoleHeader, []byte(wfv.Role))
	if wfv.Features != nil {
		hw.Set(viewer.FeaturesHeader, []byte(*wfv.Features))
	}
	return nil
}

// ExtractToWorkflow extracts context information from headers and returns
// a workflow context
func (contextPropagator) ExtractToWorkflow(ctx workflow.Context, hr workflow.HeaderReader) (workflow.Context, error) {
	wfv := workflowViewer{}
	if err := hr.ForEachKey(func(s string, bytes []byte) error {
		switch s {
		case viewer.TenantHeader:
			wfv.Tenant = string(bytes)
		case viewer.UserHeader:
			wfv.UserName = pointer.ToString(string(bytes))
		case viewer.AutomationHeader:
			wfv.AutomationName = pointer.ToString(string(bytes))
		case viewer.RoleHeader:
			wfv.Role = string(bytes)
		case viewer.FeaturesHeader:
			wfv.Features = pointer.ToString(string(bytes))
		}
		return nil
	}); err != nil {
		return nil, fmt.Errorf("failed to construct workflow viewer: %w", err)
	}
	return workflow.WithValue(ctx, ctxKey{}, wfv), nil
}
