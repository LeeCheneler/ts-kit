# @leecheneler/ts-kit

Core package providing the `ts-kit` CLI.

## Getting Started

### Install the package

```sh
yarn add --dev @leecheneler/ts-kit
```

### Create entry file

```ts
// src/main.ts

console.log("Hello world!");
```

### Run a build

```sh
yarn run ts-kit build
```

### Check output

A new build will be available in `dist/main.js`.

## Usage

### Build

Builds your code using [Rollup](https://rollupjs.org/).

```sh
# Single build
ts-kit build

# Build and watch for changes
ts-kit build --watch
```

### Typecheck

Type checks your code using [TypeScript](https://www.typescriptlang.org/).

```sh
# Check types only
ts-kit typecheck

# Check types and emit type declaration files
ts-kit typecheck --emit
```

### Lint

Lints your code using [ESLint](https://eslint.org/).

```sh
# Lint your code
ts-kit lint

# Lint your code and automatically fix fixable issues
ts-kit lint --fix
```

### Test

Runs your unit tests using [Jest](https://jestjs.io/).

```sh
# Run tests once
ts-kit test

# All args EXCEPT for --config are forward onto jest
ts-kit test <jest_cli_args>
```
