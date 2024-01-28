---
title: Python Date Types - Part I
author: Urban
tags: ["Python", "Notes"]
coverImage: https://i.ytimg.com/vi/YfO28Ihehbk/maxresdefault.jpg
keywords: python, notes, guides
description: Python Data Types Guide
pubDate: 2024-01-09
---

This is the first entry of notes in the Advanced Python series. This section will focus on extended Python container types. We will be talking about `lists` `tuples` and `dictionaries` along with `sets` and `collections` and much more. The goal here is to give a simple, bite sized definition and example for each as to function as a quick reference guide.

## Python Lists

Lists are **_ordered_** , **_mutable_** and they **_allow duplicate elements_**
Lists are similar to how arrays would work in other languages.

### Example

```python
myList = ["One", "Two", "Three"]
print(myList)
```

### Iteration / Checking

```python
myList = ["One", "Two", "Three"]
for i in myList:
	print(i)
if "One" in myList:
	print("One is in the list!")
```

### Adding / Removing

- `.append()`
- `.insert()`
- `.pop()`
- `.sort()`

```python
myList = [1,2,3,4,5]
print(myList) # [1,2,3,4,5]
myList.append(6) # Adds to the end
print(myList) # [1,2,3,4,5,6]
# Insert an element BEFORE index 2
myList.insert(2, 7) # [1,2,7,3,4,5,6]
# Remove an element with pop
myList.pop() # [1,2,7,3,4,5]
myList.sort() # [1,2,3,4,5,7]
```

## Python Tuples

Tuples are **\*ordered**, **_immutable_**, and they **_allow duplicates_**

```python
myTuple = tuple({ 'b', 'c', 'a', 'd'})
# or
myTuple = ('b', 'c', 'a', 'd')
print(myTuple) # (a, b, c, d)
print(myTuple[:3]) # (a, b, c)
```

### Common Methods

- `.count()` - Counts how many times the element occurs
- `.index()` - Finds an element's index
- `list(myTuple)` - Convert tuple to list

## Python Dictionaries

Dictionaries are **_Key-Value Pairs_** they are **_unordered_** and they are **_mutable_**

```python
myDict = {"name": "Josh", "age": 24}
# or
myDict = dict(name="Josh", age=24)
```

## Python Sets

Sets are **_unordered_** , **_mutable_** and they **_DO NOT allow duplicates_**

```python
mySet = set()
mySet.add(1)
mySet.add(2)
mySet.remove(2)
```
