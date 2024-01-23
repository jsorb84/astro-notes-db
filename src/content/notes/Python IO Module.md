---
title: Python IO Module
description: IO in Python
author: Urban
keywords: io, python, buffering
---

# Text I/O

## Documentation Reference [¶](https://docs.python.org/3/library/io.html#text-i-o)

> Text I/O expects and produces [`str`](https://docs.python.org/3/library/stdtypes.html#str "str") objects. This means that whenever the backing store is natively made of bytes (such as in the case of a file), encoding and decoding of data is made transparently as well as optional translation of platform-specific newline characters.
>
> The easiest way to create a text stream is with [`open()`](https://docs.python.org/3/library/functions.html#open "open"), optionally specifying an encoding:

# Binary I/O

## Documentation Reference [¶](https://docs.python.org/3/library/io.html#binary-i-o)

> Binary I/O (also called *buffered I/O*) expects [bytes-like objects](https://docs.python.org/3/glossary.html#term-bytes-like-object) and produces [`bytes`](https://docs.python.org/3/library/stdtypes.html#bytes "bytes") objects. No encoding, decoding, or newline translation is performed. This category of streams can be used for all kinds of non-text data, and also when manual control over the handling of text data is desired.

The easiest way to create a binary stream is with [`open()`](https://docs.python.org/3/library/functions.html#open "open") with `'b'` in the mode string:

```python
f = open('myfile.jpg', 'rb')
```

# Raw I/O

## Documentation Reference [¶](https://docs.python.org/3/library/io.html#raw-i-o)

> Raw I/O (also called *unbuffered I/O*) is generally used as a low-level building-block for binary and text streams; it is rarely useful to directly manipulate a raw stream from user code. Nevertheless, you can create a raw stream by opening a file in binary mode with buffering disabled:

```python
f = open('myfile.jpg', 'rb', buffering=0)
```
