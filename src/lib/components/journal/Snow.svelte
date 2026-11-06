<script lang="ts">
	import { onMount } from 'svelte';
	import { createPainter, flakeAt, PHONE_COUNT, PHONE_WIND, type View } from './snow-flakes.js';

	let layer = $state<HTMLDivElement>();
	let canvas = $state<HTMLCanvasElement>();

	const TAP_RADIUS = 26;
	const ALL_FLAKES = 18;
	const flying = [
		{ count: 6, size: 0.42, reach: 1.5, color: 'var(--pen)' },
		{ count: 8, size: 0.2, reach: 1.05, color: 'var(--pink-text)' }
	];

	// Flakes lie under the page, so a click only reaches one over bare paper or plain text.
	function isOverPaper(target: EventTarget | null) {
		if (!(target instanceof Element) || target.closest('a, button, input, textarea, select, label')) return false;
		for (let el: Element | null = target; el && el !== document.body; el = el.parentElement) {
			const style = getComputedStyle(el);
			const color = style.backgroundColor;
			if (style.backgroundImage !== 'none' || !(color === 'transparent' || color === 'rgba(0, 0, 0, 0)')) return false;
		}
		return true;
	}

	function burst(x: number, y: number, size: number) {
		flying.forEach(({ count, size: length, reach, color }, ring) => {
			for (let i = 0; i < count; i++) {
				const angle = ((i + ring * 0.5) / count) * Math.PI * 2 + Math.random() * 0.3;
				const distance = size * reach * (0.8 + Math.random() * 0.5);
				const dx = Math.cos(angle) * distance;
				const dy = Math.sin(angle) * distance;
				const turn = (angle * 180) / Math.PI;
				const spin = (Math.random() - 0.5) * 240;

				const shard = document.createElement('span');
				shard.className = 'snow-shard';
				shard.style.cssText = `left:${x}px;top:${y}px;width:${Math.max(7, size * length)}px;background:${color}`;
				layer?.append(shard);
				shard
					.animate(
						[
							{ transform: `translate(-50%, -50%) rotate(${turn}deg)`, opacity: 1 },
							{ transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) rotate(${turn + spin * 0.6}deg)`, opacity: 1, offset: 0.55, easing: 'ease-in' },
							{ transform: `translate(calc(-50% + ${dx * 1.15}px), calc(-50% + ${dy + 26}px)) rotate(${turn + spin}deg)`, opacity: 0 }
						],
						{ duration: 620, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' }
					)
					.finished.finally(() => shard.remove());
			}
		});
	}

	onMount(() => {
		if (!canvas) return;
		const target = canvas;
		const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
		const phone = matchMedia('(max-width: 600px)');
		const color = getComputedStyle(target).color;
		const startedAt = Date.now();
		const popped = new Map<number, number>();

		const measure = (): { view: View; scale: number } => ({
			view: {
				width: innerWidth,
				height: innerHeight,
				count: phone.matches ? PHONE_COUNT : ALL_FLAKES,
				wind: phone.matches ? PHONE_WIND : 1
			},
			scale: Math.min(devicePixelRatio, 2)
		});
		let size = measure();
		const now = () => (calm ? 0 : (Date.now() - startedAt) / 1000);

		// A lone canvas in a worker: the snow costs the page one layer and no main-thread time,
		// where animated elements made every other animation drop to 20 fps on slow devices.
		let worker: Worker | undefined;
		let paint: ReturnType<typeof createPainter> | undefined;
		let frame = 0;

		const repaint = () => paint?.(now(), size.view, size.scale, popped);
		const fitHere = () => {
			target.width = size.view.width * size.scale;
			target.height = size.view.height * size.scale;
			paint = createPainter(target.getContext('2d')!, color);
			repaint();
		};

		if (!calm && 'transferControlToOffscreen' in target) {
			worker = new Worker(new URL('./snow-worker.ts', import.meta.url), { type: 'module' });
			const offscreen = target.transferControlToOffscreen();
			worker.postMessage({ type: 'start', canvas: offscreen, color, startedAt, ...size }, [offscreen]);
		} else {
			fitHere();
			if (!calm) {
				const loop = () => {
					repaint();
					frame = requestAnimationFrame(loop);
				};
				frame = requestAnimationFrame(loop);
			}
		}

		const onResize = () => {
			size = measure();
			if (worker) worker.postMessage({ type: 'resize', ...size });
			else fitHere();
		};

		const onClick = (event: MouseEvent) => {
			if (!getSelection()?.isCollapsed || !isOverPaper(event.target)) return;
			const time = now();
			let hit: { index: number; lap: number; x: number; y: number; size: number } | undefined;
			let nearest = Infinity;
			for (let index = 0; index < size.view.count; index++) {
				const flake = flakeAt(index, time, size.view);
				if (popped.get(index) === flake.lap) continue;
				const distance = Math.hypot(event.clientX - flake.x, event.clientY - flake.y);
				if (distance <= Math.max(flake.size / 2, TAP_RADIUS) && distance < nearest) {
					nearest = distance;
					hit = { index, ...flake };
				}
			}
			if (!hit) return;
			// The flake stays gone until its next lap, when it comes back from above the screen.
			popped.set(hit.index, hit.lap);
			worker?.postMessage({ type: 'pop', index: hit.index, lap: hit.lap });
			if (calm) {
				repaint();
				const { index } = hit;
				setTimeout(() => {
					popped.delete(index);
					repaint();
				}, 8000);
				return;
			}
			burst(hit.x, hit.y, hit.size);
		};

		addEventListener('resize', onResize);
		document.addEventListener('click', onClick);
		return () => {
			removeEventListener('resize', onResize);
			document.removeEventListener('click', onClick);
			cancelAnimationFrame(frame);
			worker?.terminate();
		};
	});
</script>

<div class="snow" aria-hidden="true" bind:this={layer}>
	<canvas bind:this={canvas}></canvas>
</div>

<style>
	/* Under .wrap (z-index 1), so flakes pass beneath the text and every sheet lying on the page. */
	.snow {
		position: fixed;
		inset: 0;
		z-index: 0;
		overflow: hidden;
		pointer-events: none;
		color: var(--pen);
	}
	canvas {
		display: block;
		width: 100%;
		height: 100%;
		color: var(--pen);
	}
	.snow :global(.snow-shard) {
		position: absolute;
		height: 3px;
		border-radius: 2px;
	}
	@media print {
		.snow {
			display: none;
		}
	}
</style>
