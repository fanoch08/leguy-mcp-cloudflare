# SOP: Query Constitution summary

## Objective
Get an executive overview of the Uruguayan Constitution to quickly identify relevant sections.

## MCP Tool
`leguy_get_constitucion`

## Required inputs
- No parameters required.

## Procedure
1. Execute `leguy_get_constitucion`.
2. Return key metadata and available sections.
3. If the user needs detailed text, offer next step with `leguy_get_articulo` using:
   - `tipo=constitucion`
   - `numero=1967`
   - `anio=1967`
   - requested `nro_articulo`

## Success criteria
- The user gets a useful high-level view and a clear path to drill down.

## Error handling
- If Constitution retrieval fails, report it explicitly and suggest retrying.
