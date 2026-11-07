import { fail, redirect } from '@sveltejs/kit';
import { checkPassword, isSignedIn, passwordOf, startSession } from '#lib/server/admin-auth.js';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ cookies }) => {
	if (await isSignedIn(cookies)) redirect(303, '/adm');
	return { configured: !!(await passwordOf()) };
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request, cookies }) => {
		const password = String((await request.formData()).get('password') ?? '');
		if (!(await checkPassword(password))) {
			// Slows down guessing without any state to keep.
			await new Promise((resolve) => setTimeout(resolve, 800));
			return fail(400, { wrong: true });
		}
		await startSession(cookies);
		redirect(303, '/adm');
	}
} satisfies Actions;
