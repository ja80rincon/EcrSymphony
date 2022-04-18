#!/usr/bin/env python3
# Copyright (c) 2004-present Facebook All rights reserved.
# Use of this source code is governed by a BSD-style
# license that can be found in the LICENSE file.

import argparse
import json
import sys
from typing import Any, Dict, List

from psym import PsymClient
from psym.api.equipment_type import add_equipment_type
from psym.api.location_type import add_location_type
from psym.api.port_type import add_equipment_port_type
from psym.api.service_type import add_service_type
from psym.common.data_class import (
    EquipmentPortDefinition,
    PropertyDefinition,
    ServiceEndpointDefinition,
)
from psym.graphql.enum.property_kind import PropertyKind


def read_from_file(data_type: str) -> List[Dict[str, Any]]:
    file_name = f"{data_type}_types.json"
    with open(file_name, "r") as json_file:
        data = json.load(json_file)
    return data


def format_property_type_definitions(
    property_types: List[Dict[str, Any]]
) -> List[PropertyDefinition]:
    return (
        [
            PropertyDefinition(
                property_name=prop["property_name"],
                property_kind=PropertyKind(prop["property_kind"]),
                default_raw_value=prop["default_raw_value"],
                is_fixed=prop["is_fixed"],
                external_id=prop["external_id"],
                is_mandatory=prop["is_mandatory"],
                is_deleted=prop["is_deleted"],
            )
            for prop in property_types
        ]
        if property_types
        else []
    )


def upload_equipment_types(client: PsymClient) -> None:
    data = read_from_file("equipment")
    for equipment_type in data:
        add_equipment_type(
            client=client,
            name=equipment_type["name"],
            category=equipment_type["category"],
            properties=format_property_type_definitions(equipment_type["properties"]),
            port_definitions=[
                EquipmentPortDefinition(
                    name=port["name"],
                    visible_label=port["visible_label"],
                    port_definition_index=port["index"],
                    port_type_name=port["port_type_name"],
                    connected_ports=[],
                )
                for port in equipment_type["ports"]
            ],
            position_list=[pos["name"] for pos in equipment_type["position_list"]],
        )


def upload_location_types(client: PsymClient) -> None:
    data = read_from_file("location")
    for location_type in data:
        add_location_type(
            client=client,
            name=location_type["name"],
            map_type=location_type["map_type"],
            map_zoom_level=location_type["map_zoom_level"],
            is_site=location_type["is_site"],
            properties=format_property_type_definitions(location_type["properties"]),
        )


def upload_port_types(client: PsymClient) -> None:
    data = read_from_file("port")
    for port_type in data:
        add_equipment_port_type(
            client=client,
            name=port_type["name"],
            properties=format_property_type_definitions(port_type["properties"]),
            link_properties=format_property_type_definitions(
                port_type["link_properties"]
            ),
        )


def upload_service_types(client: PsymClient) -> None:
    data = read_from_file("service")
    for service_type in data:
        add_service_type(
            client=client,
            name=service_type["name"],
            has_customer=service_type["has_customer"],
            properties=format_property_type_definitions(service_type["properties"]),
            endpoint_definitions=[
                ServiceEndpointDefinition(
                    id=None,
                    name=ed["name"],
                    endpoint_definition_index=int(ed["endpoint_definition_index"]),
                    role=ed["role"],
                    equipment_type_id=ed["equipment_type_id"],
                )
                for ed in service_type["endpoint_definitions"]
            ],
        )


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
        upload_port_types(client)
    if args.entity_type in ["equipment", "all"]:
        upload_equipment_types(client)
    if args.entity_type in ["location", "all"]:
        upload_location_types(client)
    if args.entity_type in ["service", "all"]:
        upload_service_types(client)

    sys.exit(0)
