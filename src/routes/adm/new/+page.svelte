<script lang="ts">
	import VisualEditor from '#lib/components/admin/VisualEditor.svelte';

	let { data, form } = $props();
</script>

<div class="wrap">
	<h1>Новая запись</h1>
	<VisualEditor source={form?.source ?? data.source} number={data.number} photos={data.photos} error={form?.error} submitLabel="Опубликовать" />
</div>

<style>
	h1 {
		font-size: clamp(34px, 4.6vw, 56px);
		margin-bottom: clamp(24px, 3vw, 36px);
	}
</style>
