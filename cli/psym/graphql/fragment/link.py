#!/usr/bin/env python3
# @generated AUTOGENERATED file. Do not Change!

from dataclasses import dataclass, field as _field
from ...config import custom_scalars, datetime
from gql_client.runtime.variables import encode_variables
from gql import gql, Client
from gql.transport.exceptions import TransportQueryError
from functools import partial
from numbers import Number
from typing import Any, AsyncGenerator, Dict, List, Generator, Optional
from time import perf_counter
from dataclasses_json import DataClassJsonMixin, config

from .property import PropertyFragment, QUERY as PropertyFragmentQuery

# fmt: off
QUERY: List[str] = PropertyFragmentQuery + ["""
fragment LinkFragment on Link {
  id
  properties {
    ...PropertyFragment
  }
  services {
    id
  }
}

"""]

@dataclass(frozen=True)
class LinkFragment(DataClassJsonMixin):
    @dataclass(frozen=True)
    class Property(PropertyFragment):
        pass

    @dataclass(frozen=True)
    class Service(DataClassJsonMixin):
        id: str

    id: str
    properties: List[Property]
    services: List[Service]
