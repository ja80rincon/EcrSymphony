#!/usr/bin/env python3
# Copyright (c) 2004-present Facebook All rights reserved.
# Use of this source code is governed by a BSD-style
# license that can be found in the LICENSE file.
from psym.api.location_type import (
    _populate_location_types,
    add_location_type,
    delete_location_type,
    get_location_type_by_id,
    get_location_types,
)
from psym.common.cache import LOCATION_TYPES
from psym.common.data_class import DocumentCategory, PropertyDefinition
from psym.graphql.enum.property_kind import PropertyKind

from ..utils.base_test import BaseTest


class TestLocationType(BaseTest):
    def setUp(self) -> None:
        super().setUp()
        self.location_type = add_location_type(
            client=self.client,
            name="City",
            properties=[
                PropertyDefinition(
                    property_name="Mayor",
                    property_kind=PropertyKind.string,
                    default_raw_value=None,
                    is_fixed=False,
                ),
                PropertyDefinition(
                    property_name="Contact",
                    property_kind=PropertyKind.email,
                    default_raw_value=None,
                    is_fixed=False,
                ),
            ],
            document_categories=[
                DocumentCategory(
                    index=0,
                    name="DATAFILLS"
                ),
                DocumentCategory(
                    index=1,
                    name="TOPOLOGIA"
                ),
            ],
        )

    def test_work_order_type_populated(self) -> None:
        self.assertEqual(len(LOCATION_TYPES), 1)
        LOCATION_TYPES.clear()
        _populate_location_types(client=self.client)
        self.assertEqual(len(LOCATION_TYPES), 1)

    def test_get_location_types(self) -> None:
        fetched_location_types = list(get_location_types(client=self.client))
        self.assertEqual(len(fetched_location_types), 1)
        self.assertEqual(self.location_type.id, fetched_location_types[0].id)
        self.assertEqual(self.location_type.document_categories, fetched_location_types[0].document_categories)

    def test_get_location_type_by_id(self) -> None:
        fetched_location_type = get_location_type_by_id(
            client=self.client, id=self.location_type.id
        )
        self.assertEqual(self.location_type.id, fetched_location_type.id)

    def test_location_type_deleted(self) -> None:
        delete_location_type(client=self.client, location_type_id=self.location_type.id)
        self.assertEqual(len(LOCATION_TYPES), 0)
