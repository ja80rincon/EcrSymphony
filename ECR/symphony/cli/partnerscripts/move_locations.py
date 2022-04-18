#!/usr/bin/env python3
# Copyright (c) 2004-present Facebook All rights reserved.
# Use of this source code is governed by a BSD-style
# license that can be found in the LICENSE file.

import argparse
import sys

from partnerscripts.utils import add_base_args
from psym import PsymClient
from psym.api.location import move_location

if __name__ == "__main__":
    parser = add_base_args()
    parser.add_argument("new_parent", help="new parent ID", type=str)
    parser.add_argument(
        "locations_to_move", help="list of location IDs to move", nargs="+"
    )
    args: argparse.Namespace = parser.parse_args()
    client = PsymClient(args.email, args.password, args.tenant)
    for location_id in args.locations_to_move:
        move_location(client, location_id, args.new_parent_id)
    sys.exit(0)
