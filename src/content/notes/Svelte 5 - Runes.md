---
title: Svelte 5 - Runes Overview
description: A quick overview of the new runes available in Svelte 5 and SvelteKit 2
keywords: svelte, sveltekit, sveltekit2, runes, svelte5, new features, runes mode, overview, free
coverImage: https://miro.medium.com/v2/resize:fit:800/1*694arrMBzrG9pRcLHxC0WA.png
author: theofficialurban (Josh)
---

## Overview

With the beta release of Svelte 5 and the recently announced SvelteKit 2, we have a few new features to take a look at, some of which are very nice additions to the framework.

### New Features

- Runes [Svelte 5]
- Snippets [Svelte 5]
- Shallow Routing [SvelteKit 2]
- Reactivity Outside of Components [Svelte 5]

## Runes

Runes overhaul the original reactivity system entirely. We have ~3 new major runes as of now.

### `$state()`

Used to declare a reactive state. In Svelte 5 all reactive code, that is, code that is expected to change and so should be reactive, must be declared with either `$state` or `$derived`

```html
<script lang="ts">
	let count = 0; // Will not be reactive
	let reactiveCount = $state(0); // Will be reactive
</script>
```

### `$derived()`

Used to declare derived state, largely replaces reactive declarations.

**You must use `$state` or `$derived` for state to be reactive**

```html
<script lang="ts">
	let a = $state(5);
	let b = 2;
	// Old Way
	$: area = a * b;
	// New Way
	let area = $derived(a * b);
</script>
```

### `$effect()`

Similar to React's `useEffect` will run each time one of the variables inside of it changes.

```html
<script lang="ts">
	let a = $state(5);
	let b = 2;
	let area = $state(a * b);
	$effect(() => {
		// Runs when a changes
		// This is the same as a derived decl.
		// Anytime a changes area will be set to a * b
		area = a * b;
	});
</script>
```

### `$inspect()`

Allows you to inspect (`console.log`) variables when they change. Think of this as a reactive console.log. Can use the `with()` method returned to modify the callback behavior.

```html
<script lang="ts">
	let a = $state(5)
	// Logs on mount, and anytime 'a' changes
	$inspect(a)
	// Use console.trace instead of console.log
	$inspect(a).with(console.trace)
	// Multiple Vars
	$inspect({a, b, ...})
</script>
<button onclick="{()" ="">a += 1}>Click</button>
```

### `$props()`

Replaces the original declaration of props.

```html
<script lang="ts">
	// Old Way
	export let a
	// New Way
	let { a = 1 } = $props()
	// With Typescript
	let { a } = $props<{a: number}>()
	// With Rest Props & Renaming
	let { a, className: class, ...restProps } = $props()
</script>
```

## Snippets

Snippets are a new way to handle slot behavior, original `<slot />` behavior is deprecated and still works as usual.

### Declare a Snippet

```ts
{#snippet mySnippet( { firstName, lastName } )}
	<span>Hello, {firstName} {lastName}</span>
{/snippet}
```

### Rendering a Snippet

```html
<div>{@render mySnippet( { firstName: "Josh", lastName: "S" } )}</div>
```

### Passing Snippets

```html
<MyComponent someProp="{mySnippet}" />
```
