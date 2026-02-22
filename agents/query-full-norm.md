# SOP: Query a full norm

## Objective
Retrieve the complete text of a legal norm when exhaustive review is required.

## MCP Tool
`leguy_get_norma_completa`

## Required inputs
- `tipo`
- `numero`
- `anio`

## Procedure
1. Confirm the user actually needs full text (the response can be long).
2. Execute `leguy_get_norma_completa`.
3. Return the full result while preserving article structure.
4. If output is too large for context limits, offer article-by-article retrieval via `leguy_get_articulo`.

## Success criteria
- The user receives the full norm content with clear traceability (type/number/year).

## Error handling
- If the norm is not found, communicate it and offer `leguy_get_norma` as a validation step.
