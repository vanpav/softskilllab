<script lang="ts">
	import type { Post } from '#lib/posts.js';
	import Doodle from './Doodle.svelte';

	let { post }: { post: Post } = $props();
</script>

<a class="post-card" href="/zhurnal/{post.slug}">
	<span class="tape" aria-hidden="true"></span>
	<span class="top">
		<span class="no hand">№{post.number}</span>
		<Doodle name={post.doodle} class="doodle" />
	</span>
	{#if post.quote}<span class="quote hand">«{post.quote}»</span>{/if}
	<span class="title">{post.title}</span>
	<span class="excerpt">{post.description}</span>
	<span class="foot">
		<span class="time">{post.minutes} мин чтения</span>
		<span class="more hand">
			читать запись
			<svg viewBox="0 0 40 20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 11c10-3 20-3 32-1M27 4l8 6-8 6" /></svg>
		</span>
	</span>
</a>

<style>
	.post-card {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: 14px;
		padding: clamp(22px, 2.6vw, 30px);
		background: var(--sheet);
		color: var(--ink);
		box-shadow: 0 2px 2px rgba(20, 30, 80, 0.05), 0 14px 28px rgba(20, 30, 80, 0.09);
		transform: rotate(var(--tilt, -1deg));
		transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s;
	}
	.post-card:hover {
		transform: rotate(var(--tilt, -1deg)) translateY(-4px);
		box-shadow: 0 2px 2px rgba(20, 30, 80, 0.05), 0 22px 36px rgba(20, 30, 80, 0.14);
	}
	.tape {
		top: -14px;
		left: 50%;
		width: 96px;
		margin-left: -48px;
		transform: rotate(calc(var(--tilt, -1deg) * -3));
	}
	.top {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
	}
	.no {
		font-size: 44px;
		line-height: 1;
	}
	.top :global(.doodle) {
		width: 88px;
		height: 88px;
		color: var(--ink);
		margin: -6px -6px 0 0;
	}
	.quote {
		font-size: clamp(26px, 2.3vw, 30px);
		line-height: 1.08;
		text-wrap: balance;
	}
	.title {
		font-size: 20px;
		font-weight: 800;
		letter-spacing: -0.01em;
		line-height: 1.15;
	}
	.excerpt {
		font-size: 16px;
		line-height: 1.5;
		color: var(--ink-2);
	}
	.foot {
		margin-top: auto;
		padding-top: 12px;
		border-top: 2px solid var(--ink);
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 12px;
	}
	.time {
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--ink-2);
	}
	.more {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-size: 24px;
	}
	.more svg {
		width: 30px;
		height: 15px;
	}
	.post-card:hover .more {
		text-decoration: underline wavy var(--pink-text);
		text-underline-offset: 5px;
	}
</style>
