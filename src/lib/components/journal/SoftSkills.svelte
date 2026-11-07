<section class="soft" id="soft-skills">
	<div class="wrap">
		<div class="text">
			<h2>Что такое <span>софт скиллы?</span></h2>
			<p>Soft skills, или гибкие навыки, — это <b>умение ладить с людьми и с собой</b>: договориться, выслушать, справиться с обидой и попробовать ещё раз после неудачи.</p>
			<p>Таблицу умножения и английский проверяют контрольной. Гибкие навыки проверяет жизнь: сможет ли ребёнок попросить о помощи, отстоять своё мнение без крика, найти друзей в новом классе.</p>
			<p>По учебнику их не выучить. Они растут в деле, рядом с другими людьми, поэтому у нас за одним столом шесть детей и один общий опыт.</p>
		</div>
		<!-- A school physics problem, ruled the way it is in every Russian exercise book. -->
		<dl class="task hand">
			<div class="given">
				<dt>Дано:</dt>
				<dd>Петя — знаток вулканов</dd>
				<dd>проект группы: вулкан</dd>
			</div>
			<div class="find">
				<dt>Найти:</dt>
				<dd>
					почему он не извергся?
					<svg class="volcano" viewBox="0 0 120 96" aria-hidden="true">
					<path d="M6 88C22 86 40 87 58 86s38 1 56 0" />
					<path d="M14 87C26 66 36 48 44 30c4-2 10-2 16-1 3 0 7 1 10 2 10 20 22 38 36 56" />
					<path d="M44 30c6 3 18 3 26 1" />
					<path d="M38 44c4 3 9 2 12 6M74 50c3-2 6-1 9 2M30 64c5 1 7 4 10 6M78 70c4 0 7 3 10 2" />
					<path d="M56 24c-3-5 2-7 0-11s3-6 2-9M64 23c2-4-1-6 2-9" />
					</svg>
				</dd>
			</div>
			<div class="solve">
				<dt>Решение:</dt>
				<dd>Петя делал всё сам</dd>
				<dd>и никого не слушал.</dd>
				<dd>С ним поспорили —</dd>
				<dd>обиделся и ушёл.</dd>
				<dd>Знаний хватило,</dd>
				<dd>а договориться</dd>
				<dd>не получилось.</dd>
			</div>
			<div class="answer">
				<dt>Ответ:</dt>
				<dd>не хватило <span class="hl">софт скиллов</span></dd>
			</div>
		</dl>
	</div>
</section>

<style>
	.soft {
		padding: clamp(24px, 4vw, 56px) 0;
	}
	.soft .wrap {
		display: grid;
		grid-template-columns: 1.1fr 0.9fr;
		grid-template-areas: 'task text';
		gap: clamp(28px, 5vw, 80px);
		align-items: center;
	}
	.text {
		grid-area: text;
	}
	h2 {
		font-size: clamp(34px, 4.6vw, 64px);
	}
	h2 span {
		white-space: nowrap;
	}
	.text p {
		margin-top: 20px;
		max-width: 44ch;
		font-size: clamp(18px, 1.5vw, 20px);
		color: var(--ink-2);
	}
	.text b {
		color: var(--ink);
	}
	.task {
		grid-area: task;
		display: grid;
		grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
		grid-template-areas:
			'given solve'
			'find solve'
			'find answer';
		grid-template-rows: auto auto 1fr;
		font-size: clamp(26px, 2.2vw, 32px);
		line-height: 1.15;
		transform: rotate(-0.6deg);
	}
	dt {
		font-weight: 700;
	}
	dd {
		font-weight: 500;
		padding-left: 0.5em;
	}
	.given,
	.find {
		padding-right: clamp(14px, 2vw, 24px);
	}
	/* Ruled lines are pen drawn along a ruler: one under «Дано», one between the columns. */
	.given {
		grid-area: given;
		padding-bottom: 12px;
		border-bottom: 2px solid var(--pen);
	}
	.find {
		grid-area: find;
		padding-top: 10px;
	}
	.solve,
	.answer {
		border-left: 2px solid var(--pen);
		padding-left: clamp(14px, 2vw, 24px);
	}
	.solve {
		grid-area: solve;
	}
	.answer {
		grid-area: answer;
		align-self: stretch;
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		align-content: end;
		gap: 0 0.3em;
		padding-top: 22px;
	}
	.answer dd {
		padding-left: 0;
		font-weight: 700;
		font-size: 1.15em;
	}
	.answer .hl {
		color: var(--pen);
		white-space: nowrap;
	}
	.volcano {
		display: block;
		width: clamp(104px, 10vw, 148px);
		margin: 20px 0 0 0.6em;
		fill: none;
		stroke: var(--pen);
		stroke-width: 2.5;
		stroke-linecap: round;
		stroke-linejoin: round;
		transform: rotate(-4deg);
	}
	@media (max-width: 900px) {
		.soft .wrap {
			grid-template-columns: 1fr;
			grid-template-areas: 'text' 'task';
		}
		.task {
			max-width: 640px;
		}
	}
	@media (max-width: 600px) {
		.task {
			grid-template-columns: minmax(0, 1fr);
			grid-template-areas: 'given' 'find' 'solve' 'answer';
			grid-template-rows: none;
			font-size: 23px;
		}
		.given,
		.find {
			padding-right: 0;
		}
		.find {
			position: relative;
			padding-bottom: 12px;
			border-bottom: 2px solid var(--pen);
		}
		.volcano {
			position: absolute;
			right: 0;
			bottom: 14px;
			width: 72px;
			margin: 0;
		}
		.find dd {
			padding-right: 80px;
		}
		.solve,
		.answer {
			border-left: 0;
			padding-left: 0;
		}
		.solve {
			padding-top: 10px;
		}
		.answer {
			padding-top: 14px;
		}
	}
</style>
