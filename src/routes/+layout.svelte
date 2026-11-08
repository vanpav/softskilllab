<script lang="ts">
	import { page } from '$app/state';
	import { SITE_URL } from '#lib/content.js';
	import './layout.css';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();

	// Only real visitors of the site: not Аня's editor, not local runs, not a preview address.
	const tracked = $derived(page.url.origin === SITE_URL && !/^\/adm(\/|$)/.test(page.url.pathname));

	function trackWhatsApp(event: MouseEvent) {
		if (!(event.target instanceof Element) || !event.target.closest('a[href^="https://wa.me/"]')) return;
		const place = event.target.closest('header, section, .cta');
		const placement = !place ? 'page' : place.id || (place.localName === 'header' ? 'header' : place.classList[0]);
		window.gtag?.('event', 'whatsapp_click', { placement });
	}

	const GTM_SETUP = `<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());<\/script>`;
</script>

<svelte:window onclick={trackWhatsApp} />

<svelte:head>
	<link rel="icon" href="/favicon.ico" sizes="48x48" />
	<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
	<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
	{#if tracked}
		<script async src="https://www.googletagmanager.com/gtm.js?id=GTM-NH8NB2TF"></script>
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html GTM_SETUP}
	{/if}
</svelte:head>

{@render children()}
