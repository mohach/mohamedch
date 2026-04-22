declare module 'astro:content' {
	interface RenderResult {
		Content: import('astro/runtime/server/index.js').AstroComponentFactory;
		headings: import('astro').MarkdownHeading[];
		remarkPluginFrontmatter: Record<string, any>;
	}
	interface Render {
		'.md': Promise<RenderResult>;
	}

	export interface RenderedContent {
		html: string;
		metadata?: {
			imagePaths: Array<string>;
			[key: string]: unknown;
		};
	}
}

declare module 'astro:content' {
	type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

	export type CollectionKey = keyof AnyEntryMap;
	export type CollectionEntry<C extends CollectionKey> = Flatten<AnyEntryMap[C]>;

	export type ContentCollectionKey = keyof ContentEntryMap;
	export type DataCollectionKey = keyof DataEntryMap;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	/** @deprecated Use `getEntry` instead. */
	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	/** @deprecated Use `getEntry` instead. */
	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E,
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E,
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown,
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {}),
	>(
		collection: C,
		slug: E,
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {}),
	>(
		collection: C,
		id: E,
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[],
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[],
	): Promise<CollectionEntry<C>[]>;

	export function render<C extends keyof AnyEntryMap>(
		entry: AnyEntryMap[C][string],
	): Promise<RenderResult>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C,
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
				}
			: {
					collection: C;
					id: keyof DataEntryMap[C];
				}
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C,
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"blog": {
"2026-04-09-herramientas-open-source-esenciales-para-sysadmins.md": {
	id: "2026-04-09-herramientas-open-source-esenciales-para-sysadmins.md";
  slug: "herramientas-open-source-esenciales-para-sysadmins";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2026-04-09-herramientas-open-source-imprescindibles-para-sysadmins.md": {
	id: "2026-04-09-herramientas-open-source-imprescindibles-para-sysadmins.md";
  slug: "herramientas-open-source-imprescindibles-para-sysadmins";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2026-04-09-top-open-source-tools-for-sysadmins.md": {
	id: "2026-04-09-top-open-source-tools-for-sysadmins.md";
  slug: "top-open-source-tools-for-sysadmins";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2026-04-11-how-to-contribute-to-open-source-on-github.md": {
	id: "2026-04-11-how-to-contribute-to-open-source-on-github.md";
  slug: "how-to-contribute-to-open-source-on-github";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2026-04-13-boost-wordpress-pagespeed-from-50-to-100.md": {
	id: "2026-04-13-boost-wordpress-pagespeed-from-50-to-100.md";
  slug: "boost-wordpress-pagespeed-from-50-to-100";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2026-04-13-optimiza-wordpress-de-50-a-100-en-pagespeed-insights.md": {
	id: "2026-04-13-optimiza-wordpress-de-50-a-100-en-pagespeed-insights.md";
  slug: "optimiza-wordpress-de-50-a-100-en-pagespeed-insights";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2026-04-14-guia-practica-de-apis-rest-con-ejemplos-reales.md": {
	id: "2026-04-14-guia-practica-de-apis-rest-con-ejemplos-reales.md";
  slug: "guia-practica-de-apis-rest-con-ejemplos-reales";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2026-04-14-rest-apis-explained-with-real-world-examples.md": {
	id: "2026-04-14-rest-apis-explained-with-real-world-examples.md";
  slug: "rest-apis-explained-with-real-world-examples";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2026-04-15-guia-practica-de-apis-rest-con-ejemplos-reales.md": {
	id: "2026-04-15-guia-practica-de-apis-rest-con-ejemplos-reales.md";
  slug: "guia-practica-de-apis-rest-con-ejemplos-reales";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2026-04-15-rest-apis-explained-with-real-world-examples.md": {
	id: "2026-04-15-rest-apis-explained-with-real-world-examples.md";
  slug: "rest-apis-explained-with-real-world-examples";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2026-04-17-como-funciona-https-y-ssl-tls-facil.md": {
	id: "2026-04-17-como-funciona-https-y-ssl-tls-facil.md";
  slug: "como-funciona-https-y-ssl-tls-facil";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2026-04-17-how-https-and-ssl-tls-work-simply-explained.md": {
	id: "2026-04-17-how-https-and-ssl-tls-work-simply-explained.md";
  slug: "how-https-and-ssl-tls-work-simply-explained";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2026-04-19-build-an-iptv-infrastructure-with-ffmpeg-and-hls.md": {
	id: "2026-04-19-build-an-iptv-infrastructure-with-ffmpeg-and-hls.md";
  slug: "build-an-iptv-infrastructure-with-ffmpeg-and-hls";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"2026-04-19-monta-tu-iptv-con-ffmpeg-y-hls.md": {
	id: "2026-04-19-monta-tu-iptv-con-ffmpeg-y-hls.md";
  slug: "monta-tu-iptv-con-ffmpeg-y-hls";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"astro-islands-lcp.md": {
	id: "astro-islands-lcp.md";
  slug: "astro-islands-lcp";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"contribuir-open-source.md": {
	id: "contribuir-open-source.md";
  slug: "contribuir-open-source";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
"typescript-tipos-avanzados.md": {
	id: "typescript-tipos-avanzados.md";
  slug: "typescript-tipos-avanzados";
  body: string;
  collection: "blog";
  data: any
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	export type ContentConfig = never;
}
