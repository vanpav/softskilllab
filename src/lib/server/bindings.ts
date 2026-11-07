type Bindings = { POSTS?: App.KV; PHOTOS?: App.Bucket; ADMIN_PASSWORD?: string };

/**
 * Cloudflare bindings from `cloudflare:workers`. That module exists only inside workerd (production, and `pnpm dev`
 * when the adapter emulates the platform); a dev server that runs SSR in Node has none, and the site then shows the
 * posts from `src/posts/` and keeps /adm closed instead of failing. A dynamic import fails at the call, where it can
 * be caught; a static one would fail the whole module. Keep the specifier literal: Vite's workerd runner only
 * recognises the built-in that way.
 */
let cached: Promise<Bindings> | undefined;
export function bindings() {
	cached ??= import('cloudflare:workers').then((module) => (module.env ?? {}) as Bindings).catch(() => ({}));
	return cached;
}
