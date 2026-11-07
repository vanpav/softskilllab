<script lang="ts">
	import { formatDate, type Post } from '#lib/posts.js';
	import Doodle from './Doodle.svelte';
	import './post-sheet.css';

	let { post }: { post: Post } = $props();
	// Unless Аня picked a colour, notes take the sticky colours in the same yellow, pink, green order as the protocols.
	const NOTES = ['yellow', 'pink', 'green'];
	const note = $derived(NOTES[(post.number - 1) % NOTES.length]);
</script>

<article class="post-sheet">
	<span class="tape" aria-hidden="true"></span>
	<span class="ps-holes" aria-hidden="true"><span></span><span></span><span></span></span>

	<aside class="ps-margin">
		<span class="ps-no hand">№{post.number}</span>
		<Doodle name={post.doodle} class="ps-doodle" />
		<span class="ps-time">
			{#if post.date}<time datetime={post.date.slice(0, 10)}>{formatDate(post.date)}</time><br />{/if}
			{post.minutes} мин чтения
		</span>
	</aside>

	<div class="ps-text">
		<h1 class="ps-title">{post.title}</h1>
		{#if post.quote}
			<div class="ps-epigraph">
				<svg viewBox="0 0 90 60" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8c10 30 34 42 72 38M64 34l13 12-15 9" /></svg>
				<p class="ps-quote hand">«{post.quote}»</p>
			</div>
		{/if}

		{#each post.blocks as block, i (i)}
			{#if block.type === 'note'}
				<aside class="ps-note note-{block.color ?? note}">
					<p class="ps-note-title hand">{block.title}</p>
					{#each block.paragraphs as paragraph, j (j)}<p class="ps-note-p">{paragraph}</p>{/each}
				</aside>
			{:else if block.type === 'photos'}
				<div class="ps-photos" class:ps-gallery={block.photos.length > 1}>
					{#each block.photos as photo, j (photo.key)}
						<figure class="ps-print" style:--tilt="{[-1.6, 1.2, -0.8, 1.8][j % 4]}deg">
							<img src="/foto/{photo.key}" alt={photo.caption || 'Фото с занятия'} width={photo.width} height={photo.height} loading="lazy" decoding="async" />
							{#if photo.caption}<figcaption class="hand">{photo.caption}</figcaption>{/if}
						</figure>
					{/each}
				</div>
			{:else if block.type === 'h'}
				<h2 class="ps-h">{block.text}</h2>
			{:else}
				<p class="ps-{block.type}">{block.text}</p>
			{/if}
		{/each}

		<div class="ps-sign"><small>Подпись</small><span class="hand">Аня</span></div>
	</div>
</article>
