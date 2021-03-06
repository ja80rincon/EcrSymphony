#!/usr/bin/env python3
# @generated AUTOGENERATED file. Do not Change!

from enum import Enum


class VariableType(Enum):
    STRING = "STRING"
    INT = "INT"
    DATE = "DATE"
    WORK_ORDER = "WORK_ORDER"
    WORK_ORDER_TYPE = "WORK_ORDER_TYPE"
    LOCATION = "LOCATION"
    PROJECT = "PROJECT"
    USER = "USER"
    MISSING_ENUM = ""

    @classmethod
    def _missing_(cls, value: object) -> "VariableType":
        return cls.MISSING_ENUM
