# Development Notes

This document describes the expected local development workflow for DockStack.

## Toolchain

### Extension
- Node.js 20+
- pnpm 9.12.0
- WXT
- React
- TypeScript

### Native core
- Rust stable toolchain

## Typical local workflow

### Build the extension
```bash
cd apps/extension
pnpm install
pnpm build
pnpm zip
```

### Type-check the extension
```bash
cd apps/extension
pnpm typecheck
```

### Build the Rust workspace
```bash
cargo build --workspace
```

### Run the native core directly
```bash
cargo run -p native-core
```

## CI expectations

The repository includes GitHub Actions for:
- continuous build validation
- release packaging
- release creation through tagged assets

## Release expectations

The release workflow is designed to:
- generate semantic patch versions beginning at `v0.1.0`
- build the extension package
- build the native core
- publish GitHub release assets

## Development guidance

Because DockStack crosses browser-runtime code and native local code, changes should be tested with both of the following in mind:
- browser build correctness
- local host/runtime correctness

## Practical note on DuckDB

DuckDB brings real analytical capability, but it also increases native compile weight significantly. That is expected and should be treated as a normal consequence of using a serious embedded analytics engine.
