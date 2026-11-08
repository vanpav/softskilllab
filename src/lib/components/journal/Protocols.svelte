<script lang="ts">
	import { Button } from '#lib/components/ui/button/index.js';
	import { protocols } from '#lib/content.js';
	import ProtocolSheet from './ProtocolSheet.svelte';

	let peeled = $state(protocols.map(() => false));
	const allPeeled = $derived(peeled.every(Boolean));

	// Focus moves to the revealed text so it isn't left on a note that is about to hide.
	function reveal(index: number) {
		document.getElementById(`conclusion-${index + 1}`)?.focus({ preventScroll: true });
	}

	const track = (index: number, method: 'one' | 'all') =>
		window.gtag?.('event', 'sticker_peel', { sticker: index + 1, experiment: protocols[index].title, method });

	function peel(index: number) {
		reveal(index);
		track(index, 'one');
		peeled[index] = true;
	}

	function peelAll() {
		const rest = peeled.flatMap((isPeeled, index) => (isPeeled ? [] : [index]));
		reveal(rest[0]);
		rest.forEach((index, order) => {
			track(index, 'all');
			setTimeout(() => (peeled[index] = true), order * 110);
		});
	}
</script>

<section class="protocols" id="protocols">
	<div class="wrap">
		<div class="head">
			<div>
				<h2>Протоколы опытов на целый год</h2>
				<p class="sub">Шесть блоков программы. Слева то, что происходит в колбе. Справа, под стикером, то, что происходит между детьми. Отклейте стикер.</p>
			</div>
			<!-- Hidden rather than removed: its row keeps the sheets from jumping up on phones. -->
			<Button variant="pencil" size="pencil" class="hidden [.js_&]:inline-flex {allPeeled ? 'invisible' : ''}" onclick={peelAll}>отклеить все стикеры</Button>
		</div>
		<div class="proto-list">
			{#each protocols as protocol, i (protocol.title)}
				<ProtocolSheet {protocol} number={i + 1} peeled={peeled[i]} onpeel={() => peel(i)} />
			{/each}
		</div>
	</div>
</section>

<style>
	.protocols {
		padding: clamp(40px, 6vw, 80px) 0 clamp(64px, 8vw, 120px);
		overflow-x: clip; /* a note being pulled sideways must not widen the page */
	}
	.head {
		display: grid;
		grid-template-columns: minmax(0, 1fr) auto;
		align-items: end;
		gap: 18px 32px;
	}
	h2 {
		font-size: clamp(36px, 5vw, 72px);
		max-width: 15ch;
	}
	.sub {
		margin-top: 18px;
		max-width: 54ch;
		font-size: clamp(18px, 1.5vw, 20px);
		color: var(--ink-2);
	}
	.proto-list {
		margin-top: clamp(36px, 5vw, 64px);
		display: grid;
		gap: clamp(24px, 3vw, 40px);
	}
	@media (max-width: 900px) {
		.head {
			grid-template-columns: minmax(0, 1fr);
			justify-items: start;
		}
	}
</style>
