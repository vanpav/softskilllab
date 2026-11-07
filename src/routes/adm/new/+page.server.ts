import { requireAdmin } from '#lib/server/admin-auth.js';
import { loadSources } from '#lib/server/post-store.js';
import { savePost } from '../editor.server.js';
import type { Actions, PageServerLoad } from './$types';

export const load = (async (event) => {
	await requireAdmin(event);
	return { source: { slug: '', title: '', text: '', doodle: '' }, number: (await loadSources()).length + 1 };
}) satisfies PageServerLoad;

export const actions = {
	default: (event) => savePost(event, null)
} satisfies Actions;
