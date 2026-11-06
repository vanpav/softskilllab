type Segment = [number, number, number, number];

const KINDS = 4;
const FRAMES = 2;
const COUNT = 18;
const GUST_TIME = 13;
const BOIL_TIME = 0.4;
const OFFSCREEN = 110;
const LINE = 2.4;

export const PHONE_COUNT = 7;
export const PHONE_WIND = 0.6;

// Seeded so every load draws the same snow.
function random(seed: number) {
	return () => {
		seed = (seed + 0x6d2b79f5) | 0;
		let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

function skeleton(kind: number, rand: () => number) {
	const segments: Segment[] = [];
	const polar = (radius: number, degrees: number): [number, number] => {
		const a = (degrees * Math.PI) / 180;
		return [50 + radius * Math.cos(a), 50 + radius * Math.sin(a)];
	};
	const line = (from: [number, number], to: [number, number]) => segments.push([...from, ...to]);
	const start = rand() * 60;

	for (let arm = 0; arm < 6; arm++) {
		const angle = start + arm * 60 + (rand() - 0.5) * 7;
		const length = 38 + rand() * 9;
		line(polar(kind === 3 ? 6 : 0, angle), polar(length, angle));

		const barbs = kind === 1 ? [0.42, 0.72] : kind === 3 ? [] : [0.62];
		for (const at of barbs) {
			const base = polar(length * at, angle);
			const size = 11 + rand() * 6;
			for (const side of [-1, 1]) {
				const a = ((angle + side * (48 + rand() * 14)) * Math.PI) / 180;
				line(base, [base[0] + size * Math.cos(a), base[1] + size * Math.sin(a)]);
			}
		}
		if (kind === 2) line(polar(17, angle), polar(17, angle + 60));
		if (kind === 3) line(polar(length * 0.82, angle - 9), polar(length * 0.82, angle + 9));
	}
	return segments;
}

// The same strokes retraced with a slightly unsteady hand.
function trace(segments: Segment[], rand: () => number) {
	const n = (value: number, wobble: number) => (value + (rand() - 0.5) * wobble).toFixed(1);
	return segments
		.map(([x1, y1, x2, y2]) => {
			const midX = n((x1 + x2) / 2, 4);
			const midY = n((y1 + y2) / 2, 4);
			return `M${n(x1, 1.6)} ${n(y1, 1.6)}Q${midX} ${midY} ${n(x2, 2.2)} ${n(y2, 2.2)}`;
		})
		.join('');
}

const shapes = Array.from({ length: KINDS }, (_, kind) => {
	const segments = skeleton(kind, random(11 + kind * 7));
	return Array.from({ length: FRAMES }, (_, frame) => trace(segments, random(101 + kind * 13 + frame)));
});

const rand = random(2026);
const flakes = Array.from({ length: COUNT }, (_, i) => {
	const depth = rand();
	const y = Math.round(rand() * 100);
	const drift = 40 + rand() * 70;
	const start = (y + 8) / 116;
	const duration = 30 - depth * 14 + rand() * 4;
	const swayTime = 4.5 + rand() * 3.5;
	return {
		kind: i % KINDS,
		// Stepping through the strip, so the first flakes still spread out when phones hide the rest.
		x: (((i * 7) % COUNT) + rand()) / COUNT,
		size: Math.round(27 + depth * 45),
		start,
		duration,
		driftFrom: -drift * start,
		driftTo: drift * (1 - start),
		// One gust period for all, offset by height, so the wind passes down the page.
		gust: 16 + depth * 34,
		gustPhase: (y / 100) * GUST_TIME,
		sway: 22 + depth * 44 + rand() * 12,
		swayTime,
		swayPhase: rand(),
		spin: ((16 + rand() * 24) * Math.PI) / 180,
		// Kept below the fall speed, so a flake slows at each turn but never climbs back up.
		dip: 10 + rand() * 12,
		ink: 0.34 + depth * 0.24,
		boil: rand()
	};
});

export type View = { width: number; height: number; count: number; wind: number };

/** Where flake `i` is `time` seconds after the snow started. All motion lives in this one formula. */
export function flakeAt(i: number, time: number, { width, height, wind }: View) {
	const f = flakes[i];
	const laps = f.start + time / f.duration;
	const progress = laps % 1;
	const swing = 2 * Math.PI * (time / f.swayTime + f.swayPhase);
	const gust = -Math.cos((Math.PI * (time + f.gustPhase)) / GUST_TIME) * f.gust;
	return {
		lap: Math.floor(laps),
		size: f.size,
		x: f.x * width + f.size / 2 + f.driftFrom + (f.driftTo - f.driftFrom) * progress + (gust - Math.cos(swing) * f.sway) * wind,
		y: -OFFSCREEN + (height + 2 * OFFSCREEN) * progress + f.size / 2 + Math.abs(Math.sin(swing)) * f.dip,
		// Tilts most mid-sweep and levels out at each end, like a falling leaf.
		angle: Math.sin(swing) * f.spin
	};
}

export function createPainter(ctx: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D, color: string) {
	const paths = shapes.map((frames) => frames.map((d) => new Path2D(d)));
	ctx.strokeStyle = color;
	ctx.lineCap = 'round';
	ctx.lineJoin = 'round';

	return (time: number, view: View, scale: number, popped: Map<number, number>) => {
		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
		for (let i = 0; i < view.count; i++) {
			const flake = flakeAt(i, time, view);
			if (popped.get(i) === flake.lap) continue;
			const s = (flake.size / 100) * scale;
			const f = flakes[i];
			const cos = Math.cos(flake.angle) * s;
			const sin = Math.sin(flake.angle) * s;
			ctx.setTransform(cos, sin, -sin, cos, flake.x * scale, flake.y * scale);
			ctx.translate(-50, -50);
			ctx.globalAlpha = f.ink;
			ctx.lineWidth = (LINE * scale) / s;
			ctx.stroke(paths[f.kind][Math.floor(time / BOIL_TIME + f.boil) % FRAMES]);
		}
	};
}
