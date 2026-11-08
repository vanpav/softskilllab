<script lang="ts">
	import { SHARE_IMAGE, SITE_NAME, SITE_URL } from '#lib/content.js';

	let {
		title,
		description,
		path,
		image = SHARE_IMAGE,
		type = 'website',
		schema
	}: {
		title: string;
		description: string;
		/** Path on the live site, such as `/zhurnal`; the canonical always points at SITE_URL, never at workers.dev. */
		path: string;
		/** Absolute URL or a path on the site; without one, the common picture made for link previews. */
		image?: string;
		type?: 'website' | 'article';
		/** JSON-LD objects for this page. */
		schema?: object[];
	} = $props();

	const url = $derived(new URL(path, SITE_URL).href);
	const imageUrl = $derived(new URL(image, SITE_URL).href);
	// `<` is escaped so text inside the JSON can never close the script tag.
	const json = $derived(
		schema?.length ? JSON.stringify({ '@context': 'https://schema.org', '@graph': schema }).replace(/</g, '\\u003c') : ''
	);
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={url} />
	<meta property="og:type" content={type} />
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:locale" content="ru_RU" />
	<meta property="og:url" content={url} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={imageUrl} />
	{#if image === SHARE_IMAGE}
		<meta property="og:image:width" content="1200" />
		<meta property="og:image:height" content="630" />
	{/if}
	<meta name="twitter:card" content="summary_large_image" />
	{#if json}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html `<script type="application/ld+json">${json}</script>`}
	{/if}
</svelte:head>
