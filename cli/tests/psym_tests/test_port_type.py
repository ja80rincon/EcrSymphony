#!/usr/bin/env python3
# Copyright (c) 2004-present Facebook All rights reserved.
# Use of this source code is governed by a BSD-style
# license that can be found in the LICENSE file.

from psym.api.port_type import (
    _populate_equipment_port_types,
    add_equipment_port_type,
    delete_equipment_port_type,
    edit_equipment_port_type,
    get_equipment_port_type,
    get_equipment_port_types,
)
from psym.common.cache import PORT_TYPES
from psym.common.data_class import PropertyDefinition
from psym.graphql.enum.property_kind import PropertyKind

from ..utils.base_test import BaseTest


class TestEquipmentPortType(BaseTest):
    def setUp(self) -> None:
        super().setUp()
        self.port_type1 = add_equipment_port_type(
            self.client,
            name="port type 1",
            properties=[
                PropertyDefinition(
                    property_name="port property",
                    property_kind=PropertyKind.string,
                    default_raw_value="port property value",
                    is_fixed=False,
                )
            ],
            link_properties=[
                PropertyDefinition(
                    property_name="link property",
                    property_kind=PropertyKind.string,
                    default_raw_value="link property value",
                    is_fixed=False,
                )
            ],
        )

    def test_equipment_port_type_populated(self) -> None:
        self.assertEqual(len(PORT_TYPES), 1)
        PORT_TYPES.clear()
        _populate_equipment_port_types(client=self.client)
        self.assertEqual(len(PORT_TYPES), 1)

    def test_get_equipment_port_type(self) -> None:
        fetched_port_type = get_equipment_port_type(
            client=self.client, equipment_port_type_id=self.port_type1.id
        )
        self.assertEqual(self.port_type1.id, fetched_port_type.id)

    def test_get_equipment_port_types(self) -> None:
        fetched_equipment_port_types = list(
            get_equipment_port_types(client=self.client)
        )
        self.assertEqual(len(fetched_equipment_port_types), 1)
        self.assertEqual(self.port_type1.id, fetched_equipment_port_types[0].id)

    def test_equipment_port_type_edited(self) -> None:
        edited_port_type = edit_equipment_port_type(
            client=self.client,
            port_type=self.port_type1,
            new_name="new port type 1",
            new_properties={"port property": "new port property value"},
            new_link_properties={"link property": "new link property value"},
        )
        fetched_port_type = get_equipment_port_type(
            client=self.client, equipment_port_type_id=self.port_type1.id
        )
        self.assertEqual(fetched_port_type.name, edited_port_type.name)
        self.assertEqual(len(fetched_port_type.property_types), 1)
        self.assertEqual(
            fetched_port_type.property_types[0].default_raw_value,
            "new port property value",
        )
        self.assertEqual(len(fetched_port_type.link_property_types), 1)
        self.assertEqual(
            fetched_port_type.link_property_types[0].default_raw_value,
            "new link property value",
        )

    def test_delete_equipment_port_type(self) -> None:
        delete_equipment_port_type(
            client=self.client, equipment_port_type_id=self.port_type1.id
        )
        self.assertEqual(len(PORT_TYPES), 0)
