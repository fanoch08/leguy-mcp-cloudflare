/**
 * MCP Server for Uruguay Legislation (IMPO) - Cloudflare Workers
 *
 * This server provides tools to query Uruguayan legislation from IMPO
 * (Centro de Informacion Oficial).
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { McpAgent } from "agents/mcp";
import { z } from "zod";

import { getArticulo, getConstitucion, getNorma, searchInArticulos } from "./impo-client";
import {
	formatArticulo,
	formatConstitucionResumen,
	formatNormaCompleta,
	formatNormaResumen,
	formatSearchResults,
} from "./formatters";

// Valid norm types
const tipoNormaEnum = z.enum(["ley", "decreto", "resolucion", "constitucion", "ordenanza", "acordada"]);

/**
 * Leguy MCP Agent with tools for Uruguayan legislation.
 */
export class LeguyMCP extends McpAgent {
	server = new McpServer({
		name: "leguy-mcp",
		version: "0.1.0",
	});

	async init() {
		// Tool 1: Get norm summary
		this.server.tool(
			"leguy_get_norma",
			"Obtiene metadata y resumen de una norma uruguaya (ley, decreto, etc.). Devuelve: nombre, fechas, cantidad de articulos, y titulos de los primeros articulos. Para obtener el texto completo, usar leguy_get_norma_completa. Tipos: ley, decreto, resolucion, constitucion, ordenanza, acordada",
			{
				tipo: tipoNormaEnum.describe("Tipo de norma"),
				numero: z.number().describe("Numero de la norma (ej: 18331)"),
				anio: z.number().describe("Anio de la norma (ej: 2008)"),
			},
			async ({ tipo, numero, anio }) => {
				const norma = await getNorma(tipo, numero, anio);
				if (norma === null) {
					return {
						content: [{ type: "text", text: `No se encontro la norma: ${tipo} ${numero}/${anio}` }],
					};
				}
				const text = formatNormaResumen(norma, { tipo, numero, anio });
				return { content: [{ type: "text", text }] };
			},
		);

		// Tool 2: Get full norm content
		this.server.tool(
			"leguy_get_norma_completa",
			"Obtiene el texto COMPLETO de una norma uruguaya incluyendo todos los articulos. ADVERTENCIA: Puede devolver respuestas muy largas (miles de tokens). Usar solo cuando se necesite el texto completo de la norma. Para ver solo metadata/resumen, usar leguy_get_norma.",
			{
				tipo: tipoNormaEnum.describe("Tipo de norma"),
				numero: z.number().describe("Numero de la norma"),
				anio: z.number().describe("Anio de la norma"),
			},
			async ({ tipo, numero, anio }) => {
				const norma = await getNorma(tipo, numero, anio);
				if (norma === null) {
					return {
						content: [{ type: "text", text: `No se encontro la norma: ${tipo} ${numero}/${anio}` }],
					};
				}
				const text = formatNormaCompleta(norma, { tipo, numero, anio });
				return { content: [{ type: "text", text }] };
			},
		);

		// Tool 3: Get specific article
		this.server.tool(
			"leguy_get_articulo",
			"Obtiene un articulo especifico de una norma uruguaya. Util para consultar un articulo particular sin descargar toda la norma.",
			{
				tipo: tipoNormaEnum.describe("Tipo de norma"),
				numero: z.number().describe("Numero de la norma"),
				anio: z.number().describe("Anio de la norma"),
				nro_articulo: z.number().describe("Numero del articulo a consultar"),
			},
			async ({ tipo, numero, anio, nro_articulo }) => {
				const articulo = await getArticulo(tipo, numero, anio, nro_articulo);
				if (articulo === null) {
					return {
						content: [
							{
								type: "text",
								text: `No se encontro el articulo ${nro_articulo} de ${tipo} ${numero}/${anio}`,
							},
						],
					};
				}
				const text = formatArticulo(articulo, { tipo, numero, anio, nro_articulo });
				return { content: [{ type: "text", text }] };
			},
		);

		// Tool 4: Get Constitution summary
		this.server.tool(
			"leguy_get_constitucion",
			"Obtiene resumen de la Constitucion de Uruguay. Devuelve metadata y lista de secciones. Para articulos especificos usar leguy_get_articulo.",
			{},
			async () => {
				const norma = await getConstitucion();
				if (norma === null) {
					return {
						content: [{ type: "text", text: "No se pudo obtener la Constitucion" }],
					};
				}
				const text = formatConstitucionResumen(norma);
				return { content: [{ type: "text", text }] };
			},
		);

		// Tool 5: Search in articles
		this.server.tool(
			"leguy_search_articulos",
			"Busca texto dentro de los articulos de una norma especifica. Devuelve lista de articulos que contienen el texto buscado.",
			{
				tipo: tipoNormaEnum.describe("Tipo de norma"),
				numero: z.number().describe("Numero de la norma"),
				anio: z.number().describe("Anio de la norma"),
				texto: z.string().describe("Texto a buscar dentro de los articulos"),
			},
			async ({ tipo, numero, anio, texto }) => {
				const results = await searchInArticulos(tipo, numero, anio, texto);
				if (results.length === 0) {
					return {
						content: [
							{
								type: "text",
								text: `No se encontro '${texto}' en ${tipo} ${numero}/${anio}`,
							},
						],
					};
				}
				const text = formatSearchResults(results, texto);
				return { content: [{ type: "text", text }] };
			},
		);
	}
}

/**
 * Cloudflare Worker fetch handler.
 */
export default {
	fetch(request: Request, env: Env, ctx: ExecutionContext) {
		const url = new URL(request.url);

		// Handle MCP endpoint
		if (url.pathname === "/mcp") {
			return LeguyMCP.serve("/mcp").fetch(request, env, ctx);
		}

		// Home page with info
		if (url.pathname === "/" || url.pathname === "") {
			return new Response(
				`<!DOCTYPE html>
<html>
<head>
	<title>leguy-mcp - Uruguay Legislation MCP Server</title>
	<style>
		body { font-family: system-ui, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
		h1 { color: #333; }
		code { background: #f4f4f4; padding: 2px 6px; border-radius: 4px; }
		pre { background: #f4f4f4; padding: 15px; border-radius: 8px; overflow-x: auto; }
		.endpoint { background: #e7f3ff; padding: 10px; border-radius: 8px; margin: 20px 0; }
	</style>
</head>
<body>
	<h1>leguy-mcp</h1>
	<p>MCP Server para consultar legislacion uruguaya desde IMPO (Centro de Informacion Oficial).</p>

	<div class="endpoint">
		<strong>MCP Endpoint:</strong> <code>/mcp</code>
	</div>

	<h2>Tools disponibles</h2>
	<ul>
		<li><strong>leguy_get_norma</strong> - Obtiene metadata y resumen de una norma</li>
		<li><strong>leguy_get_norma_completa</strong> - Obtiene el texto completo de una norma</li>
		<li><strong>leguy_get_articulo</strong> - Obtiene un articulo especifico</li>
		<li><strong>leguy_get_constitucion</strong> - Obtiene resumen de la Constitucion</li>
		<li><strong>leguy_search_articulos</strong> - Busca texto en articulos de una norma</li>
	</ul>

	<h2>Tipos de norma soportados</h2>
	<p><code>ley</code>, <code>decreto</code>, <code>resolucion</code>, <code>constitucion</code>, <code>ordenanza</code>, <code>acordada</code></p>

	<h2>Uso con Claude Code</h2>
	<pre>claude mcp add leguy --transport sse --url ${url.origin}/mcp</pre>

	<h2>Links</h2>
	<ul>
		<li><a href="https://github.com/steffanochilotte/leguy-mcp-cloudflare">GitHub Repository</a></li>
		<li><a href="https://www.impo.com.uy">IMPO - Centro de Informacion Oficial</a></li>
	</ul>
</body>
</html>`,
				{
					headers: { "Content-Type": "text/html; charset=utf-8" },
				},
			);
		}

		return new Response("Not found", { status: 404 });
	},
};
