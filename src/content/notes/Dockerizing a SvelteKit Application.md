---
title: Dockerizing a SvelteKit App
description: Learn how to dockerize a SvelteKit App
author: Urban
coverImage: https://community-cdn-digitalocean-com.global.ssl.fastly.net/YMiWVwf44KxC6EmLNooKyr5w
category: notes
tags: ["Guides", "SvelteKit / Svelte", "Docker"]
keywords: guide, docker, svelte, sveltekit, js
---

## Building the Dockerfile

### I) Starting Image `node:20-alpine`

```dockerfile
FROM node:20-alpine as build
```

We're selecting `node:20-alpine` as our base image and we're calling this the `build` step.

### II) Working Directory

Next we need to copy over our `package.json`, our `pnpm-lock.yaml` and our `.npmrc`

```dockerfile
WORKDIR /app
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY .npmrc ./
```

We set our working directory to `./app` and copy over the files.

### III) Environment & Args

Next we need to tell Docker about whichever ENV variables and ARGS we'll need

**Example**:

```dockerfile
ENV KEY=VALUE
ARG ARGNAME
```

### IV) Installing `pnpm` and Install

```dockerfile
RUN npm i -g pnpm
RUN pnpm i
# Copy the rest after install
COPY . ./
# Run Svelte Check
RUN pnpm run check
# Build SvelteKit
RUN pnpm run build
# Prune Dev Dependencies
RUN pnpm prune --production
ENV NODE_ENV=production
```

### V) Run Command

```dockerfile
EXPOSE 3000:3000
CMD ["node", "build/index.js"]
```

## `compose.yaml`

Next we can optionally create a Docker Compose file to give instructions for container formation

```d
version: '3'

services:
	svelte-app:
		image: my-image
		env_file:
			- .env
		build:
			context: .
			dockerfile: Dockerfile
		user: 'node'
		ports:
			- 3000:3000
```
