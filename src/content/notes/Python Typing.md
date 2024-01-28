---
title: Python Typing
description: Typing overview for python's typing module
author: Urban
keywords: python, typing, programming, notes
tags: ["Python", "Notes"]
coverImage: https://i.ytimg.com/vi/YfO28Ihehbk/maxresdefault.jpg
pubDate: 2024-01-12
---

# `typing` Module

### [Typing Cheat Sheet](https://mypy.readthedocs.io/en/stable/cheat_sheet_py3.html)

### [Static Typing /w Python](https://typing.readthedocs.io/en/latest/)

### [Param Spec Documentation](https://docs.python.org/3/library/typing.html#typing.ParamSpec)

# Important Types Quick Reference

- `typing.ClassVar`
  Used to mark a variable within a class as existing on the class itself vs instance (static variables sort-of)
- `typing.Optional`
  The same as `Union[X | None]`
- `typing.Concatenate`
  See [Concatenate / ParamSpec](https://docs.python.org/3/library/typing.html#typing.ParamSpec)
- `typing.Literal`
  Used to specify a literal type `Literal['W']` means the static letter `W`
- `typing.Required` & `typing.NotRequired`
  Used for `TypedDict` to specify required and non-required keys
- `typing.Unpack`
  Used to unpack for `**kwargs` so instead of saying `**kwargs: X` which means that each item inside `**kwargs` is type `X` we use `Unpack[X]` to unpack the typed dict allowing it to be used for `**kwargs`
- `typing.TypeVar` [¶](https://docs.python.org/3/library/typing.html#typing.TypeVar "Permalink to this definition")
  Base class for type variables / generics with a few special options
  - See also [`typing.TypeVarTuple`](https://docs.python.org/3/library/typing.html#typing.TypeVarTuple "Permalink to this definition") and [`typing.ParamSpec`](https://docs.python.org/3/library/typing.html#typing.ParamSpec)

### [Protocols](https://docs.python.org/3/library/typing.html#protocols "Permalink to this headline")

The following protocols are provided by the typing module. All are decorated with [`@runtime_checkable`](https://docs.python.org/3/library/typing.html#typing.runtime_checkable "typing.runtime_checkable").

*class* typing.SupportsAbs [¶](https://docs.python.org/3/library/typing.html#typing.SupportsAbs "Permalink to this definition")

An ABC with one abstract method `__abs__` that is covariant in its return type.

- *class* `typing.SupportsBytes` [¶](https://docs.python.org/3/library/typing.html#typing.SupportsBytes "Permalink to this definition")
  An ABC with one abstract method `__bytes__`.

- *class* `typing.SupportsComplex` [¶](https://docs.python.org/3/library/typing.html#typing.SupportsComplex "Permalink to this definition")
  An ABC with one abstract method `__complex__`.

- *class* `typing.SupportsFloat` [¶](https://docs.python.org/3/library/typing.html#typing.SupportsFloat "Permalink to this definition")
  An ABC with one abstract method `__float__`.

- *class* `typing.SupportsIndex` [¶](https://docs.python.org/3/library/typing.html#typing.SupportsIndex "Permalink to this definition")
  An ABC with one abstract method `__index__`.

- *class* `typing.SupportsInt` [¶](https://docs.python.org/3/library/typing.html#typing.SupportsInt "Permalink to this definition")
  An ABC with one abstract method `__int__`.

- *class* `typing.SupportsRound` [¶](https://docs.python.org/3/library/typing.html#typing.SupportsRound "Permalink to this definition")
  An ABC with one abstract method `__round__` that is covariant in its return type.

## Type Aliases

```python
from typing import TypeAlias
type Vector = list[float]
Vector: TypeAlias = list[float]
```

### `NewType`

```python
from typing import NewType
UserId = NewType('UserId', int)
some_id = UserId(123)
```

### `Callable` & `Awaitable` & `Iterable`

- A **_callable_** signifies that a variable will be a function that takes in some types `[]` of variables, and will return another type.
  - `Callable[[int], str]` - Indicates the function takes a `int` and returns a `str`
  - The argument list must be a list of types, a [`ParamSpec`](https://docs.python.org/3/library/typing.html#typing.ParamSpec "typing.ParamSpec"), [`Concatenate`](https://docs.python.org/3/library/typing.html#typing.Concatenate "typing.Concatenate"), or an ellipsis. The return type must be a single type.
  - If a literal ellipsis `...` is given as the argument list, it indicates that a callable with any arbitrary parameter list would be acceptable:
- An **_awaitable_** is an awaitable function
- An **_iterable_** is an iterable

## Generics

> Since type information about objects kept in containers cannot be statically inferred in a generic way, many container classes in the standard library support subscription to denote the expected types of container elements.

```python
from collections.abc import Mapping, Sequence

class Employee: ...

# Sequence[Employee] indicates that all elements in the sequence
# must be instances of "Employee".
# Mapping[str, str] indicates that all keys and all values in the mapping
# must be strings.
def notify_by_email(employees: Sequence[Employee],
	overrides: Mapping[str, str]) -> None: ...
```

### Functions and Classes

```python
from collections.abc import Sequence
from typing import TypeVar
def first[T](l: Sequence[T]) -> T:
	return l[0]

# Can also use TypeVar factory

U = TypeVar('U')
def second(l: Sequence[U]) -> U:
	return l[1]
```

## `ParamSpec`

`ParamSpec` allows for generics to be maintained in the case of something like a decorator. Use `ParamSpec` to infer the `*args` and `**kwargs` types

```python
from typing import Callable

def myDecorator[**P](fn: Callable[P, int]):
	def myFn(*args: P.args, **kwargs: P.kwargs):
		...
	return myFn

def someFn(a: int, b: float) -> int:
	return a * b
```

# `dataclasses`

> This module provides a decorator and functions for automatically adding generated [special method](https://docs.python.org/3/glossary.html#term-special-method)s such as [`__init__()`](https://docs.python.org/3/reference/datamodel.html#object.__init__ "object.__init__") and [`__repr__()`](https://docs.python.org/3/reference/datamodel.html#object.__repr__ "object.__repr__") to user-defined classes. It was originally described in [**PEP 557**](https://peps.python.org/pep-0557/).
>
> The member variables to use in these generated methods are defined using [**PEP 526**](https://peps.python.org/pep-0526/) type annotations. For example, this code:

```python
from dataclasses import dataclass

@dataclass
class Point:
	x: float
	y: float
```

Using the decorator automatically creates a `__init__()` method for the class such that it can be instantiated with

```python
Point(1.1, 2.2)
```

## Parameters for `dataclass`

> The parameters to [`dataclass()`](https://docs.python.org/3/library/dataclasses.html#dataclasses.dataclass "dataclasses.dataclass") are:
>
> - `init`: If true (the default), a [`__init__()`](https://docs.python.org/3/reference/datamodel.html#object.__init__ "object.__init__") method will be generated.
>   If the class already defines [`__init__()`](https://docs.python.org/3/reference/datamodel.html#object.__init__ "object.__init__"), this parameter is ignored.
> - `repr`: If true (the default), a [`__repr__()`](https://docs.python.org/3/reference/datamodel.html#object.__repr__ "object.__repr__") method will be generated. The generated repr string will have the class name and the name and repr of each field, in the order they are defined in the class. Fields that are marked as being excluded from the repr are not included. For example: `InventoryItem(name='widget', unit_price=3.0, quantity_on_hand=10)`.
>   If the class already defines [`__repr__()`](https://docs.python.org/3/reference/datamodel.html#object.__repr__ "object.__repr__"), this parameter is ignored.
> - `eq`: If true (the default), an [`__eq__()`](https://docs.python.org/3/reference/datamodel.html#object.__eq__ "object.__eq__") method will be generated. This method compares the class as if it were a tuple of its fields, in order. Both instances in the comparison must be of the identical type.
>   If the class already defines [`__eq__()`](https://docs.python.org/3/reference/datamodel.html#object.__eq__ "object.__eq__"), this parameter is ignored.
> - `order`: If true (the default is `False`), [`__lt__()`](https://docs.python.org/3/reference/datamodel.html#object.__lt__ "object.__lt__"), [`__le__()`](https://docs.python.org/3/reference/datamodel.html#object.__le__ "object.__le__"), [`__gt__()`](https://docs.python.org/3/reference/datamodel.html#object.__gt__ "object.__gt__"), and [`__ge__()`](https://docs.python.org/3/reference/datamodel.html#object.__ge__ "object.__ge__") methods will be generated. These compare the class as if it were a tuple of its fields, in order. Both instances in the comparison must be of the identical type. If `order` is true and `eq` is false, a [`ValueError`](https://docs.python.org/3/library/exceptions.html#ValueError "ValueError") is raised.
>
>   If the class already defines any of [`__lt__()`](https://docs.python.org/3/reference/datamodel.html#object.__lt__ "object.__lt__"), [`__le__()`](https://docs.python.org/3/reference/datamodel.html#object.__le__ "object.__le__"), [`__gt__()`](https://docs.python.org/3/reference/datamodel.html#object.__gt__ "object.__gt__"), or [`__ge__()`](https://docs.python.org/3/reference/datamodel.html#object.__ge__ "object.__ge__"), then [`TypeError`](https://docs.python.org/3/library/exceptions.html#TypeError "TypeError") is raised.
>
> - `unsafe_hash`: If `False` (the default), a [`__hash__()`](https://docs.python.org/3/reference/datamodel.html#object.__hash__ "object.__hash__") method is generated according to how `eq` and `frozen` are set.
>   [`__hash__()`](https://docs.python.org/3/reference/datamodel.html#object.__hash__ "object.__hash__") is used by built-in [`hash()`](https://docs.python.org/3/library/functions.html#hash "hash"), and when objects are added to hashed collections such as dictionaries and sets. Having a [`__hash__()`](https://docs.python.org/3/reference/datamodel.html#object.__hash__ "object.__hash__") implies that instances of the class are immutable. Mutability is a complicated property that depends on the programmer’s intent, the existence and behavior of [`__eq__()`](https://docs.python.org/3/reference/datamodel.html#object.__eq__ "object.__eq__"), and the values of the `eq` and `frozen` flags in the [`dataclass()`](https://docs.python.org/3/library/dataclasses.html#dataclasses.dataclass "dataclasses.dataclass") decorator.
>   By default, [`dataclass()`](https://docs.python.org/3/library/dataclasses.html#dataclasses.dataclass "dataclasses.dataclass") will not implicitly add a [`__hash__()`](https://docs.python.org/3/reference/datamodel.html#object.__hash__ "object.__hash__") method unless it is safe to do so. Neither will it add or change an existing explicitly defined [`__hash__()`](https://docs.python.org/3/reference/datamodel.html#object.__hash__ "object.__hash__") method. Setting the class attribute `__hash__ = None` has a specific meaning to Python, as described in the [`__hash__()`](https://docs.python.org/3/reference/datamodel.html#object.__hash__ "object.__hash__") documentation.
>   If [`__hash__()`](https://docs.python.org/3/reference/datamodel.html#object.__hash__ "object.__hash__") is not explicitly defined, or if it is set to `None`, then [`dataclass()`](https://docs.python.org/3/library/dataclasses.html#dataclasses.dataclass "dataclasses.dataclass") *may* add an implicit [`__hash__()`](https://docs.python.org/3/reference/datamodel.html#object.__hash__ "object.__hash__") method. Although not recommended, you can force [`dataclass()`](https://docs.python.org/3/library/dataclasses.html#dataclasses.dataclass "dataclasses.dataclass") to create a [`__hash__()`](https://docs.python.org/3/reference/datamodel.html#object.__hash__ "object.__hash__") method with `unsafe_hash=True`. This might be the case if your class is logically immutable but can nonetheless be mutated. This is a specialized use case and should be considered carefully.
>   Here are the rules governing implicit creation of a [`__hash__()`](https://docs.python.org/3/reference/datamodel.html#object.__hash__ "object.__hash__") method. Note that you cannot both have an explicit [`__hash__()`](https://docs.python.org/3/reference/datamodel.html#object.__hash__ "object.__hash__") method in your dataclass and set `unsafe_hash=True`; this will result in a [`TypeError`](https://docs.python.org/3/library/exceptions.html#TypeError "TypeError").
>   If `eq` and `frozen` are both true, by default [`dataclass()`](https://docs.python.org/3/library/dataclasses.html#dataclasses.dataclass "dataclasses.dataclass") will generate a [`__hash__()`](https://docs.python.org/3/reference/datamodel.html#object.__hash__ "object.__hash__") method for you. If `eq` is true and `frozen` is false, [`__hash__()`](https://docs.python.org/3/reference/datamodel.html#object.__hash__ "object.__hash__") will be set to `None`, marking it unhashable (which it is, since it is mutable). If `eq` is false, [`__hash__()`](https://docs.python.org/3/reference/datamodel.html#object.__hash__ "object.__hash__") will be left untouched meaning the [`__hash__()`](https://docs.python.org/3/reference/datamodel.html#object.__hash__ "object.__hash__") method of the superclass will be used (if the superclass is [`object`](https://docs.python.org/3/library/functions.html#object "object"), this means it will fall back to id-based hashing).
> - `frozen`: If true (the default is `False`), assigning to fields will generate an exception. This emulates read-only frozen instances. If [`__setattr__()`](https://docs.python.org/3/reference/datamodel.html#object.__setattr__ "object.__setattr__") or [`__delattr__()`](https://docs.python.org/3/reference/datamodel.html#object.__delattr__ "object.__delattr__") is defined in the class, then [`TypeError`](https://docs.python.org/3/library/exceptions.html#TypeError "TypeError") is raised. See the discussion below.
> - `match_args`: If true (the default is `True`), the `__match_args__` tuple will be created from the list of parameters to the generated [`__init__()`](https://docs.python.org/3/reference/datamodel.html#object.__init__ "object.__init__") method (even if [`__init__()`](https://docs.python.org/3/reference/datamodel.html#object.__init__ "object.__init__") is not generated, see above). If false, or if `__match_args__` is already defined in the class, then `__match_args__` will not be generated.
>   New in version 3.10.
> - `kw_only`: If true (the default value is `False`), then all fields will be marked as keyword-only. If a field is marked as keyword-only, then the only effect is that the [`__init__()`](https://docs.python.org/3/reference/datamodel.html#object.__init__ "object.__init__") parameter generated from a keyword-only field must be specified with a keyword when [`__init__()`](https://docs.python.org/3/reference/datamodel.html#object.__init__ "object.__init__") is called. There is no effect on any other aspect of dataclasses. See the [parameter](https://docs.python.org/3/glossary.html#term-parameter) glossary entry for details. Also see the [`KW_ONLY`](https://docs.python.org/3/library/dataclasses.html#dataclasses.KW_ONLY "dataclasses.KW_ONLY") section.
>   New in version 3.10.
> - `slots`: If true (the default is `False`), [`__slots__`](https://docs.python.org/3/reference/datamodel.html#object.__slots__ "object.__slots__") attribute will be generated and new class will be returned instead of the original one. If [`__slots__`](https://docs.python.org/3/reference/datamodel.html#object.__slots__ "object.__slots__") is already defined in the class, then [`TypeError`](https://docs.python.org/3/library/exceptions.html#TypeError "TypeError") is raised.
>   New in version 3.10.
>
> Changed in version 3.11: If a field name is already included in the `__slots__` of a base class, it will not be included in the generated `__slots__` to prevent [overriding them](https://docs.python.org/3/reference/datamodel.html#datamodel-note-slots). Therefore, do not use `__slots__` to retrieve the field names of a dataclass. Use [`fields()`](https://docs.python.org/3/library/dataclasses.html#dataclasses.fields "dataclasses.fields") instead. To be able to determine inherited slots, base class `__slots__` may be any iterable, but *not* an iterator.
>
> - `weakref_slot`: If true (the default is `False`), add a slot named “**weakref**”, which is required to make an instance weakref-able. It is an error to specify `weakref_slot=True` without also specifying `slots=True`.

## Class Typing

To use a **class** as a type (a class that isn't instantiated, the class as a whole):

```python
class User: ...

def makeUser(user_class: type[User]) -> User:
	...
	return
```

### `TypedDict`

Typing a dictionary, this is essentially the same as a JavaScript Interface

```python
from typing import TypedDict, NotRequired, Required
class Point(TypedDict):
	x: NotRequired[float]
	y: Required[float]
	pass

myDict: Point = {"x": 1.2, "y": 2.2}
```
