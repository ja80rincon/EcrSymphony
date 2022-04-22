#!/usr/bin/env python3
# Copyright (c) 2004-present Facebook All rights reserved.
# Use of this source code is governed by a BSD-style
# license that can be found in the LICENSE file.
import argparse
import sys
from typing import List

from partnerscripts.utils import add_base_args
from psym import PsymClient
from psym.api.user import get_users
from psym.common.data_class import User

if __name__ == "__main__":
    parser = add_base_args()
    args: argparse.Namespace = parser.parse_args()

    username: str = args.email
    password: str = args.password
    tenant: str = args.tenant
    result: List[str] = []
    users: List[User] = []
    try:
        client = PsymClient(username, password, tenant)
    except Exception as e:
        print(f"User {username} unaible to connect to {tenant} tenant")
        print(f"ERROR - {str(e)}")

    try:
        users = list(get_users(client))
    except Exception as e:
        print(f"ERROR collectng users - {str(e)}")

    for user in users:
        try:
            client = PsymClient(user.auth_id, user.auth_id, tenant)
            result.append(user.auth_id)
        except Exception:
            continue

    print(f"{tenant}")
    for user_id in result:
        print(f"\t{user_id}")

    sys.exit(0)
