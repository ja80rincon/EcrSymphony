#!/usr/bin/env python3
# Copyright (c) 2004-present Facebook All rights reserved.
# Use of this source code is governed by a BSD-style
# license that can be found in the LICENSE file.


from psym.api.work_order_type import (
    _populate_work_order_types,
    add_work_order_type,
    delete_work_order_type,
    edit_work_order_type,
    get_work_order_type_by_id,
    get_work_order_type_by_name,
    get_work_order_types,
)
from psym.common.cache import WORK_ORDER_TYPES
from psym.common.data_class import PropertyDefinition
from psym.graphql.enum.property_kind import PropertyKind

from ..utils.base_test import BaseTest


class TestWorkOrderType(BaseTest):
    def setUp(self) -> None:
        super().setUp()
        self.work_order_type = add_work_order_type(
            self.client,
            name="Work order type",
            description="Test work order type",
            properties=[
                PropertyDefinition(
                    property_name="work order type property",
                    property_kind=PropertyKind.string,
                    default_raw_value="test string value",
                    is_fixed=False,
                )
            ],
        )

    def test_work_order_type_populated(self) -> None:
        self.assertEqual(len(WORK_ORDER_TYPES), 1)
        WORK_ORDER_TYPES.clear()
        _populate_work_order_types(client=self.client)
        self.assertEqual(len(WORK_ORDER_TYPES), 1)

    def test_add_work_order_type(self) -> None:
        fetched_work_order_types = list(get_work_order_types(client=self.client))
        self.assertEqual(len(fetched_work_order_types), 1)
        self.assertEqual(self.work_order_type.id, fetched_work_order_types[0].id)

    def test_get_work_order_type_by_id(self) -> None:
        fetched_work_order_type = get_work_order_type_by_id(
            client=self.client, id=self.work_order_type.id
        )
        self.assertEqual(self.work_order_type.id, fetched_work_order_type.id)

    def test_get_work_order_type_by_name(self) -> None:
        fetched_work_order_type = get_work_order_type_by_name(
            client=self.client, name=self.work_order_type.name
        )
        self.assertEqual(self.work_order_type.id, fetched_work_order_type.id)

    def test_edit_work_order_type(self) -> None:
        edited_work_order_type = edit_work_order_type(
            client=self.client,
            work_order_type_id=self.work_order_type.id,
            new_name="New name",
        )
        fetched_work_order_type = get_work_order_type_by_id(
            client=self.client, id=edited_work_order_type.id
        )
        self.assertEqual(self.work_order_type.id, fetched_work_order_type.id)
        self.assertEqual(fetched_work_order_type.name, "New name")
        self.assertEqual(
            self.work_order_type.description, fetched_work_order_type.description
        )
        edited_work_order_type = edit_work_order_type(
            client=self.client,
            work_order_type_id=self.work_order_type.id,
            new_description="New description",
        )
        fetched_work_order_type = get_work_order_type_by_id(
            client=self.client, id=edited_work_order_type.id
        )
        self.assertEqual(self.work_order_type.id, fetched_work_order_type.id)
        self.assertEqual(fetched_work_order_type.name, "New name")
        self.assertEqual(fetched_work_order_type.description, "New description")
        edited_work_order_type = edit_work_order_type(
            client=self.client,
            work_order_type_id=self.work_order_type.id,
            new_properties_defaults={
                "work order type property": "new test string value"
            },
        )
        fetched_work_order_type = get_work_order_type_by_id(
            client=self.client, id=edited_work_order_type.id
        )
        fetched_property_types = fetched_work_order_type.property_types

        self.assertIsNotNone(fetched_property_types)
        self.assertEqual(len(fetched_property_types), 1)
        self.assertEqual(
            fetched_property_types[0].default_raw_value, "new test string value"
        )
        edited_work_order_type = edit_work_order_type(
            client=self.client,
            work_order_type_id=self.work_order_type.id,
            new_name="New name again",
            new_description="New description again",
        )
        fetched_work_order_type = get_work_order_type_by_id(
            client=self.client, id=edited_work_order_type.id
        )
        self.assertEqual(self.work_order_type.id, fetched_work_order_type.id)
        self.assertEqual(fetched_work_order_type.name, "New name again")
        self.assertEqual(fetched_work_order_type.description, "New description again")

    def test_delete_work_order_type(self) -> None:
        delete_work_order_type(
            client=self.client, work_order_type_id=self.work_order_type.id
        )
        self.assertEqual(len(WORK_ORDER_TYPES), 0)
