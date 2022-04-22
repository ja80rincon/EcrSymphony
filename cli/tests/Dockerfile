# Copyright (c) 2004-present Facebook All rights reserved.
# Use of this source code is governed by a BSD-style
# license that can be found in the LICENSE file.

FROM python:3.8

RUN pip install unittest-xml-reporting websocket-client

COPY cli/ ./
RUN python setup.py -q install

# Switch to symphony directory
WORKDIR /src/symphony/cli

CMD ["python", "-m", "tests.runner"]
