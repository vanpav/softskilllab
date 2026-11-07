// Run with `pnpm test`. Covers the logic that breaks quietly: reading a post's layout from its text, the line-break
// rules, and the admin session cookie.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { parsePost, toContent } from './posts.ts';
import { validSession, sessionValue } from './server/admin-auth.ts';
import { nbsp } from './typography.ts';

const NB = ' ';
const file = (name: string) => readFileSync(new URL(`../posts/${name}`, import.meta.url), 'utf8').replace(/^---[\s\S]*?---\n/, '');

test('a pasted post is laid out by the text rules', () => {
	const post = parsePost({ slug: 'gubki', title: 'Губки', text: file('01-gubki-dlya-posudy.md') }, 1);
	assert.equal(post.quote, `Ты чего с${NB}ребенком сделала? Он${NB}посуду мыть собрался!`);
	assert.deepEqual(
		post.blocks.map((b) => b.type),
		['lead', 'p', 'p', 'h', 'p', 'p', 'p', 'note']
	);
	const note = post.blocks.at(-1)!;
	assert.ok(note.type === 'note' && note.title.startsWith('Полезный вывод') && note.paragraphs.length === 2);
	assert.equal(post.doodle, 'sponge');
	assert.ok(!/\p{Extended_Pictographic}/u.test(JSON.stringify(post)), 'emoji are dropped');
});

test('a «Главный вывод» paragraph becomes its own note and the post goes on after it', () => {
	const { blocks } = toContent({ text: file('02-lichnye-granitsy.md') });
	assert.deepEqual(
		blocks.map((b) => b.type),
		['p', 'p', 'p', 'p', 'note', 'p']
	);
});

test('short words, numbers and dashes do not break a line', () => {
	assert.equal(nbsp('и в группе до 6 детей — повод'), `и${NB}в${NB}группе до${NB}6${NB}детей${NB}— повод`);
	assert.equal(nbsp('+972 53-378-9931'), '+972 53-378-9931', 'a phone number is left alone');
});

test('a session cookie only works with the password that signed it, until it expires', async () => {
	const value = await sessionValue('right', Date.now() + 60_000);
	assert.equal(await validSession('right', value), true);
	assert.equal(await validSession('wrong', value), false);
	assert.equal(await validSession('right', value.replace(/.$/, (c) => (c === 'A' ? 'B' : 'A'))), false);
	assert.equal(await validSession('right', value, Date.now() + 120_000), false);
	assert.equal(await validSession(null, value), false);
});
