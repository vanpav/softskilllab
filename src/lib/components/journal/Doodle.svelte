<script lang="ts">
	import type { DoodleName } from '#lib/doodles.js';

	let { name, class: className }: { name: DoodleName; class?: string } = $props();
</script>

<svg
	class={className}
	viewBox="0 0 84 84"
	fill="none"
	stroke="currentColor"
	stroke-width="2.5"
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden="true"
>
	{#if name === 'splash'}
		<path d="M14 46c6-8 14-8 20 0s14 8 20 0 12-8 18-2" /><path d="M12 46v18a8 8 0 0 0 8 8h44a8 8 0 0 0 8-8V44" /><path d="M42 10v18M34 20l8 8 8-8" />
	{:else if name === 'flask'}
		<path d="M32 10h20M36 10v22L20 64a6 6 0 0 0 5 9h34a6 6 0 0 0 5-9L48 32V10" /><path d="M24 56h36" /><circle cx="62" cy="22" r="5" /><path d="M58 16l-6-6" />
	{:else if name === 'tower'}
		<path d="M30 74V54h24v20M22 54h40L52 30H32L22 54ZM36 30l6-20 6 20" /><path d="M12 74h60" />
	{:else if name === 'compass'}
		<circle cx="42" cy="42" r="30" /><path d="M52 32l-6 14-14 6 6-14 14-6Z" /><path d="M42 12v6M42 66v6M12 42h6M66 42h6" />
	{:else if name === 'chain'}
		<circle cx="16" cy="20" r="6" /><path d="M10 30l30 10M30 46v24M38 46v24M46 46v24M54 46v24M62 46v24" /><path d="M8 72h68" />
	{:else if name === 'sponge'}
		<rect x="12" y="38" width="60" height="30" rx="6" /><path d="M12 48h60" /><path d="M24 58h2M38 60h2M52 57h2M30 64h2M46 65h2M60 63h2" /><circle cx="28" cy="24" r="6" /><circle cx="46" cy="16" r="4" /><circle cx="58" cy="28" r="5" />
	{:else if name === 'boundary'}
		<circle cx="42" cy="44" r="32" stroke-dasharray="7 7" /><circle cx="42" cy="34" r="7" /><path d="M28 62c2-12 26-12 28 0" /><path d="M8 12l8 8M76 12l-8 8M8 76l8-8M76 76l-8-8" />
	{:else}
		<ellipse cx="42" cy="52" rx="30" ry="14" /><path d="M12 52v4c0 8 13 14 30 14s30-6 30-14v-4" /><circle cx="34" cy="50" r="4" /><circle cx="50" cy="54" r="3" /><circle cx="46" cy="44" r="2.5" /><path d="M42 12v14M36 18l6-6 6 6" />
	{/if}
</svg>
