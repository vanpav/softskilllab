/** The line drawings in Doodle.svelte. Kept apart from content.ts so posts.ts can be tested without its images. */
export const doodleNames = ['flask', 'splash', 'tower', 'compass', 'chain', 'dish', 'sponge', 'boundary'] as const;
export type DoodleName = (typeof doodleNames)[number];
