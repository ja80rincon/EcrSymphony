#!/usr/bin/env python3
# Copyright (c) 2004-present Facebook All rights reserved.
# Use of this source code is governed by a BSD-style
# license that can be found in the LICENSE file.

import json
from datetime import datetime

from psym.api.equipment import (
    add_equipment,
    edit_equipment,
    get_equipment,
    get_equipment_by_external_id,
    get_equipment_properties,
    get_equipments,
    get_equipments_by_location,
    get_equipments_by_type,
    get_or_create_equipment,
)
from psym.api.equipment_type import add_equipment_type
from psym.api.location import add_location
from psym.api.location_type import add_location_type
from psym.api.port import edit_port_properties, get_port, get_ports
from psym.api.port_type import add_equipment_port_type
from psym.common.cache import EQUIPMENT_TYPES
from psym.common.data_class import EquipmentPortDefinition, PropertyDefinition
from psym.graphql.enum.property_kind import PropertyKind

from ..utils.base_test import BaseTest


class TestEquipment(BaseTest):
    def setUp(self) -> None:
        super().setUp()
        self.date_time_date = datetime.strptime("2020-08-16", "%Y-%m-%d").date()
        self.date_time = datetime.strptime("2020-08-16T18:03", "%Y-%m-%dT%H:%M")
        self.choices = ["11", "22"]
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
        add_location_type(
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
        )
        add_equipment_type(
            client=self.client,
            name="Tp-Link T1600G",
            category="Router",
            properties=[
                PropertyDefinition(
                    property_name="IP",
                    property_kind=PropertyKind.string,
                    default_raw_value=None,
                    is_fixed=False,
                ),
                PropertyDefinition(
                    property_name="Date",
                    property_kind=PropertyKind.date,
                    default_raw_value=None,
                    is_fixed=False,
                ),
                PropertyDefinition(
                    property_name="DateTime",
                    property_kind=PropertyKind.datetime_local,
                    default_raw_value=None,
                    is_fixed=False,
                ),
                PropertyDefinition(
                    property_name="Choices",
                    property_kind=PropertyKind.enum,
                    default_raw_value=json.dumps(self.choices),
                    is_fixed=False,
                ),
            ],
            port_definitions=[
                EquipmentPortDefinition(
                    name="tp_link_port",
                    visible_label="TP-Link port",
                    port_definition_index=0,
                    port_type_name="port type 1",
                    connected_ports=[],
                )
            ],
            position_list=[],
        )
        self.location = add_location(
            client=self.client,
            location_hirerchy=[("City", "Lima")],
            properties_dict={"Mayor": "Bernard King", "Contact": "limacity@peru.pe"},
            lat=10,
            long=20,
        )
        self.equipment = add_equipment(
            client=self.client,
            name="TPLinkRouter",
            equipment_type="Tp-Link T1600G",
            location=self.location,
            properties_dict={
                "IP": "127.0.0.1",
                "Date": self.date_time_date,
                "DateTime": self.date_time,
                "Choices": "11",
            },
        )
        self.equipment_with_external_id = add_equipment(
            client=self.client,
            name="TPLinkRouterExt",
            equipment_type="Tp-Link T1600G",
            location=self.location,
            properties_dict={"IP": "127.0.0.1"},
            external_id="12345",
        )

    def test_equipment_created(self) -> None:

        fetched_equipment = get_equipment(
            client=self.client, name="TPLinkRouter", location=self.location
        )
        self.assertEqual(self.equipment, fetched_equipment)

    def test_equipment_with_external_id_created(self) -> None:

        fetched_equipment = get_equipment(
            client=self.client, name="TPLinkRouterExt", location=self.location
        )
        self.assertEqual(self.equipment_with_external_id, fetched_equipment)

    def test_get_or_create_equipment(self) -> None:
        equipment2 = get_or_create_equipment(
            client=self.client,
            name="TPLinkRouter",
            equipment_type="Tp-Link T1600G",
            location=self.location,
            properties_dict={"IP": "127.0.0.1"},
        )
        self.assertEqual(self.equipment, equipment2)

    def test_get_equipments(self) -> None:
        equipments = get_equipments(client=self.client)
        self.assertEqual(len(list(equipments)), 2)

    def test_equipment_properties(self) -> None:
        properties = get_equipment_properties(
            client=self.client, equipment=self.equipment
        )
        self.assertTrue("IP" in properties)
        self.assertEquals("127.0.0.1", properties["IP"])
        self.assertTrue("Date" in properties)
        self.assertEquals(self.date_time_date, properties["Date"])
        self.assertTrue("DateTime" in properties)
        self.assertEquals(self.date_time, properties["DateTime"])
        self.assertTrue("Choices" in properties)
        self.assertTrue(properties["Choices"] in self.choices)
        self.assertEquals("11", properties["Choices"])

    def test_edit_equipment(self) -> None:
        edit_equipment(
            client=self.client,
            equipment=self.equipment,
            new_name="New equipment name",
            new_properties={"IP": "127.0.0.2", "Choices": "22"},
        )
        properties = get_equipment_properties(
            client=self.client, equipment=self.equipment
        )
        self.assertTrue("IP" in properties)
        self.assertEquals("127.0.0.2", properties["IP"])
        self.assertTrue("Date" in properties)
        self.assertEquals(self.date_time_date, properties["Date"])
        self.assertTrue("DateTime" in properties)
        self.assertEquals(self.date_time, properties["DateTime"])
        self.assertTrue("Choices" in properties)
        self.assertTrue(properties["Choices"] in self.choices)
        self.assertEquals("22", properties["Choices"])

    def test_equipment_get_port(self) -> None:
        fetched_port = get_port(
            client=self.client, equipment=self.equipment, port_name="tp_link_port"
        )
        self.assertEqual(self.port_type1.name, fetched_port.definition.port_type_name)

    def test_get_ports(self) -> None:
        ports = list(get_ports(client=self.client))
        self.assertEqual(len(ports), 2)

    def test_equipment_edit_port_properties(self) -> None:
        edit_port_properties(
            client=self.client,
            equipment=self.equipment,
            port_name="tp_link_port",
            new_properties={"port property": "test_port_property"},
        )
        fetched_port = get_port(
            client=self.client, equipment=self.equipment, port_name="tp_link_port"
        )
        port_properties = fetched_port.properties
        self.assertEqual(len(port_properties), 1)

        property_type = port_properties[0].propertyType
        self.assertEqual(property_type.name, "port property")
        self.assertEqual(port_properties[0].stringValue, "test_port_property")

    def test_get_equipments_by_type(self) -> None:
        equipment_type_id = EQUIPMENT_TYPES["Tp-Link T1600G"].id
        equipments = list(
            get_equipments_by_type(
                client=self.client, equipment_type_id=equipment_type_id
            )
        )
        self.assertEqual(len(equipments), 2)
        self.assertEqual(equipments[0].name, "TPLinkRouter")

    def test_get_equipments_by_location(self) -> None:
        equipments = list(
            get_equipments_by_location(client=self.client, location_id=self.location.id)
        )
        self.assertEqual(len(equipments), 2)
        self.assertEqual(equipments[0].name, "TPLinkRouter")

    def test_get_equipment_by_external_id(self) -> None:
        equipment = get_equipment_by_external_id(
            client=self.client, external_id="12345"
        )
        self.assertEqual(self.equipment_with_external_id, equipment)
