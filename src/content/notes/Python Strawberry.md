---
title: Python Strawberry (GraphQL) Notes
description: Notes on the python strawberry library for GraphQL
keywords: graphql, notes, strawberry, python
author: Urban
tags: ["Python", "GraphQL"]
coverImage: https://graphqleditor.com/articles/graphql-library-for-python-strawberry/strawberry.webp
---

<center><img src="https://i.imgur.com/TEN5GLj.png" width=300 /></center>

# Schema

### Supported types [¶](https://strawberry.rocks/docs/general/schema-basics#supported-types)

GraphQL supports a few different types:

- Scalar types
- Object types
- The Query type
- The Mutation type
- Input types

### Scalar types [¶](https://strawberry.rocks/docs/general/schema-basics#scalar-types)

Scalar types are similar to Python primitive types. Here’s the list of the default scalar types in GraphQL:

- Int, a signed 32-bit integer, maps to python’s int
- Float, a signed double-precision floating-point value, maps to python’s float
- String, maps to python’s str
- Boolean, true or false, maps to python’s bool
- ID, a unique identifier that usually used to refetch an object or as the key for a cache. Serialized as string and available as `strawberry.ID(“value”)`
- `UUID`, a [UUID](https://docs.python.org/3/library/uuid.html#uuid.UUID) value serialized as a string

### Object Types

```python
import typing
import strawberry

def get_author_for_book(root) -> "Author":
	return Author(name="...")

# Create a function to get books
def get_books_for_author(root) -> List[Book]:
	return [Book(title="...")]

@strawberry.type
class Book:
	title: str
	author: "Author" = strawberry.field(resolver=get_author_for_book)

@strawberry.type
class Author:
	name: str
	books: typing.List[Book] = strawberry.field(resolver=get_books_for_author)

# Get Authors
def get_authors(root) -> List[Author]:
	return [Author(name="...")]

@strawberry.type
class Query:
	authors: List[Author] = strawberry.field(resolver=get_authors)
	books: List[Book] = strawberry.field(resolver=get_books_for_author)

```

> These functions provide the `strawberry.field` with the ability to render data to the GraphQL query upon request and are the backbone of all GraphQL APIs.
>
> This example is trivial since the resolved data is entirely static. However, when building more complex APIs, these resolvers can be written to map data from databases, e.g. making SQL queries using SQLAlchemy, and other APIs, e.g. making HTTP requests using aiohttp.
>
> For more information and detail on the different ways to write resolvers, see the [resolvers section](https://strawberry.rocks/docs/types/resolvers).

## Query Type

The `Query` type defines exactly which GraphQL queries (i.e., read operations) clients can execute against your data. It resembles an object type, but its name is always `Query`.

Each field of the `Query` type defines the name and return type of a different supported query. The `Query` type for our example schema might resemble the following:

```python
@strawberry.type
class Query:
    books: typing.List[Book]
    authors: typing.List[Author]
```

This Query type defines two available queries: books and authors. Each query returns a list of the corresponding type.

With a REST-based API, books and authors would probably be returned by different endpoints (e.g., /api/books and /api/authors). The flexibility of GraphQL enables clients to query both resources with a single request.

### Structuring Queries

### **Example for Above Setup**

```graphql
query {
	books {
		title
	}

	authors {
		name
	}
}
```

#### Response

```json
{
	"data": {
		"books": [{ "title": "Jurassic Park" }],
		"authors": [{ "name": "Michael Crichton" }]
	}
}
```

### Nested Queries

```graphql
query {
	books {
		title
		author {
			name
		}
	}
}
```

#### Response

```json
{
	"data": {
		"books": [
			{ "title": "Jurassic Park", "author": { "name": "Michael Crichton" } }
		]
	}
}
```

## Mutation Type

The `Mutation` type is similar in structure and purpose to the Query type. Whereas the Query type defines your data's supported read operations, the `Mutation` type defines supported write operations.

Each field of the `Mutation` type defines the signature and return type of a different mutation. The `Mutation` type for our example schema might resemble the following:

```python
@strawberry.type
class Mutation:
	@strawberry.field
	def add_book(self, title: str, author: str) -> Book:
		...
```

> `add_book` -> `addBook`

> Strawberry converts fields names from snake case to camel case by default. This can be changed by specifying a [custom `StrawberryConfig` on the schema](https://strawberry.rocks/docs/types/schema-configurations)

### Resulting Mutation Structure

```graphql
mutation {
	addBook(title: "...", author: "...") {
		title
		author {
			name
		}
	}
}
```

#### Response

```json
{
	"data": {
		"addBook": {
			"title": "Fox in Socks",
			"author": {
				"name": "Dr. Seuss"
			}
		}
	}
}
```

## Input Types

Input types are special object types that allow you to pass objects as arguments to queries and mutations (as opposed to passing only scalar types). Input types help keep operation signatures clean.

Instead of accepting two arguments, this mutation could accept a single input type that includes all of these fields. This comes in extra handy if we decide to accept an additional argument in the future, such as a publication date.

An input type's definition is similar to an object type's, but it uses the input keyword:

```python
@strawberry.input
class AddBookInput:
    title: str
    author: str

@strawberry.type
class Mutation:
    @strawberry.field
    def add_book(self, book: AddBookInput) -> Book:
        ...
```

# Queries

## Creating a Root Query

In GraphQL you use queries to fetch data from a server. In Strawberry you can define the data your server provides by defining query types.

By default all the fields the API exposes are nested under a root Query type.

This is how you define a root query type in Strawberry:

```python
@strawberry.type
class Query:
	name: str

schema = strawberry.Schema(query=Query)
```

This creates a schema where the root type Query has one single field called name.

As you notice we don't provide a way to fetch data. In order to do so we need to provide a `resolver`, a function that knows how to fetch data for a specific field.

For example in this case we could have a function that always returns the same name:

```python
def get_name() -> str:
    return "Strawberry"

@strawberry.type
class Query:
    name: str = strawberry.field(resolver=get_name)

schema = strawberry.Schema(query=Query)
```

So now, when requesting the name field, the `get_name` function will be called.

# Mutations

As opposed to queries, mutations in GraphQL represent operations that modify server-side data and/or cause side effects on the server. For example, you can have a mutation that creates a new instance in your application or a mutation that sends an email. Like in queries, they accept parameters and can return anything a regular field can, including new types and existing object types. This can be useful for fetching the new state of an object after an update.

Let's improve our books project from the [Getting started tutorial](https://strawberry.rocks/docs/index) and implement a mutation that is supposed to add a book:

```python
import strawberry

# We must define a query, it is unused here
@strawberry.type
class Query:
	@strawberry.field
	def hello() -> str:
		return "world"

@strawberry.type
class Mutation:
	@strawberry.mutation
	def add_book(self, title: str, author: str) -> Book:
		# Remember, `add_book` becomes `addBook`
		return Book(title=title, author=author)

schema = strawberry.Schema(query=Query, mutation=Mutation)
```

#### Result

```graphql
mutation {
	addBook(title: "The Little Prince", author: "Antoine de Saint-Exupéry") {
		title
	}
}
```

## The Input Mutation Extension

It is usually useful to use a pattern of defining a mutation that receives a single [input type](https://strawberry.rocks/docs/general/input-types) argument called `input`.

Strawberry provides a helper to create a mutation that automatically creates an input type for you, whose attributes are the same as the args in the resolver.

For example, suppose we want the mutation defined in the section above to be an input mutation. We can add the `InputMutationExtension` to the field like this:

```python
from strawberry.field_extensions import ImputMutationExtension

@strawberry.type
class Mutation:
	@strawberry.mutation(extensions=[InputMutationExtension()])
	def update_fruit_weight(
		self,
		info: Info
		id: strawberry.ID,
		weight: Annotated[
			float,
			strawberry.argument(description="...")
		]
	) -> Fruit:
		fruit = ...
		fruit.weight = weight
		...
		return fruit
```

#### Resulting Schema

```graphql
input UpdateFruitWeightInput {
	id: ID!

	"""
	The fruit's new weight in grams
	"""
	weight: Float!
}

type Mutation {
	updateFruitWeight(input: UpdateFruitWeightInput!): Fruit!
}
```

## Nested Mutations

##### [Apollo's Guide on Namespacing](https://www.apollographql.com/docs/technotes/TN0012-namespacing-by-separation-of-concern/)

##### [Rapid API's Interactive Guide to GraphQL Queries: Aliases and Variables](https://rapidapi.com/guides/graphql-aliases-variables)

Since all GraphQL operations are fields, we can define a `FruitMutation` type and add mutation fields to it like we could add mutation fields to the root `Mutation` type.

```python
@strawberry.type
class FruitMutations:
	@strawberry.mutation
	def add(self, info, input: AddFruitInput) -> Fruit:
		...

	@strawberry.mutation
	def update_weight(self, info, input: UpdateFruitWeightInput) -> Fruit:
		...

@strawberry.type
class Mutation:
	@strawberry.field
	def fruit(self) -> FruitMutations:
		return FruitMutations()
```

> Fields on the root `Mutation` type are resolved serially. Namespace types introduce the potential for mutations to be resolved asynchronously and in parallel because the mutation fields that mutate data are no longer at the root level.
>
> To guarantee serial execution when namespace types are used, clients should use aliases to select the root mutation field for each mutation. In the following example, once `addFruit` execution is complete, `updateFruitWeight` begins.

# Subscriptions

In GraphQL you can use subscriptions to stream data from a server. To enable this with Strawberry your server must support ASGI and websockets or use the AIOHTTP integration.

This is how you define a subscription-capable resolver:

```python
import asyncio
from typing import AsyncGenerator

import strawberry

@strawberry.type
class Query:
	@strawberry.field
	def hello(self) -> str:
		return "world"

@strawberry.type
class Subscription:
	@strawberry.subscription
	async def count(self, target: int = 100) -> AsyncGenerator[int, None]:
		for i in range(target):
			yield i
			await asyncio.sleep(0.5)

schema = strawberry.Schema(query=Query, subscription=Subscription)
```

#### GraphQL Query

```graphql
subscription {
	count(target: 5)
}
```

# FastAPI Setup [¶](https://strawberry.rocks/docs/integrations/fastapi)

```python
from strawberry.fastapi import GraphQLRouter
from strawberry.subscriptions import GRAPHQL_TRANSPORT_WS_PROTOCOL, GRAPHQL_WS_PROTOCOL
from fastapi import FastAPI
from api.schema import schema

graphql_router = GraphQLRouter(
    schema,
    subscription_protocols=[
        GRAPHQL_TRANSPORT_WS_PROTOCOL,
        GRAPHQL_WS_PROTOCOL,
    ],
)
app = FastAPI()
app.include_router(graphql_router, prefix="/graphql")
```

# Additional Information

## DataLoaders

Strawberry comes with a built-in DataLoader, a generic utility that can be used to reduce the number of requests to databases or third party APIs by batching and caching requests.

> DataLoaders provide an async API, so they only work in async context

```python
from typing import List

from strawberry.dataloader import DataLoader
async def load_users(keys: List[int]) -> List[User]:
	return [User(id=key) for key in keys]

loader = DataLoader(load_fn=load_users)

user = await loader.load(1)

# Making Multiple Requests
[user_a, user_b] = await asyncio.gather(loader.load(1), loader.load(2))

# `load_many`
[user_a, user_b, user_c] = await loader.load_many([1, 2, 3])

```
