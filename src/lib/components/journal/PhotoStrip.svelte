<script lang="ts">
	import chemistry from '#lib/assets/color-chemistry-experiment.webp';
	import slime from '#lib/assets/slime-experiment.webp';
	import blocks from '#lib/assets/team-building-blocks.webp';
	import map from '#lib/assets/treasure-map-compass.webp';

	const photos = [
		{ src: blocks, alt: 'Трое мальчиков вместе собирают конструкцию из цветных деталей', caption: 'втроём держать легче' },
		{ src: slime, alt: 'Дети месят зелёный слайм в общей миске', caption: 'слайм на всех' },
		{ src: chemistry, alt: 'Девочка капает пипеткой краситель в колбу, за ней смотрят другие дети', caption: 'все смотрят на одну каплю' },
		{ src: map, alt: 'Мальчик и девочка прокладывают маршрут по карте', caption: 'куда идём?' }
	];
</script>

<section class="strip" aria-label="Как это выглядит">
	<div class="wrap">
		{#each photos as photo (photo.src)}
			<figure>
				<img src={photo.src} alt={photo.alt} loading="lazy" />
				<figcaption>{photo.caption}</figcaption>
			</figure>
		{/each}
	</div>
</section>

<style>
	.strip {
		padding: 0 0 clamp(64px, 8vw, 120px);
	}
	.strip .wrap {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: clamp(14px, 2vw, 28px);
		align-items: start;
	}
	figure {
		background: var(--sheet);
		padding: 10px 10px 14px;
		box-shadow: 0 12px 24px rgba(20, 30, 80, 0.12);
	}
	figure:nth-child(1) {
		transform: rotate(-3deg);
	}
	figure:nth-child(2) {
		transform: rotate(2deg) translateY(18px);
	}
	figure:nth-child(3) {
		transform: rotate(-1.5deg);
	}
	figure:nth-child(4) {
		transform: rotate(3deg) translateY(10px);
	}
	img {
		aspect-ratio: 1/1;
		object-fit: cover;
	}
	figcaption {
		font-family: var(--hand);
		font-size: 23px;
		color: var(--pen);
		margin-top: 6px;
		line-height: 1.05;
	}
	@media (max-width: 900px) {
		.strip .wrap {
			grid-template-columns: 1fr 1fr;
		}
	}
</style>
