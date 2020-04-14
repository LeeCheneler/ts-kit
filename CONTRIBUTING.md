# Contributing to TypeScript Kit

## Repo

This is a Yarn Workspace's powered mono repo and some packages depend on other packages in this repo. You can install all dependencies and wire up local packages by running Yarn.

```sh
yarn
```

## Running tests in `packages/ts-kit`

Because all tests are e2e tests and the test script uses `ts-kit` itself to run we need to build the CLI tool first.

```sh
yarn
cd packages/ts-kit
yarn build
yarn test
```

## Linting in `packages/ts-kit`

Because the lint script uses `ts-kit` itself to run we need to build the CLI tool first.

```sh
yarn
cd packages/ts-kit
yarn build
yarn lint
```

## Publishing

Each pushed commit is built, verified and published as a prerelease to npm with the commit id appended to the version. Checkout GitHub Actions - https://github.com/LeeCheneler/ts-kit/actions.

When a new release is ready we do the proper release manually using the npm CLI.

### 1. Bump package version to the next version

All prereleases will have been automatically created with the next patch version number. Adhere to SEMVER.

If there are breaking changing bump the major number, else if there are new features then bump the minor number, else if its just fixes then bump the patch number.

### 2. Release packages in order

```sh
cd packages/eslint-config-ts-kit
npm publish --tag latest --access public

cd ../ts-kit
npm publish --tag latest --access public
```

### 3. Verification

Verify they have appeared in npm and are working.

### 3. Commit bumped versions

Commit the new bumped versions.

### 4. Create Tag and Release in GitHub

Tag the version bump commit in GitHub.
