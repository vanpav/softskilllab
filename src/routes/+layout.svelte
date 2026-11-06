<script lang="ts">
	import './layout.css';
	import favicon from '#lib/assets/logo-mark.webp';
	import type { LayoutProps } from './$types';

	let { children }: LayoutProps = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} type="image/webp" />
</svelte:head>

{@render children()}
