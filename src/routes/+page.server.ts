import { LOOKS } from '#lib/anya-looks.js';
import { photos } from '#lib/content.js';
import { loadPosts } from '#lib/server/post-store.js';
import { monthInAkko, newYearGreeting } from '#lib/season.js';
import type { PageServerLoad } from './$types';

// Decided on the server so the first paint and hydration agree, with no swap on load.
export const load = (async ({ url }) => {
	// `?date=2027-01-01T12:00:00Z` previews another day in `pnpm dev` only.
	const preview = import.meta.env.DEV ? url.searchParams.get('date') : null;
	const now = preview ? new Date(preview) : new Date();
	return {
		heroPhoto: Math.floor(Math.random() * photos.length),
		// What gets drawn on Аня's portrait; `?anya=3` picks a set in `pnpm dev`.
		anyaLook: (import.meta.env.DEV && url.searchParams.has('anya') ? Number(url.searchParams.get('anya')) : Math.floor(Math.random() * LOOKS.length)) % LOOKS.length,
		month: monthInAkko(now),
		greeting: newYearGreeting(now),
		// One more than the three cards, so the section knows whether to offer «все записи».
		posts: (await loadPosts(4)).reverse()
	};
}) satisfies PageServerLoad;
