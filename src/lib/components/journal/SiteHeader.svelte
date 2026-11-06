<script lang="ts">
	import logoLine from '#lib/assets/logo/logo-line.svg';
	import { Button } from '#lib/components/ui/button/index.js';
	import { WHATSAPP_HREF } from '#lib/content.js';
	import WhatsAppIcon from './WhatsAppIcon.svelte';
</script>

<header class="top">
	<div class="wrap">
		<a class="brand" href="/" aria-label="Soft Skills Lab, на главную">
			<img src={logoLine} alt="Soft Skills Lab" width="744" height="210" />
		</a>
		<nav class="nav" aria-label="Разделы">
			<a href="#group">Группа</a>
			<a href="#protocols">Опыты</a>
			<a href="#anya">Аня</a>
			<a href="#join">Запись</a>
		</nav>
		<Button
			variant="pen"
			size="pen"
			href={WHATSAPP_HREF}
			class="max-[900px]:ml-auto max-[900px]:h-11 max-[900px]:px-4 max-[900px]:text-[15px]"
		>
			<WhatsAppIcon />
			WhatsApp
		</Button>
	</div>
</header>

<style>
	.top .wrap {
		display: flex;
		align-items: center;
		gap: 20px;
		height: 84px;
	}
	.brand {
		display: flex;
		align-items: center;
	}
	.brand img {
		display: block;
		height: 60px;
		width: auto;
	}
	.nav {
		margin-left: auto;
		display: flex;
		gap: 24px;
		font-weight: 500;
		font-size: 16px;
	}
	.nav a {
		color: var(--ink-2);
	}
	.nav a:hover {
		color: var(--pen);
		text-decoration: underline wavy var(--pink-text);
		text-underline-offset: 6px;
	}
	@media (max-width: 900px) {
		.top .wrap {
			flex-wrap: wrap;
			height: auto;
			gap: 4px 20px;
			padding-top: 12px;
		}
		.brand img {
			height: 48px;
		}
		.nav {
			order: 3;
			width: 100%;
			margin: 0;
			justify-content: space-between;
			gap: 8px;
		}
		.nav a {
			display: inline-flex;
			align-items: center;
			min-height: 44px;
		}
	}
</style>
