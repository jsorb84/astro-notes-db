---
title: Github Publish Action
description: A Github Action to publish a package to both NPM and Github package registries
keywords: github, actions, workflows, yml, svelte, javascript, npm, package
author: theofficialurban (Josh)
coverImage: https://github.blog/wp-content/uploads/2022/12/1200x640-1.png?fit=1200%2C640
tags: ["GitHub Actions", "NPM Packages"]
---

# Github Actions

## `.npmrc` File

```markdown
//npm.pkg.github.com/:\_authToken=${GITHUB_AUTH_TOKEN}
//registry.npmjs.org/:_authToken=${NPM_AUTH_TOKEN}
```

## Github Workflow File

```yaml
name: Publish Package to NPM Registry & To GitHub Packages

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
      - uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install PNPM
        run: npm i -g pnpm

      - name: Install Dep.
        run: pnpm i

      - name: Run Svelte Check
        run: pnpm run check

      - name: Set Registry NPM
        run: pnpm config set @theofficialurban:registry=https://registry.npmjs.org

      - name: Publish to NPM Registry
        run: pnpm publish
        env:
          NPM_AUTH_TOKEN: ${{ secrets.NPM_AUTH_TOKEN }}

      - name: Set Registry NPM
        run: pnpm config set @theofficialurban:registry=https://npm.pkg.github.com

      - name: Publish to Github Registry
        run: pnpm publish --registry="https://npm.pkg.github.com"
        env:
          GITHUB_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
