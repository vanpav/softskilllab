<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	type Mark = 'x' | 'o';
	type Game = {
		id: number;
		x: number;
		y: number;
		tilt: number;
		lines: string[];
		cells: (Mark | null)[];
		strokes: (string[] | null)[];
		strike: string | null;
		result: string | null;
	};

	const MAX_BOARDS = 4;
	const WIDE_ENOUGH = '(min-width: 1440px)';
	const CELL = 40;
	const SIZE = CELL * 3;
	const HEIGHT = SIZE + 40;
	const GRID = 24;
	const THINKING = 450;
	const NEXT_GAME = 1400;
	const SETTLE = 300;
	const WINS = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6]
	];
	const CONTAINERS = new Set(['HTML', 'BODY', 'MAIN', 'SECTION', 'DIV', 'HEADER', 'FOOTER']);

	let games = $state<Game[]>([]);
	let thinking = $state(false);
	let waitingForRoom = false;
	let timer: ReturnType<typeof setTimeout> | undefined;
	let nextId = 0;

	const current = $derived(games.at(-1));

	const jitter = (amount: number) => (Math.random() - 0.5) * amount;
	const stroke = (x1: number, y1: number, x2: number, y2: number) =>
		`M${(x1 + jitter(3)).toFixed(1)} ${(y1 + jitter(3)).toFixed(1)}Q${((x1 + x2) / 2 + jitter(5)).toFixed(1)} ${((y1 + y2) / 2 + jitter(5)).toFixed(1)} ${(x2 + jitter(3)).toFixed(1)} ${(y2 + jitter(3)).toFixed(1)}`;

	const center = (cell: number) => ({ x: (cell % 3) * CELL + CELL / 2, y: Math.floor(cell / 3) * CELL + CELL / 2 });

	function drawMark(mark: Mark, cell: number) {
		const { x, y } = center(cell);
		if (mark === 'x') return [stroke(x - 11, y - 11, x + 11, y + 11), stroke(x + 11, y - 11, x - 11, y + 11)];
		const r = 11;
		// Slightly overshoots where it started, the way a circle drawn by hand does.
		return [
			`M${x + 2} ${y - r - 1}C${x + 9 + jitter(3)} ${y - r} ${x + r + 2} ${y - 5} ${x + r} ${y + 1}C${x + r - 1} ${y + 8 + jitter(3)} ${x + 4} ${y + r + 1} ${x - 2} ${y + r}C${x - 9} ${y + r - 1} ${x - r - 1} ${y + 4} ${x - r} ${y - 2}C${x - r + 1} ${y - 8} ${x - 6} ${y - r - 2} ${x + 4} ${y - r + 1}`
		];
	}

	// A spot is free if only empty page containers lie under it: no text, picture or sheet.
	function isFree(left: number, top: number) {
		for (let row = 0; row < 6; row++) {
			for (let column = 0; column < 6; column++) {
				const el = document.elementFromPoint(left - 4 + (column * (SIZE + 8)) / 5, top - 4 + (row * (HEIGHT + 8)) / 5);
				if (!el) return false;
				// Boards are compared by position instead: one being rubbed out is still in the DOM.
				if (el.closest('.board')) continue;
				if (!CONTAINERS.has(el.tagName)) return false;
				if (el !== document.body && el !== document.documentElement && getComputedStyle(el).backgroundColor !== 'rgba(0, 0, 0, 0)') return false;
				if ([...el.childNodes].some((node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim())) return false;
			}
		}
		return true;
	}

	function findSpot() {
		const margin = Math.min(44, innerWidth * 0.03) + 16;
		// Rows of one board's height, so a random first board can't leave too little room for the rest.
		const rowHeight = Math.ceil((HEIGHT + 8) / GRID) * GRID;
		const firstRow = Math.ceil((scrollY + 4) / GRID) * GRID;
		const spots: { x: number; y: number }[] = [];
		for (let x = Math.ceil(margin / GRID) * GRID; x + SIZE <= innerWidth - 4; x += GRID / 2) {
			for (let y = firstRow; y + HEIGHT <= scrollY + innerHeight - 4; y += rowHeight) {
				spots.push({ x, y });
			}
		}
		const clear = (spot: { x: number; y: number }) =>
			games.every((game) => Math.abs(game.x - spot.x) >= SIZE + 8 || Math.abs(game.y - spot.y) >= HEIGHT + 8);
		// Shuffled, then tried one by one: checking every spot with elementFromPoint took over 200ms after a scroll.
		for (let i = spots.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[spots[i], spots[j]] = [spots[j], spots[i]];
		}
		return spots.find((spot) => clear(spot) && isFree(spot.x, spot.y - scrollY)) ?? null;
	}

	function addBoard() {
		if (!matchMedia(WIDE_ENOUGH).matches) return;
		clearTimeout(timer);
		thinking = false;
		// The oldest board is rubbed out first, which also frees its spot. Boards never overlap,
		// so with no room in view the new one waits until the visitor scrolls somewhere with room.
		const oldest = games.length >= MAX_BOARDS ? games[0] : null;
		if (oldest) games.shift();
		const spot = findSpot();
		waitingForRoom = !spot;
		if (!spot) {
			if (oldest) games.unshift(oldest);
			return;
		}
		games.push({
			id: nextId++,
			...spot,
			tilt: (Math.random() < 0.5 ? -1 : 1) * (1.5 + Math.random() * 3),
			lines: [
				stroke(CELL, 5, CELL, SIZE - 5),
				stroke(CELL * 2, 5, CELL * 2, SIZE - 5),
				stroke(5, CELL, SIZE - 5, CELL),
				stroke(5, CELL * 2, SIZE - 5, CELL * 2)
			],
			cells: Array(9).fill(null),
			strokes: Array(9).fill(null),
			strike: null,
			result: null
		});
	}

	function place(game: Game, cell: number, mark: Mark) {
		game.cells[cell] = mark;
		game.strokes[cell] = drawMark(mark, cell);
		const win = WINS.find((line) => line.every((i) => game.cells[i] === mark));
		if (win) {
			const from = center(win[0]);
			const to = center(win[2]);
			game.strike = `M${from.x} ${from.y}L${to.x} ${to.y}`;
			game.result = mark === 'x' ? 'твоя взяла!' : 'моя взяла!';
			window.gtag?.('event', 'game_finish', { result: mark === 'x' ? 'win' : 'loss' });
		} else if (game.cells.every(Boolean)) {
			game.result = 'ничья!';
			window.gtag?.('event', 'game_finish', { result: 'draw' });
		}
	}

	function bestMove(cells: (Mark | null)[]) {
		const empty = cells.flatMap((value, i) => (value ? [] : [i]));
		const finishing = (mark: Mark) =>
			empty.find((i) => WINS.some((line) => line.includes(i) && line.every((j) => j === i || cells[j] === mark)));
		// Misses now and then, so a child can actually beat it.
		const careless = Math.random() < 0.25;
		const smart = finishing('o') ?? (careless ? undefined : finishing('x'));
		if (smart !== undefined) return smart;
		if (!careless && empty.includes(4)) return 4;
		return empty[Math.floor(Math.random() * empty.length)];
	}

	function nextGame() {
		timer = setTimeout(addBoard, NEXT_GAME);
	}

	function inView(game: Game) {
		const top = game.y - scrollY;
		return top + HEIGHT > 0 && top < innerHeight;
	}

	// After scrolling, the page offers a board in view: an untouched one moves along with the visitor.
	function onSettled() {
		if (current?.result) {
			if (waitingForRoom) addBoard();
			return;
		}
		if (current && inView(current)) return;
		if (current && !current.cells.some(Boolean)) games.pop();
		addBoard();
	}

	function move(game: Game, cell: number) {
		if (game !== current || thinking || game.result || game.cells[cell]) return;
		if (game.cells.every((value) => !value)) window.gtag?.('event', 'game_start');
		place(game, cell, 'x');
		if (game.result) return nextGame();
		thinking = true;
		timer = setTimeout(() => {
			place(game, bestMove(game.cells), 'o');
			thinking = false;
			if (game.result) nextGame();
		}, THINKING);
	}

	onMount(() => {
		let settle: ReturnType<typeof setTimeout>;
		const onMove = () => {
			clearTimeout(settle);
			settle = setTimeout(onSettled, SETTLE);
		};
		// Spots are judged by what lies on the page, so wait for the fonts that set its layout.
		document.fonts.ready.then(() => games.length || addBoard());
		addEventListener('scroll', onMove, { passive: true });
		addEventListener('resize', onMove);
		return () => {
			clearTimeout(timer);
			clearTimeout(settle);
			removeEventListener('scroll', onMove);
			removeEventListener('resize', onMove);
		};
	});
</script>

{#each games as game (game.id)}
	<div class="board" out:fade={{ duration: 300 }} style:left="{game.x}px" style:top="{game.y}px" style:transform="rotate({game.tilt}deg)">
		<svg viewBox="0 0 {SIZE} {SIZE}" aria-hidden="true">
			{#if game.strike}<path class="strike" pathLength="1" d={game.strike} />{/if}
			{#each game.lines as d, i (i)}
				<path class="line" pathLength="1" style:animation-delay="{i * 0.09}s" {d} />
			{/each}
			{#each game.strokes as marks, cell (cell)}
				{#if marks}
					{#each marks as d, i (i)}
						<path class={game.cells[cell] === 'x' ? 'x' : 'o'} pathLength="1" style:animation-delay="{i * 0.1}s" {d} />
					{/each}
				{/if}
			{/each}
		</svg>
		<div class="cells">
			{#each game.cells as value, cell (cell)}
				<button
					type="button"
					disabled={game !== current || !!value || !!game.result || thinking}
					aria-label="Клетка {cell + 1}: {value === 'x' ? 'крестик' : value === 'o' ? 'нолик' : 'пусто'}"
					onclick={() => move(game, cell)}
				></button>
			{/each}
		</div>
		<p class="hand result" aria-live="polite">{game.result ?? ''}</p>
	</div>
{/each}

<style>
	.board {
		position: absolute;
		z-index: 2;
		width: 120px;
	}
	/* The right gutter must fit a whole board, so one almost always finds a place. */
	@media (max-width: 1439px) {
		.board {
			display: none;
		}
	}
	svg {
		display: block;
		width: 120px;
		height: 120px;
		overflow: visible;
		fill: none;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	path {
		/* The long gap and the offset past 1 hide the round cap, which otherwise shows as a dot before the stroke starts. */
		stroke-dasharray: 1 3;
		animation: draw 0.28s ease-out both;
	}
	.line,
	.x {
		stroke: var(--pen);
		stroke-width: 2.4;
	}
	.o {
		stroke: var(--pink-text);
		stroke-width: 2.4;
		animation-duration: 0.4s;
	}
	.strike {
		stroke: var(--marker);
		stroke-width: 22;
		animation-duration: 0.4s;
	}
	@keyframes draw {
		from {
			stroke-dashoffset: 1.25;
		}
		to {
			stroke-dashoffset: 0;
		}
	}
	.cells {
		position: absolute;
		inset: 0 0 auto;
		display: grid;
		grid-template-columns: repeat(3, 40px);
		grid-auto-rows: 40px;
	}
	.cells button {
		background: none;
		border: 0;
		padding: 0;
		cursor: pointer;
	}
	.cells button:disabled {
		cursor: default;
	}
	.result {
		min-height: 32px;
		margin-top: 6px;
		font-size: 24px;
		text-align: center;
		transform: rotate(-2deg);
	}
</style>
