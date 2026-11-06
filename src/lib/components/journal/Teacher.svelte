<script lang="ts">
	import pushistik from '#lib/assets/pushistik.webp';
	import { credentials } from '#lib/content.js';
	import SantaDoodle from './SantaDoodle.svelte';

	let { newYear }: { newYear: boolean } = $props();
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
				<div class="portrait-slot">здесь будет фото Ани</div>
				<span class="sticker" class:bearded={newYear}>
					<img src={pushistik} alt="Пушистик — пушистый инопланетянин в очках, талисман лаборатории" />
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
	.portrait-slot {
		aspect-ratio: 1/1;
		display: grid;
		place-items: center;
		padding: 24px 24px 34%; /* keeps the placeholder text clear of the sticker and its hat */
		text-align: center;
		border: 3px dashed var(--ink-2);
		font-family: var(--hand);
		font-size: clamp(28px, 3vw, 38px);
		line-height: 1.1;
		color: var(--pen);
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
