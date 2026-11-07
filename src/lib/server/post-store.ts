import { buildPosts, type PostSource } from '#lib/posts.js';
import { bindings } from './bindings.js';

/**
 * Posts live in the POSTS KV namespace, one key per post: `post:<slug>` holds a PostSource, with `{ seq, date }`
 * as key metadata so the order is known from a listing alone. There is no shared index to read, change and write
 * back: KV reads can lag a write by up to a minute, and such a write would drop whatever the stale copy lacked.
 * A listing can lag too, but then a new post only shows a little later; nothing is lost.
 *
 * The files in `src/posts/` are the first posts. They are never copied into KV: each shows from its file until
 * Аня saves it (then the KV copy wins) or deletes it (then `gone:<slug>` hides it).
 */

const POST = 'post:';
const GONE = 'gone:';
const key = (slug: string) => `${POST}${slug}`;

type Meta = { seq: number; date?: string };
export type Entry = Meta & { slug: string };

const seedFiles = import.meta.glob('../../posts/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

export const seedSources: PostSource[] = Object.entries(seedFiles)
	.sort(([a], [b]) => a.localeCompare(b))
	.map(([path, raw], i) => {
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
			doodle: (meta.doodle as PostSource['doodle']) ?? '',
			// The files come first, before anything published from /adm (whose seq is a timestamp).
			seq: i + 1,
			// `date: 2026-10-15` in the front matter; without it the post simply shows no date.
			...(meta.date ? { createdAt: meta.date } : {})
		};
	});

const seedBySlug = new Map(seedSources.map((source) => [source.slug, source]));

/** Order of a stored post: its own seq, or for copies saved before seq existed, its file's place or its date. */
const seqOf = (source: PostSource) => source.seq ?? seedBySlug.get(source.slug)?.seq ?? (Date.parse(source.createdAt ?? '') || 0);

export async function requireKv() {
	const kv = (await bindings()).POSTS;
	if (!kv) throw new Error('POSTS KV namespace is not bound');
	return kv;
}

async function listKeys(kv: App.KV, prefix: string) {
	const keys: { name: string; metadata?: unknown }[] = [];
	let cursor: string | undefined;
	do {
		const page = await kv.list({ prefix, cursor });
		keys.push(...page.keys);
		cursor = page.list_complete ? undefined : page.cursor;
	} while (cursor);
	return keys;
}

/** Every post in publication order, from the listing and the files, without reading any post's text. */
export async function listEntries(): Promise<Entry[]> {
	const kv = (await bindings()).POSTS;
	if (!kv) return seedSources.map((s) => ({ slug: s.slug, seq: s.seq!, date: s.createdAt }));
	const [stored, gone] = await Promise.all([listKeys(kv, POST), listKeys(kv, GONE)]);
	const goneSlugs = new Set(gone.map((k) => k.name.slice(GONE.length)));
	const entries = await Promise.all(
		stored.map(async ({ name, metadata }): Promise<Entry | null> => {
			const slug = name.slice(POST.length);
			const meta = metadata as Meta | undefined;
			if (typeof meta?.seq === 'number') return { slug, seq: meta.seq, date: meta.date };
			// Saved before metadata existed: read it once to learn its place.
			const source = (await kv.get(name, 'json')) as PostSource | null;
			return source && { slug, seq: seqOf(source), date: source.createdAt };
		})
	);
	const storedSlugs = new Set(stored.map((k) => k.name.slice(POST.length)));
	const seeds = seedSources
		.filter((s) => !storedSlugs.has(s.slug) && !goneSlugs.has(s.slug))
		.map((s) => ({ slug: s.slug, seq: s.seq!, date: s.createdAt }));
	return [...entries.filter((e): e is Entry => !!e), ...seeds].sort((a, b) => a.seq - b.seq);
}

export async function getSource(kv: App.KV | undefined, slug: string): Promise<PostSource | null> {
	const stored = kv ? ((await kv.get(key(slug), 'json')) as PostSource | null) : null;
	if (stored) return stored;
	const seed = seedBySlug.get(slug);
	if (!seed || (kv && (await kv.get(`${GONE}${slug}`)))) return null;
	return seed;
}

/** Posts in publication order and numbered as such; with `newest`, only that many of the latest are read. */
export async function loadPosts(newest?: number) {
	const entries = await listEntries();
	const from = newest ? Math.max(0, entries.length - newest) : 0;
	const kv = (await bindings()).POSTS;
	const sources = await Promise.all(entries.slice(from).map((entry) => getSource(kv, entry.slug)));
	return buildPosts(sources.filter((s): s is PostSource => !!s), from + 1);
}

export async function saveSource(kv: App.KV, source: PostSource) {
	const seq = source.seq ?? Date.now();
	await kv.put(key(source.slug), JSON.stringify({ ...source, seq }), { metadata: { seq, date: source.createdAt } satisfies Meta });
	// A slug reused after its file post was deleted shows again.
	await kv.delete(`${GONE}${source.slug}`);
}

/** Hides the post first, so a request cut off halfway never leaves a visible post with missing photos. */
export async function deleteSource(kv: App.KV, slug: string) {
	const source = await getSource(kv, slug);
	if (seedBySlug.has(slug)) await kv.put(`${GONE}${slug}`, '1');
	await kv.delete(key(slug));
	await deletePhotos(photoKeys(source));
}

export function photoKeys(source: PostSource | null) {
	return (source?.content?.blocks ?? []).flatMap((block) => (block.type === 'photos' ? block.photos.map((photo) => photo.key) : []));
}

export async function deletePhotos(keys: string[]) {
	const photos = (await bindings()).PHOTOS;
	await Promise.all(keys.map((photoKey) => photos?.delete(photoKey)));
}
