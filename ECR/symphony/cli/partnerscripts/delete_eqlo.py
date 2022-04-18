#!/usr/bin/env python3
# Copyright (c) 2004-present Facebook All rights reserved.
# Use of this source code is governed by a BSD-style
# license that can be found in the LICENSE file.

import argparse
import sys

from psym import PsymClient
from psym.api.equipment import delete_all_equipments
from psym.api.location_type import delete_locations_by_location_type
from psym.common.cache import LOCATION_TYPES

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("email", help="email to connect to symphony with", type=str)
    parser.add_argument("password", help="symphony connection password", type=str)
    parser.add_argument("tenant", help="Tenant name", type=str)
    parser.add_argument(
        "entity", help="entity", type=str, choices=["equipment", "location"]
    )
    parser.add_argument(
        "location_types",
        help="Delete locations of this type",
        type=str,
        nargs="*",
        default=None,
    )
    args: argparse.Namespace = parser.parse_args()
    client = PsymClient(args.email, args.password, args.tenant)

    if args.entity == "equipment":
        delete_all_equipments(client)
    else:
        for location_type_name in args.location_types:
            location_type = LOCATION_TYPES[location_type_name]
            delete_locations_by_location_type(
                client=client, location_type=location_type
            )

    sys.exit(0)
