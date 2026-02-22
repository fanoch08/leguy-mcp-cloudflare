# SOP: Query a norm summary

## Objective
Retrieve metadata and a quick overview of a Uruguayan legal norm without downloading full content.

## MCP Tool
`leguy_get_norma`

## Required inputs
- `tipo` (`ley`, `decreto`, `resolucion`, `constitucion`, `ordenanza`, `acordada`)
- `numero` (norm number)
- `anio` (norm year)

## Procedure
1. Validate that `tipo`, `numero`, and `anio` are present.
2. Execute `leguy_get_norma` with those parameters.
3. If a result exists:
   - Summarize name, dates, and total article count.
   - Suggest next steps:
     - `leguy_get_articulo` for precise article-level queries,
     - `leguy_get_norma_completa` only if full text is truly required.
4. If no result exists, explicitly report that the norm was not found.

## Success criteria
- The user receives a clear, actionable summary of the norm.

## Error handling
- If the norm does not exist or IMPO fails, report it clearly and suggest verifying input parameters.
