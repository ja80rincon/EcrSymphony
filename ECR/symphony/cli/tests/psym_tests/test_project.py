#!/usr/bin/env python3
# Copyright (c) 2004-present Facebook All rights reserved.
# Use of this source code is governed by a BSD-style
# license that can be found in the LICENSE file.
import random
import string

from psym.api.project import (
    add_project,
    delete_project,
    edit_project,
    get_project_by_id,
    get_projects,
)
from psym.api.project_type import add_project_type
from psym.api.user import add_user
from psym.api.work_order_type import add_work_order_type
from psym.common.data_class import PropertyDefinition, WorkOrderDefinition
from psym.graphql.enum.project_priority import ProjectPriority
from psym.graphql.enum.property_kind import PropertyKind

from ..utils.base_test import BaseTest


class TestProject(BaseTest):
    def setUp(self) -> None:
        super().setUp()
        user_name = f"{self.random_string()}@fb.com"
        self.user = add_user(client=self.client, email=user_name, password=user_name)
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
        self.project = add_project(
            client=self.client,
            name="new projecct",
            project_type=self.project_type,
            description="Project description",
            creator_id=self.user.id,
        )

    @staticmethod
    def random_string(length: int = 10) -> str:
        letters = string.ascii_lowercase
        return "".join(random.choices(letters, k=length))

    def test_add_project(self) -> None:
        fetched_projects = list(get_projects(client=self.client))
        self.assertEqual(len(fetched_projects), 1)
        self.assertEqual(self.project.id, fetched_projects[0].id)

    def test_edit_project(self) -> None:
        edited_project = edit_project(
            client=self.client,
            project_id=self.project.id,
            new_name="New name",
            new_description="New description",
        )
        fetched_project = get_project_by_id(client=self.client, id=edited_project.id)
        self.assertEqual(self.project.id, fetched_project.id)
        self.assertEqual(fetched_project.name, "New name")
        self.assertEqual(fetched_project.description, "New description")

        edited_project = edit_project(
            client=self.client,
            project_id=self.project.id,
            new_properties_dict={"project type property": "new test string value"},
        )
        fetched_project = get_project_by_id(client=self.client, id=edited_project.id)
        fetched_properties = fetched_project.properties
        self.assertIsNotNone(fetched_properties)
        self.assertEqual(len(fetched_properties), 1)
        self.assertEqual(fetched_properties[0].stringValue, "new test string value")

        user_name = f"{self.random_string()}@fb.com"
        user = add_user(client=self.client, email=user_name, password=user_name)
        edited_project = edit_project(
            client=self.client, project_id=self.project.id, new_creator_id=user.id
        )
        fetched_project = get_project_by_id(client=self.client, id=edited_project.id)
        self.assertEqual(self.project.id, fetched_project.id)
        self.assertEqual(fetched_project.created_by, user.id)

        edited_project = edit_project(
            client=self.client,
            project_id=self.project.id,
            new_priority=ProjectPriority("HIGH"),
        )
        fetched_project = get_project_by_id(client=self.client, id=edited_project.id)
        self.assertEqual(self.project.id, fetched_project.id)
        self.assertEqual(fetched_project.priority, ProjectPriority.HIGH)

    def test_get_project_by_id(self) -> None:
        fetched_project = get_project_by_id(client=self.client, id=self.project.id)
        self.assertEqual(self.project.id, fetched_project.id)

    def test_delete_project(self) -> None:
        delete_project(client=self.client, id=self.project.id)
        fetched_projects = list(get_projects(client=self.client))
        self.assertEqual(len(fetched_projects), 0)
