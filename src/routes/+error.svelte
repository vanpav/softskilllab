<script lang="ts">
	import { page } from '$app/state';
	import pushistik from '#lib/assets/pushistik.webp';
	import MarginGame from '#lib/components/journal/MarginGame.svelte';
	import SiteFooter from '#lib/components/journal/SiteFooter.svelte';
	import SiteHeader from '#lib/components/journal/SiteHeader.svelte';
	import Snow from '#lib/components/journal/Snow.svelte';
	import { Button } from '#lib/components/ui/button/index.js';
	import { WHATSAPP_HREF } from '#lib/content.js';
	import { newYearGreeting } from '#lib/season.js';
	import { nbspDeep } from '#lib/typography.js';

	const DIGITS: Record<string, string[]> = {
		'4': ['M58 12C44 36 28 60 12 84C36 82 66 80 94 82', 'M68 18C64 52 64 90 70 130'],
		'0': ['M56 14C28 16 14 50 16 80C18 112 38 130 58 124C84 116 94 78 88 46C84 26 70 10 48 18'],
		'5': ['M84 14C66 16 44 16 28 18C26 36 24 50 20 66C36 54 62 52 76 68C92 86 84 118 58 126C40 130 24 122 14 110']
	};

	const path = $derived(page.url.pathname);
	const inAdmin = $derived(path === '/adm' || path.startsWith('/adm/'));
	const inJournal = $derived(path.startsWith('/zhurnal/'));
	const greeting = newYearGreeting(new Date());

	const view = $derived.by(() => {
		if (page.status !== 404) {
			return nbspDeep({
				number: '500',
				pageTitle: 'Ошибка на сайте',
				title: ['В лаборатории что-то пошло ', 'не так', ''],
				answer: 'повторим опыт чуть позже',
				lead: 'Ошибка на нашей стороне, ваша ссылка в порядке. Обновите страницу через минуту. Если не поможет, напишите Ане в WhatsApp.',
				goal: 'открыть страницу',
				seen: 'лаборатория не ответила',
				conclusion: ['Попробуем ', 'ещё раз'],
				torn: 'продолжение следует',
				say: 'я уже чиню!',
				primary: { label: 'Обновить страницу', href: path + page.url.search, reload: true },
				secondary: { label: 'написать Ане в WhatsApp', href: WHATSAPP_HREF, external: true }
			});
		}
		const home = { label: 'на главную', href: '/' };
		return nbspDeep({
			number: '404',
			pageTitle: inJournal ? 'Запись не найдена' : 'Страница не найдена',
			title: inJournal ? ['Этой записи ', 'нет', ' в журнале'] : ['Этой страницы ', 'нет', ' в журнале'],
			answer: 'опыт не удался, бывает',
			lead: inJournal
				? 'Возможно, в ссылке опечатка или Аня убрала запись. Остальные записи на месте.'
				: 'Возможно, в ссылке опечатка или страницу перенесли.',
			goal: inJournal ? 'найти запись' : 'найти страницу',
			seen: 'листа нет, остался корешок',
			conclusion: ['Неудача — ', 'тоже результат'],
			torn: 'дальше лист вырван',
			say: 'а где лист?',
			primary: inAdmin
				? { label: 'К записям', href: '/adm' }
				: inJournal
					? { label: 'Все записи', href: '/zhurnal' }
					: { label: 'На главную', href: '/' },
			secondary: inAdmin || inJournal ? home : { label: 'почитать журнал занятий', href: '/zhurnal' }
		});
	});

	// Each stroke starts when the one before it ends, so the number reads as written by one hand.
	const strokes = $derived.by(() => {
		let delay = 0.25;
		return [...view.number].map((digit) =>
			DIGITS[digit].map((d) => {
				const stroke = { d, delay };
				delay += 0.36;
				return stroke;
			})
		);
	});
	const underlineDelay = $derived(0.25 + strokes.flat().length * 0.36);
</script>

<svelte:head>
	<title>{view.pageTitle} — Soft Skills Lab</title>
	<meta name="robots" content="noindex" />
</svelte:head>

{#if greeting}
	<Snow />
{:else if !inAdmin}
	<MarginGame />
{/if}
<SiteHeader />
<main class="miss">
	<div class="wrap">
		<div class="say">
			<h1>{view.title[0]}<span class="hl">{view.title[1]}</span>{view.title[2]}</h1>
			<div class="answer">
				<svg viewBox="0 0 84 56" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
					<path pathLength="1" d="M6 8C12 30 30 42 66 40M52 29l14 11-13 12" />
				</svg>
				<p class="hand write">{view.answer}</p>
			</div>
			<p class="lead">{view.lead}</p>
			<div class="actions">
				<Button
					variant="pen"
					size="pen"
					href={view.primary.href}
					data-sveltekit-reload={'reload' in view.primary ? true : undefined}
					class="h-14 px-[26px]"
				>
					{view.primary.label}
				</Button>
				<a
					class="hand other"
					href={view.secondary.href}
					target={'external' in view.secondary ? '_blank' : undefined}
					rel={'external' in view.secondary ? 'noopener' : undefined}
				>
					{view.secondary.label}
				</a>
			</div>
		</div>

		<div class="stub">
			<div class="leaf">
				<span class="fibre" aria-hidden="true"></span>
				<div class="paper">
					<span class="holes" aria-hidden="true"><span></span><span></span></span>
					<dl>
						<div>
							<dt>Опыт</dt>
							<dd class="hand">{view.goal}</dd>
						</div>
					</dl>
					<svg class="number" viewBox="0 0 320 156" fill="none" stroke-linecap="round" stroke-linejoin="round" role="img" aria-label="Ошибка {view.number}">
						{#each strokes as digit, i (i)}
							<g transform="translate({i * 104} 0)">
								{#each digit as stroke (stroke.d)}
									<path pathLength="1" d={stroke.d} style:animation-delay="{stroke.delay}s" />
								{/each}
							</g>
						{/each}
						<path class="under" pathLength="1" d="M14 148C60 140 120 152 170 145S270 142 306 148" style:animation-delay="{underlineDelay}s" />
					</svg>
					<dl>
						<div>
							<dt>Наблюдение</dt>
							<dd class="hand">{view.seen}</dd>
						</div>
						<div>
							<dt>Вывод</dt>
							<dd class="hand">{view.conclusion[0]}<span class="hl">{view.conclusion[1]}</span></dd>
						</div>
					</dl>
				</div>
			</div>
			<span class="tape" aria-hidden="true"></span>
			<span class="sticker">
				<img src={pushistik} alt="" width="160" height="160" />
			</span>
			<span class="bubble" aria-hidden="true">{view.say}</span>
			<p class="hand torn">{view.torn}</p>
			<span class="scrap one" aria-hidden="true"><i></i></span>
			<span class="scrap two" aria-hidden="true"><i></i></span>
		</div>
	</div>
</main>
<SiteFooter {greeting} />

<style>
	.miss {
		padding: clamp(24px, 4vw, 56px) 0 clamp(72px, 9vw, 120px);
	}
	.miss .wrap {
		display: grid;
		grid-template-columns: 1.15fr 0.85fr;
		gap: clamp(40px, 6vw, 88px);
		align-items: center;
	}
	h1 {
		font-size: clamp(40px, 5vw, 72px);
	}
	.answer {
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
	.answer path {
		stroke-dasharray: 1 1.1;
		animation: draw 0.7s 0.25s ease-out backwards;
	}
	.answer .hand {
		font-size: clamp(38px, 4.2vw, 60px);
		transform: rotate(-2deg);
		transform-origin: left;
	}
	.write {
		animation: write 1.4s 0.5s cubic-bezier(0.6, 0.05, 0.3, 1) backwards;
	}
	.lead {
		margin-top: 26px;
		max-width: 46ch;
		font-size: clamp(18px, 1.5vw, 20px);
		color: var(--ink-2);
	}
	.actions {
		margin-top: 30px;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 16px 26px;
	}
	.other {
		font-size: 26px;
		font-weight: 500;
		text-decoration: none;
		text-underline-offset: 6px;
	}
	.other:hover {
		text-decoration: underline wavy var(--pink-text) 2px;
	}

	/* The tear is the same outline twice: the darker copy below shows as the paper's rough, thick edge. */
	.stub {
		--tear: polygon(
			0 0,
			100% 0,
			100% calc(100% - 25px),
			96% calc(100% - 15px),
			92% calc(100% - 27px),
			87% calc(100% - 10px),
			83% calc(100% - 22px),
			77% calc(100% - 7px),
			72% calc(100% - 24px),
			67% calc(100% - 14px),
			61% calc(100% - 28px),
			55% calc(100% - 12px),
			50% calc(100% - 21px),
			44% calc(100% - 3px),
			39% calc(100% - 19px),
			33% calc(100% - 9px),
			28% calc(100% - 26px),
			22% calc(100% - 11px),
			16% calc(100% - 23px),
			10% calc(100% - 6px),
			5% calc(100% - 20px),
			0 calc(100% - 8px)
		);
		position: relative;
		transform: rotate(1.5deg);
		max-width: 460px;
		width: 100%;
		justify-self: center;
		padding-bottom: 62px;
	}
	.leaf {
		position: relative;
		filter: drop-shadow(0 12px 18px rgba(20, 30, 80, 0.14));
	}
	.fibre,
	.paper {
		clip-path: var(--tear);
	}
	.fibre {
		position: absolute;
		inset: 0;
		transform: translateY(5px);
		background: var(--grid);
	}
	.paper {
		position: relative;
		background: var(--sheet);
		padding: clamp(30px, 3vw, 40px) clamp(22px, 3vw, 36px) 52px clamp(50px, 5vw, 66px);
	}
	.holes {
		position: absolute;
		top: 0;
		bottom: 0;
		left: clamp(14px, 1.6vw, 22px);
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		padding-bottom: 24px;
	}
	.holes span {
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: var(--paper);
		box-shadow: inset 0 2px 3px rgba(20, 30, 80, 0.22);
	}
	dl {
		display: grid;
		gap: 16px;
	}
	dt {
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--ink-2);
		border-bottom: 2px solid var(--ink);
		padding-bottom: 4px;
		margin-bottom: 6px;
	}
	dd {
		font-size: clamp(25px, 2.2vw, 30px);
	}
	.number {
		display: block;
		width: 100%;
		height: auto;
		margin: 14px 0 18px;
		overflow: visible;
		stroke: var(--pen);
		stroke-width: 7;
	}
	.number path {
		stroke-dasharray: 1 1.1;
		animation: draw 0.34s linear backwards;
	}
	.number .under {
		stroke: var(--pink-text);
		stroke-width: 3.5;
		animation-duration: 0.45s;
	}
	.tape {
		top: -15px;
		left: 12%;
		transform: rotate(-3deg);
	}
	.sticker {
		position: absolute;
		top: -34px;
		right: -28px;
		width: clamp(92px, 9vw, 124px);
		transform: rotate(-8deg);
	}
	.sticker img {
		display: block;
		width: 100%;
		height: auto;
		border-radius: 50%;
		border: 5px solid var(--sheet);
		box-shadow: 0 10px 18px rgba(20, 30, 80, 0.25);
	}
	.bubble {
		position: absolute;
		top: -24px;
		right: clamp(66px, 7vw, 92px);
		font-family: var(--hand);
		font-size: 24px;
		line-height: 1.2;
		color: var(--ink);
		background: var(--sheet);
		border: 2px solid var(--ink);
		border-radius: 18px 4px 18px 18px;
		padding: 5px 12px;
		transform: rotate(-3deg);
		white-space: nowrap;
	}
	.torn {
		position: absolute;
		bottom: 8px;
		left: 22%;
		font-size: 28px;
		font-weight: 500;
		transform: rotate(-2.5deg);
		white-space: nowrap;
	}
	/* The shadow sits on the wrapper: a filter on the clipped element itself would be cut off with it. */
	.scrap {
		position: absolute;
		filter: drop-shadow(0 3px 3px rgba(20, 30, 80, 0.22));
	}
	.scrap i {
		display: block;
		width: 100%;
		height: 100%;
		background: var(--sheet);
	}
	.scrap.one {
		bottom: 34px;
		left: 6%;
		width: 34px;
		height: 22px;
		transform: rotate(14deg);
	}
	.scrap.one i {
		clip-path: polygon(8% 18%, 42% 0, 72% 16%, 100% 8%, 84% 74%, 52% 100%, 24% 76%, 0 88%);
	}
	.scrap.two {
		bottom: 2px;
		right: 8%;
		width: 24px;
		height: 18px;
		transform: rotate(-22deg);
	}
	.scrap.two i {
		clip-path: polygon(0 24%, 34% 0, 64% 20%, 100% 12%, 78% 100%, 44% 74%, 12% 92%);
	}
	@keyframes draw {
		from {
			stroke-dashoffset: 1.05;
		}
		to {
			stroke-dashoffset: 0;
		}
	}
	@keyframes write {
		from {
			clip-path: inset(-0.3em 100% -0.3em -0.1em);
		}
		to {
			clip-path: inset(-0.3em -5% -0.3em -0.1em);
		}
	}
	@media (max-width: 900px) {
		.miss .wrap {
			grid-template-columns: 1fr;
		}
		.stub {
			margin-top: 12px;
		}
	}
	@media (max-width: 600px) {
		.stub {
			max-width: none;
			width: calc(100% - 8px);
		}
		.sticker {
			right: -10px;
			width: 88px;
		}
		.bubble {
			right: 62px;
			font-size: 22px;
		}
		.tape {
			left: 6%;
			width: 96px;
		}
		.holes span {
			width: 12px;
			height: 12px;
		}
		.torn {
			left: 18%;
		}
	}
</style>
