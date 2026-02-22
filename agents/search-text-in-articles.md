# SOP: Search text within articles

## Objective
Quickly find articles in a norm that contain a target term or phrase.

## MCP Tool
`leguy_search_articulos`

## Required inputs
- `tipo`
- `numero`
- `anio`
- `texto` (search string)

## Procedure
1. Validate that `texto` is non-empty and the norm is identified.
2. Execute `leguy_search_articulos`.
3. If there are matches:
   - List matching articles with short context.
   - Recommend opening relevant items with `leguy_get_articulo`.
4. If there are no matches, report that no occurrences were found.

## Success criteria
- The user receives a useful match list for targeted legal exploration.

## Error handling
- If query fails or norm is missing, communicate clearly and suggest reviewing search terms.
