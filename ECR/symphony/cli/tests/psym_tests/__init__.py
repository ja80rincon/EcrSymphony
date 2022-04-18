#!/usr/bin/env python3
# Copyright (c) 2004-present Facebook All rights reserved.
# Use of this source code is governed by a BSD-style
# license that can be found in the LICENSE file.

from typing import Optional
from unittest import TestSuite
from unittest.loader import TestLoader
from ..utils import init_cleaner, init_client, wait_for_platform
from ..utils.constant import TEST_USER_EMAIL


def load_tests(
    loader: TestLoader, tests: TestSuite, pattern: Optional[str]
) -> TestSuite:

    from .test_equipment import TestEquipment
    from .test_equipment_type import TestEquipmentType
    from .test_flow import TestFlow
    from .test_link import TestLink
    from .test_location import TestLocation
    from .test_port_type import TestEquipmentPortType
    from .test_service import TestService
    from .test_service_type import TestServiceType
    from .test_user import TestUser
    from .test_work_order import TestWorkOrder
    from .test_work_order_type import TestWorkOrderType
    from .test_site_survey import TestSiteSurvey
    from .test_work_order_subscription import TestWorkOrderSubscription
    from .test_project_type import TestProjectType
    from .test_project import TestProject
    from .test_location_type import TestLocationType

    TESTS = [
        TestEquipment,
        TestEquipmentType,
        TestLink,
        TestLocation,
        TestLocationType,
        TestEquipmentPortType,
        TestService,
        TestServiceType,
        TestUser,
        TestWorkOrder,
        TestWorkOrderType,
        TestSiteSurvey,
        # TestWorkOrderSubscription,
        TestProjectType,
        TestProject,
        TestFlow,
    ]

    print("Waiting for symphony to be ready")
    wait_for_platform()
    print("Initializing client")
    client = init_client(TEST_USER_EMAIL, TEST_USER_EMAIL)
    print("Initializing cleaner")
    cleaner = init_cleaner()
    print("Packing tests")
    test_suite = TestSuite()
    for test_class in TESTS:
        testCaseNames = loader.getTestCaseNames(test_class)
        for test_case_name in testCaseNames:
            test_suite.addTest(test_class(test_case_name, client, cleaner))
    return test_suite
