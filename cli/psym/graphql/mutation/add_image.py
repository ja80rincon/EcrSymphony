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

from ..input.add_image_input import AddImageInput


# fmt: off
QUERY: List[str] = ["""
mutation AddImageMutation($input: AddImageInput!) {
  addImage(input: $input) {
    id
    fileName
  }
}

"""
]


class AddImageMutation:
    @dataclass(frozen=True)
    class AddImageMutationData(DataClassJsonMixin):
        @dataclass(frozen=True)
        class File(DataClassJsonMixin):
            id: str
            fileName: str

        addImage: File

    # fmt: off
    @classmethod
    def execute(cls, client: Client, input: AddImageInput) -> AddImageMutationData.File:
        variables: Dict[str, Any] = {"input": input}
        new_variables = encode_variables(variables, custom_scalars)
        response_text = client.execute(
            gql("".join(set(QUERY))), variable_values=new_variables
        )
        res = cls.AddImageMutationData.from_dict(response_text)
        return res.addImage

    # fmt: off
    @classmethod
    async def execute_async(cls, client: Client, input: AddImageInput) -> AddImageMutationData.File:
        variables: Dict[str, Any] = {"input": input}
        new_variables = encode_variables(variables, custom_scalars)
        response_text = await client.execute_async(
            gql("".join(set(QUERY))), variable_values=new_variables
        )
        res = cls.AddImageMutationData.from_dict(response_text)
        return res.addImage
