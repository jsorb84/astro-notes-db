---
title: Python DotEnv
keywords: python, dotenv, bitesized
tags: ["Python", "Notes"]
coverImage: https://i.ytimg.com/vi/YfO28Ihehbk/maxresdefault.jpg
author: Urban
description: A bite sized guide for how to use DotEnv
---

Instructions for using `dotenv` in Python

## Instructions

```python
import os
import dotenv
dotenv.load_dotenv()
myVar = os.environ.get('myVar')
```
