// Ambient (no imports or exports), so this declares the module rather than augmenting one.
declare module 'cloudflare:workers' {
	export const env: Record<string, unknown>;
}
