import { SITE_URL } from '#lib/content.js';
import { buildPosts } from '#lib/posts.js';
import { loadSources } from '#lib/server/post-store.js';
import type { RequestHandler } from './$types';

/** Built per request from the post store, so a post Аня publishes is listed at once. */
export const GET: RequestHandler = async () => {
	const posts = buildPosts(await loadSources());
	const pages = [
		{ path: '/', lastmod: null },
		{ path: '/zhurnal', lastmod: posts.map((p) => p.date).filter(Boolean).sort().at(-1) ?? null },
		...posts.map((post) => ({ path: `/zhurnal/${post.slug}`, lastmod: post.date })),
		{ path: '/legal', lastmod: null }
	];
	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
	.map(({ path, lastmod }) => `\t<url><loc>${new URL(path, SITE_URL).href}</loc>${lastmod ? `<lastmod>${lastmod.slice(0, 10)}</lastmod>` : ''}</url>`)
	.join('\n')}
</urlset>
`;
	return new Response(body, { headers: { 'content-type': 'application/xml; charset=utf-8', 'cache-control': 'public, max-age=3600' } });
};
