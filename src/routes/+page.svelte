<script lang="ts">
	import { page } from '$app/state';
	import EntryPass from '#lib/components/journal/EntryPass.svelte';
	import Hero from '#lib/components/journal/Hero.svelte';
	import PhotoStrip from '#lib/components/journal/PhotoStrip.svelte';
	import Protocols from '#lib/components/journal/Protocols.svelte';
	import Roster from '#lib/components/journal/Roster.svelte';
	import SiteFooter from '#lib/components/journal/SiteFooter.svelte';
	import SiteHeader from '#lib/components/journal/SiteHeader.svelte';
	import Teacher from '#lib/components/journal/Teacher.svelte';
	import { photos } from '#lib/content.js';

	let { data } = $props();

	const title = 'Soft Skills Lab — мини-группы для детей 6–16 лет, Акко';
	const description = 'Мини-группы до 6 детей 6–16 лет в Акко. Научные опыты, на которых дети учатся договариваться, слушать и не бояться ошибок.';
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={new URL(photos[0].src, page.url.href).href} />
</svelte:head>

<SiteHeader />
<main>
	<Hero photo={photos[data.heroPhoto]} />
	<Roster />
	<Protocols />
	<PhotoStrip photos={photos.filter((_, i) => i !== data.heroPhoto)} />
	<Teacher />
	<EntryPass />
</main>
<SiteFooter />
