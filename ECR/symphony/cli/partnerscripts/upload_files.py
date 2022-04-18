#!/usr/bin/env python3
# Copyright (c) 2004-present Facebook All rights reserved.
# Use of this source code is governed by a BSD-style
# license that can be found in the LICENSE file.

import argparse
import glob
import os
import sys
from typing import Generator

from partnerscripts.utils import add_base_args
from psym import PsymClient
from psym.api.file import add_file


def list_dir(directory_path: str) -> Generator[str, None, None]:
    files = list(glob.glob(os.path.join(directory_path, "**/**"), recursive=True))
    for file_path in set(files):
        if os.path.isfile(file_path):
            yield file_path


if __name__ == "__main__":
    parser = add_base_args()
    parser.add_argument(
        "local_dir_path", help="local directory path to upload", type=str
    )
    parser.add_argument(
        "entity_type",
        help="entity type",
        type=str,
        choices=["LOCATION", "WORK_ORDER", "SITE_SURVEY", "EQUIPMENT"],
    )
    parser.add_argument("entity_id", help="entity ID", type=str)
    args: argparse.Namespace = parser.parse_args()
    client = PsymClient(args.email, args.password, args.tenant)
    for file in list_dir(args.local_dir_path):
        file_name = os.path.basename(file)
        category = file_name.split("_")[1]
        add_file(client, file, args.entity_type, args.entity_id, category)
    sys.exit(0)
