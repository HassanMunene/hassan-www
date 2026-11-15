<script>
	import ContributionGraph from '$lib/components/ContributionGraph.svelte';
	import GithubIcon from '~icons/ph/github-logo';
	import XIcon from '~icons/ph/x-logo';
	import LinkedinIcon from '~icons/ph/linkedin-logo';
	import IntroPlayer from '$lib/components/IntroPlayer.svelte';
	import portrait from '../../content/journey/intro-poster.jpg?url';

	const doing = [
		{
			title: 'The Shamba Records platform',
			text: 'APIs, USSD workflows and payment integrations behind a platform that serves more than 150,000 farmers across Kenya.',
			href: '/projects/shamba-records-platform'
		},
		{
			title: 'The PMIS',
			text: 'Part of the lead team on the Project Management Information System for the Ministry of Agriculture, built with the World Bank and covering 13 counties.',
			href: '/projects/pmis'
		},
		{
			title: 'Out in the field',
			text: 'Training the people who use what we build, and visiting farmers to see how they use it.',
			href: '/field-notes'
		}
	];

	const work = [
		{
			when: 'Oct 2025 – now',
			role: 'Software engineer',
			org: 'Shamba Records',
			text: 'Backend systems for an agricultural platform serving 150,000+ farmers across web, mobile, field-agent and USSD channels. Also the FSRP PMIS and the EDMS.',
			projects: [
				{ name: 'Shamba Records Platform', href: '/projects/shamba-records-platform' },
				{ name: 'PMIS', href: '/projects/pmis' },
				{ name: 'EDMS', href: '/projects/edms' }
			]
		},
		{
			when: 'Feb – Aug 2025',
			role: 'Backend developer',
			org: 'Goymarey Software Solutions',
			text: 'APIs, business logic and data models for an ERP and a social media lead management system.'
		},
		{
			when: 'Jun – Dec 2024',
			role: 'Full-stack developer',
			org: 'Lakewood Crystal Group',
			text: 'Led development of an e-commerce platform for cybersecurity products in React and Laravel, with M-Pesa C2B and B2B payments, my first big project.',
			projects: [{ name: 'Cybill Software', href: '/projects/cybillsoftware' }]
		}
	];

	const stack = {
		Backend: ['PHP', 'Laravel', 'Python', 'Django', 'Celery', 'REST APIs', 'USSD'],
		Data: ['MySQL', 'PostgreSQL', 'Redis', 'Schema design', 'Query optimization'],
		Frontend: ['TypeScript', 'JavaScript', 'React', 'shadcn/ui'],
		Integrations: [
			'M-Pesa',
			'Bank APIs',
			'Payment gateways',
			'SMS gateways',
			'Credit scoring',
			'Mayan EDMS'
		],
		Tools: ['Git', 'GitHub', 'Postman', 'Docker']
	};

	let player = $state();
</script>

<main>
	<h1>About</h1>

	<section class="intro">
		<div class="portrait">
			<img src={portrait} alt="Munene smiling and waving, in a green Shamba Records polo" />
			<button
				class="play-pill"
				onclick={() => player.open()}
				aria-label="Play my 20 second intro video"
			>
				<i></i>Play intro
			</button>
		</div>
		<div class="story">
			<p>
				Hey! I'm Munene, a software engineer in Nairobi, working at Shamba Records, one of Kenya's
				leading agritech companies. I build the systems that reach farmers: APIs, USSD and payments
				on the backend, and I work on the frontend when it's needed.
			</p>
			<p>
				I trained at Holberton School, then built an e-commerce platform at Lakewood, an ERP at
				Goymarey, and now the Shamba platform, the PMIS and the EDMS. The projects that taught me
				the most are the ones people depend on every day.
			</p>
			<p>
				I've learned that building is only half the job. The rest is rolling it out, training the
				people who use it, and picking up the phone when something breaks.
			</p>
		</div>
	</section>

	<h2>What I do</h2>
	<ul class="doing">
		{#each doing as { title, text, href }}
			<li>
				<a {href} class="card">
					<span class="t">{title}</span>
					<span class="d">{text}</span>
				</a>
			</li>
		{/each}
	</ul>

	<h2>Where I've worked</h2>
	<ol class="timeline">
		{#each work as { when, role, org, text, projects }}
			<li>
				<div class="when">{when}</div>
				<div class="role">{role} <span class="sub">/</span> {org}</div>
				<p>{text}</p>
				{#if projects}
					<div class="proj">
						{#each projects as project}
							<a href={project.href}>{project.name} <span aria-hidden="true">→</span></a>
						{/each}
					</div>
				{/if}
			</li>
		{/each}
	</ol>

	<h2>Stack</h2>
	{#each Object.entries(stack) as [category, items]}
		<div class="info">
			{category} <span class="sub">-></span>
			{#each items as item, i}
				<span>{item}</span>{#if i < items.length - 1}<span class="sub sep">/</span><wbr />{/if}
			{/each}
		</div>
	{/each}

	<h2>Education</h2>
	<div class="info">
		B.Sc. Information Technology <span class="sub">-></span> KCA University, 2025, second class honours
		(upper division)
	</div>
	<div class="info">
		Software engineering <span class="sub">-></span> Holberton School, 2022 – 2023
	</div>
	<div class="info">
		High school <span class="sub">-></span> Starehe Boys' Centre, 2018
	</div>

	<h2>Links</h2>
	<div class="links">
		<a href="https://github.com/HassanMunene" class="external icon">
			<GithubIcon /><span class="text">GitHub</span><span class="arrow">/></span>
		</a>
		<a href="https://www.linkedin.com/in/hassan-munene-41290b237" class="external icon">
			<LinkedinIcon /><span class="text">LinkedIn</span><span class="arrow">/></span>
		</a>
		<a href="https://x.com/awanzii" class="external icon">
			<XIcon /><span class="text">X / Twitter</span><span class="arrow">/></span>
		</a>
	</div>

	<h2>Contributions</h2>
	<ContributionGraph />

	<p class="colophon">
		Built with SvelteKit, mdsvex and Cloudflare. Set in Space Mono and Space Grotesk. Based on a
		<a href="https://github.com/refact0r/www" class="external">template by refact0r</a>.
	</p>
</main>

<IntroPlayer bind:this={player} />

<style>
	main {
		width: 100%;
		max-width: 53rem;
		margin: 0 auto 8rem auto;
		padding: 0 1.5rem;
	}

	.links a {
		font-family: 'Space Mono', monospace;
	}

	.links a {
		display: block;
		font-size: 1.25rem;
		margin: 0.5rem 0;
	}

	/* ─── intro: portrait + story ─── */
	.intro {
		display: grid;
		grid-template-columns: 1fr;
		justify-items: start;
		gap: 2rem;
		margin-bottom: 0.5rem;

		.portrait {
			position: relative;
			margin-bottom: 0.9rem;
		}

		.story p + p {
			margin-top: 0.9rem;
		}

		img {
			width: 7.5rem;
			height: 7.5rem;
			border-radius: 50%;
			object-fit: cover;
			object-position: 51% 30%;
			transform: scale(1);
			box-shadow:
				0 0 0 4px var(--bg),
				0 0 0 6px var(--green);
		}

		p {
			margin: 0;
		}
	}

	/* ─── what i do ─── */
	.doing {
		display: grid;
		gap: 0.75rem;
		margin: 0;
		padding: 0;
		list-style: none;

		li {
			margin: 0;
		}
	}

	.card {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		height: 100%;
		padding: 1rem 1.1rem;
		border-left: 3px solid var(--green);
		background: var(--bg-2);
		border-radius: 0 0.6rem 0.6rem 0;
		transition:
			background 0.2s,
			transform 0.2s;

		&:hover {
			background: var(--bg-3);
			transform: translateX(3px);
		}

		.t {
			font-family: 'Space Mono', monospace;
			font-size: 1.1rem;
			color: var(--txt-0);
		}

		.d {
			font-size: 1rem;
			line-height: 1.55;
			color: var(--txt-2);
		}
	}

	/* ─── timeline ─── */
	.timeline {
		margin: 0;
		padding: 0 0 0 1.25rem;
		list-style: none;
		border-left: 2px solid var(--bg-3);

		li {
			position: relative;
			margin: 0 0 1.5rem 0;
		}

		li::before {
			content: '';
			position: absolute;
			left: calc(-1.25rem - 6px);
			top: 0.35rem;
			width: 10px;
			height: 10px;
			border-radius: 50%;
			background: var(--green);
		}

		li:first-child::before {
			background: var(--ochre);
		}

		.when {
			font-family: 'Space Mono', monospace;
			font-size: 0.95rem;
			color: var(--txt-2);
		}

		.role {
			font-family: 'Space Mono', monospace;
			font-size: 1.15rem;
			color: var(--txt-0);
			margin: 0.15rem 0;
		}

		p {
			margin: 0.25rem 0 0;
			font-size: 1rem;
			line-height: 1.55;
			color: var(--txt-2);
		}
	}

	.timeline .proj {
		display: flex;
		flex-wrap: wrap;
		gap: 0.25rem 1.25rem;
		margin-top: 0.5rem;

		a {
			font-family: 'Space Mono', monospace;
			font-size: 0.95rem;
			color: var(--green);

			&:hover {
				text-decoration: underline;
			}
		}
	}

	.sep {
		margin: 0 0.9ch;
	}

	.play-pill {
		position: absolute;
		left: 50%;
		bottom: -0.9rem;
		transform: translateX(-50%);
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		min-height: 2.25rem;
		padding: 0 1rem 0 0.8rem;
		border-radius: 999px;
		background: var(--green);
		color: var(--bg);
		font-family: 'Space Mono', monospace;
		font-size: 0.9rem;
		white-space: nowrap;
		cursor: pointer;
		box-shadow: 0 8px 18px -6px hsla(148, 48%, 12%, 0.6);
		animation: pulse 2.4s ease-out infinite;
		transition: background 0.2s;

		i {
			display: block;
			border-style: solid;
			border-width: 0.35rem 0 0.35rem 0.6rem;
			border-color: transparent transparent transparent var(--bg);
		}

		&:hover {
			background: hsl(148, 48%, 19%);
		}
		&:focus-visible {
			outline: 3px solid var(--ochre);
			outline-offset: 3px;
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

	@media (prefers-reduced-motion: reduce) {
		.play-pill {
			animation: none;
		}
	}

	.info {
		font-size: 1.05rem;
		line-height: 1.7;
		margin: 0.4rem 0;
		font-family: 'Space Mono', monospace;
	}

	.colophon {
		margin-top: 3rem;
		font-size: 0.95rem;
		line-height: 1.7;
		color: var(--txt-2);

		a {
			font-size: inherit;
		}
	}

	@media (min-width: 700px) {
		.intro {
			grid-template-columns: auto 1fr;
			align-items: start;
			gap: 2rem;

			img {
				width: 9rem;
				height: 9rem;
			}
		}

		.doing {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}
</style>
