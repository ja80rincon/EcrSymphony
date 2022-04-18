#!/usr/bin/env python3
# Copyright (c) 2004-present Facebook All rights reserved.
# Use of this source code is governed by a BSD-style
# license that can be found in the LICENSE file.
import functools
import time
import requests

from typing import Callable
from psym import PsymClient
from gql import Client, gql
from gql.transport.requests import RequestsHTTPTransport
from psym.common.endpoint import LOCALHOST_SERVER

from .constant import PLATFORM_SERVER_HEALTH_CHECK_URL, TestMode

TEST_MODE: TestMode = TestMode.DEV
TENANT = "fb-test"


def wait_for_platform() -> None:
    if TEST_MODE == TestMode.REMOTE:
        return
    platform_server_health_check = PLATFORM_SERVER_HEALTH_CHECK_URL
    if TEST_MODE == TestMode.LOCAL:
        platform_server_health_check = "https://fb-test.localtest.me/healthz"

    deadline = time.monotonic() + 60
    while time.monotonic() < deadline:
        try:
            response = requests.get(
                platform_server_health_check, timeout=0.5, verify=False
            )
            if response.status_code == 200:
                return
            print(
                f"Response failed with status code {response.status_code}"
                f' and with message "{response.text}"'
            )
        except Exception as e:
            print(f"Request failed with exception {e}")
            time.sleep(0.5)
    raise Exception("Failed to wait for platform")


def init_client(email: str, password: str) -> PsymClient:
    if TEST_MODE == TestMode.LOCAL:
        return PsymClient(email, password, tenant=TENANT, is_local_host=True)
    elif TEST_MODE == TestMode.REMOTE:
        return PsymClient(email, password, tenant=f"{TENANT}.staging")
    else:
        return PsymClient(email, password, is_dev_mode=True)


def init_cleaner() -> Callable:
    if TEST_MODE == TestMode.LOCAL:
        endpoint = f"https://admin.{LOCALHOST_SERVER}/query"
    elif TEST_MODE == TestMode.REMOTE:
        raise NotImplementedError("T64902729")
    else:
        endpoint = "http://admin/query"

    session = requests.Session()
    session.verify = False
    client = Client(
        transport=RequestsHTTPTransport(
            url=endpoint,
            headers={
                "Accept": "application/json",
                "Content-Type": "application/json",
                "User-Agent": "psym",
            },
            verify=False,
        ),
        fetch_schema_from_transport=True,
    )
    mutation = gql(
        """
        mutation TruncateTenant($name: String!) {
            truncateTenant(input: { name: $name }) {
                clientMutationId
            }
        }
    """
    )
    variables = {"name": TENANT}
    return functools.partial(
        client.execute, document=mutation, variable_values=variables
    )
