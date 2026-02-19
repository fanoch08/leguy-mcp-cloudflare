# leguy-mcp-cloudflare

MCP Server para consultar legislacion uruguaya desde IMPO (Centro de Informacion Oficial), desplegado en Cloudflare Workers.

## Endpoint

```
https://leguy-mcp-cloudflare.<tu-cuenta>.workers.dev/mcp
```

## Tools disponibles

| Tool | Descripcion |
|------|-------------|
| `leguy_get_norma` | Obtiene metadata y resumen de una norma |
| `leguy_get_norma_completa` | Obtiene el texto completo de una norma |
| `leguy_get_articulo` | Obtiene un articulo especifico |
| `leguy_get_constitucion` | Obtiene resumen de la Constitucion |
| `leguy_search_articulos` | Busca texto en articulos de una norma |

## Tipos de norma soportados

- `ley`
- `decreto`
- `resolucion`
- `constitucion`
- `ordenanza`
- `acordada`

## Uso con Claude Code

```bash
claude mcp add leguy --transport sse --url https://leguy-mcp-cloudflare.<tu-cuenta>.workers.dev/mcp
```

## Desarrollo local

```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# El servidor estara disponible en http://localhost:8787/mcp
```

## Deploy

```bash
npm run deploy
```

## Verificacion

Probar con MCP Inspector:

```bash
npx @anthropic-ai/mcp-inspector@latest https://leguy-mcp-cloudflare.<tu-cuenta>.workers.dev/mcp
```

## Repositorios relacionados

- [leguy-mcp](https://github.com/steffanochilotte/leguy-mcp) - Version Python para uso local via `uvx leguy-mcp`

## Fuente de datos

Los datos provienen de [IMPO - Centro de Informacion Oficial](https://www.impo.com.uy), el repositorio oficial de legislacion uruguaya.

## Licencia

MIT
