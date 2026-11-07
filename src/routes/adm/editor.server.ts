import { fail, redirect, type RequestEvent } from '@sveltejs/kit';
import { doodleNames } from '#lib/doodles.js';
import { contentToText, noteColors, slugify, type ContentBlock, type NoteColor, type Photo, type PostContent, type PostSource } from '#lib/posts.js';
import { requireAdmin } from '#lib/server/admin-auth.js';
import { deletePhotos, getSource, photoKeys, requireKv, saveSource } from '#lib/server/post-store.js';

const str = (value: unknown, max: number) => (typeof value === 'string' ? value.slice(0, max) : null);

/** Checks the editor's JSON: only the known block types and strings of sane length get through. */
function readContent(raw: string): PostContent | null {
	try {
		const data = JSON.parse(raw);
		if (!data || !Array.isArray(data.blocks) || data.blocks.length > 300) return null;
		const blocks: ContentBlock[] = [];
		for (const block of data.blocks) {
			if (block?.type === 'photos') {
				if (!Array.isArray(block.photos) || block.photos.length > 30) return null;
				const photos: Photo[] = [];
				for (const photo of block.photos) {
					if (typeof photo?.key !== 'string' || !/^[a-z0-9]+-[a-f0-9]{8}\.(webp|jpg|png)$/.test(photo.key)) return null;
					const size = (n: unknown) => (typeof n === 'number' && n > 0 && n < 20000 ? Math.round(n) : 1000);
					photos.push({ key: photo.key, width: size(photo.width), height: size(photo.height), caption: str(photo.caption, 200) ?? '' });
				}
				blocks.push({ type: 'photos', photos });
				continue;
			}
			const text = str(block?.text, 20000);
			if (text === null) return null;
			if (block.type === 'note') {
				const color = noteColors.includes(block.color) ? (block.color as NoteColor) : undefined;
				blocks.push({ type: 'note', title: str(block.title, 200) ?? '', text, color });
			}
			else if (block.type === 'p' || block.type === 'h') blocks.push({ type: block.type, text });
			else return null;
		}
		return { quote: str(data.quote, 500) || null, blocks };
	} catch {
		return null;
	}
}

/** Shared by /adm/new and /adm/edit/[slug]. An edited post keeps its address, so links already shared still work. */
export async function savePost(event: RequestEvent, existingSlug: string | null) {
	await requireAdmin(event);
	const kv = await requireKv();
	const form = await event.request.formData();
	const title = String(form.get('title') ?? '').trim();
	const doodle = String(form.get('doodle') ?? '');
	const rawDate = String(form.get('date') ?? '');
	// Only a real calendar day; anything else, or nothing, means the post has no date.
	const date = /^\d{4}-\d{2}-\d{2}$/.test(rawDate) && !Number.isNaN(Date.parse(rawDate)) ? rawDate : undefined;
	const content = readContent(String(form.get('content') ?? ''));
	const text = content ? contentToText(content) : '';
	// Sent back on an error, so the editor reopens with what Аня had typed.
	const values = { source: { title, text, doodle, content: content ?? undefined, createdAt: date } };
	if (!content) return fail(400, { ...values, error: 'Не получилось прочитать запись. Обновите страницу и попробуйте ещё раз.' });
	if (!title) return fail(400, { ...values, error: 'Напишите название записи.' });
	if (!text.trim() && !content.blocks.some((b) => b.type === 'photos')) return fail(400, { ...values, error: 'Запись пустая.' });

	let slug = existingSlug;
	const previous = slug ? await getSource(kv, slug) : null;
	if (slug) {
		if (!previous) return fail(404, { ...values, error: 'Эта запись уже удалена.' });
	} else {
		const base = slugify(title);
		slug = base;
		for (let n = 2; await getSource(kv, slug); n++) slug = `${base}-${n}`;
	}

	const source: PostSource = {
		slug,
		title,
		text,
		content,
		doodle: (doodleNames as readonly string[]).includes(doodle) ? (doodle as PostSource['doodle']) : '',
		createdAt: date,
		// An edit keeps its place in the journal; a new post goes last.
		seq: previous?.seq
	};
	await saveSource(kv, source);
	// Photos taken out of the post in this edit are no longer used anywhere.
	const kept = new Set(photoKeys(source));
	await deletePhotos(photoKeys(previous).filter((photoKey) => !kept.has(photoKey)));
	redirect(303, `/adm?saved=${encodeURIComponent(slug)}`);
}
