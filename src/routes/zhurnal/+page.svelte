<script lang="ts">
	import PostCard from '#lib/components/journal/PostCard.svelte';
	import MarginGame from '#lib/components/journal/MarginGame.svelte';
	import SiteFooter from '#lib/components/journal/SiteFooter.svelte';
	import Seo from '#lib/components/journal/Seo.svelte';
	import SiteHeader from '#lib/components/journal/SiteHeader.svelte';
	import Snow from '#lib/components/journal/Snow.svelte';

	import { photos } from '#lib/content.js';

	let { data } = $props();

	const TILTS = ['-1.2deg', '0.9deg', '-0.6deg', '1.2deg'];
</script>

<Seo
	title="Журнал занятий — Soft Skills Lab"
	description="Аня рассказывает, что происходило на занятиях Soft Skills Lab в Акко и что дети унесли домой."
	path="/zhurnal"
	image={photos[0].src}
/>

{#if data.greeting}
	<Snow />
{:else}
	<MarginGame />
{/if}
<SiteHeader />
<main class="all">
	<div class="wrap">
		<h1>Журнал занятий</h1>
		<p class="sub">После занятий Аня записывает, что происходило в лаборатории и что дети унесли домой.</p>
		<div class="cards">
			{#each data.posts as post, i (post.slug)}
				<div style:--tilt={TILTS[i % TILTS.length]}><PostCard {post} /></div>
			{/each}
		</div>
	</div>
</main>
<SiteFooter greeting={data.greeting} />

<style>
	.all {
		padding: clamp(24px, 4vw, 48px) 0 clamp(72px, 10vw, 140px);
	}
	h1 {
		font-size: clamp(40px, 5vw, 72px);
	}
	.sub {
		margin-top: 18px;
		max-width: 46ch;
		font-size: clamp(18px, 1.5vw, 20px);
		color: var(--ink-2);
	}
	.cards {
		margin-top: clamp(40px, 5vw, 64px);
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 340px), 1fr));
		gap: clamp(28px, 3vw, 40px);
	}
	.cards > div {
		display: grid;
	}
</style>
