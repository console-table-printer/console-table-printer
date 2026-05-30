# AGENTS.md

This guide is for future agents and maintainers working in this repository. It summarizes how the project is organized, how changes should be made, and which checks matter before handing work back.

## Project Overview

`console-table-printer` is a TypeScript library for rendering formatted tables for console output. The published package is CommonJS and ships compiled files from `dist/`, with type declarations generated from TypeScript.

The public package entry point is `index.ts`. It exports:

- `Table`: chainable class facade for building and printing tables.
- `printTable`: direct helper that prints an array of row objects.
- `renderTable`: direct helper that renders an array of row objects to a string.
- `COLOR` and `ALIGNMENT`: public TypeScript type exports from the external table model.

The project uses Yarn, TypeScript, Jest with `ts-jest`, ESLint flat config, Prettier, and semantic-release.

## Repository Map

- `index.ts`: package entry point and public exports.
- `src/console-table-printer.ts`: public `Table` class. This is intentionally thin and delegates to `TableInternal`.
- `src/models/`: public and internal TypeScript model definitions.
  - `external-table.ts`: user-facing option types such as `ComplexOptions`, `ColumnOptionsRaw`, computed columns, filter/sort callbacks, and default column options.
  - `internal-table.ts`: normalized column/style structures used by the renderer.
  - `common.ts`: shared dictionary, row, color, alignment, and char-width types.
- `src/internalTable/`: internal table state, input conversion, preprocessing, and rendering.
  - `internal-table.ts`: mutable table state and methods for adding columns/rows.
  - `input-converter.ts`: converts raw user column options into internal columns.
  - `table-pre-processors.ts`: render-time preprocessing for computed columns, enabled/disabled columns, sorting, filtering, and column width calculation.
  - `internal-table-printer.ts`: actual rendering pipeline and public simple-table helpers.
- `src/utils/`: console width, padding, color, border, row, and column helpers.
- `test/`: broad integration, feature, snapshot, README example, infrastructure, package, and performance tests.
- `src/**/*.test.ts`: focused unit tests colocated with source modules.
- `static-resources/`: README screenshots.
- `.github/workflows/`: CI for lint/format, coverage, package packing, cross-version package tests, and release.

## Development Commands

Use Yarn for this repository.

```bash
yarn
yarn build
yarn test
yarn test:coverage
yarn lint
yarn format
```

Useful targeted checks:

```bash
yarn jest --config jestconfig.json path/to/file.test.ts
yarn jest --config jestconfig.json path/to/file.test.ts -u
yarn prettier --check "**/*.{ts,js,yml}"
npm pack
```

Notes:

- `yarn build` runs `tsc` and emits CommonJS JavaScript plus `.d.ts` files into `dist/`.
- `yarn test` uses `jestconfig.json` and discovers both `test/**/*.test.*` and colocated `src/**/*.test.ts` files.
- `yarn test:coverage` enforces global 80% thresholds for branches, functions, lines, and statements.
- CI uses Node 24 for build/test/quality jobs, then validates the packed package on Node 14, 16, 18, 20, and 22.

## Architecture Notes

The high-level flow is:

1. User code imports from `index.ts`.
2. `Table` in `src/console-table-printer.ts` delegates all stateful behavior to `TableInternal`.
3. User-facing options are normalized through helpers such as `rawColumnToInternalColumn` and `convertRawRowOptionsToStandard`.
4. Rendering calls `renderTable(table)` in `src/internalTable/internal-table-printer.ts`.
5. Before rendering, `preProcessColumns` and `preProcessRows` mutate the internal table state.
6. Rows are transformed, split to width-limited lines, padded, colored, bordered, and joined with newlines.

Important behavior:

- Columns can be provided explicitly, inferred from row keys, or added later.
- `defaultColumnOptions` applies when raw columns are converted to internal columns, including inferred columns and computed columns.
- `computedColumns` are created during render. The code guards against duplicate computed columns when rendering multiple times.
- Sorting and filtering happen during render and replace `table.rows` with the processed row array.
- Column transforms affect rendered values and column width calculation, but `renderRow` deep-clones the row so transforms do not mutate original row data.
- `shouldDisableColors` replaces the color map with `{}`, which leaves rendered text uncolored.
- `charLength` lets callers override width calculations for specific characters before falling back to `simple-wcswidth`.

## Working On Features

When adding or changing public behavior:

- Update or add user-facing types in `src/models/external-table.ts`.
- Keep `Table` as a thin facade unless the public API itself changes.
- Normalize user input in `src/internalTable/input-converter.ts` or `src/utils/table-helpers.ts`.
- Add internal state or defaults in `src/internalTable/internal-table.ts`.
- Add render-time behavior in `src/internalTable/table-pre-processors.ts` when it changes columns, rows, sort/filter behavior, computed columns, or widths.
- Add string output behavior in `src/internalTable/internal-table-printer.ts` or `src/utils/string-utils.ts` when it changes actual table rendering.
- Export new public API from `index.ts`.

Prefer preserving existing API compatibility. This package is tested as an installed dependency, so changes to `main`, `types`, emitted file structure, or package contents can break CI even when source tests pass.

### End-To-End Feature Workflow

For a new feature, make the change through the same layers a user exercises:

1. Start from the public API shape. Decide whether the feature belongs on `Table`, `printTable`, `renderTable`, or table options.
2. Add or update public types in `src/models/external-table.ts` when the feature introduces options, callbacks, or user-visible data structures.
3. Keep `src/console-table-printer.ts` as a chainable facade. Public instance methods should delegate to `TableInternal` and return `this` when they mutate the table, matching `addRow`, `addRows`, `addColumn`, and `addColumns`.
4. Put mutable table state and state-changing methods in `src/internalTable/internal-table.ts`.
5. Put render-time behavior in `src/internalTable/table-pre-processors.ts`, `src/internalTable/internal-table-printer.ts`, or `src/utils/string-utils.ts` only when the feature changes rendered output.
6. Export any new top-level public API from `index.ts`.
7. Update README/API docs when users need to discover the behavior from npm or the repository.

Example: a row-reset feature should expose a chainable `Table.clearRows()` method, delegate to `TableInternal.clearRows()`, keep columns/options intact, and document that it removes only rows.

## Testing Guidance

Choose tests based on the change:

- Public rendering behavior: add or update snapshot tests under `test/` or `test/features/<feature>/`.
- Small helper behavior: add colocated tests under `src/**`.
- README examples: update tests under `test/readme/Version1` or `test/readme/Version2` when examples change.
- Installed package behavior: update `test/infrastructuralTest/package-test.test.js` and `test/githubActionsTest/package-test.js` if package consumption changes.
- Test discovery changes: update `test/infrastructuralTest/jest-discovery.test.ts` whenever adding, removing, or renaming test files.
- Performance-sensitive changes: review `test/performance/`.

Snapshot tests are a core part of this repo. Only update snapshots when the rendered output change is intentional, and inspect the diff carefully because ANSI color codes, whitespace, alignment, and borders are meaningful output.

### Feature Test Layout

For a new public feature, prefer a dedicated folder under `test/features/<feature>/` instead of adding all coverage to broad root tests. Match the existing feature-test style:

- `basic.test.ts`: user-facing examples and chainability, usually with `expect(table.render()).toMatchSnapshot()`.
- `render.test.ts`: precise rendered-output assertions using `getTableHeader` and `getTableBody` from `test/testUtils/getRawData.ts`, plus snapshots when useful.
- `verifyOutput.test.ts`: behavioral assertions that are easier to read without snapshots, such as internal state, preserved columns, absent stale values, colors, alignment, or transformed data.
- `__snapshots__/`: generated by Jest for snapshot tests. Inspect these files before keeping them.

In feature rendering tests, choose header names and cell values that make the behavior obvious to human reviewers. The data should be intention-revealing, not necessarily short: use concise values for sorting/filtering/visibility tests, and deliberately long values when the feature being tested is wrapping, width calculation, truncation, alignment under long content, or multiline rendering. For example, use names like `priority`, `status`, `Display Name`, or `Current Status`, and row values like `active`, `hidden`, `Ready`, sorted numbers, or readable long phrases that clearly show what the assertion is checking. Avoid placeholder-heavy data such as `foo`, `bar`, `value1`, or unrelated long strings when readable test data would make the expected table easier to verify by eye.

When adding a new feature-test file, update `test/infrastructuralTest/jest-discovery.test.ts` by adding every new `*.test.ts` path to `expectedFiles`. This is required even when Jest can already discover the file.

Useful feature-test flow:

```bash
yarn jest --config jestconfig.json test/features/<feature>
yarn jest --config jestconfig.json test/infrastructuralTest/jest-discovery.test.ts
```

If snapshots are new or intentionally changed, run the targeted test first, inspect the generated snapshot diff, and only then keep or update snapshots. Avoid using `-u` broadly.

## Formatting And Style

- TypeScript is strict: `strict`, `strictNullChecks`, and `noImplicitAny` are enabled.
- Prettier settings: semicolons, single quotes, two-space indentation, trailing commas where valid in ES5.
- ESLint ignores tests, `dist`, `coverage`, and config files. It allows `console`, disables `camelcase`, and allows explicit `any`.
- Keep new code small and close to the existing module boundaries.
- Avoid broad refactors while changing rendering behavior. The snapshot surface is large, and unrelated churn makes output regressions harder to review.

## Packaging And Release

The package publishes only `dist` via the `files` field, but npm package contents also include standard metadata such as `package.json`, `README.md`, and `LICENSE`.

CI validates:

- Build output exists for every expected source module.
- The package tarball has an expected size range.
- Packed files match an explicit allowlist.
- The package can be installed and consumed from a fresh project.
- Type declarations resolve from `dist/index.d.ts`.

Releases are handled by semantic-release on `master`. Commit messages drive versioning. The release job builds, tests, generates changelog entries, publishes to npm, and creates GitHub releases.

## Common Pitfalls

- Render calls mutate internal state. Be careful with changes to sorting, filtering, computed columns, enabled/disabled columns, or column widths.
- Width calculations must account for ANSI codes and wide characters. Use `findWidthInConsole` rather than plain `.length`.
- `maxLen` does not blindly truncate; it constrains wrapping while ensuring the largest word can still fit.
- Row option conversion uses `options.separator || DEFAULT_ROW_SEPARATOR`. This is harmless while the default is `false`, but recheck it if the default separator behavior changes.
- Color names are type aliases from the `COLORS` array, but some tests pass non-standard colors to verify graceful behavior.
- The package test imports `console-table-printer` as an installed dependency, not via relative source paths.
- Adding a test file requires updating the explicit expected file list in `test/infrastructuralTest/jest-discovery.test.ts`.

## Before Finishing A Change

For documentation-only changes, inspect the rendered Markdown mentally and run no build unless the docs reference generated output.

For code changes, usually run:

```bash
yarn build
yarn test
yarn lint
```

For package-shape changes, also run:

```bash
npm pack
```

For snapshot changes, run the relevant Jest target first, then update snapshots intentionally with `-u` only after reviewing the expected output.
