<script>
	import { onMount } from 'svelte';
	import { formatDateLong } from '$lib/js/utils.js';
	import { iconMap } from '$lib/js/icons.js';
	import Cover from '$lib/components/Cover.svelte';
	import avatar from '$lib/assets/avatar.jpg';

	let { data } = $props();
	let { default: content, metadata } = data.post;
	let Icon = iconMap[metadata.icon];

	const Content = $derived(content);

	// outline of the post, built from its headings once it is on the page
	let toc = $state([]);
	let activeId = $state('');
	let copied = $state(false);

	function slugify(text) {
		return text
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-|-$/g, '');
	}

	async function copyLink() {
		try {
			await navigator.clipboard.writeText(location.href);
			copied = true;
			setTimeout(() => (copied = false), 1800);
		} catch {
			/* clipboard blocked: nothing useful to do */
		}
	}

	onMount(() => {
		const root = document.querySelector('.content');
		if (!root) return;

		// 1. headings get ids and a hover anchor, and feed the outline
		const used = new Set();
		const headings = [...root.querySelectorAll('h2, h3')];
		toc = headings.map((h) => {
			let id = slugify(h.textContent) || 'section';
			while (used.has(id)) id += '-2';
			used.add(id);
			h.id = id;
			const a = document.createElement('a');
			a.href = '#' + id;
			a.className = 'anchor';
			a.textContent = '#';
			a.setAttribute('aria-label', 'link to this section');
			h.appendChild(a);
			return { id, text: h.textContent.replace(/#$/, ''), level: h.tagName === 'H2' ? 2 : 3 };
		});

		// 2. a copy button on every code block
		for (const pre of root.querySelectorAll('pre')) {
			pre.style.position = 'relative';
			const btn = document.createElement('button');
			btn.className = 'copy';
			btn.type = 'button';
			btn.textContent = 'Copy';
			btn.addEventListener('click', async () => {
				try {
					await navigator.clipboard.writeText(
						pre.querySelector('code')?.innerText ?? pre.innerText
					);
					btn.textContent = 'Copied';
					setTimeout(() => (btn.textContent = 'Copy'), 1500);
				} catch {
					btn.textContent = 'Press Ctrl+C';
				}
			});
			pre.appendChild(btn);
		}

		// 3. highlight the section being read
		const observer = new IntersectionObserver(
			(entries) => {
				for (const e of entries) if (e.isIntersecting) activeId = e.target.id;
			},
			{ rootMargin: '-90px 0px -70% 0px' }
		);
		headings.forEach((h) => observer.observe(h));
		return () => observer.disconnect();
	});
</script>

<div class="layout">
	<main>
		<div class="head">
			<a href="/blog" class="back"><span class="arrow">&lt;-</span>blog</a>
		</div>

		<div class="cover-wrap">
			<Cover slug={data.slug} title={metadata.name} tag={metadata.tags?.[0]} size="hero" />
		</div>

		<h1>
			<Icon class="icon" />{metadata.name}
		</h1>

		<div class="byline">
			<img class="av" src={avatar} alt="" />
			<span class="by">Munene</span>
			<span class="dot">·</span>
			<span>{formatDateLong(metadata.date)}</span>
			<span class="dot">·</span>
			<span>{data.minutes} min read</span>
			{#if metadata.tags?.length}
				<span class="tags">
					{#each metadata.tags as t}
						<a href={'/blog?tag=' + t} class="tag">{t}</a>
					{/each}
				</span>
			{/if}
		</div>

		<p class="description">{metadata.description}</p>

		<div class="content">
			<Content />
		</div>

		<!-- who wrote this, and what to do next -->
		<section class="author">
			<img src={avatar} alt="Munene" />
			<div>
				<p class="who">Written by Munene</p>
				<p class="bio">
					Software engineer at Shamba Records. I write about the backend problems I run into while
					building for farmers.
				</p>
				<div class="actions">
					<a href="/projects" class="btn solid">See my work</a>
					<a href="/contact" class="btn line">Say hello</a>
					<button class="btn line" onclick={copyLink}>{copied ? 'Link copied' : 'Copy link'}</button
					>
				</div>
			</div>
		</section>

		{#if data.related.length}
			<section class="more">
				<h2>Keep reading</h2>
				<div class="more-grid">
					{#each data.related as post (post.slug)}
						<a href={'/blog/' + post.slug} class="mini">
							<span class="m">{formatDateLong(post.date)}</span>
							<span class="t">{post.name}</span>
							<span class="d">{post.description}</span>
						</a>
					{/each}
				</div>
			</section>
		{/if}

		{#if data.newer || data.older}
			<nav class="pager" aria-label="More posts">
				{#if data.older}
					<a href={'/blog/' + data.older.slug} class="prev">
						<span class="dir">&lt;- Older</span>
						<span class="t">{data.older.name}</span>
					</a>
				{:else}
					<span></span>
				{/if}
				{#if data.newer}
					<a href={'/blog/' + data.newer.slug} class="next">
						<span class="dir">Newer -></span>
						<span class="t">{data.newer.name}</span>
					</a>
				{/if}
			</nav>
		{/if}
	</main>

	{#if toc.length > 1}
		<aside class="toc" aria-label="On this page">
			<p>On this page</p>
			<ul>
				{#each toc as item}
					<li class:sub={item.level === 3}>
						<a href={'#' + item.id} class:on={activeId === item.id}>{item.text}</a>
					</li>
				{/each}
			</ul>
		</aside>
	{/if}
</div>

<style>
	.layout {
		display: grid;
		grid-template-columns: minmax(0, 53rem);
		justify-content: center;
		gap: 3rem;
	}

	main {
		width: 100%;
		margin: 0 auto 10rem auto;
		padding: 1.5rem;
	}

	.content {
		overflow-x: hidden;
		max-width: 100%;
		margin-bottom: 3rem;
	}

	/* section links appear when you hover a heading */
	.content :global(h2),
	.content :global(h3) {
		scroll-margin-top: 5.5rem;
	}

	.content :global(.anchor) {
		margin-left: 0.5ch;
		color: var(--txt-3);
		font-weight: 400;
		text-decoration: none;
		opacity: 0;
		transition: opacity 0.2s;
	}

	.content :global(h2:hover .anchor),
	.content :global(h3:hover .anchor),
	.content :global(.anchor:focus-visible) {
		opacity: 1;
	}

	/* copy button inside code blocks */
	.content :global(pre .copy) {
		position: absolute;
		top: 0.4rem;
		right: 0.4rem;
		padding: 0.2rem 0.65rem;
		border-radius: 999px;
		background: var(--bg-3);
		color: var(--txt-2);
		font-family: 'Space Mono', monospace;
		font-size: 0.75rem;
		opacity: 0;
		transition: opacity 0.2s;
	}

	.content :global(pre:hover .copy),
	.content :global(pre .copy:focus-visible) {
		opacity: 1;
	}

	@media (hover: none) {
		.content :global(pre .copy) {
			opacity: 1;
		}
	}

	.cover-wrap {
		margin: 1rem 0 1.5rem;
		overflow: hidden;
		border-radius: 1rem;
		border: 1px solid var(--bg-3);
	}

	.av {
		width: 2rem;
		height: 2rem;
		border-radius: 50%;
		object-fit: cover;
	}

	.by {
		color: var(--txt-0);
	}

	h1 {
		font-size: clamp(1.9rem, 7vw, 2.5rem);
		margin: 1rem 0;
	}

	h1 :global(.icon) {
		margin-right: 0.75ch;
	}

	.byline {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.4rem 0.75ch;
		font-family: 'Space Mono', monospace;
		font-size: 1.05rem;

		.dot {
			color: var(--txt-3);
		}
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		margin-left: 0.5rem;
	}

	.tag {
		padding: 0.1rem 0.7rem;
		border-radius: 999px;
		background: var(--bg-2);
		font-size: 0.8rem;
		color: var(--txt-2);
		transition:
			background 0.2s,
			color 0.2s;

		&:hover {
			background: var(--green);
			color: var(--bg);
		}
	}

	.description {
		font-size: 1.125rem;
		margin: 0.75rem 0 1.5rem 0;
		font-style: italic;
		color: var(--txt-2);
	}

	/* ─── author footer ─── */
	.author {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 1.25rem;
		padding: 1.5rem;
		border-radius: 1rem;
		background: var(--bg-2);
		border-left: 4px solid var(--green);

		img {
			width: 4.5rem;
			height: 4.5rem;
			border-radius: 50%;
			object-fit: cover;
			object-position: 51% 30%;
			box-shadow: 0 0 0 3px var(--bg);
		}

		p {
			margin: 0;
		}

		.who {
			font-family: 'Space Mono', monospace;
			font-size: 1.1rem;
			color: var(--txt-0);
		}

		.bio {
			margin: 0.35rem 0 1rem;
			font-size: 1rem;
			line-height: 1.55;
			color: var(--txt-2);
		}
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.btn {
		display: inline-flex;
		align-items: center;
		min-height: 2.75rem;
		padding: 0 1.2rem;
		border: 2px solid var(--green);
		border-radius: 999px;
		background: transparent;
		font-family: 'Space Mono', monospace;
		font-size: 0.95rem;
		transition:
			background 0.2s,
			color 0.2s;

		&.solid {
			background: var(--green);
			color: var(--bg);

			&:hover {
				background: hsl(148, 48%, 19%);
			}
		}

		&.line {
			color: var(--green);

			&:hover {
				background: hsla(148, 48%, 26%, 0.09);
			}
		}
	}

	/* ─── keep reading ─── */
	.more {
		margin-top: 3rem;

		h2 {
			font-size: 1.5rem;
			margin: 0 0 1rem;
		}
	}

	.more-grid {
		display: grid;
		gap: 0.75rem;
	}

	.mini {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		padding: 1rem 1.1rem;
		border: 2px solid var(--bg-3);
		border-radius: 0.8rem;
		transition:
			border-color 0.2s,
			background 0.2s;

		&:hover {
			border-color: var(--green);
			background: var(--bg-2);
		}

		.m {
			font-family: 'Space Mono', monospace;
			font-size: 0.85rem;
			color: var(--txt-2);
		}

		.t {
			font-family: 'Space Mono', monospace;
			font-size: 1.1rem;
			color: var(--txt-0);
		}

		.d {
			font-size: 0.95rem;
			line-height: 1.5;
			color: var(--txt-2);
		}
	}

	/* ─── older / newer ─── */
	.pager {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.75rem;
		margin-top: 2rem;
		padding-top: 1.5rem;
		border-top: 1px solid var(--bg-3);

		a {
			display: flex;
			flex-direction: column;
			gap: 0.3rem;
			padding: 0.5rem 0;
		}

		.next {
			text-align: right;
			grid-column: 2;
		}

		.dir {
			font-family: 'Space Mono', monospace;
			font-size: 0.85rem;
			color: var(--green);
		}

		.t {
			color: var(--txt);
			line-height: 1.4;
		}

		a:hover .t {
			color: var(--green);
		}
	}

	/* ─── outline rail (wide screens only) ─── */
	.toc {
		display: none;
	}

	@media (min-width: 1280px) {
		.layout {
			grid-template-columns: minmax(0, 53rem) 15rem;
		}

		.toc {
			display: block;
			position: sticky;
			top: 6rem;
			align-self: start;
			max-height: calc(100vh - 8rem);
			overflow-y: auto;
			padding-top: 2.5rem;

			p {
				margin: 0 0 0.75rem;
				font-family: 'Space Mono', monospace;
				font-size: 0.85rem;
				color: var(--txt-3);
			}

			ul {
				margin: 0;
				padding: 0 0 0 0.9rem;
				list-style: none;
				border-left: 2px solid var(--bg-3);
			}

			li {
				margin: 0;
			}

			li.sub {
				padding-left: 0.9rem;
			}

			a {
				display: block;
				margin-left: calc(-0.9rem - 2px);
				padding: 0.3rem 0 0.3rem 0.9rem;
				border-left: 2px solid transparent;
				font-size: 0.9rem;
				line-height: 1.35;
				color: var(--txt-2);
				transition:
					color 0.2s,
					border-color 0.2s;

				&:hover {
					color: var(--txt-0);
				}

				&.on {
					color: var(--green);
					border-left-color: var(--green);
				}
			}

			li.sub a {
				margin-left: calc(-1.8rem - 2px);
				padding-left: 1.8rem;
			}
		}
	}

	@media (max-width: 600px) {
		.author {
			grid-template-columns: 1fr;
		}

		.pager {
			grid-template-columns: 1fr;

			.next {
				grid-column: 1;
				text-align: left;
			}
		}
	}
</style>
