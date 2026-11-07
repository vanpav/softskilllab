<script lang="ts">
	import { Button } from '#lib/components/ui/button/index.js';

	let { data, form } = $props();
</script>

<div class="wrap">
	<form class="sheet" method="POST">
		<span class="tape" aria-hidden="true"></span>
		<h1>Вход в журнал</h1>
		<p class="hand">Здесь Аня пишет записи о занятиях.</p>
		{#if data.configured}
			<label class="field">
				<span>Пароль</span>
				<!-- svelte-ignore a11y_autofocus -->
				<input type="password" name="password" autocomplete="current-password" required autofocus />
			</label>
			{#if form?.wrong}<p class="error" role="alert">Пароль не подошёл. Попробуйте ещё раз.</p>{/if}
			<Button variant="pen" size="pen" type="submit">Войти</Button>
		{:else}
			<p class="error" role="alert">Пароль ещё не задан на сервере. Его нужно добавить секретом ADMIN_PASSWORD в Cloudflare.</p>
		{/if}
	</form>
</div>

<style>
	.sheet {
		position: relative;
		max-width: 440px;
		margin: clamp(24px, 6vw, 72px) auto 0;
		display: grid;
		gap: 18px;
		justify-items: start;
		background: var(--sheet);
		padding: clamp(28px, 5vw, 44px);
		box-shadow: 0 18px 34px rgba(20, 30, 80, 0.12);
		transform: rotate(-0.6deg);
	}
	.sheet > :global(:not(.tape)) {
		width: 100%;
	}
	.sheet > :global(button) {
		width: auto;
	}
	.tape {
		top: -14px;
		left: 50%;
		margin-left: -60px;
		transform: rotate(3deg);
	}
	h1 {
		font-size: clamp(32px, 4vw, 44px);
	}
	.hand {
		font-size: 26px;
		margin-top: -10px;
	}
</style>
