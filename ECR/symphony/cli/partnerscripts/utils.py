#!/usr/bin/env python3
# Copyright (c) 2004-present Facebook All rights reserved.
# Use of this source code is governed by a BSD-style
# license that can be found in the LICENSE file.
import argparse
import time
from typing import List, Optional, Tuple

from psym import PsymClient
from psym.api.location import edit_location, get_location_by_external_id, get_locations
from psym.common.data_class import Location


def is_empty_excel_cell(value: str) -> bool:
    return value == "nan"


def is_empty_cell(value: str) -> bool:
    return is_empty_excel_cell(value) or value.strip(" ") in ["", "-"]


class TimerError(Exception):
    """A custom exception used to report errors in use of Timer class"""


class Timer:
    def __init__(self) -> None:
        self._start_time: Optional[float] = None

    def start(self) -> None:
        if self._start_time is not None:
            raise TimerError("Timer is running. Use .stop() to stop it")

        self._start_time = time.perf_counter()

    def stop(self) -> float:
        start_time = self._start_time
        if start_time is None:
            raise TimerError("Timer is not running. Use .start() to start it")

        elapsed_time = time.perf_counter() - start_time
        self._start_time = None
        return elapsed_time


def get_location(client: PsymClient, external_id: str) -> Tuple[Location, float]:
    t = Timer()
    t.start()
    location = get_location_by_external_id(client=client, external_id=external_id)
    return (location, t.stop())


def get_building_locations(client: PsymClient) -> List[Tuple[Location, str]]:
    t = Timer()
    t.start()
    locations = list(get_locations(client=client))
    print(f"Collected {len(locations)} Locations in {t.stop():.4f} secs")
    result = []
    for location in locations:
        external_id = location.external_id if location.external_id else None
        building = location.location_type_name
        if external_id and building == "Building":
            result.append((location, external_id))
    return result


def edit_location_with_time(client: PsymClient, location: Location) -> float:
    t = Timer()
    t.start()
    edit_location(
        client=client,
        location=location,
        new_properties={"Building Asset Number": "12345678"},
    )
    return t.stop()


def get_client(email: str, password: str, tenant: str) -> PsymClient:
    t = Timer()
    t.start()
    client = PsymClient(email=email, password=password, tenant=tenant)
    print(f"Client connection in {t.stop():.4f} secs")
    return client


def add_base_args() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser()
    parser.add_argument("email", help="email to connect to symphony with", type=str)
    parser.add_argument("password", help="symphony connection password", type=str)
    parser.add_argument("tenant", help="Tenant name", type=str)
    return parser
