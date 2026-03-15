# Contributing

This project uses a lightweight, solo-friendly workflow to keep `main` stable.

## Branch naming

Use short-lived branches from `main`:

- `feat/<short-description>` for features
- `fix/<short-description>` for bug fixes
- `chore/<short-description>` for maintenance/docs/tooling
- `refactor/<short-description>` for code restructuring without behavior changes

Examples:

- `feat/sankey-diagram`
- `fix/category-total`
- `chore/update-readme`

## Workflow

1. Create a branch from the latest `main`.
2. Make focused changes for one goal.
3. Run validation checks locally before merging.
4. Merge into `main` when ready (squash merge preferred for clean history).

## Validation checklist

Run these before merging:

- `cargo check --manifest-path backend/Cargo.toml`
- `cargo clippy --manifest-path backend/Cargo.toml -- -D warnings`
- `npm run build --prefix frontend`

## Commit message style

Use concise [Conventional Commit](https://www.conventionalcommits.org/) prefixes:

- `feat: ...`
- `fix: ...`
- `chore: ...`
- `refactor: ...`
- `docs: ...`

## Scope guidelines

- Keep changes small and focused on a single goal.
- Avoid mixing unrelated backend and frontend changes in one branch.
- Prefer follow-up branches over large, multi-purpose changes.
