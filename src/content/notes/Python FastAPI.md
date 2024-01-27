---
title: Python FastAPI Notes
description: Notes on the FastAPI Library
author: Urban
keywords: python, fastapi, api, library
tags: ["Python", "Notes", "Web"]
---

# Hello World Example

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/")
async def root():
	return {"message": "Hello World"}
```

# Requests & Routing

## Path Parameters

```python
@app.get("/item/{item_id}")
async def read_item(item_id: str):
	return {"item_id": item_id}

```

**Types can be declared to restrict parameter value type**

### Query Parameters

> When you declare other function parameters that are not part of the path parameters, they are automatically interpreted as "query" parameters.

```python
from fastapi import FastAPI

app = FastAPI()

fake_items_db = [{"item_name": "Foo"}, {"item_name": "Bar"}, {"item_name": "Baz"}]

# The Query is the set of key-value pairs after the ? and &
@app.get("/items/")
async def read_item(skip: int = 0, limit: int = 10):
    return fake_items_db[skip : skip + limit]
```

### Optional Parameters

Setting a default for a variable will make it optional

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/items/{item_id}")
async def read_item(item_id: str, q: str | None = None):
    if q:
        return {"item_id": item_id, "q": q}
    return {"item_id": item_id}
```

## Request Body

> When you need to send data from a client (let's say, a browser) to your API, you send it as a **request body**.
>
> A **request** body is data sent by the client to your API. A **response** body is the data your API sends to the client.
>
> Your API almost always has to send a **response** body. But clients don't necessarily need to send **request** bodies all the time.
>
> To declare a **request** body, you use [Pydantic](https://pydantic-docs.helpmanual.io/) models with all their power and benefits.

```python
from fastapi import FastAPI
from pydantic import BaseModel

class Item(BaseModel):
	name: str
	price: float

app = FastAPI()

# A POST request can declare parameters same as GET
@app.post("/items/")
async def create_item(item: Item):
	...
```

### Results of Above Example

> With just that Python type declaration, **FastAPI** will:
>
> - Read the body of the request as JSON.
> - Convert the corresponding types (if needed).
> - Validate the data.
>   - If the data is invalid, it will return a nice and clear error, indicating exactly where and what was the incorrect data.
> - Give you the received data in the parameter `item`.
>   - As you declared it in the function to be of type `Item`, you will also have all the editor support (completion, etc) for all of the attributes and their types.
> - Generate [JSON Schema](https://json-schema.org/) definitions for your model, you can also use them anywhere else you like if it makes sense for your project.
> - Those schemas will be part of the generated OpenAPI schema, and used by the automatic documentation UIs.

## String Validation

```python
from fastapi import FastAPI

app = FastAPI()


@app.get("/items/")
async def read_items(q: str | None = None):
    results = {"items": [{"item_id": "Foo"}, {"item_id": "Bar"}]}
    if q:
        results.update({"q": q})
    return results
```

> We are going to validate that the variable `q` is less than 50 characters

### Import `Query` and `Annotated`

```python
from typing import Annotated
from fastapi import FastAPI, Query

app = FastAPI()

@app.get("/items/")
async def read_items(
	 q: Annotated[str|None, Query(max_length=50)] = None
 ):
    results = {"items": [{"item_id": "Foo"}, {"item_id": "Bar"}]}
    if q:
        results.update({"q": q})
    return results
```

### Alternative Method

```python
q: str | None = Query(default=None)
```

### Advantages of `Annotated`

> **Using `Annotated` is recommended** instead of the default value in function parameters, it is **better** for multiple reasons. 🤓
>
> The **default** value of the **function parameter** is the **actual default** value, that's more intuitive with Python in general. 😌
>
> You could **call** that same function in **other places** without FastAPI, and it would **work as expected**. If there's a **required** parameter (without a default value), your **editor** will let you know with an error, **Python** will also complain if you run it without passing the required parameter.
>
> When you don't use `Annotated` and instead use the **(old) default value style**, if you call that function without FastAPI in **other place**, you have to **remember** to pass the arguments to the function for it to work correctly, otherwise the values will be different from what you expect (e.g. `QueryInfo` or something similar instead of `str`). And your editor won't complain, and Python won't complain running that function, only when the operations inside error out.
>
> Because `Annotated` can have more than one metadata annotation, you could now even use the same function with other tools, like [Typer](https://typer.tiangolo.com/). 🚀

## Path Parameters and Numeric Validation

#### [Documentation](https://fastapi.tiangolo.com/tutorial/path-params-numeric-validations/)

```python
from fastapi import FastAPI, Path

app = FastAPI()

@app.get("/items/{item_id}")
async def read_items(
	 q: str, item_id: int = Path(title="The ID of the item to get")
 ):
    results = {"item_id": item_id}
    if q:
        results.update({"q": q})
    return results
```

## `Body`

> The same way there is a `Query` and `Path` to define extra data for query and path parameters, **FastAPI** provides an equivalent `Body`.
>
> For example, extending the previous model, you could decide that you want to have another key `importance` in the same body, besides the `item` and `user`.
>
> If you declare it as is, because it is a singular value, **FastAPI** will assume that it is a query parameter.

## `Cookie` & `Header`

```python
from typing import Annotated

from fastapi import Cookie, FastAPI

app = FastAPI()

@app.get("/items/")
async def read_items(ads_id: Annotated[str | None, Cookie()] = None):
    return {"ads_id": ads_id}
```

> `Cookie` is a "sister" class of `Path` and `Query`. It also inherits from the same common `Param` class.
>
> But remember that when you import `Query`, `Path`, `Cookie` and others from `fastapi`, those are actually functions that return special classes.

> To declare cookies, you need to use `Cookie`, because otherwise the parameters would be interpreted as query parameters.

## Response Model - Return Type

> You can declare the type used for the response by annotating the *path operation function* **return type**.
>
> You can use **type annotations** the same way you would for input data in function **parameters**, you can use Pydantic models, lists, dictionaries, scalar values like integers, booleans, etc.

```python

@app.post("/items/")
async def create_item(item: Item) -> Item: # Returns an Item
	...

# OR

@app.post("/items/", response_model=Item)
async def ...
```

## Form Data

#### Install `python-multipart`

`pip install python-multipart`

### Define `Form` Parameters

```python
from typing import Annotated

from fastapi import FastAPI, Form

app = FastAPI()

@app.post("/login/")
async def login(username: Annotated[str, Form()], password: Annotated[str, Form()]):
    return {"username": username}
```

### JSON Compatible Encoder

> There are some cases where you might need to convert a data type (like a Pydantic model) to something compatible with JSON (like a `dict`, `list`, etc).
>
> For example, if you need to store it in a database.
>
> For that, **FastAPI** provides a `jsonable_encoder()` function.

```python
from datetime import datetime
from typing import Union

from fastapi import FastAPI
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel

fake_db = {}

class Item(BaseModel):
    title: str
    timestamp: datetime
    description: Union[str, None] = None

app = FastAPI()

@app.put("/items/{id}")
def update_item(id: str, item: Item):
    json_compatible_item_data = jsonable_encoder(item)
    fake_db[id] = json_compatible_item_data
```

# Dependencies

## What is "Dependency Injection"

> **"Dependency Injection"** means, in programming, that there is a way for your code (in this case, your *path operation functions*) to declare things that it requires to work and use: "dependencies".
>
> And then, that system (in this case **FastAPI**) will take care of doing whatever is needed to provide your code with those needed dependencies ("inject" the dependencies).
>
> This is very useful when you need to:
>
> - Have shared logic (the same code logic again and again).
> - Share database connections.
> - Enforce security, authentication, role requirements, etc.
> - And many other things...
>
> All these, while minimizing code repetition.

## Creating a Dependency

```python
from fastapi import FastAPI, Depends
from typing import Annotated
app = FastAPI()

async def my_dependency(...):
	return {"test": 123}

@app.get("/items/")
async def read_items(commons: Annotated[dict, Depends(my_dependency)]):
	...

```

# File Structure / Multiple Files [¶](https://fastapi.tiangolo.com/tutorial/bigger-applications/)

![structure](https://fastapi.tiangolo.com/img/tutorial/bigger-applications/package.svg)

```
├── app                  # "app" is a Python package
│   ├── __init__.py      # this file makes "app" a "Python package"
│   ├── main.py          # "main" module, e.g. import app.main
│   ├── dependencies.py  # "dependencies" module, e.g. import app.dependencies
│   └── routers          # "routers" is a "Python subpackage"
│   │   ├── __init__.py  # makes "routers" a "Python subpackage"
│   │   ├── items.py     # "items" submodule, e.g. import app.routers.items
│   │   └── users.py     # "users" submodule, e.g. import app.routers.users
│   └── internal         # "internal" is a "Python subpackage"
│       ├── __init__.py  # makes "internal" a "Python subpackage"
│       └── admin.py     # "admin" submodule, e.g. import app.internal.admin
```

## `APIRouter`

> Let's say the file dedicated to handling just users is the submodule at `/app/routers/users.py`.
>
> You want to have the *path operations* related to your users separated from the rest of the code, to keep it organized.
>
> But it's still part of the same **FastAPI** application/web API (it's part of the same "Python Package").
>
> You can create the *path operations* for that module using `APIRouter`.

```python
from fastapi import APIRouter

router = APIRouter()

@router.get("/users/", tags=["users"])
async def read_users():
    return [{"username": "Rick"}, {"username": "Morty"}]

@router.get("/users/me", tags=["users"])
async def read_user_me():
    return {"username": "fakecurrentuser"}

@router.get("/users/{username}", tags=["users"])
async def read_user(username: str):
    return {"username": username}
```

### Another Module with `APIRouter`

> Let's say you also have the endpoints dedicated to handling "items" from your application in the module at `app/routers/items.py`.
>
> You have *path operations* for:
>
> - `/items/`
> - `/items/{item_id}`
>
> It's all the same structure as with `app/routers/users.py`.
>
> But we want to be smarter and simplify the code a bit.
>
> We know all the *path operations* in this module have the same:
>
> - Path `prefix`: `/items`.
> - `tags`: (just one tag: `items`).
> - Extra `responses`.
> - `dependencies`: they all need that `X-Token` dependency we created.
>
> So, instead of adding all that to each *path operation*, we can add it to the `APIRouter`.

```python
from fastapi import APIRouter, Depends, HTTPException

from ..dependencies import get_token_header

router = APIRouter(
    prefix="/items",
    tags=["items"],
    dependencies=[Depends(get_token_header)],
    responses={404: {"description": "Not found"}},
)

fake_items_db = {"plumbus": {"name": "Plumbus"}, "gun": {"name": "Portal Gun"}}

@router.get("/")
async def read_items():
    return fake_items_db


@router.get("/{item_id}")
async def read_item(item_id: str):
    if item_id not in fake_items_db:
        raise HTTPException(status_code=404, detail="Item not found")
    return {"name": fake_items_db[item_id]["name"], "item_id": item_id}


@router.put(
    "/{item_id}",
    tags=["custom"],
    responses={403: {"description": "Operation forbidden"}},
)
async def update_item(item_id: str):
    if item_id != "plumbus":
        raise HTTPException(
            status_code=403, detail="You can only update the item: plumbus"
        )
    return {"item_id": item_id, "name": "The great Plumbus"}
```

# Middleware

> Work in Progress

## CORS

> Work in Progress

# SQL / Databases

> Work in Progress
