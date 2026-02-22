# Agent workflows for `leguy-mcp-cloudflare`

This directory defines **SOPs (Standard Operating Procedures)** in natural language for agents using this MCP server.

Goal: enable agents to execute repeatable, traceable, and safe workflows for the repository's main use cases.

## Covered workflows

1. `query-norm-summary.md`
2. `query-full-norm.md`
3. `query-specific-article.md`
4. `query-constitution-summary.md`
5. `search-text-in-articles.md`

## Conventions

- Prioritize `leguy_get_norma` before requesting full text.
- Avoid long responses when unnecessary.
- Always report when a resource is not found.
- Keep traceability: norm type, number, year, and tool used.
