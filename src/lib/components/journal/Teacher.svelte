<script lang="ts">
	import { onMount } from 'svelte';
	import anya from '#lib/assets/anya.webp';
	import pushistik from '#lib/assets/pushistik.webp';
	import { credentials } from '#lib/content.js';
	import SantaDoodle from './SantaDoodle.svelte';

	let { newYear }: { newYear: boolean } = $props();

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
				<!-- Drawn on in ballpoint, in the photo's own pixel coordinates: horns first, then the moustache. -->
				<svg class="pen-doodle {doodle}" bind:this={doodleSvg} viewBox="0 0 1000 1000" aria-hidden="true">
					<path pathLength="1" style:--at="0s" style:--for="0.45s" d="M424 188C402 120 376 70 324 30C396 50 460 92 500 142" />
					<path pathLength="1" style:--at="0.45s" style:--for="0.35s" d="M352 50C392 72 424 104 446 142M378 84C404 102 424 126 440 154M340 38C352 44 362 50 372 58" />
					<path pathLength="1" style:--at="0.85s" style:--for="0.45s" d="M582 126C598 72 640 30 704 8C694 60 676 106 656 146" />
					<path pathLength="1" style:--at="1.3s" style:--for="0.35s" d="M676 26C658 60 640 94 624 128M690 52C676 80 662 106 646 132M690 16C684 24 678 32 672 40" />
					<g transform="translate(425 529) rotate(17) scale(1.35)">
						<path pathLength="1" style:--at="1.75s" style:--for="0.5s" d="M0-2C-20-18-50-20-68 0C-78 12-94 10-98-4C-101-16-90-24-82-16C-77-11-80-4-86-4" />
						<path pathLength="1" style:--at="2.25s" style:--for="0.25s" d="M0 8C-22 2-48 10-70 14C-80 16-90 14-96 8" />
						<path pathLength="1" style:--at="2.5s" style:--for="0.5s" d="M0-2C20-18 50-20 68 0C78 12 94 10 98-4C101-16 90-24 82-16C77-11 80-4 86-4" />
						<path pathLength="1" style:--at="3s" style:--for="0.25s" d="M0 8C22 2 48 10 70 14C80 16 90 14 96 8" />
						<path pathLength="1" style:--at="3.25s" style:--for="0.35s" d="M-10 0C-24-6-38-4-50 4M-14 6C-28 4-42 8-56 10M10 0C24-6 38-4 50 4M14 6C28 4 42 8 56 10" />
					</g>
				</svg>
				<span class="sticker" class:bearded={newYear}>
					<img src={pushistik} alt="Пушистик — пушистый инопланетянин в очках, талисман лаборатории" width="752" height="752" />
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
	/* The moustache group is scaled by 1.35, so this comes out at the same 7. */
	.pen-doodle g {
		stroke-width: 5.2;
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
