/**
 * Formatters for IMPO data to human-readable text.
 */

import type { Articulo, ArticuloSearchResult, Norma } from "./types";
import { getArticuloUrl, getNormaUrl, getTipoNormaPath } from "./impo-client";

interface NormaArgs {
	tipo: string;
	numero: number;
	anio: number;
}

interface ArticuloArgs extends NormaArgs {
	nro_articulo: number;
}

/**
 * Format a Norma object as a brief summary.
 */
export function formatNormaResumen(norma: Norma, args: NormaArgs): string {
	const { tipo, numero, anio } = args;
	const url = getNormaUrl(tipo, numero, anio);

	const lines: string[] = [
		`# ${norma.tipoNorma} ${numero}/${anio}`,
	];

	if (norma.nombreNorma) {
		lines.push(`**${norma.nombreNorma}**`);
	}

	lines.push("");
	lines.push("## Metadata");

	if (norma.fechaPromulgacion) {
		lines.push(`- **Promulgacion:** ${norma.fechaPromulgacion}`);
	}
	if (norma.fechaPublicacion) {
		lines.push(`- **Publicacion:** ${norma.fechaPublicacion}`);
	}
	if (norma.leyenda) {
		lines.push(`- **Estado:** ${norma.leyenda.trim()}`);
	}

	lines.push(`- **Total de articulos:** ${norma.articulos.length}`);
	lines.push(`- **URL:** ${url}`);

	// Show structure/chapters if available
	if (norma.articulos.length > 0) {
		lines.push("");
		lines.push("## Estructura");

		const capitulos: string[] = [];
		// Check first 30 articles for chapter titles
		for (const art of norma.articulos.slice(0, 30)) {
			if (art.titulosArticulo && art.titulosArticulo.trim()) {
				const titulo = art.titulosArticulo.replace(/<br>/g, " ").trim();
				if (!capitulos.includes(titulo)) {
					capitulos.push(titulo);
				}
			}
		}

		if (capitulos.length > 0) {
			// Show max 10 chapters
			for (const cap of capitulos.slice(0, 10)) {
				lines.push(`- ${cap}`);
			}
			if (capitulos.length > 10) {
				lines.push(`- ... y ${capitulos.length - 10} secciones mas`);
			}
		} else {
			// Show first few article titles
			lines.push("**Primeros articulos:**");
			for (const art of norma.articulos.slice(0, 5)) {
				const titulo = art.tituloArticulo || `Articulo ${art.nroArticulo}`;
				lines.push(`- Art. ${art.nroArticulo}: ${titulo}`);
			}
			if (norma.articulos.length > 5) {
				lines.push(`- ... y ${norma.articulos.length - 5} articulos mas`);
			}
		}
	}

	if (norma.referenciasNorma) {
		lines.push("");
		lines.push("## Referencias");
		// Clean HTML and truncate
		let refs = norma.referenciasNorma
			.replace(/<b>/g, "**")
			.replace(/<\/b>/g, "**")
			.replace(/<a class="linkFicha" href="/g, "[")
			.replace(/" >/g, "](https://www.impo.com.uy")
			.replace(/<\/a>/g, ")");
		if (refs.length > 500) {
			refs = refs.slice(0, 500) + "...";
		}
		lines.push(refs);
	}

	lines.push("");
	lines.push("---");
	lines.push("*Para ver el texto completo, usar `leguy_get_norma_completa`*");
	lines.push("*Para ver un articulo especifico, usar `leguy_get_articulo`*");

	return lines.join("\n");
}

/**
 * Format a Norma object with full content.
 */
export function formatNormaCompleta(norma: Norma, args: NormaArgs): string {
	const { tipo, numero, anio } = args;
	const nro = norma.nroNorma || "";
	const anioNorma = norma.anioNorma || "";

	// Build URL
	let url: string;
	if (tipo === "constitucion") {
		url = "https://www.impo.com.uy/bases/constitucion/1967-1967";
	} else {
		url = getNormaUrl(tipo, numero, anio);
	}

	const lines: string[] = [
		nro ? `# ${norma.tipoNorma} ${nro}/${anioNorma}` : `# ${norma.tipoNorma}`,
	];

	if (norma.nombreNorma) {
		lines.push(`**${norma.nombreNorma}**`);
	}

	lines.push("");

	if (norma.fechaPromulgacion) {
		lines.push(`- Fecha de promulgacion: ${norma.fechaPromulgacion}`);
	}
	if (norma.fechaPublicacion) {
		lines.push(`- Fecha de publicacion: ${norma.fechaPublicacion}`);
	}
	if (norma.leyenda) {
		lines.push(`- Estado: ${norma.leyenda}`);
	}
	lines.push(`- **URL:** ${url}`);

	lines.push("");

	if (norma.vistos && norma.vistos.trim()) {
		lines.push("## VISTOS");
		lines.push(norma.vistos);
		lines.push("");
	}

	if (norma.articulos.length > 0) {
		lines.push("## ARTICULOS");
		lines.push("");
		for (const art of norma.articulos) {
			let titulo = "";
			if (art.titulosArticulo) {
				titulo = ` - ${art.titulosArticulo.replace(/<br>/g, " ")}`;
			} else if (art.tituloArticulo) {
				titulo = ` - ${art.tituloArticulo}`;
			}

			lines.push(`### Articulo ${art.nroArticulo}${titulo}`);
			lines.push("");
			lines.push(art.textoArticulo);
			lines.push("");

			if (art.notasArticulo) {
				lines.push(`*Nota: ${art.notasArticulo}*`);
				lines.push("");
			}
		}
	}

	if (norma.referenciasNorma) {
		lines.push("## REFERENCIAS");
		lines.push(norma.referenciasNorma);
	}

	return lines.join("\n");
}

/**
 * Format Constitution as a summary.
 */
export function formatConstitucionResumen(norma: Norma): string {
	const lines: string[] = [
		"# Constitucion de la Republica Oriental del Uruguay",
		"",
		"## Metadata",
	];

	if (norma.fechaPublicacion) {
		lines.push(`- **Publicacion:** ${norma.fechaPublicacion}`);
	}
	lines.push(`- **Total de articulos:** ${norma.articulos.length}`);
	lines.push("- **URL:** https://www.impo.com.uy/bases/constitucion/1967-1967");
	lines.push("");
	lines.push("## Secciones");

	// Extract unique section titles
	const secciones: string[] = [];
	for (const art of norma.articulos) {
		if (art.titulosArticulo && art.titulosArticulo.trim()) {
			const titulo = art.titulosArticulo.replace(/<br>/g, " - ").trim();
			if (!secciones.includes(titulo)) {
				secciones.push(titulo);
			}
		}
	}

	for (const sec of secciones.slice(0, 20)) {
		lines.push(`- ${sec}`);
	}

	if (secciones.length > 20) {
		lines.push(`- ... y ${secciones.length - 20} secciones mas`);
	}

	lines.push("");
	lines.push("---");
	lines.push("*Para ver un articulo especifico, usar `leguy_get_articulo` con tipo='constitucion', numero=1967, anio=1967*");

	return lines.join("\n");
}

/**
 * Format a single Articulo for display.
 */
export function formatArticulo(articulo: Articulo, args: ArticuloArgs): string {
	const { tipo, numero, anio } = args;
	const nroArt = articulo.nroArticulo;
	const url = getArticuloUrl(tipo, numero, anio, nroArt);

	const lines: string[] = [
		`# Articulo ${nroArt}`,
		`*${tipo.charAt(0).toUpperCase() + tipo.slice(1)} ${numero}/${anio}*`,
		"",
	];

	if (articulo.titulosArticulo) {
		lines.push(`**${articulo.titulosArticulo.replace(/<br>/g, " ")}**`);
		lines.push("");
	} else if (articulo.tituloArticulo) {
		lines.push(`**${articulo.tituloArticulo}**`);
		lines.push("");
	}

	lines.push(articulo.textoArticulo);

	if (articulo.notasArticulo) {
		lines.push("");
		lines.push(`*Nota: ${articulo.notasArticulo}*`);
	}

	lines.push("");
	lines.push(`**URL:** ${url}`);

	return lines.join("\n");
}

/**
 * Format search results for display.
 */
export function formatSearchResults(results: ArticuloSearchResult[], query: string): string {
	const lines: string[] = [
		`# Busqueda: '${query}'`,
		`**${results.length} articulos encontrados**`,
		"",
	];

	// Limit to first 10 results to avoid huge responses
	const shownResults = results.slice(0, 10);

	for (const r of shownResults) {
		lines.push(`## Articulo ${r.nroArticulo}`);
		lines.push(`*${r.tipoNorma} ${r.nroNorma}/${r.anioNorma} - ${r.nombreNorma}*`);
		lines.push("");
		// Show excerpt around the match (first 300 chars)
		let texto = r.textoArticulo;
		if (texto.length > 300) {
			texto = texto.slice(0, 300) + "...";
		}
		lines.push(texto);
		lines.push("");
		lines.push(`**URL:** ${r.urlArticulo}`);
		lines.push("");
		lines.push("---");
		lines.push("");
	}

	if (results.length > 10) {
		lines.push(`*... y ${results.length - 10} articulos mas. Usar \`leguy_get_articulo\` para ver articulos especificos.*`);
	}

	return lines.join("\n");
}
