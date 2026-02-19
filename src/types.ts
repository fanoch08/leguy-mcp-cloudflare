/**
 * TypeScript types for IMPO data structures.
 * Based on the Python Pydantic models from leguy-mcp.
 */

/**
 * Generic key-value field used in norms and articles.
 */
export interface Campo {
	nombreCampo: string;
	valor: string;
}

/**
 * Registro Nacional de Leyes y Decretos - National Registry info.
 */
export interface RNLD {
	tomo?: number | string;
	semestre?: number | string;
	anio?: number | string;
	pagina?: number | string;
}

/**
 * An article within a legal norm.
 */
export interface Articulo {
	nroArticulo: string;
	secArticulo?: string;
	tituloArticulo?: string;
	titulosArticulo?: string;
	textoArticulo: string;
	urlArticulo?: string;
	notasArticulo?: string;
	urlReferenciasArticulo?: string;
	campos?: Campo[];
}

/**
 * A signatory of the legal norm.
 */
export interface Firmante {
	firmante: string;
}

/**
 * A complete legal norm from IMPO.
 */
export interface Norma {
	tipoNorma: string;
	nroNorma?: string;
	anioNorma?: number;
	secNorma?: string;
	nombreNorma?: string;
	leyenda?: string;
	fechaPromulgacion?: string;
	fechaPublicacion?: string;
	urlVerImagen?: string;
	urlVerOriginal?: string;
	RNLD?: RNLD;
	vistos?: string;
	referenciasNorma?: string;
	urlReferenciasTodaLaNorma?: string;
	articulos: Articulo[];
	camposNorma?: Campo[];
	firmantes?: Firmante[] | string;
}

/**
 * A search result item (simplified norm info).
 */
export interface NormaSearchResult {
	tipoNorma: string;
	nroNorma: string;
	anioNorma: number;
	nombreNorma: string;
	url: string;
	fechaPublicacion?: string;
}

/**
 * A search result for an article within a norm.
 */
export interface ArticuloSearchResult {
	tipoNorma: string;
	nroNorma: string;
	anioNorma: number;
	nombreNorma: string;
	nroArticulo: string;
	textoArticulo: string;
	urlArticulo: string;
}

/**
 * Supported norm types.
 */
export type TipoNorma = "ley" | "decreto" | "resolucion" | "constitucion" | "ordenanza" | "acordada";
