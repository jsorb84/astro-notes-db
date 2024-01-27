---
title: Publish to Heroku Action
description: A Github action allowing you to automatically publish your site to Heroku. Used here on this site.
keywords: github, actions, heroku, automation, git, notes, personal notes
author: theofficialurban (Josh)
coverImage: https://www.lavalamp.biz/wp-content/uploads/heroku.jpg
tags: ["Heroku", "GitHub Actions"]
---

## Heroku Publish Action

### Github Action

```yaml
name: "Publish to Heroku" #set whatevername you want to your github job
on:
  push:
    branches: [main, master]
jobs:
  build:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    steps:
      - name: Checkout
        uses: actions/checkout@v2
      - name: Build, Push and Deploy to Heroku #set the whatever name you want to this step
        uses: gonuit/heroku-docker-deploy@v1.3.3 # use the latest version of the action
        with:
          email: ${{ secrets.HEROKU_EMAIL }} # your heroku email
          heroku_api_key: ${{ secrets.HEROKU_API_KEY }} # your  heroku api key
          heroku_app_name: ${{ secrets.HEROKU_APP_NAME }} # you aplication name
          dockerfile_directory: ./ # set the path to the folder wher the Dokerfile is located
          dockerfile_name: Dockerfile
          docker_options: --build-arg GITHUB_TOKEN=${{secrets.GITHUB_TOKEN}}
```

## Docker

### `Dockerfile`

```dockerfile

FROM node:20-alpine AS build

WORKDIR /app
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY .npmrc ./
ENV PUBLIC_ENDPOINT="endpoint"
ENV PUBLIC_PROJECT='projectid'
ARG GITHUB_TOKEN
ENV NODE_AUTH_TOKEN=$GITHUB_TOKEN
RUN npm i -g pnpm
RUN pnpm config set @theofficialurban:registry https://npm.pkg.github.com
RUN pnpm i
COPY . ./
RUN pnpm run check
RUN pnpm run build
RUN pnpm prune --production
EXPOSE 3000:3000
ENV NODE_ENV=production
CMD ["node", "build/index.js"]
```

### `compose.yaml`

```yaml
version: "3"

services:
  app-node:
    image: svelte-docker
    env_file:
      - .env
    build:
      context: .
      dockerfile: Dockerfile
    user: "node"
    ports:
      - 3000:3000
```
