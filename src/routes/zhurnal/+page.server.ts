import { buildPosts } from '#lib/posts.js';
import { loadSources } from '#lib/server/post-store.js';
import type { PageServerLoad } from './$types';

export const load = (async () => ({
	posts: buildPosts(await loadSources()).reverse()
})) satisfies PageServerLoad;
