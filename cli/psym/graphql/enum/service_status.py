#!/usr/bin/env python3
# @generated AUTOGENERATED file. Do not Change!

from enum import Enum


class ServiceStatus(Enum):
    PENDING = "PENDING"
    IN_SERVICE = "IN_SERVICE"
    MAINTENANCE = "MAINTENANCE"
    DISCONNECTED = "DISCONNECTED"
    MISSING_ENUM = ""

    @classmethod
    def _missing_(cls, value: object) -> "ServiceStatus":
        return cls.MISSING_ENUM
