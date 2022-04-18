// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package resolver

import (
	"context"
	"fmt"
	"math"
	"strconv"
	"sync"

	"github.com/AlekSi/pointer"
	"github.com/facebookincubator/symphony/graph/graphql/models"
	"github.com/facebookincubator/symphony/pkg/ctxgroup"
	"github.com/facebookincubator/symphony/pkg/ent"
	"github.com/facebookincubator/symphony/pkg/ent/equipment"
	"github.com/facebookincubator/symphony/pkg/ent/file"
	"github.com/facebookincubator/symphony/pkg/ent/location"
	"golang.org/x/sync/semaphore"
)

type locationTypeResolver struct{}

func (r locationTypeResolver) DocumentCategories(ctx context.Context, obj *ent.LocationType) ([]*ent.DocumentCategory, error) {
	return obj.QueryDocumentCategory().All(ctx)
}

func (locationTypeResolver) NumberOfLocations(ctx context.Context, obj *ent.LocationType) (int, error) {
	return obj.QueryLocations().Count(ctx)
}

func (locationTypeResolver) Locations(ctx context.Context, typ *ent.LocationType, enforceHasLatLong *bool) (*ent.LocationConnection, error) {
	query := typ.QueryLocations()
	if pointer.GetBool(enforceHasLatLong) {
		query = query.Where(location.LatitudeNEQ(0), location.LongitudeNEQ(0))
	}
	return query.Paginate(ctx, nil, nil, nil, nil)
}

type locationResolver struct{}

func (r locationResolver) ParentCoords(ctx context.Context, obj *ent.Location) (*models.Coordinates, error) {
	var err error
	parent := obj
	for parent != nil {
		locLat, locLong := parent.Latitude, parent.Longitude
		if locLat != 0 || locLong != 0 {
			return &models.Coordinates{Latitude: locLat, Longitude: locLong}, nil
		}
		parent, err = parent.QueryParent().Only(ctx)
		if ent.MaskNotFound(err) != nil {
			return nil, err
		}
	}
	return nil, nil
}

func (locationResolver) NumChildren(ctx context.Context, location *ent.Location) (int, error) {
	if children, err := location.Edges.ChildrenOrErr(); !ent.IsNotLoaded(err) {
		return len(children), err
	}
	return location.QueryChildren().Count(ctx)
}

func (locationResolver) filesOfType(ctx context.Context, location *ent.Location, typ file.Type) ([]*ent.File, error) {
	fds, err := location.Edges.FilesOrErr()
	if ent.IsNotLoaded(err) {
		return location.QueryFiles().
			Where(file.TypeEQ(typ)).
			All(ctx)
	}
	files := make([]*ent.File, 0, len(fds))
	for _, f := range fds {
		if f.Type == typ {
			files = append(files, f)
		}
	}
	return files, nil
}

func (r locationResolver) Images(ctx context.Context, location *ent.Location) ([]*ent.File, error) {
	return r.filesOfType(ctx, location, file.TypeImage)
}

func (r locationResolver) Files(ctx context.Context, location *ent.Location) ([]*ent.File, error) {
	return r.filesOfType(ctx, location, file.TypeFile)
}

type topologist struct {
	equipment sync.Map
	links     sync.Map
	sem       *semaphore.Weighted
	maxDepth  int
}

func (*topologist) rootNode(ctx context.Context, eq *ent.Equipment) *ent.Equipment {
	parent := eq
	for parent != nil {
		p, err := parent.QueryParentPosition().QueryParent().Only(ctx)
		if err != nil {
			break
		}
		parent = p
	}
	return parent
}

func (t *topologist) nestedNodes(ctx context.Context, eq *ent.Equipment, depth int) ([]*ent.Equipment, error) {
	if depth >= 5 {
		return nil, nil
	}

	posEqs, err := eq.QueryPositions().QueryAttachment().All(ctx)
	if err != nil {
		return nil, fmt.Errorf("cannot query posistion attachments: %w", err)
	}

	posEqs = append(posEqs, eq)
	for _, posEq := range posEqs {
		nestedEqs, err := t.nestedNodes(ctx, posEq, depth+1)
		if err != nil {
			return nil, err
		}
		posEqs = append(posEqs, nestedEqs...)
	}

	return posEqs, nil
}

func (*topologist) hkey(id1, id2 int) string {
	if id2 > id1 {
		id1, id2 = id2, id1
	}
	return strconv.Itoa(id1) + ":" + strconv.Itoa(id2)
}

func (t *topologist) build(ctx context.Context, eq *ent.Equipment, depth int) error {
	if err := t.sem.Acquire(ctx, 1); err != nil {
		return err
	}
	defer t.sem.Release(1)

	t.equipment.Store(eq.ID, eq)
	if depth >= t.maxDepth {
		return nil
	}

	subTree, err := t.nestedNodes(ctx, eq, 0)
	if err != nil {
		return fmt.Errorf("cannot query nested equipment: %w", err)
	}

	g := ctxgroup.WithContext(ctx)
	for _, neq := range subTree {
		leqs, err := neq.QueryPorts().
			QueryLink().
			QueryPorts().
			QueryParent().
			Where(equipment.IDNEQ(eq.ID)).
			All(ctx)
		if err != nil {
			return fmt.Errorf("cannot query equipment links: %w", err)
		}

		for _, leq := range leqs {
			root := t.rootNode(ctx, leq)
			key := t.hkey(eq.ID, root.ID)
			value := &models.TopologyLink{Type: models.TopologyLinkTypePhysical, Source: eq, Target: root}
			if _, loaded := t.links.LoadOrStore(key, value); !loaded {
				g.Go(func(ctx context.Context) error {
					return t.build(ctx, root, depth+1)
				})
			}
		}
	}
	return g.Wait()
}

func (t *topologist) topology() *models.NetworkTopology {
	var nodes []ent.Noder
	t.equipment.Range(func(_, value interface{}) bool {
		nodes = append(nodes, value.(*ent.Equipment))
		return true
	})
	var links []*models.TopologyLink
	t.links.Range(func(_, value interface{}) bool {
		links = append(links, value.(*models.TopologyLink))
		return true
	})
	return &models.NetworkTopology{Nodes: nodes, Links: links}
}

// Need to deal with positions
func (locationResolver) Topology(ctx context.Context, loc *ent.Location, depth int) (*models.NetworkTopology, error) {
	eqs, err := loc.QueryEquipment().All(ctx)
	if err != nil {
		return nil, fmt.Errorf("cannot query location root equipment: %w", err)
	}

	t := &topologist{
		sem:      semaphore.NewWeighted(32),
		maxDepth: depth,
	}
	g := ctxgroup.WithContext(ctx)
	for _, eq := range eqs {
		eq := eq
		g.Go(func(ctx context.Context) error {
			return t.build(ctx, eq, 0)
		})
	}
	if err := g.Wait(); err != nil {
		return nil, err
	}
	return t.topology(), nil
}

func (locationResolver) LocationHierarchy(ctx context.Context, location *ent.Location) ([]*ent.Location, error) {
	var locations []*ent.Location
	for {
		parent, err := location.QueryParent().Only(ctx)
		if err != nil {
			if ent.IsNotFound(err) {
				return locations, nil
			}
			return nil, fmt.Errorf("querying parent location: %w", err)
		}
		locations = append([]*ent.Location{parent}, locations...)
		location = parent
	}
}

func (locationResolver) DistanceKm(_ context.Context, location *ent.Location, latitude, longitude float64) (float64, error) {
	const (
		radian        = math.Pi / 180
		earthRadiusKm = 6371
	)
	locLat, locLong := location.Latitude, location.Longitude
	a := 0.5 - math.Cos((latitude-locLat)*radian)/2 +
		math.Cos(locLat*radian)*math.Cos(latitude*radian)*
			(1-math.Cos((longitude-locLong)*radian))/2
	return earthRadiusKm * 2 * math.Asin(math.Sqrt(a)), nil
}
