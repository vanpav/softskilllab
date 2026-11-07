import logo from '#lib/assets/logo/logo-line.svg';
import { EMAIL, PHONE_HREF, SITE_NAME, SITE_URL, SOCIAL } from './content.js';
import type { Post } from './posts.js';

const BUSINESS_ID = `${SITE_URL}/#business`;
const absolute = (path: string) => new URL(path, SITE_URL).href;

/** The lab as a local business, for searches like «кружок для детей Акко». Only facts the page itself states. */
export function businessSchema(description: string, image: string) {
	return [
		{
			'@type': ['LocalBusiness', 'EducationalOrganization'],
			'@id': BUSINESS_ID,
			name: SITE_NAME,
			url: `${SITE_URL}/`,
			description,
			telephone: PHONE_HREF.replace('tel:', ''),
			email: EMAIL,
			address: { '@type': 'PostalAddress', addressLocality: 'Акко', addressCountry: 'IL' },
			areaServed: 'Акко',
			priceRange: '100 ₪',
			image: absolute(image),
			logo: absolute(logo),
			sameAs: SOCIAL.map((link) => link.href),
			founder: { '@type': 'Person', name: 'Аня', jobTitle: 'Педагог-психолог' }
		},
		{ '@type': 'WebSite', '@id': `${SITE_URL}/#website`, url: `${SITE_URL}/`, name: SITE_NAME, inLanguage: 'ru' }
	];
}

/** A journal post as an article by Аня, published by the lab. */
export function postSchema(post: Post, image: string | undefined) {
	return [
		{
			'@type': 'BlogPosting',
			headline: post.title,
			description: post.description,
			url: absolute(`/zhurnal/${post.slug}`),
			inLanguage: 'ru',
			...(post.date ? { datePublished: post.date } : {}),
			...(image ? { image: absolute(image) } : {}),
			author: { '@type': 'Person', name: 'Аня' },
			publisher: { '@id': BUSINESS_ID, '@type': 'Organization', name: SITE_NAME, logo: absolute(logo) },
			isPartOf: { '@type': 'Blog', name: 'Журнал занятий', url: absolute('/zhurnal') }
		}
	];
}
