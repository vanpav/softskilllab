<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import Doodle from '#lib/components/journal/Doodle.svelte';
	import { Button } from '#lib/components/ui/button/index.js';

	let { data } = $props();
	const saved = $derived(page.url.searchParams.get('saved'));
</script>

<div class="wrap">
	<div class="head">
		<h1>Записи журнала</h1>
		<div class="actions">
			<Button variant="pen" size="pen" href="/adm/new">Новая запись</Button>
			<form method="POST" action="?/logout">
				<Button variant="pencil" size="pencil" type="submit">выйти</Button>
			</form>
		</div>
	</div>

	{#if saved}
		<p class="saved hand" role="status">Сохранено! <a href="/zhurnal/{saved}" target="_blank" rel="noopener">посмотреть на сайте</a></p>
	{/if}

	{#if data.posts.length}
		<ol class="list">
			{#each data.posts as post (post.slug)}
				<li>
					<span class="no hand">№{post.number}</span>
					<Doodle name={post.doodle} class="doodle" />
					<div class="what">
						<b>{post.title}</b>
						{#if post.quote}<span class="hand">«{post.quote}»</span>{/if}
					</div>
					<div class="row-actions">
						<a href="/zhurnal/{post.slug}" target="_blank" rel="noopener">открыть</a>
						<a href="/adm/edit/{post.slug}">изменить</a>
						<form
							method="POST"
							action="?/delete"
							use:enhance={({ cancel }) => {
								if (!confirm(`Удалить запись «${post.title}»? Вернуть её не получится.`)) cancel();
							}}
						>
							<input type="hidden" name="slug" value={post.slug} />
							<button type="submit" class="danger">удалить</button>
						</form>
					</div>
				</li>
			{/each}
		</ol>
	{:else}
		<p class="empty hand">Пока ни одной записи. Нажмите «Новая запись».</p>
	{/if}
</div>

<style>
	.head {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 16px 32px;
	}
	h1 {
		font-size: clamp(34px, 4.6vw, 56px);
	}
	.actions {
		display: flex;
		align-items: center;
		gap: 24px;
	}
	.saved {
		margin-top: 20px;
		font-size: 26px;
	}
	.saved a,
	.row-actions a {
		color: var(--pen);
	}
	.saved a:hover,
	.row-actions a:hover,
	.danger:hover {
		text-decoration: underline wavy var(--pink-text);
		text-underline-offset: 5px;
	}
	.list {
		margin-top: clamp(28px, 4vw, 44px);
		background: var(--sheet);
		box-shadow: 0 18px 34px rgba(20, 30, 80, 0.12);
		padding: 8px clamp(16px, 3vw, 32px);
	}
	.list li {
		display: grid;
		grid-template-columns: 56px 56px minmax(0, 1fr) auto;
		align-items: center;
		gap: 16px;
		padding: 16px 0;
	}
	.list li + li {
		border-top: 1px solid var(--grid);
	}
	.no {
		font-size: 34px;
	}
	.list :global(.doodle) {
		width: 52px;
		height: 52px;
		color: var(--ink);
	}
	.what {
		display: grid;
		gap: 2px;
	}
	.what b {
		font-size: 18px;
	}
	.what .hand {
		font-size: 22px;
		line-height: 1.1;
	}
	.row-actions {
		display: flex;
		gap: 18px;
		font-size: 16px;
		font-weight: 500;
	}
	.danger {
		background: none;
		border: 0;
		padding: 0;
		font: inherit;
		color: var(--pink-text);
		cursor: pointer;
	}
	.empty {
		margin-top: 32px;
		font-size: 28px;
	}
	@media (max-width: 700px) {
		.list li {
			grid-template-columns: 44px minmax(0, 1fr);
		}
		.list :global(.doodle) {
			display: none;
		}
		.row-actions {
			grid-column: 2;
		}
	}
</style>
