---
title: NodeJS Buffers & Streaming
author: Urban
---

## `ArrayBuffer`

The **`ArrayBuffer`** object is used to represent a generic raw binary data buffer.

It is an array of bytes, often referred to in other languages as a "byte array". You cannot directly manipulate the contents of an `ArrayBuffer`; instead, you create one of the [typed array objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray) or a [`DataView`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DataView) object which represents the buffer in a specific format, and use that to read and write the contents of the buffer.

The [`ArrayBuffer()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/ArrayBuffer) constructor creates a new `ArrayBuffer` of the given length in bytes. You can also get an array buffer from existing data, for example, from a [Base64](https://developer.mozilla.org/en-US/docs/Glossary/Base64) string or [from a local file](https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsArrayBuffer).

`ArrayBuffer` is a [transferable object](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Transferable_objects).

## [Description](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer#description)

### [Resizing ArrayBuffers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer#resizing_arraybuffers)

`ArrayBuffer` objects can be made resizable by including the `maxByteLength` option when calling the [`ArrayBuffer()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/ArrayBuffer) constructor. You can query whether an `ArrayBuffer` is resizable and what its maximum size is by accessing its [`resizable`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/resizable) and [`maxByteLength`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/maxByteLength) properties, respectively. You can assign a new size to a resizable `ArrayBuffer` with a [`resize()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/resize) call. New bytes are initialized to 0.

These features make resizing `ArrayBuffer`s more efficient — otherwise, you have to make a copy of the buffer with a new size. It also gives JavaScript parity with WebAssembly in this regard (Wasm linear memory can be resized with [`WebAssembly.Memory.prototype.grow()`](https://developer.mozilla.org/en-US/docs/WebAssembly/JavaScript_interface/Memory/grow)).

### [Transferring ArrayBuffers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer#transferring_arraybuffers)

`ArrayBuffer` objects can be transferred between different execution contexts, like [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) or [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API), using the [structured clone algorithm](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm). This is done by passing the `ArrayBuffer` as a [transferable object](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Transferable_objects) in a call to [`Worker.postMessage()`](https://developer.mozilla.org/en-US/docs/Web/API/Worker/postMessage) or [`ServiceWorker.postMessage()`](https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorker/postMessage). In pure JavaScript, you can also transfer the ownership of memory from one `ArrayBuffer` to another using its [`transfer()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/transfer) or [`transferToFixedLength()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/transferToFixedLength) method.

When an `ArrayBuffer` is transferred, its original copy becomes *detached* — this means it is no longer usable. At any moment, there will only be one copy of the `ArrayBuffer` that actually has access to the underlying memory. Detached buffers have the following behaviors:

- [`byteLength`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/byteLength) becomes 0 (in both the buffer and the associated typed array views).
- Methods, such as [`resize()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/resize) and [`slice()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/slice), throw a [`TypeError`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypeError) when invoked. The associated typed array views' methods also throw a `TypeError`.

You can check whether an `ArrayBuffer` is detached by its [`detached`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer/detached) property.
