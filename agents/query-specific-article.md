# SOP: Query a specific article

## Objective
Retrieve one specific article to answer focused questions without loading the entire norm.

## MCP Tool
`leguy_get_articulo`

## Required inputs
- `tipo`
- `numero`
- `anio`
- `nro_articulo`

## Procedure
1. Validate all parameters, especially `nro_articulo`.
2. Execute `leguy_get_articulo`.
3. If found:
   - Return title (when available), text, and reference URL.
   - Keep norm context (`tipo numero/anio`).
4. If not found, state that the article was not found in the specified norm.

## Success criteria
- The user receives the correct article with legal context and source link.

## Error handling
- If norm/article does not exist, clearly explain what is missing and suggest validating numbering.
