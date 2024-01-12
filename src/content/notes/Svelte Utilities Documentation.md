---
title: Svelte Utilities
description: Svelte Utilities Overview
keywords: svelte, sveltekit, sveltekit2, runes, svelte5, new features, runes mode, overview, free
coverImage: https://miro.medium.com/v2/resize:fit:800/1*694arrMBzrG9pRcLHxC0WA.png
author: theofficialurban (Josh)
---

A compilation of useful components and other utilities. This package is intended for myself and not really intended to be anything concrete, I will be happy to fix anything or even take some requests if asked.

## Components & Utilities

- `ConfirmationButton` - A barebones confirmation button
- **`Form` Component** - A Form Wrapper
- **`Table` Component** - Table component

## Table Component

### Props

- `rows: T[]` - Table Rows `extends Record<string,unknown>`
- `columns: TableColumn<T>` - Table Columns

### Snippets

- `cell: Snippet<{row: T, column: TableColumn<T>}>` - A snippet for each cell
- `cols: Snippet<TableColumn<T>>` - Snippet for each header
- `label: Snippet<null>` - Label for the table

### Slots

- `thead` - Table Head gets `columns` passed
- `default` - Table Body
- `tfoot` - Table Footer

```html
<script lang="ts">
    import { Table } from '@theofficialurban/svelte-utils';
    import type { TableColumn } from '@theofficialurban/svelte-utils';
    // Rows can have any Record<string, unknown> Shape
    type Row = { name: string; city: string };
    const rows: Row[] = [
        { name: 'Josh', city: 'Los Angeles' },
        { name: 'Dave', city: 'Portland' }
    ];

    const columns: TableColumn<Row>[] = [
        // Column #1 'Name' for 'name' key
        { title: 'Name', key: 'name' },
        // Column #2 'City' for 'city' key
        { title: 'City', key: 'city' }
    ];
</script>
<!-- Then just pass these to the component -->
<Table {rows} {columns}>

    <!-- Data Object = {row: Row, column: Column} -->

    {#snippet cell({row, column}: {row: Row, column: TableColumn<Row>})}
        <td>{row[column.key]}</td>
    {/snippet}

    <!-- Column gets passed the 'Column' object -->

    {#snippet cols(col: TableColumn<Row>)}
        <th>{col.title}</th>
    {/snippet}

</Table>
```

## Form Component

A simple wrapper for async forms with Svelte's built in `use:enhance`

**Components**:

- `Body` - Form Body
- `Control` - Input Control
- `Input` - A form input
- `Select` - Form Select
- `Textarea` - Form Textarea

```ts
import Form from "@theofficialurban/svelte-utils";
```

### `Form.Body`

Top Level Wrapper

**Props `extends HTMLFormAttributes`**:

- `form?: ActionResult | null` - The `form` return from page props for `use:enhance`
- `submitFn?: SubmitFunction | undefined` - A custom function to be passed to `use:enhance={submitFn}`

**Slots**:

- `title` - Form Title Slot
- `default` - Inside slot for the form
- `submit` - Submit Button Slot

**Example**

```html
<Form.Body
	method="POST"
	action="/"
	{form}
>
	<Form.Control>
		<label slot="label">My Label</label>
		<Form.Input
			name="inputName"
			id="inputId"
		/>
	</Form.Control>
	<!-- Submit Button Added Automatically Unless Overwritten -->
</Form.Body>
```

### `Form.Control`

A control for an input, includes a slot for a label

**Props `extends HTMLDivAttributes`**:

- Extends Default HTMLDivAttributes

**Slots**:

- `label` - Label Slot

See Above Example

### `Form.Select`

A form select input element

**Props `extends HTMLSelectAttributes`**:

- `options: T[]` - Options, `T extends Record<string,unknown>`
- `displayKey: keyof T` - Key to display
- `valueKey: keyof T` - Key for the option value
  **No Slots**

**Example**:

```html
<script lang="ts">
	import Form from "@theofficialurban/svelte-utils";
	type Option = { name: string; city: string };
	let options: Option[] = [{ name: "Josh", city: "Los Angeles" }];
</script>
<Form.Body ...>
	<Form.Control>
		<label slot="label">My Select</label>
		<!-- Option #1 - Display: Josh, Value: Los Angeles -->
		<Form.Select
			{options}
			displayKey="name"
			valueKey="city"
		/>
	</Form.Control>
</Form.Body>
```

### `Form.Input`

**Props `extends HTMLInputAttributes`**

**Example**

```html
<script lang="ts">
	import Form from "@theofficialurban/svelte-utils";
</script>
<Form.Body ...>
	<Form.Control>
		<label slot="label">My Input</label>
		<Form.Input
			name=".."
			id=".."
			placeholder=".."
		/>
	</Form.Control>
</Form.Body>
```

### `Form.Textarea`

**Props `extends HTMLTextareaAttributes`**

- `toggleHTML?: boolean` - Toggleable HTML Preview

**Slots**

- `default` - Textarea
- `preview` - HTML Preview

```html
<script lang="ts">
	import Form from "@theofficialurban/svelte-utils";
</script>
<Form.Body ...>
	<Form.Control>
		<label slot="label">My Input</label>
		<Form.Textarea
			name=".."
			id=".."
			placeholder=".."
		/>
	</Form.Control>
</Form.Body>
```

## `GradientText`

A simple Gradient Text Component

**Props**

- `element`
  - span
  - h1
  - h2
  - h3
  - p
  - div
- `--size` = `font-size`
- `--weight` = `font-weight`
- `--from` `--to` = Stop 1 and Stop 2
- `--font` = `font-family`

```html
<script lang="ts">
	import { GradientText } from "@theofficialurban/svelte-utils";
</script>

<GradientText
	element="span"
	--from="red"
	--to="blue"
>
	Hello World
</GradientText>
```

## `ConfirmationButton`

**Types**

```ts
type ClickEvent = MouseEvent & {
	currentTarget: EventTarget & HTMLButtonElement;
};
type OnConfirm = (itemId: string, e: ClickEvent) => Promise<void> | void;
type OnDecline = (itemId: string, e: ClickEvent) => Promise<void> | void;
```

**Props**

- `onconfirm` - On Confirm Event
- `ondecline` - On Decline Event
- `text` - Prompt Text

**Example**

```html
<script lang="ts">
	import { ConfirmationButton } from "@theofficialurban/svelte-utils";
</script>
<ConfirmationButton text="Please Confirm"> Click Me </ConfirmationButton>
```

## Typewriter Effect

```ts
import { typewriter } from "@theofficialurban/svelte-utils";
```

## Float Effect

**Parameters**

- `options: TweenedOptions<number>` - Options for the tween
- `floatDistance: number` = The distance for the bounce (usually -10 works)

**Types**

```ts
export type FloatEffect<T extends Element = Element> = (
	options: TweenedOptions<number>,
	floatDistance: number
) => FloatEffectReturn<T>;

export type FloatEffectReturn<T extends Element = Element> = {
	effect: Action<T, number>;
	store: Tweened<number>;
};
```

```html
<script lang="ts">
	import { useFloatingEffect } from "@theofficialurban/svelte-utils";
	const { effect, store } = useFloatingEffect({ duration: 1000 }, -10);
</script>
<div use:effect="{$store}">Floating Effect</div>
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
