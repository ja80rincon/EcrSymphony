// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package importer

import (
	"context"
	"testing"

	"github.com/AlekSi/pointer"
	"github.com/facebookincubator/symphony/pkg/ent/equipment"
	pkgexporter "github.com/facebookincubator/symphony/pkg/exporter"
	"github.com/stretchr/testify/require"
)

func TestExportAndEditLinks(t *testing.T) {
	for _, withVerify := range []bool{true, false} {
		for _, skipLines := range []bool{true, false} {
			r := newExporterTestResolver(t)
			log := r.Exporter.Log
			e := &pkgexporter.Exporter{Log: log, Rower: pkgexporter.LinksRower{Log: log}}
			ctx, res := prepareHandlerAndExport(t, r, e)
			importLinksPortsFile(t, r.Client, res, ImportEntityLink, methodEdit, skipLines, withVerify)

			locs := r.Client.Location.Query().AllX(ctx)
			require.Len(t, locs, 3)
			links, err := r.Query().Links(ctx, nil, nil, nil, nil, nil)
			require.NoError(t, err)
			require.Equal(t, 1, links.TotalCount)
			for _, edge := range links.Edges {
				link := edge.Node
				props := link.QueryProperties().AllX(ctx)
				if skipLines || withVerify {
					require.Len(t, props, 0)
				} else {
					s := link.QueryService().OnlyX(ctx)
					require.Equal(t, s.Name, secondServiceName)
					require.Len(t, props, 3)
				}
				for _, prop := range props {
					switch prop.QueryType().OnlyX(ctx).Name {
					case propNameInt:
						require.Equal(t, 10, pointer.GetInt(prop.IntVal))
					case propNameBool:
						require.Equal(t, true, pointer.GetBool(prop.BoolVal))
					case propNameStr:
						require.Equal(t, "new-prop-value", pointer.GetString(prop.StringVal))
					}
				}
			}
		}
	}
}

func TestExportAndAddLinks(t *testing.T) {
	for _, withVerify := range []bool{true, false} {
		for _, skipLines := range []bool{true, false} {
			r := newExporterTestResolver(t)
			log := r.Exporter.Log
			e := &pkgexporter.Exporter{Log: log, Rower: pkgexporter.LinksRower{Log: log}}
			ctx, res := prepareHandlerAndExport(t, r, e)
			locs := r.Client.Location.Query().AllX(ctx)
			require.Len(t, locs, 3)
			// Deleting link and of side's equipment to verify it creates it on import
			deleteLinkAndEquipmentForReImport(ctx, t, r)

			equips := r.Client.Equipment.Query().AllX(ctx)
			require.Len(t, equips, 1)
			importLinksPortsFile(t, r.Client, res, ImportEntityLink, methodAdd, skipLines, withVerify)
			links, err := r.Query().Links(ctx, nil, nil, nil, nil, nil)
			require.NoError(t, err)
			if skipLines || withVerify {
				require.Zero(t, links.TotalCount)
				require.Empty(t, links.Edges)
			} else {
				require.Equal(t, 1, links.TotalCount)
				for _, edge := range links.Edges {
					link := edge.Node
					props := link.QueryProperties().AllX(ctx)
					for _, prop := range props {
						switch prop.QueryType().OnlyX(ctx).Name {
						case propNameInt:
							require.Equal(t, 100, pointer.GetInt(prop.IntVal))
						case propNameBool:
							require.Nil(t, prop.BoolVal)
						case propNameStr:
							require.Equal(t, "t1", pointer.GetString(prop.StringVal))
						}
					}
				}
			}
		}
	}
}

func deleteLinkAndEquipmentForReImport(ctx context.Context, t *testing.T, r *testExporterResolver) {
	l := r.Client.Link.Query().OnlyX(ctx)
	equipToDelete := l.QueryPorts().QueryParent().Where(equipment.Name(currEquip)).OnlyX(ctx)
	_, err := r.Mutation().RemoveLink(ctx, l.ID, nil)
	require.NoError(t, err)
	_, err = r.Mutation().RemoveEquipment(ctx, equipToDelete.ID, nil)
	require.NoError(t, err)
}
