import { doodleNames, type DoodleName } from './doodles.js';
import { nbsp } from './typography.js';

/**
 * Lab journal posts. A post is stored as Аня wrote it (title + plain text); the layout is read from the text:
 * - a paragraph that is only a «quote» becomes the large handwritten epigraph;
 * - the first ordinary paragraph after it becomes the lead;
 * - a short first line ending in «?» or «:» becomes a subheading;
 * - a subheading with «вывод» opens a sticky note that takes the rest of the post, and a paragraph that starts
 *   with «Главный вывод» becomes a sticky note on its own;
 * - emoji are dropped, and lines broken mid-sentence are joined.
 * Pure: runs on the server for the public pages and in the browser for the editor's preview.
 */

export type PostSource = {
	slug: string;
	title: string;
	text: string;
	/** Picked from the text when empty. */
	doodle?: DoodleName | '';
	createdAt?: string;
	/** Publication order: the file's place for posts from src/posts, the save time for posts from /adm. */
	seq?: number;
	/** Set by the visual editor: the layout exactly as Аня arranged it. Without it, the layout is read from `text`. */
	content?: PostContent;
};

/** What the visual editor edits. The first paragraph is shown as the lead; a note's paragraphs are its text's lines. */
export const noteColors = ['yellow', 'pink', 'green'] as const;
export type NoteColor = (typeof noteColors)[number];
/** A photo uploaded in the editor, served at /foto/<key>; width and height keep its space before it loads. */
export type Photo = { key: string; width: number; height: number; caption: string };
export type ContentBlock =
	| { type: 'p' | 'h'; text: string }
	| { type: 'note'; title: string; text: string; color?: NoteColor }
	| { type: 'photos'; photos: Photo[] };
export type PostContent = { quote: string | null; blocks: ContentBlock[] };

export type Block =
	| { type: 'lead' | 'p' | 'h'; text: string }
	| { type: 'note'; title: string; paragraphs: string[]; color?: NoteColor }
	| { type: 'photos'; photos: Photo[] };

export type Post = {
	slug: string;
	number: number;
	title: string;
	quote: string | null;
	doodle: DoodleName;
	minutes: number;
	description: string;
	/** ISO date the post was published, when known. */
	date: string | null;
	/** First photo of the post, for link previews. */
	cover: string | null;
	blocks: Block[];
};

const DOODLES: [RegExp, DoodleName][] = [
	[/губк/i, 'sponge'],
	[/границ/i, 'boundary'],
	[/башн|строи|конструкт/i, 'tower'],
	[/карт|цел[ьи]/i, 'compass'],
	[/цепоч|голдберг/i, 'chain'],
	[/колб|опыт|эксперимент/i, 'flask']
];
const FALLBACK: DoodleName[] = ['flask', 'splash', 'compass', 'tower', 'chain', 'dish'];

const clean = (text: string) =>
	text
		.replace(/\r\n?/g, '\n')
		.replace(/[\p{Extended_Pictographic}\u{FE0F}\u{200D}]/gu, '')
		.replace(/[ \t]+$/gm, '')
		.replace(/[ \t]{2,}/g, ' ')
		.replace(/\s+»/g, '»');

const isHeading = (line: string) => line.length <= 70 && /[?:]$/.test(line);
const isQuote = (text: string) => /^«[^»]+»[.!?…]*$/.test(text);

/** Reads the layout from plain text by the rules in the header comment. */
function readText(text: string) {
	const body = clean(text).trim();
	let quote: string | null = null;
	const blocks: Block[] = [];
	let note: Extract<Block, { type: 'note' }> | null = null;

	for (const paragraph of body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)) {
		const lines = paragraph.split('\n').map((line) => line.trim()).filter(Boolean);
		let heading: string | null = null;
		if (isHeading(lines[0])) heading = lines.shift()!;
		// Inside a note a single line break starts a new paragraph; elsewhere it is a wrapped sentence.
		const text = lines.join(' ');

		if (!quote && !blocks.length && !heading && isQuote(text)) {
			quote = text.replace(/[.!?…]+$/, '').replace(/^«|»$/g, '');
			continue;
		}
		if (heading && /вывод/i.test(heading)) {
			note = { type: 'note', title: heading.replace(/:$/, ''), paragraphs: lines };
			blocks.push(note);
			continue;
		}
		if (note) {
			note.paragraphs.push(...lines);
			continue;
		}
		if (heading) blocks.push({ type: 'h', text: heading });
		if (!text) continue;
		if (/^(главный|полезный|наш)?\s*вывод/i.test(text)) {
			blocks.push({ type: 'note', title: 'Главное', paragraphs: [text] });
			continue;
		}
		blocks.push({ type: blocks.some((b) => b.type === 'lead') ? 'p' : 'lead', text });
	}
	return { quote, blocks };
}

function fromContent(content: PostContent) {
	const blocks: Block[] = [];
	for (const block of content.blocks) {
		if (block.type === 'photos') {
			if (block.photos.length) blocks.push({ type: 'photos', photos: block.photos.map((photo) => ({ ...photo, caption: clean(photo.caption).trim() })) });
			continue;
		}
		const text = clean(block.text).trim();
		if (block.type === 'note') {
			const paragraphs = text.split('\n').map((line) => line.trim()).filter(Boolean);
			if (paragraphs.length || block.title.trim())
				blocks.push({ type: 'note', title: clean(block.title).trim() || 'Главное', paragraphs, color: block.color });
		} else if (text) {
			blocks.push({ type: block.type === 'h' ? 'h' : blocks.some((b) => b.type === 'lead') ? 'p' : 'lead', text: text.replace(/\s*\n\s*/g, ' ') });
		}
	}
	const quote = content.quote ? clean(content.quote).trim().replace(/^«|»$/g, '') : '';
	return { quote: quote || null, blocks };
}

const blockText = (block: Block) =>
	'text' in block ? block.text : block.type === 'photos' ? '' : `${block.title} ${block.paragraphs.join(' ')}`;

/** Line-break typesetting for what the page shows; the stored text and the editor keep plain spaces. */
function typeset(block: Block): Block {
	if (block.type === 'note') return { ...block, title: nbsp(block.title), paragraphs: block.paragraphs.map(nbsp) };
	if (block.type === 'photos') return { ...block, photos: block.photos.map((photo) => ({ ...photo, caption: nbsp(photo.caption) })) };
	return { ...block, text: nbsp(block.text) };
}

export function parsePost(source: PostSource, number: number): Post {
	const { quote, blocks } = source.content ? fromContent(source.content) : readText(source.text);
	const body = [quote ?? '', ...blocks.map(blockText)].join(' ');

	const lead = blocks.find((b) => b.type === 'lead');
	// The lead usually answers the quote («Именно такое сообщение…»), so on its own it makes no sense in search results.
	const summary = [quote && `«${quote}».`, lead && 'text' in lead ? lead.text : ''].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();
	const lower = `${source.title} ${body}`.toLowerCase();
	return {
		slug: source.slug,
		number,
		title: nbsp(source.title.trim() || quote || 'Запись из лаборатории'),
		quote: quote && nbsp(quote),
		doodle:
			(source.doodle && doodleNames.includes(source.doodle) ? source.doodle : undefined) ??
			DOODLES.find(([pattern]) => pattern.test(lower))?.[1] ??
			FALLBACK[(number - 1) % FALLBACK.length],
		minutes: Math.max(1, Math.round(body.split(/\s+/).length / 170)),
		description: nbsp(summary.length > 160 ? `${summary.slice(0, 157).replace(/\s+\S*$/, '')}…` : summary),
		date: source.createdAt ?? null,
		cover: blocks.flatMap((b) => (b.type === 'photos' ? b.photos : [])).map((photo) => `/foto/${photo.key}`)[0] ?? null,
		blocks: blocks.map(typeset)
	};
}

/** The editor's starting point: the stored layout, or the one read from the text. */
export function toContent(source: Pick<PostSource, 'text' | 'content'>): PostContent {
	if (source.content) return source.content;
	const { quote, blocks } = readText(source.text);
	return {
		quote,
		blocks: blocks.map((block): ContentBlock => {
			if (block.type === 'note') return { type: 'note', title: block.title, text: block.paragraphs.join('\n'), color: block.color };
			if (block.type === 'photos') return block;
			return { type: block.type === 'h' ? 'h' : 'p', text: block.text };
		})
	};
}

/** Plain text of a layout, kept beside it as a readable copy; reading it back gives the same layout in most cases. */
export function contentToText({ quote, blocks }: PostContent) {
	const parts = quote ? [`«${quote}»`] : [];
	for (const block of blocks) {
		if (block.type === 'note') parts.push(`${/вывод/i.test(block.title) ? block.title : 'Главный вывод'}:\n${block.text}`);
		else if (block.type !== 'photos') parts.push(block.text);
	}
	return parts.join('\n\n');
}

/** Today as YYYY-MM-DD in Akko, the default date of a new post. */
export const todayInAkko = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jerusalem' }).format(new Date());

/** «7 ноября 2026», in Akko time. */
export const formatDate = (iso: string) =>
	new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Jerusalem' }).format(new Date(iso)).replace(/\s*г\.$/, '');

/** Sources in publication order, oldest first; numbers follow that order, starting at `first`. */
export const buildPosts = (sources: PostSource[], first = 1) => sources.map((source, i) => parsePost(source, first + i));

const RU: Record<string, string> = {
	а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm',
	н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'kh', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'shch',
	ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya'
};

/** A Latin address for a post title: «Карта личных границ» → karta-lichnykh-granits. */
export function slugify(title: string) {
	return (
		[...title.toLowerCase()]
			.map((ch) => RU[ch] ?? ch)
			.join('')
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-+|-+$/g, '')
			.slice(0, 60)
			.replace(/-+$/, '') || 'zapis'
	);
}
