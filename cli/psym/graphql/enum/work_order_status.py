#!/usr/bin/env python3
# @generated AUTOGENERATED file. Do not Change!

from enum import Enum


class WorkOrderStatus(Enum):
    PLANNED = "PLANNED"
    IN_PROGRESS = "IN_PROGRESS"
    PENDING = "PENDING"
    SUBMITTED = "SUBMITTED"
    CLOSED = "CLOSED"
    DONE = "DONE"
    BLOCKED = "BLOCKED"
    CANCELED = "CANCELED"
    SUSPENDED = "SUSPENDED"
    MISSING_ENUM = ""

    @classmethod
    def _missing_(cls, value: object) -> "WorkOrderStatus":
        return cls.MISSING_ENUM