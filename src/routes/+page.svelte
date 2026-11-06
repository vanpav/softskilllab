<script lang="ts">
	import EntryPass from '#lib/components/journal/EntryPass.svelte';
	import Hero from '#lib/components/journal/Hero.svelte';
	import PhotoStrip from '#lib/components/journal/PhotoStrip.svelte';
	import Protocols from '#lib/components/journal/Protocols.svelte';
	import Roster from '#lib/components/journal/Roster.svelte';
	import SiteFooter from '#lib/components/journal/SiteFooter.svelte';
	import SiteHeader from '#lib/components/journal/SiteHeader.svelte';
	import Teacher from '#lib/components/journal/Teacher.svelte';

	const title = 'Soft Skills Lab — мини-группы для детей 6–16 лет, Акко';
	const description = 'Мини-группы до 6 детей 6–16 лет в Акко. Научные опыты, на которых дети учатся договариваться, слушать и не бояться ошибок.';
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta property="og:type" content="website" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content="https://softskilllabs.com/uploads/soft-skills-lab-kids-flask-experiment.webp" />
</svelte:head>

<SiteHeader />
<main>
	<Hero />
	<Roster />
	<Protocols />
	<PhotoStrip />
	<Teacher />
	<EntryPass />
</main>
<SiteFooter />
