import { error } from '@sveltejs/kit';
import { requireAdmin } from '#lib/server/admin-auth.js';
import { getSource, loadSources, requireKv } from '#lib/server/post-store.js';
import { savePost } from '../../editor.server.js';
import type { Actions, PageServerLoad } from './$types';

export const load = (async (event) => {
	await requireAdmin(event);
	const source = await getSource((await requireKv()), event.params.slug);
	if (!source) error(404, 'Такой записи нет');
	const number = (await loadSources()).findIndex((s) => s.slug === source.slug) + 1;
	return { source, number };
}) satisfies PageServerLoad;

export const actions = {
	default: (event) => savePost(event, event.params.slug)
} satisfies Actions;
