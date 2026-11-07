// Lets `node --test` run the project's TypeScript as is: imports are written `./x.js` (as SvelteKit wants) but the
// file on disk is `./x.ts`. No test framework needed; Node strips the types itself.
import { register } from 'node:module';

register(
	'data:text/javascript,' +
		encodeURIComponent(`export async function resolve(specifier, context, next) {
	try { return await next(specifier, context); }
	catch (error) {
		if (specifier.startsWith('.') && specifier.endsWith('.js')) return next(specifier.slice(0, -3) + '.ts', context);
		throw error;
	}
}`)
);
