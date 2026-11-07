<script lang="ts">
	import logoLine from '#lib/assets/logo/logo-line.svg';

	let { children } = $props();
</script>

<svelte:head>
	<meta name="robots" content="noindex, nofollow" />
	<title>Журнал Ани — Soft Skills Lab</title>
</svelte:head>

<header class="adm-top">
	<div class="wrap">
		<a class="brand" href="/" aria-label="Soft Skills Lab, на сайт">
			<img src={logoLine} alt="Soft Skills Lab" width="744" height="210" />
		</a>
		<span class="hand">журнал Ани</span>
	</div>
</header>
<main class="adm">
	{@render children()}
</main>

<style>
	.adm-top .wrap {
		display: flex;
		align-items: center;
		gap: 16px;
		height: 84px;
	}
	.brand img {
		display: block;
		height: 52px;
		width: auto;
	}
	.adm-top .hand {
		font-size: 28px;
		transform: rotate(-3deg) translateY(4px);
	}
	.adm {
		padding: clamp(16px, 3vw, 32px) 0 clamp(64px, 8vw, 120px);
	}
	/* Form fields for every /adm page: paper boxes with square corners and an ink edge. */
	.adm :global(.field) {
		display: grid;
		gap: 8px;
	}
	.adm :global(.field > span) {
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--ink-2);
	}
	.adm :global(input:not([type='hidden'])),
	.adm :global(select),
	.adm :global(textarea) {
		width: 100%;
		border: 2px solid var(--ink);
		border-radius: 0;
		background: var(--sheet);
		color: var(--ink);
		font: inherit;
		font-size: 17px;
		padding: 12px 14px;
	}
	.adm :global(textarea) {
		line-height: 1.6;
		resize: vertical;
	}
	.adm :global(.error) {
		color: var(--pink-text);
		font-weight: 600;
	}
</style>
