---
id: psym-release-notes
title: Python API psym package Release Notes
---

<!--
***
This is template for release notes
# new version number
 Features
 Changes
 Deprecated
 Removed
 Bug fixes
***
-->

***
## 2.2.1 - release date 1.11.2020
### Changes
- Refactor to internally use https://pypi.org/project/py-gql-client/
***

***
## 2.2.0 - release date 06.10.2020
### Features
- ServiceType:
    - `get_service_types`
- LocationType:
    - `edit_location_type`
    - `add_property_types_to_location_type`
- EquipmentType:
    - `add_property_types_to_equipment_type`
- WorkOrderType:
    - `add_property_types_to_work_order_type`
- ServiceType:
    - `add_property_types_to_service_type`
### Bug fixes
***


***
## 2.1.0 - release date 24.09.2020
### Features
- Project:
    - `add_project`
    - `delete_project`
    - `edit_project`
    - `get_project_by_id`
    - `get_projects`
- ProjectType:
    - `add_project_type`
    - `delete_project_type`
    - `edit_project_type`
    - `get_project_type_by_id`
    - `get_project_types`
- PortType:
    - `get_equipment_port_types`
- LocationType:
    - `delete_location_type`
    - `get_location_type_by_id`
    - `get_location_types`
- EquipmentType:
    - `delete_equipment_type`
    - `get_equipment_type_by_id`
    - `get_equipment_types`
### Bug fixes
***


***
## 2.0.0 - release date 13.09.2020
### Features
- WorkOrder:
    - `add_work_order`
    - `delete_work_order`
    - `edit_work_order`
    - `get_work_order_by_id`
    - `get_work_orders`
### Bug fixes
### Breaking Changes
- `EquipmentPortDefinition` has new attributes: `visible_label` and `port_type_name`
***


***
## 1.0.0 - release date 30.08.2020
### Features
- WorkOrderType:
    - `get_work_order_type_by_name`
    - `get_work_order_type_by_id`
    - `get_work_order_types`
    - `add_work_order_type`
    - `delete_work_order_type`
### Bug fixes
### Breaking Changes
- `InventoryClient` -> `PsymClient`
- `from pysymphony import SymphonyClient` -> `from psym.client import SymphonyClient`
***
