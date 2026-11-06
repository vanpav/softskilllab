<svg class="doodle" viewBox="0 0 100 100" aria-hidden="true">
	<!-- Drawn like the logo mark: a lime marker patch behind, flat colour, one round ink line. -->
	<path class="patch" transform="translate(50 25) scale(0.72) translate(-50 -27)" d="M-14 18C16-2 50-14 84-16M-18-14C4-34 28-44 52-52" />
	<g class="on-head" transform="translate(50 25.5) scale(0.68) translate(-50 -27)">
		<path class="hat" d="M12 30C16 6 34-20 58-22C76-23 92-8 97 12C92 6 84 0 76 0C81 8 84 16 85 24Z" />
		<path class="band-line" d="M9 33C28 22 70 20 91 28" />
		<path class="band" d="M9 33C28 22 70 20 91 28" />
		<circle class="pompom" cx="97" cy="19" r="9" />
	</g>
	<path class="white" d="M20 55C25 65 37 69 46 67C50 70 55 70 59 67C68 69 79 65 84 54C91 62 92 74 86 81C89 90 82 98 74 97C74 106 65 112 58 108C56 116 46 117 43 109C36 113 27 106 28 97C20 98 13 90 17 81C11 73 13 62 20 55Z" />
	<path class="fold" d="M30 80C34 85 39 85 43 81M57 81C61 85 66 85 71 80M44 96C48 100 53 100 57 96" />
	<path class="white" d="M51 60C46 55 39 55 34 59C31 62 28 62 26 59C27 67 37 70 44 67C47 66 50 64 51 62C52 64 55 66 58 67C65 70 75 67 76 59C74 62 71 62 68 59C63 55 56 55 51 60Z" />
</svg>

<style>
	/* In the sticker's own coordinates, so it turns together with Пушистик. */
	.doodle {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		overflow: visible;
		pointer-events: none;
		fill: none;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.patch {
		stroke: var(--marker);
		stroke-width: 30;
	}
	/* The hat group is scaled to 0.68, so these widths come out at exactly the beard's line of 3. */
	.hat,
	.pompom {
		stroke: var(--ink);
		stroke-width: calc(3 / 0.68);
	}
	.hat {
		fill: var(--pink-text);
	}
	.pompom {
		fill: var(--sheet);
	}
	.band-line {
		stroke: var(--ink);
		stroke-width: calc(11 + 2 * 3 / 0.68);
	}
	.band {
		stroke: var(--sheet);
		stroke-width: 11;
	}
	.white {
		fill: var(--sheet);
		stroke: var(--ink);
		stroke-width: 3;
	}
	.fold {
		stroke: var(--ink);
		stroke-width: 2;
	}
</style>
