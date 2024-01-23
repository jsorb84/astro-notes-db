---
title: Python Pydantic Notes
description: Notes on the Python Pydantic Package
keywords: python, pydantic, notes, guide, types
author: Urban
---

# Pydantic Documentation [¶](https://docs.pydantic.dev/)

# Models [¶](https://docs.pydantic.dev/latest/api/base_model/)

> In Pydantic, the term "validation" refers to the process of instantiating a model (or other type) that adheres to specified types and constraints. Pydantic guarantees the types and constraints of the output, not the input data. This distinction becomes apparent when considering that Pydantic's `ValidationError` is raised when data cannot be successfully parsed into a model instance.
>
> While this distinction may initially seem subtle, it holds practical significance. In some cases, "validation" goes beyond just model creation, and can include the copying and coercion of data. This can involve copying arguments passed to the constructor in order to perform coercion to a new type without mutating the original input data. For a more in-depth understanding of the implications for your usage, refer to the [Data Conversion](https://docs.pydantic.dev/latest/concepts/models/#data-conversion) and [Attribute Copies](https://docs.pydantic.dev/latest/concepts/models/#attribute-copies) sections below.
>
> In essence, Pydantic's primary goal is to assure that the resulting structure post-processing (termed "validation") precisely conforms to the applied type hints. Given the widespread adoption of "validation" as the colloquial term for this process, we will consistently use it in our documentation.
>
> While the terms "parse" and "validation" were previously used interchangeably, moving forward, we aim to exclusively employ "validate", with "parse" reserved specifically for discussions related to [JSON parsing](https://docs.pydantic.dev/latest/concepts/json/).

## `pydantic.BaseModel`

```python
from pydantic import BaseModel

class User(BaseModel):
	id: int
	name: str

u = User(id=123, name="John Doe")
```

> Either `.model_dump()` or `dict(user)` will provide a dict of fields, but `.model_dump()` can take numerous other arguments. (Note that `dict(user)` will not recursively convert nested models into dicts, but `.model_dump()` will.)

### Model Methods & Properties [¶](https://docs.pydantic.dev/latest/concepts/models/#model-methods-and-properties "Permanent link")

The example above only shows the tip of the iceberg of what models can do. Models possess the following methods and attributes:

- [`model_computed_fields`](https://docs.pydantic.dev/latest/api/base_model/#pydantic.main.BaseModel.model_computed_fields): a dictionary of the computed fields of this model instance.
- [`model_construct()`](https://docs.pydantic.dev/latest/api/base_model/#pydantic.main.BaseModel.model_construct): a class method for creating models without running validation. See [Creating models without validation](https://docs.pydantic.dev/latest/concepts/models/#creating-models-without-validation).
- [`model_copy()`](https://docs.pydantic.dev/latest/api/base_model/#pydantic.main.BaseModel.model_copy): returns a copy (by default, shallow copy) of the model. See [Serialization](https://docs.pydantic.dev/latest/concepts/serialization/#modelcopy).
- [`model_dump()`](https://docs.pydantic.dev/latest/api/base_model/#pydantic.main.BaseModel.model_dump): returns a dictionary of the model's fields and values. See [Serialization](https://docs.pydantic.dev/latest/concepts/serialization/#modeldump).
- [`model_dump_json()`](https://docs.pydantic.dev/latest/api/base_model/#pydantic.main.BaseModel.model_dump_json): returns a JSON string representation of [`model_dump()`](https://docs.pydantic.dev/latest/api/base_model/#pydantic.main.BaseModel.model_dump). See [Serialization](https://docs.pydantic.dev/latest/concepts/serialization/#modeldumpjson).
- [`model_extra`](https://docs.pydantic.dev/latest/api/base_model/#pydantic.main.BaseModel.model_extra): get extra fields set during validation.
- [`model_fields_set`](https://docs.pydantic.dev/latest/api/base_model/#pydantic.main.BaseModel.model_fields_set): set of fields which were set when the model instance was initialized.
- [`model_json_schema()`](https://docs.pydantic.dev/latest/api/base_model/#pydantic.main.BaseModel.model_json_schema): returns a jsonable dictionary representing the model as JSON Schema. See [JSON Schema](https://docs.pydantic.dev/latest/concepts/json_schema/).
- [`model_parametrized_name()`](https://docs.pydantic.dev/latest/api/base_model/#pydantic.main.BaseModel.model_parametrized_name): compute the class name for parametrizations of generic classes.
- [`model_post_init()`](https://docs.pydantic.dev/latest/api/base_model/#pydantic.main.BaseModel.model_post_init): perform additional initialization after the model is initialized.
- [`model_rebuild()`](https://docs.pydantic.dev/latest/api/base_model/#pydantic.main.BaseModel.model_rebuild): rebuild the model schema, which also supports building recursive generic models. See [Rebuild model schema](https://docs.pydantic.dev/latest/concepts/models/#rebuild-model-schema).
- [`model_validate()`](https://docs.pydantic.dev/latest/api/base_model/#pydantic.main.BaseModel.model_validate): a utility for loading any object into a model. See [Helper functions](https://docs.pydantic.dev/latest/concepts/models/#helper-functions).
- [`model_validate_json()`](https://docs.pydantic.dev/latest/api/base_model/#pydantic.main.BaseModel.model_validate_json): a utility for validating the given JSON data against the Pydantic model. See [Helper functions](https://docs.pydantic.dev/latest/concepts/models/#helper-functions).

### Generic Models

```python
from typing import Generic, TypeVar
from pydantic import BaseModel

T = TypeVar("T")

class User(BaseModel, Generic[T]):
	id: int
	name: str
	data: list[T]
```

### Dynamic Model Creation

Models can be created dynamically using `pydantic.create_model(...)`

> Fields are defined by a tuple of the form `(<type>, <default value>)`. The special keyword arguments `__config__` and `__base__` can be used to customise the new model. This includes extending a base model with extra fields.

- `__base__` - Inherit from a base class
- `__validators__` - Validators

```python
from pydantic import create_model, BaseModel

DynamicModel = create_model(
	'DynamicModel', foo=(str, ...), bar=(int, 123)
)
# Classes are Identical
class StaticFoobarModel(BaseModel):
	foo: str
	bar: int = 123
```

## `RootModel` [¶](https://docs.pydantic.dev/latest/api/root_model/)

> Pydantic models can be defined with a "custom root type" by subclassing [`pydantic.RootModel`](https://docs.pydantic.dev/latest/api/root_model/#pydantic.root_model.RootModel).
>
> The root type can be any type supported by Pydantic, and is specified by the generic parameter to `RootModel`. The root value can be passed to the model `__init__` or [`model_validate`](https://docs.pydantic.dev/latest/api/base_model/#pydantic.main.BaseModel.model_validate) via the first and only argument.

**Example**

```python
from typing import Dict, List
from pydantic import RootModel

Pets = RootModel[List[str]]
PetsByName = RootModel[Dict[str, str]]
```

### Extending With `RootModel`

```python
from typing import List
from pydantic import RootModel
class Pets(RootModel):
	root: List[str]
	def __iter__(self):
		return iter(self.root)
	def __getitem__(self, item):
		return self.root[item]
```

## Immutability

> Models can be configured to be immutable via `model_config['frozen'] = True`. When this is set, attempting to change the values of instance attributes will raise errors.

# Fields

```python
from pydantic import BaseModel, Field

class User(BaseModel):
	name: str = Field(default="John Doe")
```

## Fields + `Annotated`

```python
from pydantic import BaseModel, Field
from typing_extensions import Annotated
# Annotations will add metadata to the field.
class User(BaseModel):
	id: Annotated[str, Field(...)]
```

## Field Aliases

- `alias` = Both Validation, and Serializable Alias
- `validation_alias` = Validation Only
- `serialization_alias` = Serialization Alias

```python
print(user.model_dump(by_alias=True))
```

# Configuration

```python
from pydantic import BaseModel, ConfigDict, ValidationError


class Model(BaseModel):
    model_config = ConfigDict(str_max_length=10)
    v: str

try:
    m = Model(v='x' * 20)
except ValidationError as e:
    print(e)
    """
    1 validation error for Model
    v
      String should have at most 10 characters [type=string_too_long, input_value='xxxxxxxxxxxxxxxxxxxx', input_type=str]
    """

```
