---
id: psym
title: Python Symphony Tool
---

Psym is a python package that allows for querying and modifying the Symphony data using graphql queries.
Graphql is a query language developed by Facebook (https://graphql.org/)

## Prerequisites

* Python >= 3

## Installation

* Install it with:

```
pip install psym
```

## Usage

* First connect to Symphony with your credentials

```python
from psym import PsymClient
# since symphony is multi tenant system you will need to insert which partner you connect as
client = PsymClient(email, password, tenant_name)
```
  * The tenant is the company name (meaning, the word at the beginning of "{}.thesymphony.cloud", without "thesymphony.cloud")
* Start creating location types, equipment types in the inventory:
```python
locationType = client.add_location_type("City", [])
equipment_type = client.add_equipment_type("Antenna HW", "Category Name", [("altitude", "int", None, True)], {}, [])
```
* Start creating locations, equipment and links in the inventory:
```python
location = client.add_location(-1.22,2.66, ('City', 'New York'))
equipment = client.add_equipment('HW1569', 'Antenna HW', location, {'altitude': 53.5})
```

* The main APIs can all be found in [Python API Reference](../psym/html/index.html)

## Upload Site Survey Data

Psym allows you to export a json file of your site survey schema to an excel.

This excel uses different validations using the json file to make sure that the data is valid.

In order to create it:
```python
from psym.site_survey import export_to_excel
export_to_excel('survey_schemas/ipt_site.json', '~/site_survey.xlsx')
```

After the cotractor fills the excel with the information, you can use psym
to upload it to the correct location in iventory. You can choose the name of TSS and
when it was completed (could be useful if you upload old TSS)
```python
from psym import PsymClient
from datetime import datetime
client = PsymClient(email, password, "fb-test")
location = client.get_location(('Building', 'Asia-10037'))
client.upload_site_survey(location, 'My TSS 4', datetime.now(), '~/site_survey.xlsx', 'survey_schemas/ipt_site.json')
```

You can also query the site surveys of a location using `client.getSiteSurveys(location)`

## Code Example Of Bulk Import
```python
#!/usr/bin/env python3

import unicodecsv as csv
import sys
from collections import namedtuple
from psym import PsymClient


def import_tx_row(client, data):
    try:
        location = client.add_location(
            data.Latitud,
            data.Longitud,
            {"Codigo Unico Estacion": data.CodigoUnico, "Direccion": data.DIRECCION},
            ('Departamento', data.Departamento),
            ('Provincia', data.Provincia),
            ('Distrito', data.Distrito),
            ('Centro Poblado', data.CentroPoblado),
            ('Estacion', data.Estacion))
        VSATEquipment = None
        MWEquipment = None
        if data.VSATModel != "":
            equipment_type = "VSAT {}".format(data.VSATModel)
            VSATEquipment = client.add_equipment(data.VSATModel,
                                equipment_type,
                                location,
                                {"SAT Band": data.SATBand, "Satellite": data.Satellite})
        if data.MWModel != "":
            equipment_type = "MW{}".format(data.MWModel)
            MWEquipment = client.add_equipment(data.MWModel,
                                equipment_type,
                                location,
                                {})
        if VSATEquipment is not None and MWEquipment is not None:
            client.add_link(VSATEquipment, "Port A", MWEquipment, "Port A")
    except Exception as e:
        print(e)
        print(data)
        raise


def import_tx(email, password, csvPath):
    with open(csvPath, mode="rb") as infile:
        reader = csv.reader(infile, delimiter=',', encoding='utf-8')
        columnsRow = next(reader)
        columnsRow = ['ITEM'] + columnsRow[1:]
        Data = namedtuple("Data", columnsRow)
        client = PsymClient(email, password, "fb-test")
        for i, data in enumerate(map(Data._make, reader)):
            import_tx_row(client, data)


if __name__ == "__main__":
    if len(sys.argv) != 6:
        # flake8: noqa: E999
        print("Usage: ipt_tx.py {email} {password} {csv_path}")
        sys.exit(1)
    import_tx(sys.argv[1], sys.argv[2], sys.argv[3])
    sys.exit(0)

```

## License

This software is created by Facebook and will be given to any party of its choosing.
No party is allowed to copy, distribute, publish or modify the software without explicit
permission from Facebook.
