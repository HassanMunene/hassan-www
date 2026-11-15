<script>
	import AsciiField from '$lib/components/AsciiField.svelte';
	import LogoAnimated from '$lib/components/LogoAnimated.svelte';
	import IntroPlayer from '$lib/components/IntroPlayer.svelte';
	import introPoster from '../content/journey/intro-poster.jpg?url';

	const stats = [
		{
			n: '150k',
			plus: '+',
			label: 'Farmers on the Shamba platform',
			href: '/projects/shamba-records-platform'
		},
		{ n: '13', plus: '', label: 'Counties tracked in the PMIS', href: '/projects/pmis' },
		{ n: '1M', plus: '+', label: 'Farmers the PMIS aims to reach', href: '/projects/pmis' }
	];

	// the two big buttons cover projects + contact; these are the quiet extras
	const links = [
		{ name: 'about', href: '/about' },
		{ name: 'field notes', href: '/field-notes' },
		{ name: 'blog', href: '/blog' }
	];

	let burst = $state(null);
	let burstId = 0;
	let player = $state();

	function handleLogoAnimationComplete(origin) {
		burst = { ...origin, id: ++burstId };
	}
</script>

<main>
	<AsciiField {burst} />

	<div class="container">
		<section class="hero">
			<div class="bubble-wrap">
				<svg class="ring" viewBox="0 0 200 200" aria-hidden="true">
					<defs>
						<path id="ring-path" d="M100,100 m-86,0 a86,86 0 1,1 172,0 a86,86 0 1,1 -172,0" />
					</defs>
					<text>
						<textPath href="#ring-path" textLength="540"> Hi, I’m Munene ▸ 20 seconds ▸ </textPath>
					</text>
				</svg>

				<button
					class="bubble"
					onclick={() => player.open()}
					aria-label="Play my 20 second intro video"
				>
					<img src={introPoster} alt="" />
				</button>
				<button class="play-pill" onclick={() => player.open()} tabindex="-1" aria-hidden="true">
					<i></i>Play intro
				</button>
			</div>

			<div class="intro">
				<div class="name">
					<h1>Hey, I’m Munene.</h1>
					<div class="logo">
						<LogoAnimated onAnimationComplete={handleLogoAnimationComplete} />
					</div>
				</div>
				<p class="lead">
					Software engineer at Shamba Records. I build the systems that reach farmers across Kenya.
				</p>
				<div class="cta">
					<a class="btn solid" href="/projects">See my work <span aria-hidden="true">→</span></a>
					<a class="btn line" href="/contact">Say hello</a>
				</div>
			</div>
		</section>

		<ul class="stats">
			{#each stats as { n, plus, label, href }}
				<li>
					<a {href}>
						<span class="n">{n}<i>{plus}</i></span>
						<span class="label">{label}</span>
					</a>
				</li>
			{/each}
		</ul>

		<nav aria-label="more pages">
			{#each links as { name, href }}
				<a class="nav" {href}>
					<span class="arrow">-></span><span class="slash">/</span>{name}
				</a>
			{/each}
		</nav>
	</div>
</main>

<IntroPlayer bind:this={player} />

<style>
	main {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: calc(100dvh - 2rem);
		padding: 1.5rem 1.25rem 2rem;
		isolation: isolate;
	}

	.container {
		position: relative;
		z-index: 1;
		display: grid;
		gap: 1.75rem;
		width: 100%;
		max-width: 62rem;
	}

	/* ─── hero ─── */
	.hero {
		display: grid;
		justify-items: center;
		text-align: center;
		gap: 1.25rem;
	}

	.bubble-wrap {
		position: relative;
		width: min(76vw, 17rem);
		aspect-ratio: 1;
		animation: rise 0.6s both;
	}

	/* soft warm glow behind the portrait */
	.bubble-wrap::before {
		content: '';
		position: absolute;
		inset: 6%;
		border-radius: 50%;
		background: radial-gradient(circle, hsla(38, 82%, 55%, 0.35), transparent 70%);
		filter: blur(14px);
	}

	.ring {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		animation: spin 28s linear infinite;

		text {
			font-family: 'Space Mono', monospace;
			font-size: 11.5px;
			fill: var(--green);
			letter-spacing: 0.12em;
		}
	}

	.bubble {
		position: absolute;
		inset: 15%;
		display: block;
		padding: 0;
		overflow: hidden;
		border-radius: 50%;
		background: var(--bg-3);
		box-shadow:
			0 0 0 4px var(--bg),
			0 0 0 6px var(--green),
			0 18px 36px -14px hsla(148, 48%, 18%, 0.55);

		img {
			display: block;
			width: 100%;
			height: 100%;
			object-fit: cover;
			object-position: 51% 30%;
			transform: scale(1.12);
			transition: transform 0.4s;
		}
	}

	button.bubble {
		cursor: pointer;

		&:hover img {
			transform: scale(1.2);
		}
		&:focus-visible {
			outline: 3px solid var(--ochre);
			outline-offset: 8px;
		}
	}

	/* play pill: centered on the portrait's bottom edge, outside the circle's clip */
	.play-pill {
		position: absolute;
		left: 50%;
		top: 85%;
		transform: translate(-50%, -50%);
		display: inline-flex;
		align-items: center;
		gap: 0.55rem;
		min-height: 2.5rem;
		padding: 0 1.1rem 0 0.9rem;
		border-radius: 999px;
		background: var(--green);
		color: var(--bg);
		font-family: 'Space Mono', monospace;
		font-size: 0.95rem;
		white-space: nowrap;
		cursor: pointer;
		box-shadow: 0 8px 18px -6px hsla(148, 48%, 12%, 0.6);
		animation: pulse 2.4s ease-out infinite;
		transition: background 0.2s;

		i {
			display: block;
			border-style: solid;
			border-width: 0.38rem 0 0.38rem 0.65rem;
			border-color: transparent transparent transparent var(--bg);
		}

		&:hover,
		.bubble-wrap:has(button.bubble:hover) & {
			background: hsl(148, 48%, 19%);
		}
		&:focus-visible {
			outline: 3px solid var(--ochre);
			outline-offset: 3px;
		}
	}

	.intro {
		animation: rise 0.6s 0.1s both;
	}

	.name {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 1rem;
	}

	h1 {
		font-size: clamp(1.9rem, 8vw, 3rem);
		margin: 0;
	}

	.logo {
		width: 2.5rem;
		height: 2.5rem;
		flex-shrink: 0;
	}

	.lead {
		margin: 0.75rem auto 0;
		max-width: 28rem;
		font-size: 1.125rem;
		line-height: 1.55;
		color: var(--txt-2);
	}

	/* ─── the two main actions ─── */
	.cta {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.6rem;
		margin-top: 1.5rem;
	}

	.btn {
		display: inline-flex;
		align-items: center;
		gap: 0.6ch;
		min-height: 3rem;
		padding: 0 1.5rem;
		border: 2px solid var(--green);
		border-radius: 999px;
		font-family: 'Space Mono', monospace;
		font-size: 1.05rem;
		transition:
			background 0.2s,
			color 0.2s,
			border-color 0.2s;

		span {
			display: inline-block;
			transition: transform 0.2s;
		}

		&:hover span {
			transform: translateX(0.25em);
		}

		&.solid {
			background: var(--green);
			color: var(--bg);

			&:hover {
				background: hsl(148, 48%, 19%);
				border-color: hsl(148, 48%, 19%);
			}
		}

		&.line {
			color: var(--green);

			&:hover {
				background: hsla(148, 48%, 26%, 0.09);
			}
		}
	}

	/* ─── impact numbers: no boxes, just a clean strip ─── */
	.stats {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		margin: 0.5rem 0 0;
		padding: 1.25rem 0 0;
		border-top: 1px solid var(--bg-3);
		list-style: none;
		animation: rise 0.6s 0.2s both;

		li {
			margin: 0;
			text-align: center;
		}

		li + li {
			border-left: 1px solid var(--bg-3);
		}

		a {
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 0.35rem;
			padding: 0.25rem 0.5rem;

			&:hover .n {
				color: hsl(148, 48%, 19%);
			}
		}

		.n {
			font-family: 'Space Mono', monospace;
			font-size: clamp(1.9rem, 8vw, 2.9rem);
			line-height: 1;
			color: var(--green);
			transition: color 0.2s;

			i {
				font-style: normal;
				color: var(--ochre);
			}
		}

		.label {
			max-width: 11rem;
			font-size: 0.8rem;
			line-height: 1.35;
			color: var(--txt-2);
		}
	}

	/* ─── quiet links ─── */
	nav {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0 1.75rem;
		animation: rise 0.6s 0.3s both;

		a {
			display: inline-flex;
			align-items: center;
			min-height: 2.75rem;
			font-family: 'Space Mono', monospace;
			font-size: 1.1rem;
			color: var(--txt-2);
			transition: color 0.2s;

			&:hover {
				color: var(--green);
			}
		}
	}

	/* ─── desktop: text left, bubble right ─── */
	@media (min-width: 900px) {
		main {
			padding: 2rem 1.5rem;
		}

		.container {
			gap: 2.5rem;
		}

		.hero {
			grid-template-columns: minmax(0, 1fr) auto;
			grid-template-areas: 'intro bubble';
			justify-items: start;
			align-items: center;
			text-align: left;
			gap: 3rem;
		}

		.bubble-wrap {
			grid-area: bubble;
			width: 22rem;
		}

		.intro {
			grid-area: intro;
		}

		.name {
			justify-content: flex-start;
			gap: 1.5rem;
		}

		h1 {
			font-size: 3.25rem;
		}

		.logo {
			width: 3.5rem;
			height: 3.5rem;
		}

		.lead {
			margin-left: 0;
			font-size: 1.25rem;
			max-width: 30rem;
		}

		.cta {
			justify-content: flex-start;
		}

		.stats {
			padding-top: 1.75rem;

			.label {
				font-size: 0.95rem;
			}
		}

		nav {
			justify-content: flex-start;
			gap: 0 2.25rem;
		}
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	@keyframes pulse {
		0% {
			box-shadow:
				0 6px 16px -4px hsla(148, 48%, 12%, 0.6),
				0 0 0 0 hsla(148, 48%, 30%, 0.5);
		}
		100% {
			box-shadow:
				0 6px 16px -4px hsla(148, 48%, 12%, 0.6),
				0 0 0 14px hsla(148, 48%, 30%, 0);
		}
	}

	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(14px);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.ring,
		.play-pill {
			animation: none;
		}
	}
</style>
