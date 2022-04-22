#!/usr/bin/env python3
# Copyright (c) 2004-present Facebook All rights reserved.
# Use of this source code is governed by a BSD-style
# license that can be found in the LICENSE file.

import argparse
import sys

from cli.psym.api.service_type import get_service_types
from psym import PsymClient
from psym.api.equipment_type import delete_equipment_type, get_equipment_types
from psym.api.location_type import delete_location_type, get_location_types
from psym.api.port_type import delete_equipment_port_type, get_equipment_port_types
from psym.api.service_type import delete_service_type


def delete_port_types(client: PsymClient) -> None:
    port_types = get_equipment_port_types(client=client)
    for port_type in port_types:
        delete_equipment_port_type(client=client, equipment_port_type_id=port_type.id)


def delete_equipment_types(client: PsymClient) -> None:
    equipment_types = get_equipment_types(client=client)
    for equipment_type in equipment_types:
        delete_equipment_type(client=client, equipment_type_id=equipment_type.id)


def delete_location_types(client: PsymClient) -> None:
    location_types = get_location_types(client=client)
    for location_type in location_types:
        delete_location_type(client=client, location_type_id=location_type.id)


def delete_service_types(client: PsymClient) -> None:
    service_types = get_service_types(client=client)
    for service_type in service_types:
        delete_service_type(client=client, service_type=service_type)


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
        delete_port_types(client)
    if args.entity_type in ["equipment", "all"]:
        delete_equipment_types(client)
    if args.entity_type in ["location", "all"]:
        delete_location_types(client)
    if args.entity_type in ["service", "all"]:
        delete_service_types(client)

    sys.exit(0)
