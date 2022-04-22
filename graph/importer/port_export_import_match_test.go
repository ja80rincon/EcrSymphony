// Copyright (c) 2004-present Facebook All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

package importer

import (
	"testing"

	"github.com/AlekSi/pointer"
	"github.com/facebookincubator/symphony/pkg/ent/property"
	"github.com/facebookincubator/symphony/pkg/ent/propertytype"
	pkgexporter "github.com/facebookincubator/symphony/pkg/exporter"
	"github.com/stretchr/testify/require"
)

func TestImportAndEditPorts(t *testing.T) {
	for _, withVerify := range []bool{true, false} {
		for _, skipLines := range []bool{true, false} {
			r := newExporterTestResolver(t)
			log := r.Exporter.Log
			e := &pkgexporter.Exporter{Log: log, Rower: pkgexporter.PortsRower{Log: log}}
			ctx, res := prepareHandlerAndExport(t, r, e)

			importLinksPortsFile(t, r.Client, res, ImportEntityPort, methodEdit, skipLines, withVerify)
			locs := r.Client.Location.Query().AllX(ctx)
			require.Len(t, locs, 3)
			ports, err := r.Query().EquipmentPorts(ctx, nil, nil, nil, nil, nil)
			require.NoError(t, err)
			require.Equal(t, 2, ports.TotalCount)
			for _, edge := range ports.Edges {
				port := edge.Node
				def := port.QueryDefinition().OnlyX(ctx)
				if def.Name == portName1 {
					typ := def.QueryEquipmentPortType().OnlyX(ctx)
					propTyps := typ.QueryPropertyTypes().AllX(ctx)
					require.Len(t, propTyps, 2)

					props := port.QueryProperties().AllX(ctx)
					if withVerify {
						require.Empty(t, props)
					} else {
						require.Len(t, props, 2)

						p1 := typ.QueryPropertyTypes().Where(propertytype.Name(propStr)).OnlyX(ctx)
						p2 := typ.QueryPropertyTypes().Where(propertytype.Name(propStr2)).OnlyX(ctx)

						require.Equal(t, pointer.GetString(port.QueryProperties().Where(property.HasTypeWith(propertytype.ID(p1.ID))).OnlyX(ctx).StringVal), "new-prop-value")
						require.Equal(t, pointer.GetString(port.QueryProperties().Where(property.HasTypeWith(propertytype.ID(p2.ID))).OnlyX(ctx).StringVal), "new-prop-value2")
					}
				}
			}
		}
	}
}
