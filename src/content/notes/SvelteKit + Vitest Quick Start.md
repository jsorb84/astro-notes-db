---
title: SvelteKit + Vitest
description: Learn how to setup SvelteKit and Vitest for testing
keywords: svelte, sveltekit, sveltekit2, testing, vitest
coverImage: https://miro.medium.com/v2/resize:fit:800/1*694arrMBzrG9pRcLHxC0WA.png
author: theofficialurban (Josh)
---

A small bite sized guide for setting up `Vitest` + `@testing-library/svelte`

## I) Packages

- `vitest`
- `vitest-dom`
- `jsdom`
- `@vitest/ui`
- `@testing-library/svelte`
- `@testing-library/jest-dom`

### Installation

```
pnpm i -D vitest vitest-dom jsdom @vitest/ui @testing-library/svelte
	@testing-library/jest-dom
```

## II) `vite.config.ts`

```json
{
	"test": {
		"include": ["src/**/*.{test,spec}.{js,ts}"],
		"globals": true,
		"environment": "jsdom"
	}
}
```

## III) Add `test:ui` command

```json
"scripts": {
	"testui": "vitest --ui",
}
```
