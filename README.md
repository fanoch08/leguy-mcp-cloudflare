# leguy-mcp-cloudflare

MCP Server to query Uruguayan legislation from IMPO (Centro de Informacion Oficial), deployed on Cloudflare Workers.

## Endpoint

```
https://leguy-mcp-cloudflare.<your-account>.workers.dev/mcp
```

## Available tools

| Tool | Description |
|------|-------------|
| `leguy_get_norma` | Retrieves metadata and summary of a legal norm |
| `leguy_get_norma_completa` | Retrieves the full text of a legal norm |
| `leguy_get_articulo` | Retrieves a specific article |
| `leguy_get_constitucion` | Retrieves a summary of the Constitution |
| `leguy_search_articulos` | Searches text within articles of a norm |

## Agent workflows

Natural-language SOPs were added in `agents/` to guide MCP workflows:

- Query norm summary
- Query full norm
- Query specific article
- Query Constitution summary
- Search text in articles

## Supported norm types

- `ley`
- `decreto`
- `resolucion`
- `constitucion`
- `ordenanza`
- `acordada`

## Usage with Claude Code

```bash
claude mcp add leguy --transport sse --url https://leguy-mcp-cloudflare.<your-account>.workers.dev/mcp
```

## Local development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Server will be available at http://localhost:8787/mcp
```

## Deploy

```bash
npm run deploy
```

## Verification

Test with MCP Inspector:

```bash
npx @anthropic-ai/mcp-inspector@latest https://leguy-mcp-cloudflare.<your-account>.workers.dev/mcp
```

## Related repositories

- [leguy-mcp](https://github.com/schilotte/leguy-mcp) - Python version for local usage via `uvx leguy-mcp`

## Data source

Data comes from [IMPO - Centro de Informacion Oficial](https://www.impo.com.uy), the official Uruguayan legislation repository.

## License

MIT
