import { fail, redirect } from '@sveltejs/kit';
import { checkPassword, isSignedIn, passwordOf, startSession } from '#lib/server/admin-auth.js';
import { bindings } from '#lib/server/bindings.js';
import type { Actions, PageServerLoad } from './$types';

export const load = (async ({ cookies }) => {
	if (await isSignedIn(cookies)) redirect(303, '/adm');
	return { configured: !!(await passwordOf()) };
}) satisfies PageServerLoad;

export const actions = {
	default: async ({ request, cookies, getClientAddress }) => {
		// Counted per address before the password is even looked at, so guessing in parallel gets nowhere.
		const limiter = (await bindings()).LOGIN_LIMIT;
		if (limiter && !(await limiter.limit({ key: getClientAddress() })).success) return fail(429, { tooMany: true });
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
