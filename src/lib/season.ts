const AKKO = 'Asia/Jerusalem';

export const COMING_NEW_YEAR = 'С наступающим Новым годом!';

export const monthInAkko = (now: Date) =>
	new Intl.DateTimeFormat('ru', { month: 'long', timeZone: AKKO }).format(now);

/** The footer greeting from 1 December to 10 January by the date in Akko, otherwise null. */
export function newYearGreeting(now: Date) {
	const parts = new Intl.DateTimeFormat('en', { month: 'numeric', day: 'numeric', timeZone: AKKO }).formatToParts(now);
	const part = (type: string) => Number(parts.find((p) => p.type === type)?.value);
	if (part('month') === 12) return COMING_NEW_YEAR;
	if (part('month') === 1 && part('day') <= 10) return 'С Новым годом!';
	return null;
}
