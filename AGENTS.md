# AGENTS.md

Guide for AI agents collaborating in this repository.

## 1) Project objective

`leguy-mcp-cloudflare` is an MCP server deployed on Cloudflare Workers to query Uruguayan legislation from IMPO.

Main goal: expose stable, typed, and secure MCP tools so clients (e.g., Claude Code, MCP inspectors) can query legal norms, articles, and the Constitution.

## 2) Stack and runtime

- **Runtime:** Cloudflare Workers
- **Language:** TypeScript
- **Data validation:** Zod
- **MCP/Agents SDK:** `agents` package
- **Tooling:** `wrangler`, `tsc`, `oxlint`, `oxfmt`

## 3) Repository structure

- `src/index.ts`: Worker entrypoint and main MCP server wiring.
- `src/impo-client.ts`: HTTP client for IMPO.
- `src/formatters.ts`: response formatting helpers for tools.
- `src/types.ts`: shared domain types.
- `wrangler.jsonc`: Worker environment and deployment configuration.
- `worker-configuration.d.ts`: Worker environment type definitions.

If you add files, keep this separation of concerns (entrypoint, external client, formatting, types).

## 4) Recommended workflow for agents

1. Read `README.md` and this `AGENTS.md` before touching code.
2. Make minimal, focused changes (avoid broad refactors unless explicitly requested).
3. Keep public APIs backward-compatible unless explicitly instructed otherwise.
4. Run local validations before finishing.
5. Document functional impact in the final response (what changed and why).

## 5) Development and validation commands

Install dependencies:

```bash
npm install
```

Local development:

```bash
npm run dev
```

Recommended checks before delivering changes:

```bash
npm run type-check
npm run lint:fix
npm run format
```

> Note: `lint:fix` and `format` may modify files. Run `type-check` again if automatic changes were applied.

## 6) Coding standards

- Prefer small functions and explicit names.
- Centralize reusable types in `src/types.ts`.
- Validate external input (IMPO or tool input) with Zod when applicable.
- Avoid duplicated business logic across tools.
- Keep error messages useful for debugging, without leaking secrets.

## 7) Rules for MCP tool changes

When creating or modifying an MCP tool:

- Clearly define:
  - name,
  - description,
  - input schema,
  - output shape.
- Keep naming consistent (`leguy_*`).
- Document new tools in `README.md`.
- If an output contract changes, include a migration note in the PR description.

## 8) IMPO integration (robustness)

- Treat remote responses as untrusted.
- Handle timeouts/network errors with clear messages.
- Normalize text to avoid inconsistent output across tools.
- Avoid unnecessary dependencies that increase Worker latency.

## 9) Security and sensitive data

- Do not commit secrets, tokens, or credentials.
- Do not hardcode environment values.
- Use Worker environment variables/configuration for any future secrets.

## 10) Acceptance criteria for changes

Before closing a task, verify:

- [ ] Code compiles (`npm run type-check`).
- [ ] Style/lint applied (`npm run lint:fix` and `npm run format`).
- [ ] README updated if there are visible functional changes.
- [ ] Existing tools were not broken without justification.

## 11) PR guide for agent-made changes

Include in the PR:

1. **Short summary** (what was changed).
2. **Motivation** (why).
3. **Impact** (tools, types, contracts, compatibility).
4. **Validations run** (commands and results).
5. **Risks or follow-ups** (if any).

Suggested format:

- `Summary`
- `Changes`
- `Validation`
- `Risks / Follow-ups`

## 12) What NOT to do without explicit instruction

- Stack/framework migrations.
- Massive folder restructuring.
- Bulk tool contract changes.
- Introducing external telemetry or unjustified new network calls.

---

If this file conflicts with direct instructions from the user, system, or maintainer, those instructions take precedence.
