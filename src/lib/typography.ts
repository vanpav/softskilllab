/**
 * Russian typesetting rules for line breaks, applied with non-breaking spaces:
 * - a short preposition, conjunction or particle stays with the word after it («в группе», «и не»);
 * - a number stays with the word or sign after it («6 детей», «100 ₪»);
 * - a dash never starts a line («Колба — повод»).
 * No imports: vite.config.ts runs it over the static text of every .svelte file at build time.
 */

const NBSP = ' ';
// One- and two-letter words that must not end a line.
const SHORT = 'а|в|и|к|о|с|у|я|во|до|за|из|ко|на|не|ни|но|об|от|по|со|он|мы|вы|их|её|ее|ей|им';
const glue = new RegExp(`(^|[\\s(«„"${NBSP}—–-])(${SHORT})[ \\t\\r\\n]+`, 'giu');

export function nbsp(text: string) {
	// Twice, because «и в группе» has two short words in a row and a match can't start inside the previous one.
	let out = text.replace(glue, `$1$2${NBSP}`).replace(glue, `$1$2${NBSP}`);
	out = out.replace(/[ \t\r\n]+([—–])/g, `${NBSP}$1`);
	out = out.replace(/(\d)[ \t]+(?=[^\s\d])/g, `$1${NBSP}`);
	return out;
}

/** The same for every string inside plain data, such as the arrays in content.ts. */
export function nbspDeep<T>(value: T): T {
	if (typeof value === 'string') return nbsp(value) as T;
	if (Array.isArray(value)) return value.map(nbspDeep) as T;
	if (value && typeof value === 'object' && Object.getPrototypeOf(value) === Object.prototype) {
		return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, nbspDeep(item)])) as T;
	}
	return value;
}
