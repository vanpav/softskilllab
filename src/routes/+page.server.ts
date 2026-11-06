import { photos } from '#lib/content.js';

// Picked on the server so the first paint and hydration agree, with no photo swap on load.
export const load = () => ({ heroPhoto: Math.floor(Math.random() * photos.length) });
