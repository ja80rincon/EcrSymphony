#!/usr/bin/env python3
# Copyright (c) 2004-present Facebook All rights reserved.
# Use of this source code is governed by a BSD-style
# license that can be found in the LICENSE file.

import argparse
import json
import sys
from datetime import datetime
from typing import Any, Dict, List, Sequence

from psym import PsymClient
from psym.common.cache import EQUIPMENT_TYPES, LOCATION_TYPES, PORT_TYPES, SERVICE_TYPES
from psym.common.data_class import PropertyDefinition


def write_to_file(data_type: str, data: List[Dict[str, Any]]) -> None:
    now = datetime.utcnow()
    datetime_formated = now.strftime("%d-%m-%Y_%H-%M-%S")
    file_name = f"{data_type}_types_{datetime_formated}.json"
    with open(file_name, "w") as outfile:
        json.dump(data, outfile, ensure_ascii=False, indent=4)


def format_property_types(
    property_types: Sequence[PropertyDefinition],
) -> List[Dict[str, Any]]:
    return (
        [
            dict(
                id=prop.id,
                property_name=prop.property_name,
                property_kind=prop.property_kind.value,
                default_raw_value=prop.default_raw_value,
                is_fixed=prop.is_fixed,
                external_id=prop.external_id,
                is_mandatory=prop.is_mandatory,
                is_deleted=prop.is_deleted,
            )
            for prop in property_types
        ]
        if property_types
        else []
    )


def export_port_types(client: PsymClient) -> None:
    data = []
    for port_type in PORT_TYPES.values():
        data.append(
            dict(
                id=port_type.id,
                name=port_type.name,
                properties=format_property_types(
                    property_types=port_type.property_types
                ),
                link_properties=format_property_types(
                    property_types=port_type.link_property_types
                ),
            )
        )
    write_to_file(data_type="port", data=data)


def export_equipment_types(client: PsymClient) -> None:
    data = []
    for equipment_type in EQUIPMENT_TYPES.values():
        data.append(
            dict(
                id=equipment_type.id,
                name=equipment_type.name,
                category=equipment_type.category,
                properties=format_property_types(
                    property_types=equipment_type.property_types
                ),
                ports=[
                    dict(
                        id=pd.id,
                        name=pd.name,
                        visible_label=getattr(pd, "visibleLabel", None),
                        index=getattr(pd, "index", None),
                        port_type_name=pd.portType.name if pd.portType else None,
                    )
                    for pd in equipment_type.port_definitions
                ],
                position_list=[
                    dict(
                        id=pos.id,
                        name=pos.name,
                        index=pos.index,
                        visible_label=pos.visibleLabel,
                    )
                    for pos in equipment_type.position_definitions
                ],
            )
        )
    write_to_file(data_type="equipment", data=data)


def export_location_types(client: PsymClient) -> None:
    data = []
    for location_type in LOCATION_TYPES.values():
        data.append(
            dict(
                id=location_type.id,
                name=location_type.name,
                map_type=getattr(location_type, "map_type", None),
                map_zoom_level=getattr(location_type, "map_zoom_level", None),
                is_site=getattr(location_type, "is_site", None),
                properties=format_property_types(
                    property_types=location_type.property_types
                ),
            )
        )
    write_to_file(data_type="location", data=data)


def export_service_types(client: PsymClient) -> None:
    data = []
    for service_type in SERVICE_TYPES.values():
        data.append(
            dict(
                id=service_type.id,
                name=service_type.name,
                has_customer=service_type.has_customer,
                properties=format_property_types(
                    property_types=service_type.property_types
                ),
                endpoint_definitions=[
                    dict(
                        id=ed.id,
                        name=ed.name,
                        endpoint_definition_index=ed.endpoint_definition_index,
                        role=ed.role,
                        equipment_type_id=ed.equipment_type_id,
                    )
                    for ed in service_type.endpoint_definitions
                ],
            )
        )

    write_to_file(data_type="service", data=data)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("email", help="email to connect to symphony with", type=str)
    parser.add_argument("password", help="symphony connection password", type=str)
    parser.add_argument("tenant", help="Tenant name", type=str)
    parser.add_argument(
        "entity_type",
        help="entity type",
        type=str,
        choices=["all", "port", "equipment", "location", "service"],
    )
    args: argparse.Namespace = parser.parse_args()
    client = PsymClient(args.email, args.password, args.tenant)

    if args.entity_type in ["port", "all"]:
        export_port_types(client)
    if args.entity_type in ["equipment", "all"]:
        export_equipment_types(client)
    if args.entity_type in ["location", "all"]:
        export_location_types(client)
    if args.entity_type in ["service", "all"]:
        export_service_types(client)

    sys.exit(0)
