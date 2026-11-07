<script lang="ts">
	import { EMAIL, SOCIAL } from '#lib/content.js';

	let { greeting }: { greeting: string | null } = $props();
</script>

<footer>
	<div class="wrap">
		<div class="foot">
			<div><b>Soft Skills Lab</b>Акко (Acre), Израиль</div>
			<div><b>Для кого</b>дети 6–16 лет</div>
			<div><b>Почта</b><a href="mailto:{EMAIL}" target="_blank" rel="noopener">{EMAIL}</a></div>
			<div>
				<b>Аня в соцсетях</b>
				<span class="social">
					{#each SOCIAL as link (link.name)}<a href={link.href} target="_blank" rel="noopener me">{link.name}</a>{/each}
				</span>
			</div>
		</div>
		<p class="legal"><a href="/legal">Правовая информация</a>, политика конфиденциальности и доступность</p>
		{#if greeting}
			<p class="hand new-year">{greeting}</p>
		{/if}
	</div>
</footer>

<style>
	footer {
		padding: 0 0 48px;
	}
	.foot {
		display: flex;
		flex-wrap: wrap;
		gap: 20px 48px;
		justify-content: space-between;
		font-size: 16px;
		color: var(--ink-2);
		border-top: 2px solid var(--ink);
		padding-top: 28px;
	}
	.new-year {
		margin-top: clamp(32px, 4vw, 48px);
		font-size: clamp(40px, 5vw, 64px);
		text-align: center;
		text-wrap: balance;
		transform: rotate(-2deg);
	}
	b {
		color: var(--ink);
		display: block;
	}
	.social {
		display: flex;
		gap: 16px;
	}
	.legal {
		margin-top: 20px;
		font-size: 14px;
		color: var(--ink-2);
	}
	a {
		color: var(--pen);
	}
	a:hover {
		text-decoration: underline wavy var(--pink-text);
		text-underline-offset: 5px;
	}
</style>
