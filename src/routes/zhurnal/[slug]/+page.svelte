<script lang="ts">
	import PostArticle from '#lib/components/journal/PostArticle.svelte';
	import PostCard from '#lib/components/journal/PostCard.svelte';
	import MarginGame from '#lib/components/journal/MarginGame.svelte';
	import SiteFooter from '#lib/components/journal/SiteFooter.svelte';
	import Seo from '#lib/components/journal/Seo.svelte';
	import SiteHeader from '#lib/components/journal/SiteHeader.svelte';
	import Snow from '#lib/components/journal/Snow.svelte';
	import WhatsAppIcon from '#lib/components/journal/WhatsAppIcon.svelte';
	import { Button } from '#lib/components/ui/button/index.js';
	import { SHARE_IMAGE, WHATSAPP_HREF } from '#lib/content.js';
	import { postSchema } from '#lib/schema.js';

	let { data } = $props();
	const post = $derived(data.post);
	// The post's own first photo, or the common one, so a shared link always has a picture.
	const image = $derived(post.cover ?? SHARE_IMAGE);
</script>

<Seo
	title="{post.title} — журнал Soft Skills Lab"
	description={post.description}
	path="/zhurnal/{post.slug}"
	type="article"
	image={image}
	schema={postSchema(post, image)}
/>

{#if data.greeting}
	<Snow />
{:else}
	<MarginGame />
{/if}
<SiteHeader />
<main class="post-page">
	<div class="wrap">
		<a class="back hand" href="/zhurnal">
			<svg viewBox="0 0 40 20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M37 11C27 8 17 8 5 10M13 4l-8 6 8 6" /></svg>
			журнал занятий
		</a>

		<PostArticle {post} />


		<div class="after">
			<div class="cta">
				<p class="hand">Хотите, чтобы ваш ребёнок тоже был в журнале?</p>
				<Button variant="pen" size="pen" href={WHATSAPP_HREF} target="_blank" rel="noopener" class="h-14 px-[26px]">
					<WhatsAppIcon />
					Записать ребёнка
				</Button>
			</div>
			{#if data.next}
				<div class="next" style:--tilt="1deg">
					<p class="label">Ещё из журнала</p>
					<PostCard post={data.next} />
				</div>
			{/if}
		</div>
	</div>
</main>
<SiteFooter greeting={data.greeting} />

<style>
	.post-page {
		padding: clamp(12px, 2vw, 24px) 0 clamp(72px, 10vw, 140px);
	}
	.back {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		font-size: 26px;
	}
	.back svg {
		width: 32px;
		height: 16px;
	}
	.back:hover {
		text-decoration: underline wavy var(--pink-text);
		text-underline-offset: 5px;
	}
	.after {
		margin-top: clamp(56px, 7vw, 96px);
		display: grid;
		grid-template-columns: 1.1fr 0.9fr;
		gap: clamp(32px, 5vw, 80px);
		align-items: center;
	}
	.cta .hand {
		font-size: clamp(32px, 3.4vw, 46px);
		line-height: 1.05;
		margin-bottom: 22px;
		max-width: 16em;
	}
	.label {
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--ink-2);
		margin-bottom: 24px;
	}
	.next {
		display: grid;
	}
	@media (max-width: 900px) {
		.after {
			grid-template-columns: minmax(0, 1fr);
		}
	}
</style>
