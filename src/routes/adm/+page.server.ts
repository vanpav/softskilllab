import { fail, redirect } from '@sveltejs/kit';
import { endSession, requireAdmin } from '#lib/server/admin-auth.js';
import { deleteSource, loadPosts, requireKv } from '#lib/server/post-store.js';
import type { Actions, PageServerLoad } from './$types';

export const load = (async (event) => {
	await requireAdmin(event);
	return { posts: (await loadPosts()).reverse() };
}) satisfies PageServerLoad;

export const actions = {
	delete: async (event) => {
		await requireAdmin(event);
		const slug = String((await event.request.formData()).get('slug') ?? '');
		if (!slug) return fail(400);
		await deleteSource(await requireKv(), slug);
		return { deleted: true };
	},
	logout: async ({ cookies }) => {
		endSession(cookies);
		redirect(303, '/adm/login');
	}
} satisfies Actions;
