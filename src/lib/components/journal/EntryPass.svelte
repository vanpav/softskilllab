<script lang="ts">
	import { Button } from '#lib/components/ui/button/index.js';
	import { PHONE_DISPLAY, PHONE_HREF, WHATSAPP_HREF } from '#lib/content.js';
	import WhatsAppIcon from './WhatsAppIcon.svelte';
</script>

<section class="join" id="join">
	<div class="wrap">
		<div class="permit">
			<div>
				<h2>Пропуск в лабораторию на <span class="hl">сентябрь</span></h2>
				<p>Набор открыт, мест осталось несколько. Группа закрывается, как только в ней шесть детей. Напишите Ане: она расскажет о программе и подберёт группу по возрасту.</p>
			</div>
			<div class="side">
				<div class="price">100 ₪</div>
				<span>за одно занятие</span>
				<Button variant="stamp" size="stamp" href={WHATSAPP_HREF}>
					<WhatsAppIcon />
					Записаться в WhatsApp
				</Button>
				<a class="tel" href={PHONE_HREF}>{PHONE_DISPLAY}</a>
			</div>
		</div>
	</div>
</section>

<style>
	.join {
		padding: clamp(48px, 7vw, 96px) 0 clamp(72px, 10vw, 140px);
	}
	.permit {
		position: relative;
		background: var(--ink);
		color: var(--sheet);
		padding: clamp(28px, 5vw, 64px);
		display: grid;
		grid-template-columns: 1.2fr 0.8fr;
		gap: clamp(24px, 4vw, 56px);
		align-items: center;
		box-shadow: 0 24px 48px rgba(20, 30, 80, 0.25);
	}
	.permit::before {
		content: "";
		position: absolute;
		inset: 10px;
		border: 2px dashed rgba(255, 255, 255, 0.28);
		pointer-events: none;
	}
	.permit :global(:focus-visible) {
		outline-color: var(--marker);
	}
	h2 {
		font-size: clamp(36px, 5vw, 72px);
		line-height: 1.12;
	}
	h2 .hl {
		color: var(--ink);
		background: linear-gradient(transparent 14%, var(--marker) 14%);
		padding: 0 0.12em 0.14em;
	}
	.permit p {
		margin-top: 20px;
		max-width: 46ch;
		color: var(--permit-text);
		font-size: clamp(17px, 1.4vw, 19px);
	}
	.side {
		display: grid;
		gap: 14px;
		justify-items: start;
	}
	.price {
		font-weight: 900;
		font-size: clamp(56px, 6vw, 88px);
		letter-spacing: -0.04em;
		line-height: 1;
	}
	.price + span {
		font-family: var(--hand);
		font-size: 28px;
		color: var(--marker);
		margin-top: -6px;
	}
	.tel {
		color: var(--sheet);
		font-weight: 600;
		text-decoration: underline;
		text-underline-offset: 5px;
	}
	@media (max-width: 900px) {
		.permit {
			grid-template-columns: 1fr;
		}
	}
</style>
