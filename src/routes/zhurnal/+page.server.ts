import { buildPosts } from '#lib/posts.js';
import { loadSources } from '#lib/server/post-store.js';
import { newYearGreeting } from '#lib/season.js';
import type { PageServerLoad } from './$types';

export const load = (async () => ({
	posts: buildPosts(await loadSources()).reverse(),
	// Same season as the home page: snow in the New Year weeks, the margin game the rest of the year.
	greeting: newYearGreeting(new Date())
})) satisfies PageServerLoad;
