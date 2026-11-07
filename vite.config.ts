import tailwindcss from '@tailwindcss/vite';
import adapter from '@sveltejs/adapter-cloudflare';
import { sveltekit } from '@sveltejs/kit/vite';
import { parse } from 'svelte/compiler';
import { defineConfig } from 'vite';
import { nbsp } from './src/lib/typography.ts';

// Elements whose text is code or typed input, not prose.
const RAW = new Set(['script', 'style', 'textarea', 'pre', 'code']);

/** Glues short Russian words to the next one in the static text of a component's markup (see src/lib/typography.ts). */
const russianLineBreaks = {
	name: 'russian-line-breaks',
	markup({ content, filename }: { content: string; filename?: string }) {
		if (!filename || filename.includes('node_modules') || !/[а-яё]/i.test(content)) return;
		const texts: { start: number; end: number }[] = [];
		const walk = (node: unknown) => {
			if (!node || typeof node !== 'object') return;
			if (Array.isArray(node)) return node.forEach(walk);
			const n = node as Record<string, unknown>;
			if (n.type === 'Text' && typeof n.start === 'number' && typeof n.end === 'number') {
				texts.push({ start: n.start, end: n.end });
				return;
			}
			if (n.type === 'RegularElement' && RAW.has(n.name as string)) return;
			// Attributes stay as written: alt text and labels are read whole, not wrapped.
			for (const [key, value] of Object.entries(n)) if (key !== 'attributes' && key !== 'metadata') walk(value);
		};
		walk(parse(content, { modern: true }).fragment);
		if (!texts.length) return;
		let code = content;
		for (const { start, end } of texts.sort((a, b) => b.start - a.start)) {
			const fixed = nbsp(code.slice(start, end));
			if (fixed !== code.slice(start, end)) code = code.slice(0, start) + fixed + code.slice(end);
		}
		return code === content ? undefined : { code };
	}
};

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			preprocess: [russianLineBreaks],
			adapter: adapter()
		})
	]
});
