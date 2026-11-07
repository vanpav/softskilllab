import { redirect, type Cookies } from '@sveltejs/kit';
import { bindings } from './bindings.js';

/**
 * One password, ADMIN_PASSWORD, kept as a Cloudflare secret. A session is a cookie `<expiry>.<HMAC>` signed with a key
 * derived from that password, so changing the password signs everyone out. No user table, no session storage.
 */

const COOKIE = 'adm_session';
const DAYS = 30;
const encoder = new TextEncoder();

async function sign(password: string, message: string) {
	const key = await crypto.subtle.importKey('raw', encoder.encode(`adm-session:${password}`), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
	const bytes = new Uint8Array(await crypto.subtle.sign('HMAC', key, encoder.encode(message)));
	return btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** Compares in time independent of where the strings differ. */
function sameText(a: string, b: string) {
	const x = encoder.encode(a);
	const y = encoder.encode(b);
	let diff = x.length ^ y.length;
	for (let i = 0; i < Math.max(x.length, y.length); i++) diff |= (x[i] ?? 0) ^ (y[i] ?? 0);
	return diff === 0;
}

export const passwordOf = async () => (await bindings()).ADMIN_PASSWORD || null;

export async function checkPassword(attempt: string) {
	const password = await passwordOf();
	return !!password && sameText(attempt, password);
}

export async function startSession(cookies: Cookies) {
	const password = (await passwordOf())!;
	const expires = Date.now() + DAYS * 24 * 60 * 60 * 1000;
	cookies.set(COOKIE, `${expires}.${await sign(password, String(expires))}`, {
		path: '/adm',
		httpOnly: true,
		secure: true,
		sameSite: 'strict',
		maxAge: DAYS * 24 * 60 * 60
	});
}

export function endSession(cookies: Cookies) {
	cookies.delete(COOKIE, { path: '/adm' });
}

export async function isSignedIn(cookies: Cookies) {
	const password = await passwordOf();
	const [expires, signature] = cookies.get(COOKIE)?.split('.') ?? [];
	if (!password || !expires || !signature || Number(expires) < Date.now()) return false;
	return sameText(signature, await sign(password, expires));
}

/** For every /adm load and action: actions don't run the layout load, so each checks for itself. */
export async function requireAdmin({ cookies }: { cookies: Cookies }) {
	if (!(await isSignedIn(cookies))) redirect(303, '/adm/login');
}
