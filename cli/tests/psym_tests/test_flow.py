#!/usr/bin/env python3
# Copyright (c) 2004-present Facebook All rights reserved.
# Use of this source code is governed by a BSD-style
# license that can be found in the LICENSE file.


import time
from typing import Any, Dict, List
from unittest import skip

from psym.api._flow import add_flow_draft, import_flow_draft, publish_flow, start_flow

from ..utils.base_test import BaseTest
from ..utils.constant import TEST_USER_EMAIL, TestMode
from .subscription_client import SubscriptionClient


@skip("fixme")
class TestFlow(BaseTest):
    def test_start_flow_and_wait_for_completion(self) -> None:
        from ..utils import TEST_MODE

        url = "wss://fb-test.localtest.me/graph/query"
        if TEST_MODE == TestMode.DEV:
            url = "wss://fb-test.thesymphony.cloud/graph/query"

        sub_client = SubscriptionClient(url, TEST_USER_EMAIL, TEST_USER_EMAIL)
        flow_instances_done: List[Dict[str, str]] = []

        def callback(_id: str, data: Dict[str, Any]) -> None:
            flow_instances_done.append(data["payload"]["data"]["flowInstanceDone"])

        query = """
            subscription {
                flowInstanceDone {
                    id
                    status
                }
            }
        """

        sub_id = sub_client.subscribe(query, callback=callback)

        flow_draft = add_flow_draft(self.client, name="Flow Draft")
        flow_draft = import_flow_draft(
            self.client, id=flow_draft.id, name=flow_draft.name, start_block_cid="start"
        )
        flow = publish_flow(self.client, flow_draft_id=flow_draft.id)
        flow_instance = start_flow(self.client, flow_id=flow.id)

        i = 0
        while len(flow_instances_done) == 0:
            time.sleep(1)
            i = i + 1
            if i == 5:
                break

        self.assertEqual(1, len(flow_instances_done))
        self.assertEqual(flow_instance.id, flow_instances_done[0]["id"])
        self.assertEqual("COMPLETED", flow_instances_done[0]["status"])

        sub_client.stop_subscribe(sub_id)
        sub_client.close()
