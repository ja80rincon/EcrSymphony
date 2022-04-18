#!/usr/bin/env python3
# Copyright (c) 2004-present Facebook All rights reserved.
# Use of this source code is governed by a BSD-style
# license that can be found in the LICENSE file.


from psym.api.project_type import (
    _populate_project_types,
    add_project_type,
    delete_project_type,
    edit_project_type,
    get_project_type_by_id,
)
from psym.api.work_order_type import add_work_order_type
from psym.common.cache import PROJECT_TYPES
from psym.common.data_class import PropertyDefinition, WorkOrderDefinition
from psym.graphql.enum.property_kind import PropertyKind

from ..utils.base_test import BaseTest


class TestProjectType(BaseTest):
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
        self.project_type = add_project_type(
            self.client,
            name="Project type name",
            description="Project type description",
            properties=[
                PropertyDefinition(
                    property_name="project type property",
                    property_kind=PropertyKind.string,
                    default_raw_value="test string value",
                    is_fixed=False,
                )
            ],
            work_order_definitions=[
                WorkOrderDefinition(
                    id=None,
                    definition_index=0,
                    work_order_type_id=self.work_order_type.id,
                )
            ],
        )

    def test_project_type_populated(self) -> None:
        self.assertEqual(len(PROJECT_TYPES), 1)
        PROJECT_TYPES.clear()
        _populate_project_types(client=self.client)
        self.assertEqual(len(PROJECT_TYPES), 1)

    def test_delete_project_type(self) -> None:
        delete_project_type(client=self.client, id=self.project_type.id)
        self.assertEqual(len(PROJECT_TYPES), 0)

    def test_get_project_type_by_id(self) -> None:
        fetched_project_type = get_project_type_by_id(
            client=self.client, id=self.project_type.id
        )
        self.assertEqual(self.project_type.id, fetched_project_type.id)

    def test_edit_project_type(self) -> None:
        work_order_type = add_work_order_type(
            self.client,
            name="New work order type",
            description="Test work order type",
            properties=[
                PropertyDefinition(
                    property_name="New work order type property",
                    property_kind=PropertyKind.string,
                    default_raw_value="test string value",
                    is_fixed=False,
                )
            ],
        )
        edited_project_type = edit_project_type(
            client=self.client,
            project_type_id=self.project_type.id,
            new_name="New name",
            new_description="New description",
            new_work_order_definitions=[
                WorkOrderDefinition(
                    definition_index=0, work_order_type_id=work_order_type.id
                )
            ],
        )
        self.assertEqual(self.project_type.id, edited_project_type.id)
        self.assertEqual(edited_project_type.name, "New name")
        self.assertEqual(edited_project_type.description, "New description")
        work_order_definitions = edited_project_type.work_order_definitions
        self.assertEqual(len(work_order_definitions), 1)
        self.assertEqual(
            work_order_type.id, work_order_definitions[0].work_order_type_id
        )
