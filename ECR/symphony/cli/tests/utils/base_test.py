#!/usr/bin/env python3
# Copyright (c) 2004-present Facebook All rights reserved.
# Use of this source code is governed by a BSD-style
# license that can be found in the LICENSE file.

import unittest
from typing import Callable
from psym.client import SymphonyClient
from psym.common.cache import clear_types


class BaseTest(unittest.TestCase):
    def __init__(
        self, test_name: str, client: SymphonyClient, cleaner: Callable
    ) -> None:
        super().__init__(test_name)
        self.client = client
        self.cleaner = cleaner

    def setUp(self) -> None:
        self.cleaner()
        clear_types()
