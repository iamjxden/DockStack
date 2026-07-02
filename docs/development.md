# Development

## Extension
```bash
cd apps/extension
pnpm install
pnpm build
```

## Native core
```bash
cargo build --workspace
cargo run -p native-core
```

## CI
GitHub Actions builds the extension and Rust workspace on every push to main.
