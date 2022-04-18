Psym is a python package that allows for querying and modifying the Symphony data using graphql queries.
Graphql is a query language developed by Facebook (https://graphql.org/)

## Prerequisites

* Python >= 3.7

## Installation

* Install it with:

```
pip install psym
```

## Usage

* First connect to symphony with your credentials

```python
from psym import PsymClient
# since symphony is multi tenant system you will need to insert which partner you connect as
client = PsymClient(email, password, tenant_name)
```
  * The tenant is the company name
* Start creating location types, equipment types:
```python
locationType = client.add_location_type("City", [])
equipment_type = client.add_equipment_type("Antenna HW", "Category Name", [("altitude", "int", None, True)], {}, [])
```
* Start creating locations, equipment and links:
```python
location = client.add_location(-1.22,2.66, ('City', 'New York'))
equipment = client.add_equipment('HW1569', 'Antenna HW', location, {'altitude': 53.5})
```

## License

psym is `BSD License` licensed, as found in the `LICENSE` file.
