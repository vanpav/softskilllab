/**
 * Doodles drawn over Аня's portrait in ballpoint, one set per page load. Coordinates are the photo's own
 * pixels (anya.webp is 1000 × 1000).
 *
 * FACE is a frame that turns with her head: the origin is midway between her eyes, x runs along the eye line,
 * y down the face. In it the eyes sit at (−72, 0) and (72, 0), the nose tip at (0, 92), the mouth near (20, 152),
 * the chin near (55, 230), the cheeks near (−70, 105) and (105, 95), the hairline near (−30, −155), and the top
 * of her hair near (−30, −310). Hats sit from y ≈ −230 up; keep them below y ≈ −430, the top of the card.
 */

export type Stroke = {
	d: string;
	/** Group transform; FACE for things that follow her head. */
	t?: string;
	/** Seconds to draw this stroke. */
	dur?: number;
	tone?: 'pink';
	/** Stroke width when the transform scales. */
	w?: number;
};
export type Look = { name: string; strokes: Stroke[] };

export const FACE = 'translate(457 404) rotate(19.6)';
// Headwear drawn in FACE, enlarged about its own brim and lowered onto the hair; strokes thinned to match.
const HAT = `${FACE} translate(-20 -215) scale(1.35) translate(20 240)`;
const KOKOSHNIK = `${FACE} translate(-15 -195) scale(1.25) translate(15 210)`;
const MOUSTACHE = 'translate(425 529) rotate(17) scale(1.35)';
const ring = (cx: number, cy: number, r: number) => `M${cx - r} ${cy}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;

const moustache: Stroke[] = [
	{ t: MOUSTACHE, w: 5.2, dur: 0.5, d: 'M0-2C-20-18-50-20-68 0C-78 12-94 10-98-4C-101-16-90-24-82-16C-77-11-80-4-86-4' },
	{ t: MOUSTACHE, w: 5.2, dur: 0.25, d: 'M0 8C-22 2-48 10-70 14C-80 16-90 14-96 8' },
	{ t: MOUSTACHE, w: 5.2, dur: 0.5, d: 'M0-2C20-18 50-20 68 0C78 12 94 10 98-4C101-16 90-24 82-16C77-11 80-4 86-4' },
	{ t: MOUSTACHE, w: 5.2, dur: 0.25, d: 'M0 8C22 2 48 10 70 14C80 16 90 14 96 8' },
	{ t: MOUSTACHE, w: 5.2, dur: 0.35, d: 'M-10 0C-24-6-38-4-50 4M-14 6C-28 4-42 8-56 10M10 0C24-6 38-4 50 4M14 6C28 4 42 8 56 10' }
];

// Devil horns: short crescents rising from the hair on both sides of the parting, tips curling up and inwards.
const horns: Stroke[] = [
	{ t: FACE, dur: 0.5, d: 'M-132-198C-196-232-212-304-172-380C-158-316-122-272-60-236' },
	{ t: FACE, dur: 0.3, d: 'M-154-232C-142-240-126-242-110-240M-166-268C-154-278-140-282-126-280M-172-306C-162-316-150-320-140-320' },
	{ t: FACE, dur: 0.5, d: 'M98-226C154-256 156-332 102-396C104-332 82-284 24-246' },
	{ t: FACE, dur: 0.3, d: 'M110-252C98-262 82-266 66-264M120-288C108-300 94-304 80-302M118-326C108-338 98-342 88-342' }
];

const roundGlasses: Stroke[] = [
	{ t: FACE, dur: 0.4, d: ring(-72, 0, 42) },
	{ t: FACE, dur: 0.4, d: ring(72, 0, 42) },
	{ t: FACE, dur: 0.25, d: 'M-30-6C-16-18 16-18 30-6M-114-2L-152-14M114-2L150-18' }
];

export const LOOKS: Look[] = [
	{
		name: 'усы и шляпа',
		strokes: [
			{ t: HAT, w: 5.2, dur: 0.5, d: 'M-196-232C-130-270 80-280 156-252C116-232-124-220-196-232' },
			{ t: HAT, w: 5.2, dur: 0.55, d: 'M-128-248L-118-418C-50-432 30-432 98-424L92-262' },
			{ t: HAT, w: 5.2, dur: 0.3, d: 'M-126-292C-50-308 30-308 94-300M-124-312C-50-328 30-328 95-320' },
			...moustache
		]
	},
	{
		name: 'рожки и вилы',
		strokes: [
			...horns,
			{ t: 'rotate(9 220 700)', dur: 0.5, d: 'M220 990L220 470' },
			{ t: 'rotate(9 220 700)', dur: 0.3, d: 'M158 472C190 486 250 486 282 472' },
			{ t: 'rotate(9 220 700)', dur: 0.45, d: 'M160 474C148 432 156 392 170 360M220 476L220 340M280 474C292 432 284 392 270 360' },
			{ t: 'rotate(9 220 700)', dur: 0.35, d: 'M156 380L170 354L184 378M206 362L220 334L234 362M256 378L270 354L284 380' }
		]
	},
	{
		name: 'пенсне и испаньолка',
		strokes: [
			{ t: FACE, dur: 0.4, d: ring(-72, 0, 36) },
			{ t: FACE, dur: 0.4, d: ring(72, 0, 36) },
			{ t: FACE, dur: 0.25, d: 'M-36-4C-22-20 22-20 36-4' },
			{ t: FACE, dur: 0.45, d: 'M108 6C150 40 136 150 176 240' },
			{ t: FACE, dur: 0.4, d: 'M18 128C2 116-26 116-48 104C-56 100-62 92-58 86M20 128C38 114 62 114 86 98C92 94 96 86 92 80' },
			{ t: FACE, dur: 0.45, d: 'M2 184C12 204 20 238 42 266C54 238 62 208 60 184' },
			{ t: FACE, dur: 0.3, d: 'M14 194L34 252M28 190L44 244M44 190L48 234' }
		]
	},
	{
		name: 'кокошник и румяна',
		strokes: [
			{ t: KOKOSHNIK, w: 5.6, dur: 0.6, d: 'M-162-206C-152-330-62-402-15-402C42-402 122-332 132-216' },
			{ t: KOKOSHNIK, w: 5.6, dur: 0.45, d: 'M-130-220C-112-300-52-352-15-352C30-352 90-302 106-222' },
			{ t: KOKOSHNIK, w: 5.6, dur: 0.3, d: 'M-162-206C-80-236 50-242 132-216' },
			{ t: KOKOSHNIK, w: 5.6, dur: 0.35, d: 'M-15-334L-2-312L-15-290L-28-312Z' },
			{ t: KOKOSHNIK, w: 5.6, dur: 0.4, d: `${ring(-96, -300, 9)}${ring(-62, -340, 9)}${ring(32, -340, 9)}${ring(70, -300, 9)}` },
			{ t: FACE, dur: 0.35, tone: 'pink', d: `${ring(-74, 112, 30)}M-92 128L-58 94M-84 136L-50 102M-98 116L-66 86` },
			{ t: FACE, dur: 0.35, tone: 'pink', d: `${ring(106, 98, 26)}M90 112L120 82M98 120L126 92M86 100L112 76` }
		]
	},
	{
		name: 'корона и скипетр',
		strokes: [
			{ t: FACE, dur: 0.55, d: 'M-152-232L-162-332L-106-288L-60-362L-16-300L30-368L70-300L118-346L126-242' },
			{ t: FACE, dur: 0.3, d: 'M-152-232C-70-260 50-264 126-242M-150-262C-70-288 50-292 124-270' },
			{ t: FACE, dur: 0.35, d: `${ring(-60, -376, 10)}${ring(30, -382, 10)}${ring(-16, -282, 9)}` },
			{ t: 'rotate(8 220 700)', dur: 0.45, d: 'M220 990L220 528' },
			{ t: 'rotate(8 220 700)', dur: 0.4, d: `${ring(220, 494, 34)}M220 460L220 418M202 438L238 438` },
			{ t: 'rotate(8 220 700)', dur: 0.25, d: 'M210 600L230 600M210 700L230 700M210 800L230 800' }
		]
	},
	{
		name: 'пиратская шляпа и повязка',
		strokes: [
			// A captain's hat seen from the front: wide brim turned up into two wings and a raised middle, skull and bones on it.
			{ t: FACE, dur: 0.7, d: 'M-232-196C-228-282-182-334-114-324C-94-436 72-442 94-324C158-334 200-284 198-206C132-236 52-226-18-224C-90-222-170-230-232-196' },
			{ t: FACE, dur: 0.35, d: 'M-212-214C-132-246 92-256 180-226' },
			{ t: FACE, dur: 0.4, d: `${ring(-12, -300, 24)}M-23-304L-17-298M-1-304L-7-298M-22-282L-2-282` },
			{ t: FACE, dur: 0.3, d: 'M-48-268L24-244M-48-244L24-268M-54-272L-46-262M-54-240L-46-250M30-272L22-262M30-240L22-250' },
			{ t: FACE, dur: 0.45, d: 'M-114-8C-112-42-40-44-34-8C-36 30-108 34-114-8' },
			{ t: FACE, dur: 0.3, d: 'M-104-20L-50-24M-106-4L-42-6M-102 12L-46 10' },
			{ t: FACE, dur: 0.4, d: 'M-112-22L-160-62M-38-26C10-92 80-150 130-180' }
		]
	},
	{
		name: 'нимб и крылышки',
		strokes: [
			{ t: FACE, dur: 0.55, d: 'M-142-372a124 30 0 1 0 248 0a124 30 0 1 0-248 0' },
			{ t: FACE, dur: 0.3, d: 'M-120-366a102 22 0 1 0 204 0' },
			{ dur: 0.6, d: 'M250 730C180 640 100 600 40 610C80 640 90 660 70 680C110 690 120 710 105 730C150 735 170 750 160 775C200 770 230 760 250 730' },
			{ dur: 0.3, d: 'M200 700C160 670 120 650 80 640M215 725C180 705 150 700 120 700' },
			{ dur: 0.6, d: 'M720 700C790 610 870 570 940 575C900 605 890 625 912 645C870 655 860 675 878 695C830 700 812 715 822 740C780 735 750 725 720 700' },
			{ dur: 0.3, d: 'M770 675C810 645 850 630 890 620M755 700C790 685 820 680 850 680' }
		]
	},
	{
		name: 'шапочка выпускника и очки',
		strokes: [
			{ t: FACE, dur: 0.5, d: 'M-182-300L-20-362L152-300L-10-244Z' },
			{ t: FACE, dur: 0.45, d: 'M-122-278L-122-230C-60-204 40-204 96-232L96-280' },
			{ t: FACE, dur: 0.45, d: 'M-15-302C40-300 120-304 150-300L160-202' },
			{ t: FACE, dur: 0.25, d: 'M150-206L144-170M160-206L162-166M170-206L178-170' },
			...roundGlasses
		]
	},
	{
		name: 'кролик',
		strokes: [
			{ t: FACE, dur: 0.6, d: 'M-118-240C-150-330-148-420-112-470C-82-430-70-340-72-256' },
			{ t: FACE, dur: 0.35, d: 'M-104-262C-122-330-120-400-110-438C-94-400-88-330-90-268' },
			{ t: FACE, dur: 0.6, d: 'M30-266C30-350 40-400 70-436C92-410 96-370 88-336C112-344 140-330 150-306C130-300 104-300 86-300C82-284 78-272 76-258' },
			{ t: FACE, dur: 0.35, d: 'M46-276C48-340 58-380 70-404M88-318C106-322 124-318 136-310' },
			{ t: FACE, dur: 0.3, tone: 'pink', d: 'M-12 88L12 88L0 102Z' },
			{ t: FACE, dur: 0.45, d: 'M-6 146L-6 182C-6 192 18 192 18 182L18 146M19 146L19 182C19 192 44 192 44 182L44 146M-8 146L46 146' },
			{ t: FACE, dur: 0.45, d: 'M-30 118L-110 104M-30 128L-112 132M-28 138L-104 156M52 112L140 92M54 122L144 118M54 132L138 142' }
		]
	}
];

const flake = (cx: number, cy: number, r: number) => {
	const arms = [0, 60, 120].map((deg) => {
		const a = (deg * Math.PI) / 180;
		const dx = Math.sin(a) * r;
		const dy = Math.cos(a) * r;
		return `M${(cx - dx).toFixed(1)} ${(cy - dy).toFixed(1)}L${(cx + dx).toFixed(1)} ${(cy + dy).toFixed(1)}`;
	});
	return arms.join('');
};

/** A plait hanging from behind her ear down over the shoulder: lobes alternating left and right. */
function braid(x: number, y: number, links: number) {
	let d = '';
	for (let i = 0; i < links; i++) {
		const top = y + i * 46;
		const side = i % 2 ? 1 : -1;
		d += `M${x} ${top}C${x + side * 34} ${top + 10} ${x + side * 30} ${top + 44} ${x - side * 4} ${top + 56}`;
	}
	return d;
}

/** Shown instead of the random set from 1 December to 10 January, next to Пушистик's Santa beard. */
export const SNOW_MAIDEN: Look = {
	name: 'Снегурочка',
	strokes: [
		{ t: KOKOSHNIK, w: 5.6, dur: 0.6, d: 'M-160-214C-160-300-92-390-15-394C62-390 128-302 132-222' },
		{ t: KOKOSHNIK, w: 5.6, dur: 0.5, d: 'M-172-204C-144-226-122-198-94-220C-66-198-44-226-15-204C14-226 36-198 64-220C92-198 114-226 142-206' },
		{ t: KOKOSHNIK, w: 5.6, dur: 0.45, d: 'M-164-238C-136-258-112-232-84-252C-56-232-34-258-6-238C22-258 44-232 72-252C100-232 120-258 134-242' },
		{ t: KOKOSHNIK, w: 5.6, dur: 0.3, d: 'M-140-226L-134-212M-108-232L-102-216M-70-230L-64-214M-36-232L-30-216M2-230L8-214M38-232L44-216M76-230L82-214M110-232L116-216' },
		{ t: KOKOSHNIK, w: 5.6, dur: 0.4, d: `${flake(-15, -318, 34)}M-25-350L-15-340L-5-350M-25-286L-15-296L-5-286` },
		// Left of Пушистик, who sits lower on the card in the New Year season with his beard.
		{ dur: 0.7, d: braid(640, 540, 5) },
		{ dur: 0.45, d: 'M640 790C608 770 586 790 604 810C620 824 638 808 640 790C642 808 662 824 678 810C694 790 672 770 640 790M628 806L614 856M652 806L670 854' },
		{ t: FACE, dur: 0.35, tone: 'pink', d: `${ring(-74, 112, 28)}M-90 126L-58 94M-84 134L-52 102` },
		{ t: FACE, dur: 0.35, tone: 'pink', d: `${ring(106, 98, 24)}M92 110L120 82M98 118L124 92` },
		{ dur: 0.4, d: `${flake(190, 300, 22)}${flake(250, 170, 14)}${flake(880, 330, 18)}` }
	]
};
