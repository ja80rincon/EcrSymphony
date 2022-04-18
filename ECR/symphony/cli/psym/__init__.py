#!/usr/bin/env python3
# Copyright (c) 2004-present Facebook All rights reserved.
# Use of this source code is governed by a BSD-style
# license that can be found in the LICENSE file.

from gql.transport.exceptions import TransportServerError

from psym.common.constant import __version__

from .api.equipment_type import _populate_equipment_types
from .api.location_type import _populate_location_types
from .api.port_type import _populate_equipment_port_types
from .api.project_type import _populate_project_types
from .api.service_type import _populate_service_types
from .api.work_order_type import _populate_work_order_types
from .client import SymphonyClient


"""Psym is a python package that allows for querying and modifying the Symphony data using graphql queries.

This module contains the client that allows to connect to inventory. The client
allows different kind of operations: querying and creating of locations, equipments,
positions and links.

Example of how to connect:
```
from psym import PsymClient
# since symphony is multi tenant system you will need to insert which
# partner you connect as
client = PsymClient(email, password, "tenant_name")
location = client.add_location(
    location_hirerchy=[
        ("Country", "England"),
        ("City", "Milton Keynes"),
        ("Site", "Bletchley Park")
    ],
    properties_dict={
        "Date Property": date.today(),
        "Lat/Lng Property": (-1.23,9.232),
        "E-mail Property": "user@fb.com",
        "Number Property": 11,
        "String Property": "aa",
        "Float Property": 1.23,
    },
    lat=-11.32,
    long=98.32,
    external_id=None
)
equipment = client.add_equipment(
    name="Router X123",
    equipment_type="Router",
    location=location,
    properties_dict={
        "Date Property": date.today(),
        "Lat/Lng Property": (-1.23,9.232),
        "E-mail Property": "user@fb.com",
        "Number Property": 11,
        "String Property": "aa",
        "Float Property": 1.23,
    }
)
```
"""


class UserDeactivatedException(Exception):
    pass


class PsymClient(SymphonyClient):

    from .api.file import add_location_image, delete_document, add_file, add_files
    from .api.document_category import get_document_category_by_names
    from .api.location_type import (
        add_location_type,
        add_property_types_to_location_type,
        delete_location_type,
        get_location_types,
        get_location_type_by_id,
        get_location_type_by_name,
        edit_location_type,
        delete_locations_by_location_type,
        delete_location_type_with_locations,
    )
    from .api.location import (
        get_location,
        get_location_by_external_id,
        get_location_children,
        get_location_documents,
        delete_location,
        add_location,
        edit_location,
        move_location,
        get_locations,
    )
    from .api.equipment_type import (
        copy_equipment_type,
        delete_equipment_type_with_equipments,
        _add_equipment_type,
        add_equipment_type,
        add_property_types_to_equipment_type,
        get_or_create_equipment_type,
        _edit_equipment_type,
        edit_equipment_type,
        get_equipment_type_property_type,
        get_equipment_type_property_type_by_external_id,
        edit_equipment_type_property_type,
        delete_equipment_type,
        get_equipment_type_by_id,
        get_equipment_types,
    )
    from .api.equipment import (
        add_equipment,
        add_equipment_to_position,
        get_equipment,
        get_equipment_in_position,
        get_equipments,
        delete_equipment,
        search_for_equipments,
        delete_all_equipments,
        copy_equipment_in_position,
        copy_equipment,
        get_equipment_type_of_equipment,
        get_or_create_equipment,
        get_or_create_equipment_in_position,
        edit_equipment,
        get_equipment_properties,
        get_equipments_by_type,
        get_equipments_by_location,
        get_equipment_by_external_id,
    )
    from .api.link import (
        add_link,
        get_link_in_port_of_equipment,
        get_links,
        get_all_links_and_port_names_of_equipment,
    )
    from .api.service import (
        add_service,
        add_service_endpoint,
        add_service_link,
        get_service,
    )
    from .api.service_type import (
        add_service_type,
        add_property_types_to_service_type,
        get_service_type,
        get_service_types,
        edit_service_type,
        delete_service_type,
        delete_service_type_with_services,
    )
    from .api.location_template import (
        apply_location_template_to_location,
        copy_equipment_with_all_attachments,
    )
    from .api.customer import add_customer, delete_customer, get_all_customers
    from .api.port_type import (
        add_equipment_port_type,
        get_equipment_port_type,
        edit_equipment_port_type,
        delete_equipment_port_type,
        get_equipment_port_types,
    )
    from .api.port import (
        get_port,
        edit_port_properties,
        edit_link_properties,
        get_ports,
    )
    from .api.user import (
        add_user,
        get_user,
        edit_user,
        deactivate_user,
        activate_user,
        get_users,
        get_active_users,
    )
    from .api.property_type import (
        get_property_type_id,
        get_property_types,
        get_property_type,
        get_property_type_by_external_id,
    )

    from .api.features import get_enabled_features, set_feature
    from .api.work_order_type import (
        get_work_order_type_by_name,
        get_work_order_type_by_id,
        get_work_order_types,
        add_work_order_type,
        add_property_types_to_work_order_type,
        delete_work_order_type,
    )
    from .api.work_order import (
        add_work_order,
        get_work_orders,
        get_work_order_by_id,
        edit_work_order,
        delete_work_order,
    )
    from .api.project_type import (
        add_project_type,
        add_property_types_to_project_type,
        delete_project_type,
        edit_project_type,
        get_project_type_by_id,
        get_project_types,
    )
    from .api.project import (
        add_project,
        delete_project,
        edit_project,
        get_project_by_id,
        get_projects,
    )

    def __init__(
        self,
        email: str,
        password: str,
        tenant: str = "fb-test",
        is_local_host: bool = False,
        is_dev_mode: bool = False,
    ) -> None:
        """This is the class to use for working with inventory. It contains all
        the functions to query and and edit the inventory.

        The __init__ method populates the different entity types
        for faster run of operations.

        Args:
            email (str): The email of the user to connect with.
            password (str): The password of the user to connect with.
            tenant (str, optional): The tenant to connect to -
                        should be the beginning of "{}.purpleheadband.cloud"
                        The default is "fb-test" for QA environment
            is_local_host (bool, optional): Used for developers to connect to
                        local inventory. This changes the address and also
                        disable verification of ssl certificate
            is_dev_mode (bool, optional): Used for developers to connect to
                        local inventory from a container. This changes the
                        address and also disable verification of ssl
                        certificate

        """
        super().__init__(
            email,
            password,
            tenant,
            f"Psym/{__version__}",
            is_local_host,
            is_dev_mode,
        )
        try:
            self.populate_types()
        except TransportServerError as e:
            err_msg = str(e.args[0])
            if "Forbidden" in err_msg:
                raise UserDeactivatedException()
            raise

    def populate_types(self) -> None:
        _populate_location_types(self)
        _populate_equipment_types(self)
        _populate_service_types(self)
        _populate_equipment_port_types(self)
        _populate_work_order_types(self)
        _populate_project_types(self)
