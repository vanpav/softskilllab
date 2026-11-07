import { photos } from '#lib/content.js';
import { buildPosts } from '#lib/posts.js';
import { loadSources } from '#lib/server/post-store.js';
import { monthInAkko, newYearGreeting } from '#lib/season.js';
import type { PageServerLoad } from './$types';

// Decided on the server so the first paint and hydration agree, with no swap on load.
export const load = (async ({ url }) => {
	// `?date=2027-01-01T12:00:00Z` previews another day in `pnpm dev` only.
	const preview = import.meta.env.DEV ? url.searchParams.get('date') : null;
	const now = preview ? new Date(preview) : new Date();
	return {
		heroPhoto: Math.floor(Math.random() * photos.length),
		month: monthInAkko(now),
		greeting: newYearGreeting(now),
		posts: buildPosts(await loadSources()).reverse()
	};
}) satisfies PageServerLoad;
