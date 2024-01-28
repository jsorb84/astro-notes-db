---
title: theofficialurban/svelte-utils
keywords: svelte, utilities, packages, npm, pnpm, free, apache
author: theofficialurban (Josh)
description: My collection of Svelte Utilities docs.
coverImage: https://miro.medium.com/v2/resize:fit:800/1*694arrMBzrG9pRcLHxC0WA.png
---

## Documentation

## `Form`

Form.Body -> Form.Control -> Form.(Input/Textarea/Select)

### `Form.Body`

The body of the form, the same as `<form>`

### `Form.Control`

### `Form.Input`

### `Form.Textarea`

### `Form.Select`

## Example

```html
<script lang="ts">
	import Form from "@theofficialurban/svelte-utils";
</script>
<Form.Body method="POST">
	<Form.Control>
		<Form.Input
			name="input"
			type="text"
		/>
	</Form.Control>
</Form.Body>
```

## `GradientText`

### CSS Variables

- `--from` From Gradient Color
- `--to` To Gradient Color
- `--size` Font Size
- `--weight` Font Weight
- `--font` Font Family

```html
<script lang="ts">
	import { GradientText } from "@theofficialurban/svelte-utils";
</script>
<GradientText
	element="span"
	--from=""
	--to=""
	>Text</GradientText
>
```

## `Table`

### Snippets

- `cell`
  - `{column, row}`
- `cols`
  - `{key, title}`
- `tableTitle`

```html
<script lang="ts">
	import { Table } from "@theofficialurban/svelte-utils";
</script>
<table
	rows="{}"
	columns="{}"
>
	{#snippet cell({row, column})} .... {/snippet} {#snippet column(col)} ....
	{/snippet} {#snippet title()} .... {/snippet}
</table>
```

## `ConfirmationButton`

**Confirmation Event** (fired on confirmation)

`onconfirm` - `(id: string, e: ClickEvent) => Promise<void> | void`

**Decline Event** (fired on cancel / decline)

`ondecline` - `(id: string, e: ClickEvent) => Promise<void> | void`

```html
<script lang="ts">
	import { ConfirmationButton } from "@theofficialurban/svelte-utils";
</script>

<ConfirmationButton
	text="Please Confirm Your Choice"
	onconfirm="{..}"
	ondecline="{..}"
>
	Delete
</ConfirmationButton>
```

## `SVGBounce`

### Properties

- `extends SVGAttributes` (width, height, etc..)
- `springOpts?: SpringOpts`
- `bounceDistance?: number` - PX translate for bounce effect
- `css?: CSSFunction` `(node: SVGElement, bStore: Spring<number>, bVal: number) => string;` (Should return the style string)
- `trigger?: [inEvent: string, outEvent: string]` (`['pointerenter', 'pointerleave']`)

```html
<script lang="ts">
	import { SVGBounce } from "@theofficialurban/svelte-utils";
	const cssFn = (n, s, v) => {
		return `translate: translateY(${v}px);`;
	};
</script>

<SVGBounce css="{cssFn}">
	<path
		transition:draw
		stroke="blue"
		stroke-width="{3}"
		d="M807.7 951h-449V192L643.8 87l163.9 105z"
		fill="#F7D4FF"
	></path>
</SVGBounce>
```

## `useFloatingEffect()`

### Example

```html
<script lang="ts">
	import { useFloatingEffect } from "@theofficialurban/svelte-utils";
	const { effect, store } = useFloatingEffect();
</script>

<svg use:effect="{$store}"></svg>
```

## Modal Async. Rendering `Modal`

### `Modal.Wrapper`

Provides loading for a promise
**Props**

- `promise` - Promise to await
  **Slots**
- `loading` - Loading

### `Modal.List`

**Props**
`modal` - An array (may require cast for TS)
**Slots (Snippets)**

- `children(item: T[])`

```html
<script lang="ts">
	import { Modal } from "@theofficialurban/svelte-utils";
</script>

// Slot: loading // Value = Promise Awaited Return
<Modal.Wrapper
	{promise}
	let:value
>
	<span slot="loading">Loading....</span>
	<Modal.List
		modal="{value"
		as
		({name:
		string}[])}
	>
		{#snippet children(item: {name: string})}
		<li>{item.name}</li>
		{/snippet}
	</Modal.List>
</Modal.Wrapper>
```
