// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		/** The part of Cloudflare's KVNamespace the site uses. */
		interface KV {
			get(key: string): Promise<string | null>;
			get(key: string, type: 'json'): Promise<unknown>;
			put(key: string, value: string): Promise<void>;
			delete(key: string): Promise<void>;
		}
		/** The part of Cloudflare's R2Bucket the site uses. */
		interface Bucket {
			put(key: string, value: ArrayBuffer, options?: { httpMetadata?: { contentType?: string; cacheControl?: string } }): Promise<unknown>;
			get(key: string): Promise<{ body: ReadableStream; httpEtag: string; httpMetadata?: { contentType?: string } } | null>;
			delete(key: string): Promise<void>;
		}
	}
}

export {};
