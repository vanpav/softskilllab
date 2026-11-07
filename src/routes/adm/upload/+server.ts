import { error, json } from '@sveltejs/kit';
import { isSignedIn } from '#lib/server/admin-auth.js';
import { bindings } from '#lib/server/bindings.js';
import type { RequestHandler } from './$types';

const TYPES: Record<string, string> = { 'image/webp': 'webp', 'image/jpeg': 'jpg', 'image/png': 'png' };
const MAX = 8 * 1024 * 1024;

/** One photo per request, already resized in the browser. Answers with the key it is served under at /foto/<key>. */
export const POST: RequestHandler = async ({ request, cookies }) => {
	if (!(await isSignedIn(cookies))) error(401, 'Войдите заново');
	const photos = (await bindings()).PHOTOS;
	if (!photos) error(503, 'Хранилище фотографий не подключено');
	const file = (await request.formData()).get('photo');
	if (!(file instanceof File)) error(400, 'Нет файла');
	const extension = TYPES[file.type];
	if (!extension) error(415, 'Это не фотография');
	if (file.size > MAX) error(413, 'Фото слишком большое');
	const key = `${Date.now().toString(36)}-${crypto.randomUUID().slice(0, 8)}.${extension}`;
	await photos.put(key, await file.arrayBuffer(), { httpMetadata: { contentType: file.type } });
	return json({ key });
};
