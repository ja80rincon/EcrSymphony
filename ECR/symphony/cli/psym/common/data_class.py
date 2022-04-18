#!/usr/bin/env python3
# Copyright (c) 2004-present Facebook All rights reserved.
# Use of this source code is governed by a BSD-style
# license that can be found in the LICENSE file.

from datetime import date, datetime
from numbers import Number
from typing import (
    Any,
    Dict,
    List,
    NamedTuple,
    Optional,
    Sequence,
    Tuple,
    Type,
    TypeVar,
    Union,
)

from psym.graphql.enum.project_priority import ProjectPriority
from psym.graphql.enum.property_kind import PropertyKind
from psym.graphql.enum.user_role import UserRole
from psym.graphql.enum.user_status import UserStatus
from psym.graphql.enum.flow_instance_status import FlowInstanceStatus
from psym.graphql.enum.work_order_priority import WorkOrderPriority
from psym.graphql.enum.work_order_status import WorkOrderStatus
from psym.graphql.fragment import document_category
from psym.graphql.fragment.equipment_port_definition import (
    EquipmentPortDefinitionFragment,
)
from psym.graphql.fragment.equipment_position_definition import (
    EquipmentPositionDefinitionFragment,
)
from psym.graphql.fragment.property import PropertyFragment

from ..graphql.enum.image_entity import ImageEntity

ReturnType = TypeVar("ReturnType")
PropertyValue = Union[date, datetime, float, int, str, bool, Tuple[float, float]]
PropertyValueType = Union[
    Type[date],
    Type[datetime],
    Type[float],
    Type[int],
    Type[str],
    Type[bool],
    Type[Tuple[float, float]],
]


class PropertyDefinition(NamedTuple):
    """
    :param property_name: Type name
    :type property_name: str
    :param property_kind: Property kind
    :type property_kind: class:`~psym.graphql.enum.property_kind.PropertyKind`
    :param default_raw_value: Default property value as a string

        * string - "string"
        * int - "123"
        * bool - "true" / "True" / "TRUE"
        * float - "0.123456"
        * date - "24/10/2020"
        * range - "0.123456 - 0.2345" / "1 - 2"
        * email - "email@some.domain"
        * gps_location - "0.1234, 0.2345"

    :type default_raw_value: str, optional
    :param id: ID
    :type id: str, optional
    :param is_fixed: Fixed value flag
    :type is_fixed: bool, optional
    :param external_id: Property type external ID
    :type external_id: str, optional
    :param is_mandatory: Mandatory value flag
    :type is_mandatory: bool, optional
    :param is_deleted: Is delete flag
    :type is_deleted: bool, optional
    """

    property_name: str
    property_kind: PropertyKind
    default_raw_value: Optional[str]
    id: Optional[str] = None
    is_fixed: Optional[bool] = False
    external_id: Optional[str] = None
    is_mandatory: Optional[bool] = False
    is_deleted: Optional[bool] = False


class DataTypeName(NamedTuple):
    """
    :param data_type: Data type
    :type data_type: :attr:`~psym.graphql.data_class.PropertyValueType`
    :param graphql_field_name: GraphQL field name, in case of `gps_location` it is Tuple[`latitudeValue`, `longitudeValue`]
    :type graphql_field_name: Tuple[str, ...]
    """

    data_type: PropertyValueType
    graphql_field_name: Tuple[str, ...]


TYPE_AND_FIELD_NAME = {
    "date": DataTypeName(data_type=date, graphql_field_name=("stringValue",)),
    "datetime_local": DataTypeName(
        data_type=datetime, graphql_field_name=("stringValue",)
    ),
    "float": DataTypeName(data_type=float, graphql_field_name=("floatValue",)),
    "int": DataTypeName(data_type=int, graphql_field_name=("intValue",)),
    "email": DataTypeName(data_type=str, graphql_field_name=("stringValue",)),
    "string": DataTypeName(data_type=str, graphql_field_name=("stringValue",)),
    "bool": DataTypeName(data_type=bool, graphql_field_name=("booleanValue",)),
    "gps_location": DataTypeName(
        data_type=tuple,  # type: ignore
        graphql_field_name=("latitudeValue", "longitudeValue"),
    ),
    "enum": DataTypeName(data_type=str, graphql_field_name=("stringValue",)),
}


class DocumentCategory(NamedTuple):
    """
    :param name: Category name
    :type name: str
    :param dc_index: Category name index
    :type dc_index: int, optional
    :param id: ID
    :type id: str, optional
    """

    name: str
    index: Optional[int] = None
    id: Optional[str] = None


class LocationType(NamedTuple):
    """
    :param name: Name
    :type name: str
    :param id: ID
    :type id: str
    :param property_types: PropertyTypes sequence
    :type property_types: Sequence[ :class:`~psym.common.data_class.PropertyDefinition` ]
    :param map_type: Map type
    :type map_type: str, optional
    :param map_zoom_level: Map zoom level
    :type map_zoom_level: int, optional
    :param is_site: Is site flag for location
    :type is_site: bool
    """

    name: str
    id: str
    property_types: Sequence[PropertyDefinition]
    document_categories: Sequence[DocumentCategory]
    map_type: Optional[str]
    map_zoom_level: Optional[int]
    is_site: bool


class Location(NamedTuple):
    """
    :param name: name
    :type name: str
    :param id: ID
    :type id: str
    :param latitude: latitude
    :type latitude: Number
    :param longitude: longitude
    :type longitude: Number
    :param external_id: external ID
    :type external_id: str, optional
    :param location_type_name: Location type name
    :type location_type_name: str
    :param properties: PropertyFragment sequence
    :type properties: Sequence[ :class:`~psym.graphql.fragment.property.PropertyFragment` ])
    """

    name: str
    id: str
    latitude: Number
    longitude: Number
    external_id: Optional[str]
    location_type_name: str
    properties: Sequence[PropertyFragment]


class EquipmentType(NamedTuple):
    """
    :param name: Name
    :type name: str
    :param category: Category
    :type category: str, optional
    :param id: ID
    :type id: str
    :param property_types: PropertyDefinitions sequence
    :type property_types: Sequence[ :class:`~psym.common.data_class.PropertyDefinition` ]
    :param position_definitions: EquipmentPositionDefinitionFragments sequence
    :type position_definitions: Sequence[ :class:`~psym.graphql.fragment.equipment_position_definition.EquipmentPositionDefinitionFragment` ]
    :param port_definitions: EquipmentPortDefinitionFragments sequence
    :type port_definitions: Sequence[ :class:`~psym.graphql.fragment.equipment_port_definition.EquipmentPortDefinitionFragment` ]
    """

    name: str
    category: Optional[str]
    id: str
    property_types: Sequence[PropertyDefinition]
    position_definitions: Sequence[EquipmentPositionDefinitionFragment]
    port_definitions: Sequence[EquipmentPortDefinitionFragment]


class EquipmentPortType(NamedTuple):
    """
    :param id: ID
    :type id: str
    :param name: Name
    :type name: str
    :param property_types: Property types sequence
    :type property_types: Sequence[ :class:`~psym.common.data_class.PropertyDefinition` ]
    :param link_property_types: Link property types sequence
    :type link_property_types: Sequence[ :class:`~psym.common.data_class.PropertyDefinition` ]
    """

    id: str
    name: str
    property_types: Sequence[PropertyDefinition]
    link_property_types: Sequence[PropertyDefinition]


class Equipment(NamedTuple):
    """
    :param id: ID
    :type id: str
    :param external_id: External ID
    :type external_id: str, optional
    :param name: Name
    :type name: str
    :param equipment_type_name: Equipment type name
    :type equipment_type_name: str
    :param properties: PropertyFragment sequence
    :type properties: Sequence[ :class:`~psym.graphql.fragment.property.PropertyFragment` ])
    """

    id: str
    external_id: Optional[str]
    name: str
    equipment_type_name: str
    properties: Sequence[PropertyFragment]


class Link(NamedTuple):
    """
    :param id: Link ID
    :type id: str
    :param properties: Properties sequence
    :type properties: Sequence[ :class:`~psym.graphql.fragment.property.PropertyFragment` ]
    :param service_ids: Service IDs list
    :type service_ids: List[str]
    """

    id: str
    properties: Sequence[PropertyFragment]
    service_ids: List[str]


class EquipmentPortDefinitionAlias(NamedTuple):
    """
    :param name: Name
    :type name: str
    :param id: ID
    :type id: str, optional
    """

    name: str
    id: Optional[str] = None


class EquipmentPortDefinition(NamedTuple):
    """
    :param name: Name
    :type name: str
    :param id: ID
    :type id: str, optional
    :param visible_label: Visible label
    :type visible_label: str, optional
    :param port_definition_index: Index
    :type port_definition_index: int, optional
    :param port_type_name: Port type name
    :type port_type_name: str, optional
    :param connected_ports: ConnectedPorts list
    :type connected_ports: List [ :class:`~psym.common.data_class.EquipmentPortDefinitionAlias] , optional
    """

    name: str
    connected_ports: List[EquipmentPortDefinitionAlias]
    id: Optional[str] = None
    visible_label: Optional[str] = None
    port_definition_index: Optional[int] = None
    port_type_name: Optional[str] = None


class EquipmentPort(NamedTuple):
    """
    :param id: Equipment port ID
    :type id: str
    :param properties: Properties sequence
    :type properties: Sequence[ :class:`~psym.graphql.fragment.property.PropertyFragment` ]
    :param definition: EquipmentPortDefinition object
    :type definition: :class:`~psym.common.data_class.EquipmentPortDefinition`
    :param link: Link object
    :type link: :class:`~psym.common.data_class.Link`
    """

    id: str
    properties: Sequence[PropertyFragment]
    definition: EquipmentPortDefinition
    link: Optional[Link]


class Customer(NamedTuple):
    """
    :param id: ID
    :type id: str
    :param name: Name
    :type name: str
    :param external_id: External ID
    :type external_id: str, optional
    """

    id: str
    name: str
    external_id: Optional[str]


class Service(NamedTuple):
    """
    :param name: Name
    :type name: str
    :param id: ID
    :type id: str
    :param external_id: External ID
    :type external_id: str, optional
    :param service_type_name: Existing service type name
    :type service_type_name: str
    :param customer: Customer object
    :type customer: :class:`~psym.common.data_class.Customer`, optional
    :param properties: Properties sequence
    :type properties: Sequence[ :class:`~psym.graphql.fragment.property..PropertyFragment` ]
    """

    id: str
    name: str
    external_id: Optional[str]
    service_type_name: str
    customer: Optional[Customer]
    properties: Sequence[PropertyFragment]


class ServiceEndpointDefinition(NamedTuple):
    """
    :param id: ID
    :type id: str, optional
    :param name: Name
    :type name: str
    :param endpoint_definition_index: Index
    :type endpoint_definition_index: int
    :param role: Role
    :type role: str, optional
    :param equipment_type_id: Equipment type ID
    :type equipment_type_id: str
    """

    id: Optional[str]
    name: str
    endpoint_definition_index: int
    role: Optional[str]
    equipment_type_id: str


class ServiceEndpoint(NamedTuple):
    """
    :param id: ID
    :type id: str
    :param equipment_id: Existing equipment ID
    :type equipment_id: str
    :param service_id: Existing service ID
    :type service_id: str
    :param definition_id: Existing service endpoint definition ID
    :type definition_id: str
    """

    id: str
    equipment_id: str
    service_id: str
    definition_id: str


class ServiceType(NamedTuple):
    """
    :param name: Name
    :type name: str
    :param id: ID
    :type id: str
    :param has_customer: Customer existence flag
    :type has_customer: bool
    :param property_types: PropertyDefinitions sequence
    :type property_types: Sequence[ :c;ass:`~psym.common.data_class.PropertyDefinition` ]
    :param endpoint_definitions: ServiceEndpointDefinitions list
    :type endpoint_definitions: List[ :class:`~psym.common.data_class.ServiceEndpointDefinition` ]
    """

    name: str
    id: str
    has_customer: bool
    property_types: Sequence[PropertyDefinition]
    endpoint_definitions: List[ServiceEndpointDefinition]


class Document(NamedTuple):
    """
    :param id: ID
    :type id: str
    :param name: Name
    :type name: str
    :param parent_id: Parent ID
    :type parent_id: str
    :param parent_entity: Parent entity
    :type parent_entity: :class:`~psym.graphql.enum.image_entity.ImageEntity`
    :param category: Category
    :type category: str, optional
    """

    id: str
    name: str
    parent_id: str
    parent_entity: ImageEntity
    category: Optional[str]
    document_category: Optional[DocumentCategory]


class User(NamedTuple):
    """
    :param id: ID
    :type id: str
    :param auth_id: auth ID
    :type auth_id: str
    :param email: email
    :type email: str
    :param status: status
    :type status: :class:`~psym.graphql.enum.user_role.UserStatus`
    :param role: role
    :type role: :class:`~psym.graphql.enum.user_status.UserRole`
    """

    id: str
    auth_id: str
    email: str
    status: UserStatus
    role: UserRole


class SiteSurvey(NamedTuple):
    """
    :param name: Name
    :type name: str
    :param survey_id: ID
    :type survey_id: str
    :param completion_time: Complition time
    :type completion_time: datetime
    :param source_file_id: Source file ID
    :type source_file_id: str, optional
    :param source_file_name: Source file name
    :type source_file_name: str, optional
    :param source_file_key: Source file key
    :type source_file_key: str, optional
    :param forms: Forms
    :type forms: Dict[str, Dict[str, Any]]
    """

    name: str
    survey_id: str
    completion_time: datetime
    source_file_id: Optional[str]
    source_file_name: Optional[str]
    source_file_key: Optional[str]
    forms: Dict[str, Dict[str, Any]]


class WorkOrderType(NamedTuple):
    """
    :param id: ID
    :type id: str
    :param name: Work order type name
    :type name: str
    :param description: Work order type description
    :type description: str, optional
    :param property_types: PropertyTypes list
    :type property_types: Sequence[ :class:`~psym.common.data_class.PropertyDefinition` ]
    """

    id: str
    name: str
    description: Optional[str]
    property_types: Sequence[PropertyDefinition]


class WorkOrderDefinition(NamedTuple):
    """
    :param definition_index: Work order definition index
    :type definition_index: int, optional
    :param work_order_type_id: Work order type ID
    :type work_order_type_id: str
    :param id: ID
    :type id: str, optional
    """

    definition_index: Optional[int]
    work_order_type_id: str
    id: Optional[str] = None


class WorkOrder(NamedTuple):
    """
    :param id: ID
    :type id: str
    :param name: Name
    :type name: str
    :param description: Description
    :type description: str, optional
    :param work_order_type_name: Existing work order type name
    :type work_order_type_name: str
    :param location_id: Existing location ID
    :type location_id: str, optional
    :param project_id: Existing project ID
    :type project_id: str, optional
    :param properties: PropertyFragment sequence
    :type properties: Sequence[ :class:`~psym.graphql.fragment.property.PropertyFragment` ])
    :param owner_id: Existing user ID, work order owner
    :type owner_id: str, optional
    :param assignee_id: Existing user ID, assigned to work order
    :type assignee_id: str, optional
    :param status: Work order status
    :type status: :class:`~psym.graphql.enum.work_order_status.WorkOrderStatus`, optional
    :param priority: Work order priority
    :type priority: :class:`~psym.graphql.enum.work_order_priority.WorkOrderPriority`, optional
    """

    id: str
    name: str
    description: Optional[str]
    work_order_type_name: str
    location_id: Optional[str]
    project_id: Optional[str]
    properties: Sequence[PropertyFragment]
    owner_id: Optional[str]
    assignee_id: Optional[str]
    status: Optional[WorkOrderStatus]
    priority: Optional[WorkOrderPriority]


class ProjectType(NamedTuple):
    """
    :param id: ID
    :type id: str
    :param name: Project type name
    :type name: str
    :param description: Project type description
    :type description: str, optional
    :param property_types: PropertyTypes sequence
    :type property_types: Sequence[ :class:`~psym.common.data_class.PropertyDefinition` ]
    :param work_order_definitions: WorkOrderDefinitions list
    :type work_order_definitions: List[ :class:`~psym.common.data_class.WorkOrderDefinition` ]
    """

    id: str
    name: str
    description: Optional[str]
    property_types: Sequence[PropertyDefinition]
    work_order_definitions: List[WorkOrderDefinition]


class Project(NamedTuple):
    """
    :param id: ID
    :type id: str
    :param name: Project name
    :type name: str
    :param description: Project description
    :type description: str, optional
    :param priority: Project priority
    :type priority: :class:`~psym.graphql.enum.project_priority.ProjectPriority`
    :param created_by: Existing user ID, project creator
    :type created_by: str, optional
    :param project_type_name: Existing project type name
    :type project_type_name: str
    :param project_type_id: Existing project type ID
    :type project_type_id: str
    :param location_id: Existing location ID
    :type location_id: str, optional
    :param work_orders: WorkOrders list
    :type work_orders: List[ :class:`~psym.common.data_class.WorkOrder` ]
    :param properties: PropertyFragment sequence
    :type properties: Sequence[ :class:`~psym.graphql.fragment.property.PropertyFragment` ]
    """

    id: str
    name: str
    description: Optional[str]
    priority: ProjectPriority
    created_by: Optional[str]
    project_type_name: str
    project_type_id: str
    location_id: Optional[str]
    work_orders: List[WorkOrder]
    properties: Sequence[PropertyFragment]


class FlowDraft(NamedTuple):
    """
    :param id: ID
    :type id: str
    :param name: Flow draft name
    :type name: str
    """

    id: str
    name: str


class Flow(NamedTuple):
    """
    :param id: ID
    :type id: str
    :param name: Flow name
    :type name: str
    """

    id: str
    name: str


class FlowInstance(NamedTuple):
    """
    :param id: ID
    :type id: str
    :param status: status
    :type status: class:`~psym.graphql.enum.flow_instance_status.FlowInstanceStatus`
    """

    id: str
    status: FlowInstanceStatus
