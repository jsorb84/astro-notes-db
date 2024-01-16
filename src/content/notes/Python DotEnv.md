---
title: Python DotEnv
keywords: python, dotenv, bitesized
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
