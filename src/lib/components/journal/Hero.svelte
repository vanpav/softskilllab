<script lang="ts">
	import pushistik from '#lib/assets/pushistik.webp';
	import { Button } from '#lib/components/ui/button/index.js';
	import SantaDoodle from './SantaDoodle.svelte';
	import { WHATSAPP_HREF, type Photo } from '#lib/content.js';

	let { photo, newYear }: { photo: Photo; newYear: boolean } = $props();
</script>

<section class="hero">
	<div class="wrap">
		<div class="hero-text">
			<h1>Что будет, если шесть детей проведут один опыт <span class="hl">вместе?</span></h1>
			<div class="answer">
				<svg viewBox="0 0 90 60" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8c10 30 34 42 72 38M64 34l13 12-15 9" /></svg>
				<p class="hand write">Они начнут разговаривать!</p>
			</div>
			<p class="lead">
				Soft Skills Lab — мини-группы для детей <b>6–16 лет</b>. Колба, слайм или башня из бумаги здесь только повод: пока опыт идёт, дети учатся <b>договариваться, слушать и не бояться ошибок</b>.
			</p>
			<div class="cta-row">
				<Button variant="pen" size="pen-lg" href={WHATSAPP_HREF} target="_blank" rel="noopener">Записать ребёнка</Button>
				<span class="note">до 6 человек в группе!</span>
			</div>
			<div class="page-meta">
				<span><b>Место</b>Акко</span>
				<span><b>Участники</b>6 детей</span>
				<span><b>Цена</b>100 шекелей за занятие</span>
			</div>
		</div>
		<figure class="polaroid" class:bearded={newYear}>
			<span class="tape" aria-hidden="true"></span>
			<img src={photo.src} alt={photo.alt} width="1000" height="1000" />
			<span class="sticker">
				<img src={pushistik} alt="Пушистик, пушистый инопланетянин в очках" width="752" height="752" />
				{#if newYear}<SantaDoodle />{/if}
			</span>
			<span class="sticker-say" aria-hidden="true">{newYear ? 'Хо-хо-хо!' : 'я\u00A0тоже тут!'}</span>
			<figcaption>{photo.heroCaption}</figcaption>
		</figure>
	</div>
</section>

<style>
	.hero {
		padding: clamp(24px, 4vw, 48px) 0 clamp(64px, 8vw, 120px);
	}
	.hero .wrap {
		display: grid;
		grid-template-columns: 1.15fr 0.85fr;
		gap: clamp(28px, 5vw, 72px);
		align-items: start;
	}
	h1 {
		font-size: clamp(40px, 5vw, 72px);
	}
	.answer {
		position: relative;
		margin-top: 22px;
		display: flex;
		align-items: flex-start;
		gap: 14px;
	}
	.answer svg {
		flex: none;
		width: clamp(60px, 6vw, 84px);
		height: auto;
		color: var(--pink-text);
		margin-top: 4px;
	}
	.answer .hand {
		font-size: clamp(38px, 4.2vw, 60px);
		transform: rotate(-2deg);
		transform-origin: left;
	}
	.write {
		clip-path: inset(-0.3em 100% -0.3em -0.1em);
		animation: write 1.6s 0.5s cubic-bezier(0.6, 0.05, 0.3, 1) forwards;
	}
	.answer svg path {
		stroke-dasharray: 180;
		stroke-dashoffset: 180;
		animation: draw 0.7s 0.25s ease-out forwards;
	}
	@keyframes write {
		to {
			clip-path: inset(-0.3em -5% -0.3em -0.1em);
		}
	}
	@keyframes draw {
		to {
			stroke-dashoffset: 0;
		}
	}
	.lead {
		margin-top: 28px;
		max-width: 42ch;
		font-size: clamp(18px, 1.5vw, 20px);
		color: var(--ink-2);
	}
	.lead b {
		color: var(--ink);
	}
	.cta-row {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 14px 22px;
		margin-top: 32px;
	}
	.note {
		font-family: var(--hand);
		font-size: 24px;
		color: var(--pen);
		transform: rotate(-3deg);
	}
	.page-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 6px 28px;
		font-family: var(--hand);
		font-size: 24px;
		color: var(--pen);
		margin-top: 28px;
	}
	.page-meta b {
		font-family: var(--sans);
		font-size: 12px;
		font-weight: 700;
		color: var(--ink-2);
		letter-spacing: 0.06em;
		text-transform: uppercase;
		margin-right: 6px;
	}
	.polaroid {
		position: relative;
		background: var(--sheet);
		padding: 14px 14px 18px;
		box-shadow: 0 2px 2px rgba(20, 30, 80, 0.06), 0 18px 34px rgba(20, 30, 80, 0.14);
		transform: rotate(2.5deg);
		margin-top: 12px;
	}
	.polaroid img {
		aspect-ratio: 1/1;
		object-fit: cover;
		width: 100%;
	}
	.polaroid figcaption {
		font-family: var(--hand);
		font-size: 26px;
		color: var(--pen);
		margin-top: 10px;
		line-height: 1.1;
		padding-right: clamp(120px, 13vw, 190px);
	}
	.polaroid .tape {
		top: -16px;
		left: 50%;
		transform: translateX(-50%) rotate(-4deg);
	}
	.polaroid .sticker {
		position: absolute;
		right: -22px;
		bottom: -60px;
		width: clamp(110px, 12vw, 160px);
		transform: rotate(-8deg);
	}
	.polaroid .sticker img {
		display: block;
		border-radius: 50%;
		border: 6px solid var(--sheet);
		box-shadow: 0 10px 18px rgba(20, 30, 80, 0.25);
	}
	.sticker-say {
		position: absolute;
		right: clamp(110px, 12vw, 160px);
		bottom: -40px;
		font-family: var(--hand);
		font-size: 24px;
		color: var(--ink);
		background: var(--sheet);
		border: 2px solid var(--ink);
		border-radius: 18px 18px 4px 18px;
		padding: 6px 12px;
		transform: rotate(-3deg);
		white-space: nowrap;
	}
	@media (min-width: 901px) and (max-height: 800px) {
		.hero {
			padding-top: 8px;
		}
		h1 {
			font-size: 58px;
		}
		.answer {
			margin-top: 14px;
		}
		.lead {
			margin-top: 20px;
		}
		.cta-row {
			margin-top: 22px;
		}
	}
	@media (max-width: 900px) {
		.hero .wrap {
			grid-template-columns: minmax(0, 1fr);
			gap: 0;
		}
		.hero-text {
			display: contents;
		}
		h1 {
			order: 1;
		}
		.answer {
			order: 2;
		}
		.polaroid {
			order: 3;
			width: 100%;
			max-width: 300px;
			margin: 28px auto 72px;
		}
		/* The beard hangs below the sticker and needs room above the lead. */
		.polaroid.bearded {
			margin-bottom: 96px;
		}
		.polaroid figcaption {
			font-size: 24px;
			padding-right: 108px; /* clears the sticker and hat for the longest random captions */
		}
		.lead {
			order: 4;
			margin-top: 0;
		}
		.cta-row {
			order: 5;
		}
		.page-meta {
			order: 6;
		}
		.polaroid .sticker {
			right: -4px;
		}
		.sticker-say {
			right: 110px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.write {
			clip-path: none;
		}
		.answer svg path {
			stroke-dashoffset: 0;
		}
	}
</style>
