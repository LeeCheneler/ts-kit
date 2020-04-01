# NorthOps TypeScript Kit

Zero config CLI for writing TypeScript packages.

# Getting Started

```sh
yarn add --dev @northops/ts-kit
# or
npm i @northops/ts-kit -D
```

# Usage

## Build

Builds your code using [Rollup](https://rollupjs.org/).

```sh
ts-kit build
ts-kit build --watch
```

## Typecheck

Type checks your code using [TypeScript](https://www.typescriptlang.org/).

```sh
ts-kit typecheck
ts-kit typecheck --watch
```

## Lint

Lints your code using [ESLint](https://eslint.org/).

```sh
ts-kit lint
```

## Test

Runs your unit tests using [Jest](https://jestjs.io/).

```sh
ts-kit test
ts-kit <JEST_OPTIONS>
```

### Notes

Run jest from node with cli args - `jest.run([...args]);` https://github.com/facebook/jest/issues/5048#issuecomment-408706538
