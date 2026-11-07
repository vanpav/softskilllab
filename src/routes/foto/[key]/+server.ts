import { error } from '@sveltejs/kit';
import { bindings } from '#lib/server/bindings.js';
import type { RequestHandler } from './$types';

// Keys are made once per upload and never reused, so a photo can be cached for good.
export const GET: RequestHandler = async ({ params }) => {
	if (!/^[a-z0-9]+-[a-f0-9]{8}\.(webp|jpg|png)$/.test(params.key)) error(404);
	const object = await (await bindings()).PHOTOS?.get(params.key);
	if (!object) error(404);
	return new Response(object.body, {
		headers: {
			'content-type': object.httpMetadata?.contentType ?? 'application/octet-stream',
			'cache-control': 'public, max-age=31536000, immutable',
			etag: object.httpEtag
		}
	});
};
