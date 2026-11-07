<script lang="ts">
	import { Button } from '#lib/components/ui/button/index.js';
	import type { Post } from '#lib/posts.js';
	import PostCard from './PostCard.svelte';

	/** Newest first. */
	let { posts }: { posts: Post[] } = $props();

	const SHOWN = 3;
	const TILTS = ['-1.2deg', '0.9deg', '-0.6deg'];
</script>

{#if posts.length}
	<section class="journal" id="journal">
		<div class="wrap">
			<div class="head">
				<div>
					<h2>Журнал занятий</h2>
					<p class="sub">После занятий Аня записывает, что происходило в лаборатории и что дети унесли домой.</p>
				</div>
				{#if posts.length > SHOWN}
					<Button variant="pencil" size="pencil" href="/zhurnal">все записи</Button>
				{/if}
			</div>
			<div class="cards">
				{#each posts.slice(0, SHOWN) as post, i (post.slug)}
					<div style:--tilt={TILTS[i % TILTS.length]}><PostCard {post} /></div>
				{/each}
			</div>
		</div>
	</section>
{/if}

<style>
	.journal {
		padding: 0 0 clamp(72px, 10vw, 140px);
	}
	.head {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: end;
		gap: 18px 32px;
	}
	h2 {
		font-size: clamp(34px, 4.6vw, 64px);
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
	@media (max-width: 900px) {
		.head {
			grid-template-columns: minmax(0, 1fr);
			justify-items: start;
		}
	}
</style>
