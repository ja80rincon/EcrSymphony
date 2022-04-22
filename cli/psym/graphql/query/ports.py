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

from ..fragment.equipment_port import EquipmentPortFragment, QUERY as EquipmentPortFragmentQuery

from ..fragment.page_info import PageInfoFragment, QUERY as PageInfoFragmentQuery


# fmt: off
QUERY: List[str] = EquipmentPortFragmentQuery + PageInfoFragmentQuery + ["""
query PortsQuery($after: Cursor, $first: Int) {
  equipmentPorts(after: $after, first: $first) {
    edges {
      node {
        ...EquipmentPortFragment
      }
    }
    pageInfo {
      ...PageInfoFragment
    }
  }
}

"""
]


class PortsQuery:
    @dataclass(frozen=True)
    class PortsQueryData(DataClassJsonMixin):
        @dataclass(frozen=True)
        class EquipmentPortConnection(DataClassJsonMixin):
            @dataclass(frozen=True)
            class EquipmentPortEdge(DataClassJsonMixin):
                @dataclass(frozen=True)
                class EquipmentPort(EquipmentPortFragment):
                    pass

                node: Optional[EquipmentPort]

            @dataclass(frozen=True)
            class PageInfo(PageInfoFragment):
                pass

            edges: List[EquipmentPortEdge]
            pageInfo: PageInfo

        equipmentPorts: EquipmentPortConnection

    # fmt: off
    @classmethod
    def execute(cls, client: Client, after: Optional[str] = None, first: Optional[int] = None) -> PortsQueryData.EquipmentPortConnection:
        variables: Dict[str, Any] = {"after": after, "first": first}
        new_variables = encode_variables(variables, custom_scalars)
        response_text = client.execute(
            gql("".join(set(QUERY))), variable_values=new_variables
        )
        res = cls.PortsQueryData.from_dict(response_text)
        return res.equipmentPorts

    # fmt: off
    @classmethod
    async def execute_async(cls, client: Client, after: Optional[str] = None, first: Optional[int] = None) -> PortsQueryData.EquipmentPortConnection:
        variables: Dict[str, Any] = {"after": after, "first": first}
        new_variables = encode_variables(variables, custom_scalars)
        response_text = await client.execute_async(
            gql("".join(set(QUERY))), variable_values=new_variables
        )
        res = cls.PortsQueryData.from_dict(response_text)
        return res.equipmentPorts