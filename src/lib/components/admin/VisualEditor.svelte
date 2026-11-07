<script lang="ts">
	import { tick } from 'svelte';
	import { beforeNavigate } from '$app/navigation';
	import Doodle from '#lib/components/journal/Doodle.svelte';
	import '#lib/components/journal/post-sheet.css';
	import { Button } from '#lib/components/ui/button/index.js';
	import { doodleNames, type DoodleName } from '#lib/doodles.js';
	import { noteColors, parsePost, todayInAkko, toContent, type ContentBlock, type NoteColor, type Photo, type PostContent } from '#lib/posts.js';

	let {
		source,
		number,
		photos: canUpload = true,
		error,
		submitLabel
	}: {
		source: { title: string; text: string; doodle?: string; content?: PostContent; createdAt?: string };
		number: number;
		/** False while the PHOTOS bucket isn't bound; photo buttons are hidden then. */
		photos?: boolean;
		error?: string;
		submitLabel: string;
	} = $props();

	type Kind = ContentBlock['type'];
	/** A photo in the editor; `preview` shows the local file while it uploads, and `key` is empty until it has. */
	type EditPhoto = Photo & { id: number; preview?: string };
	type EditBlock = { id: number; type: Kind; text: string; title: string; color?: NoteColor; photos: EditPhoto[] };

	const LABELS: Record<DoodleName, string> = {
		flask: 'колба',
		splash: 'всплеск',
		tower: 'башня',
		compass: 'компас',
		chain: 'цепочка',
		dish: 'миска',
		sponge: 'губка',
		boundary: 'границы'
	};
	const KINDS: [Exclude<Kind, 'photos'>, string][] = [
		['p', 'абзац'],
		['h', 'подзаголовок'],
		['note', 'стикер']
	];
	const NOTES = ['yellow', 'pink', 'green'] as const;
	const COLOR_LABELS: Record<NoteColor, string> = { yellow: 'жёлтый', pink: 'розовый', green: 'зелёный' };

	let nextId = 0;
	const toEdit = (block: ContentBlock): EditBlock => ({
		id: nextId++,
		type: block.type,
		text: block.type === 'photos' ? '' : block.text,
		title: block.type === 'note' ? block.title : '',
		color: block.type === 'note' ? block.color : undefined,
		photos: block.type === 'photos' ? block.photos.map((photo) => ({ ...photo, id: nextId++ })) : []
	});
	const blank = (type: Kind = 'p'): EditBlock => ({ id: nextId++, type, text: '', title: type === 'note' ? 'Полезный вывод' : '', photos: [] });

	// svelte-ignore state_referenced_locally
	const initial = toContent({ text: source.text, content: source.content });
	// svelte-ignore state_referenced_locally
	let title = $state(source.title);
	let quote = $state(initial.quote ?? '');
	let blocks = $state<EditBlock[]>(initial.blocks.length ? initial.blocks.map(toEdit) : [blank()]);
	// svelte-ignore state_referenced_locally
	let doodle = $state(source.doodle ?? '');
	// Publication date, YYYY-MM-DD; empty means the post shows no date.
	// svelte-ignore state_referenced_locally
	let date = $state(source.createdAt?.slice(0, 10) ?? '');
	let picking = $state(false);
	let submitting = $state(false);
	let uploadError = $state('');
	const uploading = $derived(blocks.some((b) => b.photos.some((p) => !p.key)));
	let fileInput = $state<HTMLInputElement>();
	let uploadTarget: EditBlock | null = null;

	const content = $derived<PostContent>({
		quote: quote.trim() || null,
		blocks: blocks.map((b): ContentBlock => {
			if (b.type === 'note') return { type: 'note', title: b.title, text: b.text, color: b.color };
			if (b.type === 'photos')
				return { type: 'photos', photos: b.photos.filter((p) => p.key).map(({ key, width, height, caption }) => ({ key, width, height, caption })) };
			return { type: b.type, text: b.text };
		})
	});
	const post = $derived(parsePost({ slug: 'preview', title, text: '', doodle: doodle as DoodleName | '', content }, number));
	const leadId = $derived(blocks.find((b) => b.type === 'p' && b.text.trim())?.id);
	const note = $derived(NOTES[(number - 1) % NOTES.length]);
	const snapshot = () => JSON.stringify([title, doodle, date, content]);
	const saved = snapshot();
	const dirty = $derived(snapshot() !== saved);

	beforeNavigate(({ cancel, type }) => {
		if (dirty && !submitting && type !== 'form' && !confirm('Уйти без сохранения? Изменения пропадут.')) cancel();
	});
	$effect(() => {
		const warn = (event: BeforeUnloadEvent) => {
			if (dirty && !submitting) event.preventDefault();
		};
		addEventListener('beforeunload', warn);
		return () => removeEventListener('beforeunload', warn);
	});

	// Caret helpers for the plain-text editable fields.
	function caretOffset(el: HTMLElement) {
		const selection = getSelection();
		if (!selection?.rangeCount) return 0;
		const before = document.createRange();
		before.selectNodeContents(el);
		const range = selection.getRangeAt(0);
		before.setEnd(range.startContainer, range.startOffset);
		return before.toString().length;
	}
	function placeCaret(el: HTMLElement, offset: number) {
		el.focus();
		const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
		let left = offset;
		let node: Node | null;
		const range = document.createRange();
		while ((node = walker.nextNode())) {
			const length = node.textContent?.length ?? 0;
			if (left <= length) {
				range.setStart(node, left);
				range.collapse(true);
				getSelection()?.removeAllRanges();
				getSelection()?.addRange(range);
				return;
			}
			left -= length;
		}
		range.selectNodeContents(el);
		range.collapse(false);
		getSelection()?.removeAllRanges();
		getSelection()?.addRange(range);
	}
	async function focusBlock(id: number, offset: number | 'end' = 0) {
		await tick();
		const el = document.querySelector<HTMLElement>(`[data-block="${id}"] [data-field="text"]`);
		if (el) placeCaret(el, offset === 'end' ? Infinity : offset);
	}

	function insertAfter(index: number, ...items: EditBlock[]) {
		blocks.splice(index + 1, 0, ...items);
	}
	function add(type: Kind) {
		const block = blank(type);
		const last = blocks.at(-1);
		// An empty paragraph at the end is turned into the new block instead of leaving a gap.
		if (last && last.type === 'p' && !last.text.trim()) blocks[blocks.length - 1] = { ...block, text: '' };
		else blocks.push(block);
		focusBlock(blocks.at(-1)!.id);
	}
	function setKind(block: EditBlock, type: Kind) {
		block.type = type;
		if (type === 'note' && !block.title) block.title = 'Полезный вывод';
		focusBlock(block.id, 'end');
	}
	function move(index: number, by: -1 | 1) {
		const target = index + by;
		if (target < 0 || target >= blocks.length) return;
		const [block] = blocks.splice(index, 1);
		blocks.splice(target, 0, block);
		focusBlock(block.id, 'end');
	}
	function remove(index: number) {
		const [gone] = blocks.splice(index, 1);
		if (!blocks.length) blocks.push(blank());
		const neighbour = blocks[Math.max(0, index - 1)];
		if (neighbour && gone) focusBlock(neighbour.id, 'end');
	}

	function pickPhotos(target: EditBlock | null) {
		uploadTarget = target;
		fileInput?.click();
	}

	/** Shrinks a phone photo to at most 1800px on the long side before it leaves the browser. */
	async function shrink(file: File) {
		const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
		const scale = Math.min(1, 1800 / Math.max(bitmap.width, bitmap.height));
		const canvas = document.createElement('canvas');
		canvas.width = Math.round(bitmap.width * scale);
		canvas.height = Math.round(bitmap.height * scale);
		canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
		bitmap.close();
		const encode = (type: string) => new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, 0.82));
		// Browsers that can't write WebP hand back PNG instead; JPEG is far smaller for photos.
		let blob = await encode('image/webp');
		if (!blob || blob.type !== 'image/webp') blob = await encode('image/jpeg');
		if (!blob) throw new Error('encode');
		return { blob, width: canvas.width, height: canvas.height };
	}

	async function onFiles(event: Event) {
		const input = event.currentTarget as HTMLInputElement;
		const files = [...(input.files ?? [])].filter((file) => file.type.startsWith('image/'));
		input.value = '';
		if (!files.length) return;
		uploadError = '';
		let block = uploadTarget;
		if (!block) {
			block = blank('photos');
			const last = blocks.at(-1);
			if (last && last.type === 'p' && !last.text.trim()) blocks[blocks.length - 1] = block;
			else blocks.push(block);
			block = blocks.find((b) => b.id === block!.id)!;
		}
		const target = block;
		const entries = files.map((file) => ({ id: nextId++, key: '', width: 4, height: 3, caption: '', preview: URL.createObjectURL(file) }));
		target.photos.push(...entries);
		for (const [i, file] of files.entries()) {
			const id = entries[i].id;
			const photo = () => target.photos.find((p) => p.id === id);
			try {
				const { blob, width, height } = await shrink(file);
				const form = new FormData();
				form.append('photo', new File([blob], 'photo', { type: blob.type }));
				const response = await fetch('/adm/upload', { method: 'POST', body: form });
				if (!response.ok) throw new Error((await response.json().catch(() => null))?.message ?? 'upload');
				const { key } = await response.json();
				const current = photo();
				if (current) Object.assign(current, { key, width, height });
			} catch (problem) {
				target.photos = target.photos.filter((p) => p.id !== id);
				const reason = problem instanceof Error && problem.message.length > 12 ? problem.message : 'проверьте интернет и попробуйте ещё раз';
				uploadError = `Не получилось загрузить фото: ${reason}.`;
			}
		}
		if (!target.photos.length) blocks = blocks.filter((b) => b.id !== target.id);
	}

	function removePhoto(block: EditBlock, id: number) {
		block.photos = block.photos.filter((p) => p.id !== id);
		if (!block.photos.length) blocks = blocks.filter((b) => b.id !== block.id);
	}

	// Dragging by the grip: pointer events, so it works with a mouse and a finger alike. `over` is the gap the block
	// would land in, 0 before the first block to blocks.length after the last.
	let drag = $state<{ id: number; over: number } | null>(null);
	function gapAt(y: number) {
		const rows = [...document.querySelectorAll<HTMLElement>('.visual .block')];
		return rows.filter((row) => {
			const box = row.getBoundingClientRect();
			return box.top + box.height / 2 < y;
		}).length;
	}
	function dragStart(event: PointerEvent, block: EditBlock) {
		event.preventDefault();
		(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
		drag = { id: block.id, over: gapAt(event.clientY) };
	}
	function dragMove(event: PointerEvent) {
		if (!drag) return;
		drag.over = gapAt(event.clientY);
		// Scrolls while the block is held near the top or bottom of the window.
		if (event.clientY < 90) scrollBy(0, -14);
		else if (event.clientY > innerHeight - 90) scrollBy(0, 14);
	}
	function dragEnd() {
		if (!drag) return;
		const from = blocks.findIndex((b) => b.id === drag!.id);
		let to = drag.over;
		if (to > from) to--;
		if (from >= 0 && to !== from) {
			const [block] = blocks.splice(from, 1);
			blocks.splice(to, 0, block);
		}
		drag = null;
	}

	function onBlockKey(event: KeyboardEvent, index: number) {
		const block = blocks[index];
		const el = event.currentTarget as HTMLElement;
		// Inside a sticker, Enter starts its next paragraph as a new line, which is how its text is stored.
		if (event.key === 'Enter' && !event.shiftKey && block.type !== 'note') {
			event.preventDefault();
			const at = caretOffset(el);
			const after = block.text.slice(at).trimStart();
			block.text = block.text.slice(0, at).trimEnd();
			const next = blank('p');
			next.text = after;
			insertAfter(index, next);
			focusBlock(next.id);
		}
		if (event.key === 'Backspace' && caretOffset(el) === 0 && getSelection()?.isCollapsed && index > 0) {
			const previous = blocks[index - 1];
			if (!block.text) {
				event.preventDefault();
				blocks.splice(index, 1);
				focusBlock(previous.id, 'end');
			} else if (previous.type !== 'note' && block.type !== 'note') {
				event.preventDefault();
				const join = previous.text.length;
				previous.text = previous.text ? `${previous.text} ${block.text}` : block.text;
				blocks.splice(index, 1);
				focusBlock(previous.id, join ? join + 1 : 0);
			}
		}
	}

	// A whole post pasted at once is laid out by the same rules the site used for plain text.
	function onPaste(event: ClipboardEvent, index: number) {
		const text = event.clipboardData?.getData('text/plain') ?? '';
		if (!/\n\s*\n/.test(text) && !/^\s*«[^»]+»\s*$/.test(text)) return;
		event.preventDefault();
		const pasted = toContent({ text });
		if (pasted.quote && !quote.trim()) quote = pasted.quote;
		const items = pasted.blocks.map(toEdit);
		if (!items.length) return;
		const replace = !blocks[index].text.trim();
		blocks.splice(replace ? index : index + 1, replace ? 1 : 0, ...items);
		focusBlock(items.at(-1)!.id, 'end');
	}

	async function toQuote(event: KeyboardEvent, next: 'quote' | 'first') {
		if (event.key !== 'Enter') return;
		event.preventDefault();
		await tick();
		if (next === 'quote') document.querySelector<HTMLElement>('[data-field="quote"]')?.focus();
		else focusBlock(blocks[0].id);
	}
</script>

<form class="visual" method="POST" onsubmit={() => (submitting = true)}>
	<input type="hidden" name="title" value={title} />
	<input type="hidden" name="doodle" value={doodle} />
	<input type="hidden" name="date" value={date} />
	<input type="hidden" name="content" value={JSON.stringify(content)} />

	<p class="hint hand">Пишите прямо на странице. Можно вставить пост целиком, он сам разложится по блокам.</p>

	<article class="post-sheet editing">
		<span class="tape" aria-hidden="true"></span>
		<span class="ps-holes" aria-hidden="true"><span></span><span></span><span></span></span>

		<aside class="ps-margin">
			<span class="ps-no hand">№{number}</span>
			<div class="date-pick">
				<label>
					<span class="date-label">дата</span>
					<input type="date" bind:value={date} max={todayInAkko()} aria-label="Дата записи, необязательно" />
				</label>
				{#if date}
					<button type="button" class="date-clear" onclick={() => (date = '')}>убрать дату</button>
				{:else}
					<button type="button" class="date-clear" onclick={() => (date = todayInAkko())}>поставить сегодня</button>
				{/if}
			</div>
			<div class="doodle-pick">
				<button type="button" class="doodle-button" aria-expanded={picking} aria-label="Рисунок: {LABELS[post.doodle]}. Сменить" onclick={() => (picking = !picking)}>
					<Doodle name={post.doodle} class="ps-doodle" />
					<span class="change">сменить рисунок</span>
				</button>
				{#if picking}
					<div class="doodles" role="listbox" aria-label="Рисунок записи">
						<button type="button" role="option" aria-selected={!doodle} class:on={!doodle} onclick={() => ((doodle = ''), (picking = false))}>
							<span class="auto hand">сам</span>
							<small>по тексту</small>
						</button>
						{#each doodleNames as name (name)}
							<button type="button" role="option" aria-selected={doodle === name} class:on={doodle === name} onclick={() => ((doodle = name), (picking = false))}>
								<Doodle {name} />
								<small>{LABELS[name]}</small>
							</button>
						{/each}
					</div>
				{/if}
			</div>
			<span class="ps-time">{post.minutes} мин чтения</span>
		</aside>

		<div class="ps-text">
			<h1 class="ps-title editable" class:empty={!title} contenteditable="plaintext-only" bind:textContent={title} data-placeholder="Название записи" aria-label="Название" onkeydown={(e) => toQuote(e, 'quote')}></h1>

			<div class="ps-epigraph" class:faint={!quote.trim()}>
				<svg viewBox="0 0 90 60" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 8c10 30 34 42 72 38M64 34l13 12-15 9" /></svg>
				<p class="ps-quote hand quote-field">
					<span aria-hidden="true">«</span><span class="editable" class:empty={!quote} contenteditable="plaintext-only" role="textbox" tabindex="0" bind:textContent={quote} data-field="quote" data-placeholder="фраза, с которой всё началось" aria-label="Цитата, необязательно" onkeydown={(e) => toQuote(e, 'first')}></span><span aria-hidden="true">»</span>
				</p>
			</div>

			{#each blocks as block, i (block.id)}
				<div class="block" data-block={block.id} class:dragging={drag?.id === block.id} class:drop-before={drag && drag.over === i} class:drop-after={drag && drag.over === blocks.length && i === blocks.length - 1}>
					<button
						type="button"
						class="grip"
						aria-label="Перетащить блок. Или кнопки «выше» и «ниже» на панели блока"
						onpointerdown={(e) => dragStart(e, block)}
						onpointermove={dragMove}
						onpointerup={dragEnd}
						onpointercancel={() => (drag = null)}
					>
						<svg viewBox="0 0 12 20" aria-hidden="true"><circle cx="3" cy="4" r="1.6" /><circle cx="9" cy="4" r="1.6" /><circle cx="3" cy="10" r="1.6" /><circle cx="9" cy="10" r="1.6" /><circle cx="3" cy="16" r="1.6" /><circle cx="9" cy="16" r="1.6" /></svg>
					</button>
					<div class="tools" role="toolbar" aria-label="Блок {i + 1}">
						{#if block.type === 'photos'}
							{#if canUpload}<button type="button" onpointerdown={(e) => e.preventDefault()} onclick={() => pickPhotos(block)}>ещё фото</button>{/if}
						{:else}
						{#each KINDS as [kind, label] (kind)}
							<button type="button" class:on={block.type === kind} aria-pressed={block.type === kind} onpointerdown={(e) => e.preventDefault()} onclick={() => setKind(block, kind)}>{label}</button>
						{/each}
						{/if}
						{#if block.type === 'note'}
							<span class="sep" aria-hidden="true"></span>
							{#each noteColors as color (color)}
								<button
									type="button"
									class="swatch swatch-{color}"
									class:picked={(block.color ?? note) === color}
									aria-label="Цвет стикера: {COLOR_LABELS[color]}"
									aria-pressed={(block.color ?? note) === color}
									onpointerdown={(e) => e.preventDefault()}
									onclick={() => (block.color = color)}
								></button>
							{/each}
						{/if}
						<span class="sep" aria-hidden="true"></span>
						<button type="button" aria-label="Выше" disabled={i === 0} onpointerdown={(e) => e.preventDefault()} onclick={() => move(i, -1)}>
							<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 15V5M5 9l5-5 5 5" /></svg>
						</button>
						<button type="button" aria-label="Ниже" disabled={i === blocks.length - 1} onpointerdown={(e) => e.preventDefault()} onclick={() => move(i, 1)}>
							<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 5v10M5 11l5 5 5-5" /></svg>
						</button>
						<button type="button" class="del" aria-label="Удалить блок" onpointerdown={(e) => e.preventDefault()} onclick={() => remove(i)}>
							<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15" /></svg>
						</button>
					</div>

					{#if block.type === 'photos'}
						<div class="ps-photos" class:ps-gallery={block.photos.length > 1} tabindex="-1">
							{#each block.photos as photo, j (photo.id)}
								<figure class="ps-print" class:loading={!photo.key} style:--tilt="{[-1.6, 1.2, -0.8, 1.8][j % 4]}deg">
									<img src={photo.preview ?? `/foto/${photo.key}`} alt="" width={photo.width} height={photo.height} />
									{#if !photo.key}<span class="loading-note hand">загружаю…</span>{/if}
									<button type="button" class="photo-del" aria-label="Убрать это фото" onclick={() => removePhoto(block, photo.id)}>
										<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15" /></svg>
									</button>
									<figcaption class="hand editable" class:empty={!photo.caption} contenteditable="plaintext-only" bind:textContent={photo.caption} data-placeholder="подпись, если нужна" aria-label="Подпись к фото"></figcaption>
								</figure>
							{/each}
						</div>
					{:else if block.type === 'note'}
						<aside class="ps-note note-{block.color ?? note}">
							<p class="ps-note-title hand editable" class:empty={!block.title} contenteditable="plaintext-only" bind:textContent={block.title} data-placeholder="Заголовок стикера" aria-label="Заголовок стикера"></p>
							<p class="ps-note-p editable note-body" class:empty={!block.text} contenteditable="plaintext-only" bind:textContent={block.text} data-field="text" data-placeholder="Что важно унести с собой. Enter начинает новый абзац." aria-label="Текст стикера" onkeydown={(e) => onBlockKey(e, i)} onpaste={(e) => onPaste(e, i)}></p>
						</aside>
					{:else if block.type === 'h'}
						<h2 class="ps-h editable" class:empty={!block.text} contenteditable="plaintext-only" bind:textContent={block.text} data-field="text" data-placeholder="Подзаголовок" aria-label="Подзаголовок" onkeydown={(e) => onBlockKey(e, i)} onpaste={(e) => onPaste(e, i)}></h2>
					{:else}
						<p class="{block.id === leadId ? 'ps-lead' : 'ps-p'} editable" class:empty={!block.text} contenteditable="plaintext-only" bind:textContent={block.text} data-field="text" data-placeholder={i === 0 ? 'Текст записи. Можно вставить пост целиком' : 'Абзац'} aria-label="Абзац" onkeydown={(e) => onBlockKey(e, i)} onpaste={(e) => onPaste(e, i)}></p>
					{/if}
				</div>
			{/each}

			<div class="add">
				<span class="hand">добавить:</span>
				<button type="button" class="hand" onclick={() => add('p')}>абзац</button>
				<button type="button" class="hand" onclick={() => add('h')}>подзаголовок</button>
				<button type="button" class="hand" onclick={() => add('note')}>стикер с выводом</button>
				{#if canUpload}<button type="button" class="hand" onclick={() => pickPhotos(null)}>фото</button>{/if}
				<input bind:this={fileInput} class="file" type="file" accept="image/*" multiple onchange={onFiles} tabindex="-1" aria-hidden="true" />
			</div>

			<div class="ps-sign"><small>Подпись</small><span class="hand">Аня</span></div>
		</div>
	</article>

	<div class="savebar">
		{#if error}<p class="error" role="alert">{error}</p>{/if}
		{#if uploadError}<p class="error" role="alert">{uploadError}</p>{/if}
		<Button variant="pen" size="pen" type="submit" disabled={submitting || uploading}>{submitting ? 'Сохраняю…' : uploading ? 'Загружаю фото…' : submitLabel}</Button>
		<a href="/adm">отмена</a>
		{#if dirty && !submitting}<span class="unsaved">есть несохранённые изменения</span>{/if}
	</div>
</form>

<style>
	.hint {
		font-size: 26px;
		max-width: 40em;
	}
	.editing {
		margin-bottom: 32px;
	}
	/* The sticky margin is its own stacking layer; lifting it keeps the doodle picker above the text column's grips. */
	.editing :global(.ps-margin) {
		z-index: 6;
	}
	/* Editable text keeps the page's look; only a faint pen line and the placeholders say it can be typed in. */
	.editable {
		outline: none;
		border-radius: 0;
		white-space: pre-wrap;
		cursor: text;
	}
	.editable:focus {
		box-shadow: 0 2px 0 0 color-mix(in srgb, var(--pen) 35%, transparent);
	}
	.editable.empty::before {
		content: attr(data-placeholder);
		color: var(--ink-2);
		opacity: 0.45;
		pointer-events: none;
	}
	/* Lighter than the site's focus ring: Аня types here for minutes at a time. */
	.editable:focus-visible {
		outline: 2px dashed color-mix(in srgb, var(--pen) 45%, transparent);
		outline-offset: 6px;
	}
	.faint {
		opacity: 0.55;
	}
	.faint:focus-within {
		opacity: 1;
	}
	.quote-field .editable {
		display: inline;
	}
	.block {
		position: relative;
	}
	.grip {
		position: absolute;
		left: -40px;
		top: 50%;
		margin-top: -20px;
		width: 28px;
		height: 40px;
		display: grid;
		place-items: center;
		border: 0;
		background: none;
		color: var(--ink-2);
		cursor: grab;
		touch-action: none;
		opacity: 0;
		transition: opacity 0.15s;
	}
	.grip svg {
		width: 12px;
		height: 20px;
		fill: currentColor;
	}
	.block:hover > .grip,
	.block:focus-within > .grip,
	.grip:focus-visible,
	.dragging > .grip {
		opacity: 1;
	}
	.grip:active {
		cursor: grabbing;
	}
	.dragging {
		opacity: 0.4;
	}
	/* Where the held block will land: a pen line drawn across the gap. */
	.drop-before::before,
	.drop-after::after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		height: 3px;
		background: var(--pen);
	}
	.drop-before::before {
		top: -12px;
	}
	.drop-after::after {
		bottom: -12px;
	}
	.swatch {
		width: 30px;
		padding: 0 !important;
		justify-content: center;
	}
	.swatch::before {
		content: '';
		width: 18px;
		height: 18px;
		box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.15);
	}
	.swatch-yellow::before {
		background: var(--sticky);
	}
	.swatch-pink::before {
		background: var(--sticky-pink);
	}
	.swatch-green::before {
		background: var(--sticky-green);
	}
	.swatch.picked::before {
		outline: 2px solid var(--marker);
		outline-offset: 2px;
	}
	.tools {
		position: absolute;
		z-index: 3;
		right: 0;
		top: -14px;
		transform: translateY(-100%);
		display: flex;
		align-items: center;
		gap: 2px;
		padding: 4px;
		background: var(--ink);
		box-shadow: 0 6px 14px rgba(20, 30, 80, 0.28);
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.15s;
	}
	.block:focus-within > .tools {
		opacity: 1;
		pointer-events: auto;
	}
	.tools button {
		display: inline-flex;
		align-items: center;
		height: 30px;
		padding: 0 10px;
		border: 0;
		background: none;
		color: var(--permit-text);
		font: inherit;
		font-size: 14px;
		font-weight: 600;
		cursor: pointer;
	}
	.tools button:hover:not(:disabled) {
		color: var(--sheet);
		text-decoration: underline wavy var(--marker);
		text-underline-offset: 5px;
	}
	.tools button.on {
		background: var(--marker);
		color: var(--ink);
	}
	.tools button:disabled {
		opacity: 0.35;
		cursor: default;
	}
	.tools svg {
		width: 18px;
		height: 18px;
		fill: none;
		stroke: currentColor;
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.tools .del:hover {
		color: #ff8fb8;
	}
	.sep {
		width: 1px;
		height: 18px;
		margin: 0 4px;
		background: rgba(255, 255, 255, 0.25);
	}
	.add {
		margin-top: 28px;
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 4px 18px;
		font-size: 24px;
		padding: 10px 14px;
		border: 2px dashed color-mix(in srgb, var(--ink-2) 50%, transparent);
	}
	.add span {
		color: var(--ink-2);
	}
	.add button {
		border: 0;
		background: none;
		padding: 0;
		font-size: inherit;
		color: var(--pen);
		cursor: pointer;
	}
	.add button:hover {
		text-decoration: underline wavy var(--pink-text);
		text-underline-offset: 5px;
	}
	.file {
		display: none;
	}
	.ps-photos:focus {
		outline: none;
	}
	.ps-print.loading img {
		opacity: 0.45;
	}
	.loading-note {
		position: absolute;
		top: 40%;
		left: 0;
		right: 0;
		text-align: center;
		font-size: 28px;
	}
	.photo-del {
		position: absolute;
		top: -12px;
		right: -12px;
		width: 30px;
		height: 30px;
		display: grid;
		place-items: center;
		border: 0;
		border-radius: 50%;
		background: var(--ink);
		color: var(--sheet);
		cursor: pointer;
		opacity: 0;
		transition: opacity 0.15s;
	}
	.ps-print:hover .photo-del,
	.ps-print:focus-within .photo-del,
	.photo-del:focus-visible {
		opacity: 1;
	}
	.photo-del svg {
		width: 16px;
		height: 16px;
		fill: none;
		stroke: currentColor;
		stroke-width: 2.4;
		stroke-linecap: round;
	}
	@media (hover: none) {
		.photo-del {
			opacity: 1;
		}
	}
	.doodle-pick {
		position: relative;
	}
	.date-pick {
		display: grid;
		justify-items: start;
		gap: 4px;
	}
	.date-pick label {
		display: grid;
		gap: 4px;
	}
	.date-label {
		font-size: 12px;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--ink-2);
	}
	/* A plain pen-blue date on the margin, not a boxed form field; specific enough to beat the /adm field style. */
	.date-pick input[type='date'] {
		width: auto;
		border: 0;
		border-bottom: 2px solid var(--ink);
		border-radius: 0;
		background: none;
		padding: 2px 0;
		font: inherit;
		font-size: 15px;
		font-weight: 600;
		color: var(--pen);
	}
	.date-clear {
		border: 0;
		background: none;
		padding: 0;
		font: inherit;
		font-size: 13px;
		color: var(--ink-2);
		cursor: pointer;
	}
	.date-clear:hover {
		color: var(--pen);
		text-decoration: underline wavy var(--pink-text);
		text-underline-offset: 4px;
	}
	.doodle-button {
		display: grid;
		justify-items: start;
		gap: 4px;
		border: 0;
		background: none;
		padding: 0;
		cursor: pointer;
	}
	.change {
		font-size: 13px;
		font-weight: 600;
		color: var(--pen);
	}
	.doodle-button:hover .change {
		text-decoration: underline wavy var(--pink-text);
		text-underline-offset: 4px;
	}
	.doodles {
		position: absolute;
		z-index: 4;
		top: 100%;
		left: 0;
		margin-top: 8px;
		display: grid;
		grid-template-columns: repeat(3, 76px);
		gap: 6px;
		padding: 10px;
		background: var(--sheet);
		box-shadow: 0 18px 34px rgba(20, 30, 80, 0.22);
	}
	.doodles button {
		display: grid;
		justify-items: center;
		gap: 2px;
		padding: 6px 4px;
		border: 2px solid transparent;
		background: none;
		color: var(--ink);
		cursor: pointer;
	}
	.doodles button :global(svg) {
		width: 44px;
		height: 44px;
	}
	.doodles button.on {
		border-color: var(--pen);
	}
	.doodles button:hover {
		background: color-mix(in srgb, var(--marker) 45%, transparent);
	}
	.doodles small {
		font-size: 12px;
		color: var(--ink-2);
	}
	.auto {
		font-size: 26px;
		line-height: 44px;
		color: var(--pen);
	}
	.savebar {
		position: sticky;
		bottom: 0;
		z-index: 5;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 12px 24px;
		padding: 14px 0;
		background: color-mix(in srgb, var(--paper) 92%, transparent);
		border-top: 2px solid var(--ink);
	}
	.savebar a {
		color: var(--pen);
		font-weight: 500;
	}
	.savebar a:hover {
		text-decoration: underline wavy var(--pink-text);
		text-underline-offset: 5px;
	}
	.unsaved {
		font-size: 14px;
		color: var(--ink-2);
	}
	.savebar .error {
		flex-basis: 100%;
	}
	@media (max-width: 900px) {
		.doodles {
			left: auto;
			right: 0;
		}
	}
	@media (max-width: 600px) {
		.grip {
			left: -34px;
			opacity: 0.6;
		}
		/* No room above a block on a phone: the panel opens under it, in the flow, while the block has focus. */
		.block {
			display: flex;
			flex-direction: column;
		}
		.tools {
			position: static;
			order: 2;
			transform: none;
			margin-top: 10px;
			flex-wrap: wrap;
			display: none;
		}
		.block:focus-within > .tools {
			display: flex;
		}
		.tools button {
			padding: 0 8px;
		}
	}
</style>
