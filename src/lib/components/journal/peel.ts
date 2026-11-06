type Point = { x: number; y: number };

const DURATION = 650;
const FADE_FROM = 0.7;
const UNDER_FADE = 0.3;

const dot = (a: Point, b: Point) => a.x * b.x + a.y * b.y;
const polygon = (points: Point[]) =>
	points.length ? `polygon(${points.map((p) => `${p.x}px ${p.y}px`).join(',')})` : 'polygon(0 0)';

/** Part of the rectangle lying on the far side of the fold from the pulled corner, or on its side. */
function clipRect(w: number, h: number, fold: Point, normal: Point, keepPulled: boolean) {
	const corners = [
		{ x: 0, y: 0 },
		{ x: w, y: 0 },
		{ x: w, y: h },
		{ x: 0, y: h }
	];
	const side = (p: Point) => {
		const d = dot({ x: p.x - fold.x, y: p.y - fold.y }, normal);
		return keepPulled ? -d : d;
	};
	const out: Point[] = [];
	corners.forEach((a, i) => {
		const b = corners[(i + 1) % 4];
		const da = side(a);
		const db = side(b);
		if (da >= 0) out.push(a);
		if (da >= 0 !== db >= 0) {
			const t = da / (da - db);
			out.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
		}
	});
	return out;
}

/**
 * Measures the note once and returns a function that draws it at progress 0–1: the corner travels
 * along a curve and the note folds over it. Layout and styles are read only here, never per frame.
 * `curl` is the corner's current size, so progress 0 matches the note at rest or on hover.
 */
function prepare(button: HTMLElement, curl: number) {
	const paper = button.querySelector<HTMLElement>('.paper');
	const back = button.querySelector<HTMLElement>('.back');
	const note = button.querySelector<HTMLElement>('.note');
	const under = button.querySelector<HTMLElement>('.under');
	if (!paper || !back || !note || !under) return () => {};

	const style = getComputedStyle(button);
	const sign = style.getPropertyValue('--curl-side').trim() === 'right' ? -1 : 1;
	// Fractional sizes: rounded ones clip a hairline off the note's edge on the first frame.
	const w = parseFloat(style.width);
	const h = parseFloat(style.height);

	const corner = { x: sign > 0 ? 0 : w, y: h };
	const far = { x: sign > 0 ? w : -w, y: -h };
	const pull = { x: sign * 2.2 * w, y: -0.9 * h };
	// Long enough for the fold to clear the corner opposite the pulled one.
	const reach = (2.04 * dot(far, pull)) / dot(pull, pull);
	const p0 = { x: sign * curl, y: -curl };
	const p1 = { x: sign * 0.55 * w, y: -0.75 * h };
	const p2 = { x: pull.x * reach, y: pull.y * reach };

	return (progress: number) => {
		const u = progress ** 2.2; // speeds up the whole way, the way a note comes off once it gives
		const quad = (a: number, b: number, c: number) => (1 - u) ** 2 * a + 2 * (1 - u) * u * b + u ** 2 * c;
		const offset = { x: quad(p0.x, p1.x, p2.x), y: quad(p0.y, p1.y, p2.y) };

		const length = Math.hypot(offset.x, offset.y);
		const n = { x: offset.x / length, y: offset.y / length };
		const fold = { x: corner.x + offset.x / 2, y: corner.y + offset.y / 2 };

		paper.style.clipPath = polygon(clipRect(w, h, fold, n, false));
		back.style.clipPath = polygon(clipRect(w, h, fold, n, true));

		const m = 2 * dot(n, fold);
		back.style.transform = `matrix(${1 - 2 * n.x * n.x},${-2 * n.x * n.y},${-2 * n.x * n.y},${1 - 2 * n.y * n.y},${m * n.x},${m * n.y})`;

		// Stops are in px along the gradient line so the ridge stays on the fold as it moves.
		const angle = (Math.atan2(-n.x, n.y) * 180) / Math.PI;
		const line = w * Math.abs(n.x) + h * Math.abs(n.y);
		const start = -dot({ x: fold.x - w / 2, y: fold.y - h / 2 }, n) + line / 2;
		back.style.backgroundImage = `linear-gradient(${angle}deg, var(--back-dark) ${start}px, var(--back-light) ${start + 16}px, var(--back-mid) ${start + 90}px)`;

		// Set per frame, because a CSS opacity transition would promote layers mid-click and flicker.
		under.style.opacity = String(Math.max(0, 1 - progress / UNDER_FADE));

		if (u > FADE_FROM) {
			const fade = (u - FADE_FROM) / (1 - FADE_FROM);
			note.style.opacity = String(1 - fade);
			note.style.transform = `translate(${sign * 70 * fade ** 2}px, ${-34 * fade ** 2}px)`;
		}
	};
}

/** Plays the peel and resolves once the note is gone. */
export function peelAway(button: HTMLElement) {
	return new Promise<void>((resolve) => {
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) return resolve();

		// Leaving :hover would otherwise snap the fold back to rest mid-peel.
		const curl = parseFloat(getComputedStyle(button).getPropertyValue('--curl')) || 50;
		button.style.transition = 'none';
		button.style.setProperty('--curl', `${curl}px`);

		const draw = prepare(button, curl);
		const start = performance.now();
		draw(0);
		const tick = (now: number) => {
			const progress = Math.min(1, (now - start) / DURATION);
			draw(progress);
			if (progress < 1) requestAnimationFrame(tick);
			else resolve();
		};
		requestAnimationFrame(tick);
		// Frames stop in a background tab, and the note still has to leave.
		setTimeout(resolve, DURATION + 300);
	});
}
