import { error } from '@sveltejs/kit';
import { buildPosts } from '#lib/posts.js';
import { loadSources } from '#lib/server/post-store.js';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	const posts = buildPosts(await loadSources());
	const index = posts.findIndex((post) => post.slug === params.slug);
	if (index < 0) error(404, 'Такой записи нет');
	return { post: posts[index], next: posts.length > 1 ? posts[(index + 1) % posts.length] : null };
}) satisfies PageServerLoad;
