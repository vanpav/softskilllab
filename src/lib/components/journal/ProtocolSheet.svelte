<script lang="ts">
	import type { Protocol } from '#lib/content.js';
	import Doodle from './Doodle.svelte';
	import { peelAway } from './peel.js';

	let {
		protocol,
		number,
		peeled,
		onpeel
	}: { protocol: Protocol; number: number; peeled: boolean; onpeel: () => void } = $props();

	let button = $state<HTMLButtonElement>();
	let gone = $state(false);

	$effect(() => {
		if (peeled && button) peelAway(button).then(() => (gone = true));
	});
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
			bind:this={button}
			class="peel"
			class:peeling={peeled}
			class:gone
			type="button"
			tabindex={peeled ? -1 : undefined}
			aria-label="{protocol.question} отклейте, чтобы открыть вывод опыта {number}"
			onclick={onpeel}
		>
			<span class="under" aria-hidden="true"></span>
			<span class="note" aria-hidden="true">
				<span class="paper"><span class="face">{protocol.question}<small>отклейте</small></span></span>
				<span class="flap"><span class="curl"></span><span class="back"></span></span>
			</span>
		</button>
	</div>
</article>

<style>
	/* Registered so the curl can animate as a length on hover. */
	@property --curl {
		syntax: '<length>';
		inherits: true;
		initial-value: 72px;
	}
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
		--note: var(--sticky);
		--note-fold: #e3a428;
		--note-soft: var(--sticky-ink-soft);
		--curl-rest: 50px;
		--curl: var(--curl-rest);
		--tilt: 2deg;
		--overhang-l: -6px;
		--overhang-r: -6px;
		--face-tilt: 0deg;
		--light-to: to top right;
		--curl-side: left;
		--rest-side: right;
		--curl-l: 0;
		--curl-r: auto;
		--shadow-at: 72% 28%;
		--paper-clip: polygon(0 0, 100% 0, 100% 100%, var(--curl) 100%, 0 calc(100% - var(--curl)));
		--flap-clip: polygon(0 0, 100% 0, 100% 100%);
		--flap-angle: 45deg;
		--back-dark: color-mix(in srgb, var(--note-fold) 82%, black);
		--back-light: color-mix(in srgb, var(--note), white 30%);
		--back-mid: color-mix(in srgb, var(--note) 45%, var(--note-fold));
		position: absolute;
		inset: 26px var(--overhang-r) -6px var(--overhang-l);
		background: none;
		border: 0;
		cursor: pointer;
		display: none;
		padding: 0;
		font-family: var(--hand);
		font-size: 28px;
		font-weight: 700;
		color: var(--sticky-ink);
		transform: rotate(var(--tilt));
		transform-origin: top center;
		transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), --curl 0.3s cubic-bezier(0.16, 1, 0.3, 1);
	}
	:global(.js) .peel {
		display: flex;
	}
	/* The corner is cut out of the paper, so this keeps the conclusion hidden beneath it. */
	.under,
	.curl {
		position: absolute;
		bottom: 0;
		left: var(--curl-l);
		right: var(--curl-r);
		width: var(--curl);
		height: var(--curl);
	}
	.under {
		background: radial-gradient(circle at var(--shadow-at), rgba(20, 30, 80, 0.34), rgba(20, 30, 80, 0) 62%), var(--sheet);
	}
	.note {
		position: absolute;
		inset: 0;
		filter: drop-shadow(0 6px 8px rgba(20, 30, 80, 0.16));
		transition: filter 0.3s;
	}
	.paper {
		position: absolute;
		inset: 0;
		display: flex;
		background: linear-gradient(var(--light-to), color-mix(in srgb, var(--note), white 42%), color-mix(in srgb, var(--note) 90%, var(--note-fold)));
		clip-path: var(--paper-clip);
	}
	/* Same fold and same colour stops as applyPeel at progress 0, so the first frame doesn't jump. */
	.curl {
		background: linear-gradient(var(--flap-angle), var(--back-dark) 50%, var(--back-light) calc(50% + 16px), var(--back-mid) calc(50% + 90px));
		clip-path: var(--flap-clip);
	}
	.face {
		position: relative;
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 6px;
		padding: 14px 18px;
		text-align: center;
		transform: rotate(var(--face-tilt));
	}
	.peel small {
		font-family: var(--sans);
		font-size: 13px;
		font-weight: 600;
		color: var(--note-soft);
		opacity: 0.65;
	}
	.peel:hover {
		--curl: calc(var(--curl-rest) + 14px);
		transform: rotate(calc(var(--tilt) + 2deg)) translateY(-3px);
	}
	.peel:hover .note {
		filter: drop-shadow(0 12px 14px rgba(20, 30, 80, 0.22));
	}
	.flap,
	.back {
		position: absolute;
		inset: 0;
	}
	.flap {
		filter: drop-shadow(0 6px 10px rgba(20, 30, 80, 0.3));
	}
	.back {
		transform-origin: 0 0;
		visibility: hidden;
	}
	.peel.peeling {
		pointer-events: none;
	}
	.peeling .under {
		opacity: 0;
		transition: opacity 0.15s;
	}
	.peeling .curl {
		visibility: hidden;
	}
	.peeling .back {
		visibility: visible;
	}
	.peel.gone,
	.gone .back {
		visibility: hidden;
	}
	.proto:nth-child(even) .peel {
		--light-to: to top left;
		--curl-side: right;
		--rest-side: left;
		--curl-l: auto;
		--curl-r: 0;
		--shadow-at: 28% 28%;
		--paper-clip: polygon(0 0, 100% 0, 100% calc(100% - var(--curl)), calc(100% - var(--curl)) 100%, 0 100%);
		--flap-clip: polygon(0 0, 100% 0, 0 100%);
		--flap-angle: -45deg;
	}
	.proto:nth-child(3n + 2) .peel {
		--note: var(--sticky-pink);
		--note-fold: #df74a4;
		--note-soft: var(--sticky-pink-ink-soft);
		color: var(--sticky-pink-ink);
	}
	.proto:nth-child(3n) .peel {
		--note: var(--sticky-green);
		--note-fold: #82bd58;
		--note-soft: var(--sticky-green-ink-soft);
		color: var(--sticky-green-ink);
	}
	.proto:nth-child(1) .peel {
		--curl-rest: 60px;
	}
	.proto:nth-child(2) .peel {
		--curl-rest: 44px;
		--tilt: -1.5deg;
		--overhang-r: -9px;
		--face-tilt: 1deg;
	}
	.proto:nth-child(3) .peel {
		--curl-rest: 34px;
		--tilt: 1deg;
		--overhang-l: -9px;
		--face-tilt: -1.5deg;
	}
	.proto:nth-child(4) .peel {
		--curl-rest: 50px;
		--tilt: 2.5deg;
		--face-tilt: -1deg;
	}
	.proto:nth-child(5) .peel {
		--curl-rest: 40px;
		--tilt: -1deg;
		--overhang-r: -9px;
		--face-tilt: 1.5deg;
	}
	.proto:nth-child(6) .peel {
		--curl-rest: 64px;
		--tilt: 1.5deg;
		--overhang-l: -9px;
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
