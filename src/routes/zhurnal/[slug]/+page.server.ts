import { error } from '@sveltejs/kit';
import { loadPosts } from '#lib/server/post-store.js';
import { newYearGreeting } from '#lib/season.js';
import type { PageServerLoad } from './$types';

export const load = (async ({ params }) => {
	const posts = await loadPosts();
	const index = posts.findIndex((post) => post.slug === params.slug);
	if (index < 0) error(404, 'Такой записи нет');
	return {
		post: posts[index],
		next: posts.length > 1 ? posts[(index + 1) % posts.length] : null,
		greeting: newYearGreeting(new Date())
	};
}) satisfies PageServerLoad;
