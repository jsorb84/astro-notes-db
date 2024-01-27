---
title: Python Context Managers
description: Context Managers
keywords: python, notes, context
author: Urban
tags: ["Python", "Notes"]
coverImage: https://i.ytimg.com/vi/YfO28Ihehbk/maxresdefault.jpg
---

# Context Manager Creation

## `@contextlib.contextmanager`

```python
from contextlib import contextmanager

@contextmanager
def managed_resource(*args):
	resource = my_resource()
	try:
		yield resource
	finally:
		# Cleanup
with managed_resource() as r:
	# ...
```

## `@contextlib.asynccontextmanager`

```python
from contextlib import asynccontextmanager

@asynccontextmanager
async def get_connection():
    conn = await acquire_db_connection()
    try:
        yield conn
    finally:
        await release_db_connection(conn)

async def get_all_users():
    async with get_connection() as conn:
        return conn.query('SELECT ...')
```

# Extra Utilities

## `contextlib.closing()`

Return a context manager that closes thing on completion

```python
from contextlib import contextmanager

@contextmanager
def closing(thing):
    try:
        yield thing
    finally:
        thing.close()
```

## `contextlib.aclosing`

```python
from contextlib import contextmanager

@asynccontextmanager
def aclosing(thing):
    try:
        yield thing
    finally:
        thing.aclose()
```
