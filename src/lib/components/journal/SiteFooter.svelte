<script lang="ts">
	import { EMAIL } from '#lib/content.js';
</script>

<footer>
	<div class="wrap">
		<div class="foot">
			<div><b>Soft Skills Lab</b>Акко (Acre), Израиль</div>
			<div><b>Для кого</b>дети 6–16 лет</div>
			<div><b>Почта</b><a href="mailto:{EMAIL}">{EMAIL}</a></div>
		</div>
	</div>
</footer>

<style>
	footer {
		padding: 0 0 48px;
	}
	.foot {
		display: flex;
		flex-wrap: wrap;
		gap: 20px 48px;
		justify-content: space-between;
		font-size: 16px;
		color: var(--ink-2);
		border-top: 2px solid var(--ink);
		padding-top: 28px;
	}
	b {
		color: var(--ink);
		display: block;
	}
	a {
		color: var(--pen);
		text-decoration: underline;
		text-underline-offset: 4px;
	}
</style>
