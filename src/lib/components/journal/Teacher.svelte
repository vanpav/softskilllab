<script lang="ts">
	import { onMount } from 'svelte';
	import { LOOKS, SNOW_MAIDEN } from '#lib/anya-looks.js';
	import anya from '#lib/assets/anya.webp';
	import pushistik from '#lib/assets/pushistik-320.webp';
	import { credentials } from '#lib/content.js';
	import SantaDoodle from './SantaDoodle.svelte';

	let { newYear, look }: { newYear: boolean; look: number } = $props();

	// The set picked for this page load (Снегурочка in the New Year season), each stroke starting when the one before it is done.
	const strokes = $derived.by(() => {
		let at = 0;
		return (newYear ? SNOW_MAIDEN : (LOOKS[look] ?? LOOKS[0])).strokes.map((stroke) => {
			const dur = stroke.dur ?? 0.35;
			const timed = { ...stroke, dur, at: Math.round(at * 100) / 100 };
			at += dur;
			return timed;
		});
	});

	// Shown as finished until the page knows it can animate, so no-JS and reduced-motion visitors still see it.
	let doodleSvg = $state<SVGSVGElement>();
	let doodle = $state<'' | 'waiting' | 'drawing'>('');
	onMount(() => {
		if (!doodleSvg || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		doodle = 'waiting';
		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting) return;
				doodle = 'drawing';
				observer.disconnect();
			},
			{ threshold: 0.6 }
		);
		observer.observe(doodleSvg);
		return () => observer.disconnect();
	});
</script>

<section class="lead-sec" id="anya">
	<div class="wrap">
		<div>
			<h2>Руководитель лаборатории — Аня</h2>
			<p class="intro">Аня объясняет детям сложную психологию простыми словами и через опыты. Здесь никто не ставит оценок и не критикует. Все за столом равны, и взрослый тоже.</p>
			<ul class="checks">
				{#each credentials as credential (credential.title)}
					<li>
						<svg viewBox="0 0 30 30" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 16c3 2 5 5 7 8 3-8 7-14 12-18" /></svg>
						<div><b>{credential.title}</b><span>{credential.text}</span></div>
					</li>
				{/each}
			</ul>
			<div class="sign"><small>Подпись</small><span class="hand">Аня</span></div>
		</div>
		<div class="card">
			<span class="tape" aria-hidden="true"></span>
			<div class="portrait">
				<!-- A cut-out photo laid on a lime marker patch, the way the logo's flasks sit on theirs. -->
				<svg class="patch" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
					<path d="M16 30C36 18 62 13 86 16M9 56C34 41 63 35 92 37M11 82C37 67 66 61 94 63" />
				</svg>
				<img class="photo" src={anya} alt="Аня, руководитель лаборатории" width="1000" height="1000" />
				<!-- One set from src/lib/anya-looks.ts per page load, drawn stroke by stroke when the portrait comes into view. -->
				<svg class="pen-doodle {doodle}" bind:this={doodleSvg} viewBox="0 0 1000 1000" aria-hidden="true">
					{#each strokes as stroke, i (i)}
						<g transform={stroke.t}>
							<path pathLength="1" class:pink={stroke.tone === 'pink'} style:stroke-width={stroke.w} style:--at="{stroke.at}s" style:--for="{stroke.dur}s" d={stroke.d} />
						</g>
					{/each}
				</svg>
				<span class="sticker" class:bearded={newYear}>
					<img src={pushistik} alt="Пушистик — пушистый инопланетянин в очках, талисман лаборатории" width="320" height="320" />
					{#if newYear}<SantaDoodle />{/if}
				</span>
			</div>
			<p>Пушистик ходит на каждое занятие и всегда на стороне ребёнка</p>
		</div>
	</div>
</section>

<style>
	.lead-sec {
		padding: clamp(40px, 6vw, 80px) 0 clamp(64px, 8vw, 120px);
	}
	.lead-sec .wrap {
		display: grid;
		grid-template-columns: 1.1fr 0.9fr;
		gap: clamp(28px, 5vw, 80px);
		align-items: center;
	}
	h2 {
		font-size: clamp(34px, 4.6vw, 64px);
	}
	.intro {
		margin-top: 20px;
		max-width: 46ch;
		font-size: clamp(18px, 1.5vw, 20px);
		color: var(--ink-2);
	}
	.checks {
		margin-top: 28px;
		display: grid;
		gap: 16px;
	}
	.checks li {
		display: grid;
		grid-template-columns: 34px 1fr;
		gap: 12px;
		font-size: 17px;
	}
	.checks svg {
		width: 30px;
		height: 30px;
		color: var(--green);
	}
	.checks b {
		display: block;
	}
	.checks span {
		color: var(--ink-2);
	}
	.sign {
		margin-top: 30px;
		display: flex;
		align-items: flex-end;
		gap: 16px;
		border-top: 2px solid var(--ink);
		padding-top: 10px;
		max-width: 420px;
	}
	.sign .hand {
		font-size: 52px;
		color: var(--pen);
		transform: rotate(-4deg) translateY(-6px);
	}
	.sign small {
		font-size: 12px;
		font-weight: 700;
		color: var(--ink-2);
		letter-spacing: 0.06em;
		text-transform: uppercase;
		margin-bottom: 6px;
	}
	.card {
		position: relative;
		background: var(--sheet);
		padding: clamp(20px, 3vw, 32px);
		box-shadow: 0 18px 34px rgba(20, 30, 80, 0.12);
		transform: rotate(1.5deg);
	}
	.card .tape {
		top: -14px;
		right: 36%;
		transform: rotate(6deg);
	}
	.portrait {
		position: relative;
	}
	.patch {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		fill: none;
		stroke: var(--marker);
		stroke-width: 30;
		stroke-linecap: round;
	}
	.pen-doodle {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		overflow: visible;
		pointer-events: none;
		fill: none;
		stroke: var(--pen);
		stroke-width: 7;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.pen-doodle .pink {
		stroke: var(--pink-text);
	}
	/* The long gap and the offset past 1 hide the round cap, which otherwise shows as a dot before the stroke starts. */
	.pen-doodle path {
		stroke-dasharray: 1 3;
	}
	.pen-doodle.waiting path {
		stroke-dashoffset: 1.25;
	}
	.pen-doodle.drawing path {
		animation: pen-draw var(--for) cubic-bezier(0.5, 0, 0.3, 1) var(--at) both;
	}
	@keyframes pen-draw {
		from {
			stroke-dashoffset: 1.25;
		}
		to {
			stroke-dashoffset: 0;
		}
	}
	.photo {
		position: relative;
		display: block;
		width: 100%;
		height: auto;
		aspect-ratio: 1/1;
	}
	.sticker {
		position: absolute;
		right: -14px;
		bottom: 12px;
		width: clamp(96px, 10vw, 136px);
		transform: rotate(-8deg);
	}
	/* Lifted so the beard stays on the sheet and clear of the caption. */
	.sticker.bearded {
		bottom: 44px;
	}
	.sticker img {
		display: block;
		aspect-ratio: 1/1;
		object-fit: cover;
		border-radius: 50%;
		border: 6px solid var(--sheet);
		box-shadow: 0 10px 18px rgba(20, 30, 80, 0.25);
	}
	.card > p {
		font-family: var(--hand);
		font-size: clamp(24px, 2.2vw, 30px);
		color: var(--pen);
		text-align: center;
		line-height: 1.1;
		margin-top: 6px;
	}
	@media (max-width: 900px) {
		.lead-sec .wrap {
			grid-template-columns: 1fr;
		}
	}
</style>
