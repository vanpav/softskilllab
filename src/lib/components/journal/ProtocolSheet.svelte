<script lang="ts">
	import type { Protocol } from '#lib/content.js';
	import Doodle from './Doodle.svelte';

	let {
		protocol,
		number,
		peeled,
		onpeel
	}: { protocol: Protocol; number: number; peeled: boolean; onpeel: () => void } = $props();
</script>

<article class="proto">
	<div class="no">
		<h3>Опыт {number}<b>{protocol.title}</b></h3>
		<Doodle name={protocol.doodle} class="doodle" />
	</div>
	<div class="col">
		<h4>Что делаем</h4>
		<p>{protocol.doing}</p>
	</div>
	<div class="col">
		<h4>Наблюдение</h4>
		<p>{protocol.observed}</p>
	</div>
	<div class="col concl">
		<h4>Вывод для жизни</h4>
		<p class="hand" id="conclusion-{number}" tabindex="-1">
			{protocol.conclusion.before}<span class="hl">{protocol.conclusion.mark}</span>{protocol.conclusion.after}
		</p>
		<p class="take"><b>Ребёнок уносит:</b> {protocol.takeaway}</p>
		<button
			class="peel"
			class:gone={peeled}
			type="button"
			tabindex={peeled ? -1 : undefined}
			aria-label="{protocol.question} отклейте, чтобы открыть вывод опыта {number}"
			onclick={onpeel}
		>
			{protocol.question}<small>отклейте</small>
		</button>
	</div>
</article>

<style>
	.proto {
		position: relative;
		display: grid;
		grid-template-columns: 150px 1fr 1fr 1.1fr;
		gap: clamp(16px, 2.4vw, 32px);
		background: var(--sheet);
		padding: clamp(20px, 2.6vw, 32px);
		box-shadow: 0 2px 2px rgba(20, 30, 80, 0.05), 0 14px 28px rgba(20, 30, 80, 0.09);
	}
	.proto:nth-child(odd) {
		transform: rotate(-0.4deg);
	}
	.proto:nth-child(even) {
		transform: rotate(0.35deg);
	}
	.no {
		font-family: var(--hand);
		font-size: 30px;
		color: var(--pen);
		line-height: 1;
		white-space: nowrap;
	}
	.no h3 {
		font: inherit;
		letter-spacing: inherit;
		text-wrap: nowrap; /* the global balance rule would re-enable wrapping */
	}
	.no b {
		display: block;
		text-wrap: wrap;
		font-family: var(--sans);
		font-size: 15px;
		font-weight: 800;
		color: var(--ink);
		letter-spacing: -0.01em;
		margin-top: 8px;
		line-height: 1.2;
	}
	.no :global(.doodle) {
		width: 84px;
		height: 84px;
		margin-top: 14px;
		color: var(--ink);
	}
	h4 {
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--ink-2);
		margin-bottom: 8px;
		padding-bottom: 6px;
		border-bottom: 2px solid var(--ink);
	}
	.col p {
		font-size: 16.5px;
		line-height: 1.5;
	}
	.concl {
		position: relative;
	}
	.concl .hand {
		font-size: clamp(26px, 2.3vw, 32px);
		line-height: 1.08;
	}
	.concl .take {
		margin-top: 12px;
		font-size: 15px;
		color: var(--ink-2);
	}
	.take b {
		color: var(--ink);
	}
	.peel {
		position: absolute;
		inset: 26px -6px -6px -6px;
		background: var(--sticky);
		border: 0;
		cursor: pointer;
		display: none;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 6px;
		padding: 14px;
		text-align: center;
		font-family: var(--hand);
		font-size: 28px;
		font-weight: 700;
		color: var(--sticky-ink);
		box-shadow: 0 10px 18px rgba(20, 30, 80, 0.18);
		transform: rotate(2deg);
		transform-origin: top center;
		transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s;
	}
	:global(.js) .peel {
		display: flex;
	}
	.peel small {
		font-family: var(--sans);
		font-size: 13px;
		font-weight: 600;
		color: var(--sticky-ink-soft);
	}
	.peel:hover {
		transform: rotate(4deg) translateY(-3px);
		box-shadow: 0 16px 24px rgba(20, 30, 80, 0.22);
	}
	.peel.gone {
		transform: perspective(700px) translateY(-18px) rotateX(-78deg);
		opacity: 0;
		box-shadow: 0 40px 40px rgba(20, 30, 80, 0.28);
		pointer-events: none;
		visibility: hidden;
		transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s 0.35s, visibility 0s 0.6s;
	}
	.proto:nth-child(3n + 2) .peel {
		background: var(--sticky-pink);
		color: var(--sticky-pink-ink);
	}
	.proto:nth-child(3n + 2) .peel small {
		color: var(--sticky-pink-ink-soft);
	}
	.proto:nth-child(3n) .peel {
		background: var(--sticky-green);
		color: var(--sticky-green-ink);
	}
	.proto:nth-child(3n) .peel small {
		color: var(--sticky-green-ink-soft);
	}
	@media (max-width: 900px) {
		.proto {
			grid-template-columns: 1fr 1fr;
		}
		.no {
			grid-column: span 2;
		}
		.no h3 {
			display: flex;
			align-items: center;
			gap: 14px;
		}
		.no b {
			margin-top: 0;
		}
		.no :global(.doodle) {
			display: none;
		}
		.concl {
			grid-column: span 2;
		}
	}
	@media (max-width: 600px) {
		.proto {
			grid-template-columns: 1fr;
		}
		.no,
		.concl {
			grid-column: auto;
		}
	}
</style>
