import { bindings } from './bindings.js';
import type { PostSource } from '#lib/posts.js';

/**
 * Posts live in the POSTS KV namespace: `post:<slug>` holds a PostSource, `index` the slugs in publication order.
 * The files in `src/posts/` are only the first posts: they are copied into KV the first time Аня opens /adm,
 * and shown from the files until then, or wherever KV is missing.
 */

const INDEX = 'index';
const key = (slug: string) => `post:${slug}`;

const seedFiles = import.meta.glob('../../posts/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

export const seedSources: PostSource[] = Object.entries(seedFiles)
	.sort(([a], [b]) => a.localeCompare(b))
	.map(([path, raw]) => {
		const match = raw.match(/^---\n([\s\S]*?)\n---\n?/);
		const meta = Object.fromEntries(
			(match?.[1] ?? '')
				.split('\n')
				.map((line) => line.split(/:\s*/, 2).map((part) => part.trim()))
				.filter(([k, v]) => k && v)
		) as Record<string, string>;
		return {
			slug: path.split('/').pop()!.replace(/\.md$/, '').replace(/^\d+-/, ''),
			title: meta.title ?? '',
			text: raw.slice(match?.[0].length ?? 0).trim(),
			doodle: (meta.doodle as PostSource['doodle']) ?? ''
		};
	});


async function readIndex(kv: App.KV) {
	return (await kv.get(INDEX, 'json')) as string[] | null;
}

export async function loadSources(): Promise<PostSource[]> {
	const kv = (await bindings()).POSTS;
	if (!kv) return seedSources;
	const index = await readIndex(kv);
	if (!index) return seedSources;
	const posts = await Promise.all(index.map((slug) => kv.get(key(slug), 'json') as Promise<PostSource | null>));
	return posts.filter((post): post is PostSource => !!post);
}

export async function requireKv() {
	const kv = (await bindings()).POSTS;
	if (!kv) throw new Error('POSTS KV namespace is not bound');
	return kv;
}

export async function ensureSeeded(kv: App.KV) {
	if (await readIndex(kv)) return;
	for (const source of seedSources) await kv.put(key(source.slug), JSON.stringify(source));
	await kv.put(INDEX, JSON.stringify(seedSources.map((source) => source.slug)));
}

export async function getSource(kv: App.KV, slug: string) {
	return (await kv.get(key(slug), 'json')) as PostSource | null;
}

/** Adds a new post at the end, or replaces an existing one in place. */
export async function saveSource(kv: App.KV, source: PostSource) {
	const index = (await readIndex(kv)) ?? [];
	await kv.put(key(source.slug), JSON.stringify(source));
	if (!index.includes(source.slug)) await kv.put(INDEX, JSON.stringify([...index, source.slug]));
}

/** Removes the post and the photos uploaded for it. */
export async function deleteSource(kv: App.KV, slug: string) {
	const source = await getSource(kv, slug);
	const photos = (await bindings()).PHOTOS;
	for (const block of source?.content?.blocks ?? []) {
		if (block.type === 'photos') for (const photo of block.photos) await photos?.delete(photo.key);
	}
	const index = (await readIndex(kv)) ?? [];
	await kv.put(INDEX, JSON.stringify(index.filter((s) => s !== slug)));
	await kv.delete(key(slug));
}

export async function slugTaken(kv: App.KV, slug: string) {
	return (await readIndex(kv))?.includes(slug) ?? false;
}
