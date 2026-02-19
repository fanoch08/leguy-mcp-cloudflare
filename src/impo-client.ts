/**
 * Client for IMPO (Centro de Informacion Oficial) API.
 * Adapted for Cloudflare Workers environment.
 */

import type { Articulo, ArticuloSearchResult, Norma, TipoNorma } from "./types";

const BASE_URL = "https://www.impo.com.uy";

/**
 * Mapping of norm types to URL paths.
 */
const TIPO_NORMA_PATH: Record<string, string> = {
	ley: "leyes",
	leyes: "leyes",
	decreto: "decretos",
	decretos: "decretos",
	resolucion: "resoluciones",
	resoluciones: "resoluciones",
	constitucion: "constitucion",
	ordenanza: "ordenanzas",
	ordenanzas: "ordenanzas",
	acordada: "acordadas",
	acordadas: "acordadas",
};

/**
 * Normalize norm type to URL path segment.
 */
function normalizeTipo(tipo: string): string {
	return TIPO_NORMA_PATH[tipo.toLowerCase().trim()] || tipo.toLowerCase().trim();
}

/**
 * Build the URL for a specific norm.
 */
function buildNormaUrl(tipo: string, numero: number, anio: number): string {
	const path = normalizeTipo(tipo);
	if (path === "constitucion") {
		return `${BASE_URL}/bases/constitucion/${anio}-${anio}`;
	}
	return `${BASE_URL}/bases/${path}/${numero}-${anio}`;
}

/**
 * Fetch a complete norm by type, number and year.
 *
 * @param tipo - Type of norm (ley, decreto, resolucion, constitucion, etc.)
 * @param numero - Norm number
 * @param anio - Year of the norm
 * @returns Norma object with full content including articles, or null if not found
 */
export async function getNorma(tipo: string, numero: number, anio: number): Promise<Norma | null> {
	const url = buildNormaUrl(tipo, numero, anio);

	try {
		const response = await fetch(`${url}?json=true`, {
			headers: {
				"User-Agent": "leguy-mcp-cloudflare/0.1.0 (MCP Server for Uruguay Legislation)",
				Accept: "application/json",
			},
		});

		if (!response.ok) {
			if (response.status === 404) {
				return null;
			}
			throw new Error(`HTTP error: ${response.status}`);
		}

		// IMPO returns ISO-8859-1 encoded JSON
		const buffer = await response.arrayBuffer();
		const decoder = new TextDecoder("iso-8859-1");
		const text = decoder.decode(buffer);
		return JSON.parse(text) as Norma;
	} catch (error) {
		console.error(`Error fetching norma: ${error}`);
		return null;
	}
}

/**
 * Fetch a specific article from a norm.
 *
 * @param tipo - Type of norm
 * @param numero - Norm number
 * @param anio - Year of the norm
 * @param nroArticulo - Article number
 * @returns Articulo object or null if not found
 */
export async function getArticulo(
	tipo: string,
	numero: number,
	anio: number,
	nroArticulo: number,
): Promise<Articulo | null> {
	const norma = await getNorma(tipo, numero, anio);
	if (norma === null) {
		return null;
	}

	for (const articulo of norma.articulos) {
		if (articulo.nroArticulo === String(nroArticulo)) {
			return articulo;
		}
	}
	return null;
}

/**
 * Fetch the Constitution of Uruguay.
 *
 * @returns Norma object with the full constitution
 */
export async function getConstitucion(): Promise<Norma | null> {
	return getNorma("constitucion", 1967, 1967);
}

/**
 * Search for text within articles of a specific norm.
 *
 * @param tipo - Type of norm
 * @param numero - Norm number
 * @param anio - Year
 * @param texto - Text to search for
 * @returns List of articles containing the search text
 */
export async function searchInArticulos(
	tipo: string,
	numero: number,
	anio: number,
	texto: string,
): Promise<ArticuloSearchResult[]> {
	const norma = await getNorma(tipo, numero, anio);
	if (norma === null) {
		return [];
	}

	const results: ArticuloSearchResult[] = [];
	const textoLower = texto.toLowerCase();
	const path = normalizeTipo(tipo);

	for (const articulo of norma.articulos) {
		if (articulo.textoArticulo.toLowerCase().includes(textoLower)) {
			results.push({
				tipoNorma: norma.tipoNorma,
				nroNorma: norma.nroNorma || String(numero),
				anioNorma: norma.anioNorma || anio,
				nombreNorma: norma.nombreNorma || "",
				nroArticulo: articulo.nroArticulo,
				textoArticulo: articulo.textoArticulo,
				urlArticulo: `${BASE_URL}/bases/${path}/${numero}-${anio}/${articulo.nroArticulo}`,
			});
		}
	}

	return results;
}

/**
 * Get the URL path for a norm type.
 */
export function getTipoNormaPath(tipo: string): string {
	return normalizeTipo(tipo);
}

/**
 * Get the public URL for a norm.
 */
export function getNormaUrl(tipo: string, numero: number, anio: number): string {
	const path = normalizeTipo(tipo);
	if (path === "constitucion") {
		return `${BASE_URL}/bases/constitucion/1967-1967`;
	}
	return `${BASE_URL}/bases/${path}/${numero}-${anio}`;
}

/**
 * Get the public URL for an article.
 */
export function getArticuloUrl(tipo: string, numero: number, anio: number, nroArticulo: string): string {
	const path = normalizeTipo(tipo);
	if (path === "constitucion") {
		return `${BASE_URL}/bases/constitucion/1967-1967/${nroArticulo}`;
	}
	return `${BASE_URL}/bases/${path}/${numero}-${anio}/${nroArticulo}`;
}
