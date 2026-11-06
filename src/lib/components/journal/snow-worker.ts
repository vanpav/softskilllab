import { createPainter, type View } from './snow-flakes.js';

let canvas: OffscreenCanvas;
let color = '';
let paint: ReturnType<typeof createPainter>;
let view: View;
let scale = 1;
let startedAt = 0;
const popped = new Map<number, number>();

function fit(next: { view: View; scale: number }) {
	view = next.view;
	scale = next.scale;
	canvas.width = view.width * scale;
	canvas.height = view.height * scale;
	// Resizing a canvas resets its context, line styles included.
	paint = createPainter(canvas.getContext('2d')!, color);
}

function loop() {
	paint((Date.now() - startedAt) / 1000, view, scale, popped);
	requestAnimationFrame(loop);
}

self.onmessage = ({ data }) => {
	if (data.type === 'start') {
		canvas = data.canvas;
		color = data.color;
		startedAt = data.startedAt;
		fit(data);
		loop();
	}
	if (data.type === 'resize') fit(data);
	if (data.type === 'pop') popped.set(data.index, data.lap);
};
