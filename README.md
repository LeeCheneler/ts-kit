# NorthOps TypeScript Kit

Zero config CLI for writing TypeScript packages.

# Getting Started

Install the package...

```sh
yarn add --dev @northops/ts-kit
# or
npm i @northops/ts-kit -D
```

... and make sure the entry file exists at `src/main.ts`

```
// src/main.ts

console.log("Hello world!")
```

# Usage

## Build

Builds your code using [Rollup](https://rollupjs.org/).

```sh
# Single build
ts-kit build

# Build and watch for changes
ts-kit build --watch
ts-kit build -w
```

## Typecheck

Type checks your code using [TypeScript](https://www.typescriptlang.org/).

```sh
# Check types only
ts-kit typecheck

# Check types and emit type declaration files
ts-kit typecheck --emit
```

## Lint

Lints your code using [ESLint](https://eslint.org/).

```sh
ts-kit lint
ts-kit lint --fix
```

## Test

Runs your unit tests using [Jest](https://jestjs.io/).

```sh
# Run tests once
ts-kit test

# All args EXCEPT for --config are forward onto jest
ts-kit test <jest_cli_args>
```
