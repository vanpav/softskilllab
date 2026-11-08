<script lang="ts">
	import * as Table from '#lib/components/ui/table/index.js';
	import { roster, WHATSAPP_HREF } from '#lib/content.js';

	let { month }: { month: string } = $props();

	const head = 'h-auto border-b-2 border-foreground px-2 py-1.5 text-xs font-bold tracking-[.06em] text-muted-foreground uppercase';
	const cell = 'h-12 border-b border-border px-2 py-1.5 align-bottom max-[600px]:px-1';
	const hand = 'hand text-[28px] max-[600px]:text-[23px]';
</script>

<section class="roster" id="group">
	<div class="wrap">
		<div>
			<h2>В списке группы всего шесть строк</h2>
			<p>Не двадцать и не пятнадцать. Когда в группе <b>шесть человек</b>, у каждого есть голос, а Аня замечает, кто весь урок молчит, кто обиделся и кто устал. Это не урок у доски: все сидят за одним столом и делают одно дело.</p>
			<p>Активным детям и детям с СДВГ здесь хорошо: можно двигаться, трогать, пробовать руками.</p>
		</div>
		<div class="list">
			<span class="tape" aria-hidden="true"></span>
			<span class="tape r" aria-hidden="true"></span>
			<h3>Список исследователей <span>{month}</span></h3>
			<Table.Root class="mt-3.5 text-lg">
				<Table.Header>
					<Table.Row class="border-0 hover:bg-transparent">
						<Table.Head class={head}>№</Table.Head>
						<Table.Head class={head}>Имя</Table.Head>
						<Table.Head class={head}>Суперсила</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each roster as entry, i (i)}
						<Table.Row class="border-0 hover:bg-transparent">
							<Table.Cell class="{cell} w-9 font-bold text-muted-foreground tabular-nums">{i + 1}</Table.Cell>
							{#if entry.power}
								<Table.Cell class="{cell} {hand}">{entry.name}</Table.Cell>
								<Table.Cell class="{cell} {hand}">{entry.power}</Table.Cell>
							{:else}
								<Table.Cell colspan={2} class="{cell} {hand} text-destructive!">{entry.name}</Table.Cell>
							{/if}
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
			<p class="ex">Это пример заполнения, а не реальный список. Свободные места <a href={WHATSAPP_HREF} target="_blank" rel="noopener">уточняйте у Ани</a>.</p>
		</div>
	</div>
</section>

<style>
	.roster {
		padding: clamp(56px, 8vw, 112px) 0;
	}
	.roster .wrap {
		display: grid;
		grid-template-columns: 0.9fr 1.1fr;
		gap: clamp(28px, 5vw, 80px);
		align-items: start;
	}
	h2 {
		font-size: clamp(34px, 4.6vw, 64px);
	}
	.wrap > div:first-child p {
		margin-top: 20px;
		max-width: 44ch;
		font-size: clamp(18px, 1.5vw, 20px);
		color: var(--ink-2);
	}
	.wrap > div:first-child b {
		color: var(--ink);
	}
	.list {
		background: var(--sheet);
		box-shadow: 0 18px 34px rgba(20, 30, 80, 0.12);
		padding: clamp(20px, 3vw, 36px);
		transform: rotate(-1deg);
		position: relative;
	}
	.list .tape {
		top: -14px;
		left: 6%;
		width: 96px;
		transform: rotate(3deg);
	}
	.list .tape.r {
		left: auto;
		right: 6%;
		transform: rotate(-5deg);
	}
	h3 {
		font-size: 20px;
		font-weight: 800;
		letter-spacing: -0.01em;
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 12px;
	}
	h3 span {
		font-family: var(--hand);
		font-weight: 700;
		font-size: 24px;
		color: var(--pink-text);
	}
	.ex {
		margin-top: 12px;
		max-width: 44ch;
		font-size: 13px;
		color: var(--ink-2);
	}
	.ex a {
		color: var(--pen);
		text-decoration: underline;
		text-underline-offset: 3px;
	}
	.ex a:hover {
		text-decoration: underline wavy var(--pink-text);
		text-underline-offset: 4px;
	}
	@media (max-width: 900px) {
		.roster .wrap {
			grid-template-columns: 1fr;
		}
	}
</style>
