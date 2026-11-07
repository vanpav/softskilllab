<script lang="ts">
	import { onMount } from 'svelte';
	import EntryPass from '#lib/components/journal/EntryPass.svelte';
	import LabJournal from '#lib/components/journal/LabJournal.svelte';
	import Hero from '#lib/components/journal/Hero.svelte';
	import MarginGame from '#lib/components/journal/MarginGame.svelte';
	import PhotoStrip from '#lib/components/journal/PhotoStrip.svelte';
	import Protocols from '#lib/components/journal/Protocols.svelte';
	import Roster from '#lib/components/journal/Roster.svelte';
	import SiteFooter from '#lib/components/journal/SiteFooter.svelte';
	import SiteHeader from '#lib/components/journal/SiteHeader.svelte';
	import SoftSkills from '#lib/components/journal/SoftSkills.svelte';
	import Seo from '#lib/components/journal/Seo.svelte';
	import Snow from '#lib/components/journal/Snow.svelte';
	import Teacher from '#lib/components/journal/Teacher.svelte';
	import { photos } from '#lib/content.js';
	import { businessSchema } from '#lib/schema.js';
	import { COMING_NEW_YEAR } from '#lib/season.js';

	let { data } = $props();

	// `localStorage.show_ny = true` in the console, then reload: shows the season on any date.
	let showNewYear = $state(false);
	onMount(() => {
		try {
			showNewYear = localStorage.getItem('show_ny') === 'true';
		} catch {
			// Storage can be blocked; the page just follows the date.
		}
	});
	const greeting = $derived(data.greeting ?? (showNewYear ? COMING_NEW_YEAR : null));

	const title = 'Soft Skills Lab — мини-группы для детей 6–16 лет в Акко, на русском';
	const description = 'Мини-группы до 6 детей 6–16 лет в Акко. Научные опыты, на которых дети учатся договариваться, слушать и не бояться ошибок.';
</script>

<Seo {title} {description} path="/" image={photos[0].src} schema={businessSchema(description, photos[0].src)} />

{#if greeting}
	<Snow />
{:else}
	<MarginGame />
{/if}
<SiteHeader />
<main>
	<Hero photo={photos[data.heroPhoto]} newYear={!!greeting} />
	<SoftSkills />
	<Roster month={data.month} />
	<Protocols />
	<PhotoStrip photos={photos.filter((_, i) => i !== data.heroPhoto)} />
	<Teacher newYear={!!greeting} look={data.anyaLook} />
	<EntryPass month={data.month} />
	<LabJournal posts={data.posts} />
</main>
<SiteFooter {greeting} />
