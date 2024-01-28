---
title: Python FastAPI Notes
description: Notes on the FastAPI Library
author: Urban
keywords: python, fastapi, api, library
tags: ["Python", "Notes", "Web"]
coverImage: https://i.imgur.com/394f5vH.jpeg
pubDate: 2024-28-01
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

### Settings Cookies

To set cookies, you need to access the `Response` object,

```python
from fastapi import FastAPI, Response
from fastapi.responses import JSONResponse

app = FastAPI()

@app.post("/post")
def create_cookie(response: Response):
	response.set_cookie(key="session", value="value")
	return {...}

# OR - Return a `Response` object directly

@app.post("/cookie/")
def create_cookie():
	content = {"hello": "world"}
	response = JSONResponse(content=content)
	response.set_cookie(key="fakesession", value="fake-cookie-session-value")
	return response
```

> Keep in mind that if you return a response directly instead of using the `Response` parameter, FastAPI will return it directly.
>
> So, you will have to make sure your data is of the correct type. E.g. it is compatible with JSON, if you are returning a `JSONResponse`.
>
> And also that you are not sending any data that should have been filtered by a `response_model`.

### Setting Headers

```python
from fastapi import FastAPI, Response
from fastapi.responses import JSONResponse
app = FastAPI()

@app.get("/headers-and-object/")
def get_headers(response: Response):
    response.headers["X-Cat-Dog"] = "alone in the world"
    return {"message": "Hello World"}

# OR - Return the response directly

@app.get(...)
def get_headers():
	content = {"message": "Hello World"}
	headers = {"Something": "Etc"}
	return JSONResponse(content=content, headers=headers)
```

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

## Callable Dependencies

### Old Way (Non-Parameterized Class)

```python
from typing import Annotated
from fastapi import Depends
class MyClass:
	def __init__(self, q: str = ""):
		self.q = q

# We cannot instantiate the class ourselves, Depends() does this for us

@app.get("/")
async def main(
	# Traditional, passing class as a dep.
	# The class will automatically instantiate an instance
	# However you cannot pass in the `q` parameter
	myCallableDep: Annotated[MyClass, Depends(MyClass)]

	# SHORTCUT ----- Depends()
	# myCallableDep: Annotated[MyClass, Depends()]
):
	return myCallableDep.q # Undefined
```

### Parameterized `__call__()`

A class may be made callable (class instance) by defining a `__call__` method

> The purpose of the `__call__` method is that using `Depends(...)` actually CALLS the dependency. By doing this, we can create an instance, and use the instance as a parameter.

```python
from typing import Annotated
from fastapi import Depends
class MyClass:
	def __init__(self, q: str = ""):
		self.q = q
	def __call__(self, q: str = ""):
		return self.q

parameterizedInstance = MyClass(q="Hello World")

@app.get("/")
async def main(
	# Instead of Depends(MyClass) we can use Depends(parameterizedInstance)
	myCallableDep: Annotated[MyClass, Depends(parameterizedInstance)]
):
	# We now have access to our self-defined param `q`
	return myCallableDep.q # Defined
```

> In this case, this `__call__` is what **FastAPI** will use to check for additional parameters and sub-dependencies, and this is what will be called to pass a value to the parameter in your *path operation function* later.

## Dependencies in Path Operation Definition

> The *path operation decorator* receives an optional argument `dependencies`.
> It should be a `list` of `Depends()`:

```python
dependencies: list[Depends] = [
	Depends(...),
	...
]
@app.get("/", dependencies=dependencies)
```

> These dependencies will be executed/solved the same way as normal dependencies. ==But their value (if they return any) won't be passed to your *path operation function*.==

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

### Including the `APIRouter`

```python
from fastapi import APIRouter, FastAPI

app = FastAPI()

# Regular Routes Etc.
...

# You can declare the `prefix` here or in the include
admin_router = APIRouter(prefix="/admin")

# `/admin/dashboard`
@admin_router.get("/dashboard")
async def admin_dash(...):
	...

# Include the Admin Router
# Optionally define `prefix` here or above
app.include_router(admin_router)
```

# Templating

## `Jinja2Templates`

```python
from fastapi import Request, FastAPI
from fastapi.templating import Jinja2Templates

app = FastAPI()

templates = Jinja2Templates(directory="./templates")

@app.get("/")
async def main(req: Request): # Grab the Request
	return templates.TemplateResponse(request=req, name="index.html",
		context={"name": "Josh"})
```

### `url_for`

> You can also use `url_for()` inside of the template, it takes as arguments the same arguments that would be used by your *path operation function*.
>
> So, the section with:
>
> `<a href="{{ url_for('read_item', id=id) }}">`
>
> ...will generate a link to the same URL that would be handled by the *path operation function* `read_item(id=id)`.
>
> For example, with an ID of `42`, this would render:
>
> Copy to clipboard
>
> `<a href="/items/42">`

By using `url_for()` you can access static files:

Static files are found in the `static` folder

```html
<head>
	<link href={{ url_for("static", path="/styles.css") }} />
</head>
```

# Static Files

## Use `StaticFiles`

```python
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")
```

> The first `"/static"` refers to the sub-path this "sub-application" will be "mounted" on. So, any path that starts with `"/static"` will be handled by it.
>
> The `directory="static"` refers to the name of the directory that contains your static files.
>
> The `name="static"` gives it a name that can be used internally by **FastAPI**.
>
> All these parameters can be different than "`static`", adjust them with the needs and specific details of your own application.

## Mounting

> "Mounting" means adding a complete "independent" application in a specific path, that then takes care of handling all the sub-paths.
>
> This is different from using an `APIRouter` as a mounted application is completely independent. The OpenAPI and docs from your main application won't include anything from the mounted application, etc.
>
> You can read more about this in the [Advanced User Guide](https://fastapi.tiangolo.com/advanced/).

# Background Tasks

> You can define background tasks to be run *after* returning a response.
>
> This is useful for operations that need to happen after a request, but that the client doesn't really have to be waiting for the operation to complete before receiving the response.
>
> This includes, for example:
>
> - Email notifications sent after performing an action:
>   - As connecting to an email server and sending an email tends to be "slow" (several seconds), you can return the response right away and send the email notification in the background.
> - Processing data:
>   - For example, let's say you receive a file that must go through a slow process, you can return a response of "Accepted" (HTTP 202) and process it in the background.

## Using `BackgroundTasks`

### Task Functions

> Create a function to be run as the background task.
>
> It is just a standard function that can receive parameters.
>
> It can be an `async def` or normal `def` function, **FastAPI** will know how to handle it correctly.

```python
from fastapi import BackgroundTasks, FastAPI

app = FastAPI()

def some_task(email: str, message: str = ""):
	# Do something here
	...

@app.post("/send-notif/{email}")
async def send_notif(email: str, tasks: BackgroundTasks):
	tasks.add_task(some_task, email, message="My Message")
	return ...

```

### `.add_task()`

> `.add_task()` receives as arguments:
>
> - A task function to be run in the background (`write_notification`).
> - Any sequence of arguments that should be passed to the task function in order (`email`).
> - Any keyword arguments that should be passed to the task function (`message="some notification"`).

#### `BackgroundTasks` Technical Details [¶](https://fastapi.tiangolo.com/tutorial/background-tasks/#technical-details)

# Testing

## Using `TestClient`

> Requires installation of `httpx` > `pip install httpx`

1. Import `TestClient`
2. Create `TestClient` instance by passing the `FastAPI` app in
3. Create functions that start with `test_`
4. Use `TestClient` object same as `httpx`
5. Use `pytest` conventions

```python
from fastapi import FastAPI
from fastapi.testclient import TestClient

app = FastAPI()

@app.get("/")
async def read_main():
    return {"msg": "Hello World"}

client = TestClient(app)

def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"msg": "Hello World"}
```

> Notice that the testing functions are normal `def`, not `async def`.
>
> And the calls to the client are also normal calls, not using `await`.
>
> This allows you to use `pytest` directly without complications.

## Async Tests [¶](https://fastapi.tiangolo.com/advanced/async-tests/#async-tests)

### Using `HTTPX`

> Even if your **FastAPI** application uses normal `def` functions instead of `async def`, it is still an `async` application underneath.
>
> The `TestClient` does some magic inside to call the asynchronous FastAPI application in your normal `def` test functions, using standard pytest. But that magic doesn't work anymore when we're using it inside asynchronous functions. By running our tests asynchronously, we can no longer use the `TestClient` inside our test functions.
>
> The `TestClient` is based on [HTTPX](https://www.python-httpx.org/), and luckily, we can use it directly to test the API.

```python
import pytest
from httpx import AsyncClient

from .main import app


@pytest.mark.anyio
async def test_root():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Tomato"}
```

> The marker `@pytest.mark.anyio` tells pytest that this test function should be called asynchronously:
> Then we can create an `AsyncClient` with the app, and send async requests to it, using `await`.

# Callbacks

> The process that happens when your API app calls the *external API* is named a "callback". Because the software that the external developer wrote sends a request to your API and then your API *calls back*, sending a request to an *external API* (that was probably created by the same developer).
>
> In this case, you could want to document how that external API *should* look like. What *path operation* it should have, what body it should expect, what response it should return, etc.

There are 2 main differences from a normal *path operation*:

- It doesn't need to have any actual code, because your app will never call this code. It's only used to document the *external API*. So, the function could just have `pass`.
- The *path* can contain an [OpenAPI 3 expression](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.1.0.md#key-expression) (see more below) where it can use variables with parameters and parts of the original request sent to *your API*.

## Callback Path Expression

> The callback *path* can have an [OpenAPI 3 expression](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.1.0.md#key-expression) that can contain parts of the original request sent to *your API*.

```python
"{$callback_url}/invoices/{$request.body.id}"
```

## Creation of a Callback

```python
from typing import Union

from fastapi import APIRouter, FastAPI
from pydantic import BaseModel, HttpUrl

app = FastAPI()

class Invoice(BaseModel):
    id: str
    title: Union[str, None] = None
    customer: str
    total: float

class InvoiceEvent(BaseModel):
    description: str
    paid: bool

class InvoiceEventReceived(BaseModel):
    ok: bool

# Create an APIRouter()
invoices_callback_router = APIRouter()

@invoices_callback_router.post(
    "{$callback_url}/invoices/{$request.body.id}", response_model=InvoiceEventReceived
)
def invoice_notification(body: InvoiceEvent):
    pass

@app.post("/invoices/", callbacks=invoices_callback_router.routes)
def create_invoice(invoice: Invoice, callback_url: Union[HttpUrl, None] = None):

    # Send the invoice, collect the money, send the notification (the callback)
    return {"msg": "Invoice received"}

```

# Middleware

> Work in Progress

## CORS

> Work in Progress

# SQL / Databases

> Work in Progress

# WebSockets [¶](https://fastapi.tiangolo.com/advanced/websockets/)

> Work in Progress

# Available Response Types [¶](https://fastapi.tiangolo.com/advanced/custom-response/)

##### `Response`

##### `HTMLResponse`

##### `PlainTextResponse`

##### `JSONResponse`

##### `ORJSONResponse`

##### `UJSONResponse`

##### `RedirectResponse`

##### `StreamingResponse`

##### `FileResponse`

# Available Middleware [¶](https://fastapi.tiangolo.com/advanced/middleware/#advanced-middleware)

##### `HTTPSRedirectMiddleware`

##### `TrustedHostMiddleware`

##### `GZipMiddleware`

# Metadata and Docs URLs

|     Parameter      |  Type  |                                         Description                                         |
| :----------------: | :----: | :-----------------------------------------------------------------------------------------: |
|      `title`       | `str`  |                                    The title of the API                                     |
|     `summary`      | `str`  |                                       A short summary                                       |
|   `description`    | `str`  |                                     A short description                                     |
|     `version`      | `str`  |                                           Version                                           |
| `terms_of_service` | `str`  |                                    Terms of service URL                                     |
|     `contact`      | `dict` | The contact information for the exposed API<br>(`name`, `url`, and `email` for one contact) |
|   `license_info`   | `dict` |                              (`name`, `identifier`, and `url`)                              |
