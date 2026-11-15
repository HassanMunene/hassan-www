<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	import { formatDateLong } from '$lib/js/utils.js';
	import Cover from '$lib/components/Cover.svelte';
	import avatar from '$lib/assets/avatar.jpg';
	import RssIcon from '~icons/ph/rss';
	import SearchIcon from '~icons/ph/magnifying-glass';
	import CaretIcon from '~icons/ph/caret-down';
	import CheckIcon from '~icons/ph/check';

	let { data } = $props();

	let tag = $state('all');
	let query = $state('');
	let open = $state(false);
	let topicEl = $state(null);

	// every topic with how many posts it has, most used first
	const topics = $derived.by(() => {
		const counts = {};
		for (const post of data.posts)
			for (const t of post.tags ?? []) counts[t] = (counts[t] ?? 0) + 1;
		return Object.entries(counts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
	});

	const filtered = $derived.by(() => {
		const q = query.trim().toLowerCase();
		return data.posts.filter(
			(post) =>
				(tag === 'all' || post.tags?.includes(tag)) &&
				(!q || `${post.name} ${post.description}`.toLowerCase().includes(q))
		);
	});

	// the plain "latest" view leads with a hero card; any filter turns it into a grid
	const browsing = $derived(tag === 'all' && !query.trim());
	const hero = $derived(browsing ? filtered[0] : null);
	const rest = $derived(browsing ? filtered.slice(1) : filtered);

	function pick(next) {
		tag = next;
		open = false;
	}

	// close the topic menu on Escape or a click outside it
	function onKey(e) {
		if (e.key === 'Escape') open = false;
	}
	function onPointer(e) {
		if (open && topicEl && !topicEl.contains(e.target)) open = false;
	}

	// topic links from a post (/blog?tag=databases) preselect the chip
	onMount(() => {
		const wanted = new URLSearchParams(location.search).get('tag');
		if (wanted && topics.some(([t]) => t === wanted)) tag = wanted;
	});
</script>

<svelte:window onkeydown={onKey} onpointerdown={onPointer} />

<main>
	<div class="header">
		<div>
			<h1>
				Blog<span class="count" aria-label="{data.posts.length} posts">[{data.posts.length}]</span>
			</h1>
			<p class="lede">Notes on backend engineering, reliability, and building for real users.</p>
		</div>
		<a href="/blog/rss.xml" class="rss-link"><RssIcon /> RSS</a>
	</div>

	<div class="tools">
		<label class="search">
			<SearchIcon />
			<input
				type="search"
				placeholder="Search posts"
				bind:value={query}
				aria-label="Search posts"
			/>
		</label>
		<div class="topic" bind:this={topicEl}>
			<button
				class={['topic-btn', { on: tag !== 'all' }]}
				aria-haspopup="listbox"
				aria-expanded={open}
				onclick={() => (open = !open)}
			>
				<span class="label">{tag === 'all' ? 'All topics' : tag}</span>
				<CaretIcon class="caret" />
			</button>
			{#if open}
				<ul class="menu" role="listbox" aria-label="Topic">
					<li>
						<button
							role="option"
							aria-selected={tag === 'all'}
							class={{ sel: tag === 'all' }}
							onclick={() => pick('all')}
						>
							<span>All topics</span><span class="n">{data.posts.length}</span>
						</button>
					</li>
					{#each topics as [t, n] (t)}
						<li>
							<button
								role="option"
								aria-selected={tag === t}
								class={{ sel: tag === t }}
								onclick={() => pick(t)}
							>
								<span>{t}</span>
								<span class="n">
									{#if tag === t}<CheckIcon />{/if}{n}
								</span>
							</button>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	</div>

	{#if hero}
		<a href={'/blog/' + hero.slug} class="hero">
			<div class="art">
				<Cover slug={hero.slug} title={hero.name} tag={hero.tags?.[0]} size="hero" />
			</div>
			<div class="body">
				<span class="label"
					>Latest{#if dev && hero.published === false}<em>&nbsp;· draft</em>{/if}</span
				>
				<h2>{hero.name}</h2>
				<p class="desc">{hero.description}</p>
				<div class="by">
					<img src={avatar} alt="" />
					<span>Munene</span>
					<span class="dot">·</span>
					<span>{formatDateLong(hero.date)}</span>
					<span class="dot">·</span>
					<span>{hero.minutes} min read</span>
				</div>
			</div>
		</a>
	{/if}

	<div class="grid">
		{#each rest as post (post.slug)}
			<a href={'/blog/' + post.slug} class="card">
				<div class="art">
					<Cover slug={post.slug} title={post.name} tag={post.tags?.[0]} />
					{#if dev && post.published === false}<span class="draft">draft</span>{/if}
				</div>
				<div class="body">
					{#if post.tags?.length}
						<div class="tags">
							{#each post.tags as t (t)}<span>{t}</span>{/each}
						</div>
					{/if}
					<h3>{post.name}</h3>
					<p class="desc">{post.description}</p>
					<div class="by">
						<img src={avatar} alt="" />
						<span>{formatDateLong(post.date)}</span>
						<span class="dot">·</span>
						<span>{post.minutes} min read</span>
					</div>
				</div>
			</a>
		{/each}
	</div>

	{#if filtered.length === 0}
		<p class="empty">
			Nothing matches that. <button class="reset" onclick={() => ((tag = 'all'), (query = ''))}
				>Clear filters</button
			>
		</p>
	{/if}
</main>

<style>
	main {
		width: 100%;
		max-width: 72rem;
		margin: 0 auto 10rem auto;
		padding: 0 1.25rem;
	}

	.header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 1rem;

		h1 {
			margin-bottom: 0.5rem;
		}
	}

	.count {
		color: var(--bg-3);
	}

	.rss-link {
		margin-top: 1.75rem;
		font-family: 'Space Mono', monospace;
		color: var(--txt-2);

		:global(svg) {
			font-size: 1.125em;
			vertical-align: middle;
		}

		&:hover {
			color: var(--green);
		}
	}

	.lede {
		margin: 0 0 1.5rem;
		color: var(--txt-2);
	}

	/* ─── search + topic dropdown, one row ─── */
	.tools {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.6rem;
		margin-bottom: 2rem;
	}

	.search {
		flex: 1 1 9rem;
		min-width: 0;
		display: flex;
		align-items: center;
		gap: 0.6rem;
		max-width: 28rem;
		padding: 0 1rem;
		min-height: 3rem;
		border: 2px solid var(--bg-3);
		border-radius: 999px;
		color: var(--txt-2);
		transition: border-color 0.2s;

		&:focus-within {
			border-color: var(--green);
		}

		:global(svg) {
			flex-shrink: 0;
			font-size: 1.2rem;
		}

		input {
			flex: 1;
			min-width: 0;
			border: none;
			outline: none;
			background: transparent;
			font: inherit;
			font-size: 1rem;
			color: var(--txt);
		}
	}

	.topic {
		position: relative;
	}

	.topic-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
		min-height: 3rem;
		padding: 0 1rem 0 1.15rem;
		border: 2px solid var(--bg-3);
		border-radius: 999px;
		background: transparent;
		font-family: 'Space Mono', monospace;
		font-size: 0.95rem;
		color: var(--txt);
		cursor: pointer;
		transition:
			border-color 0.2s,
			background 0.2s,
			color 0.2s;

		:global(.caret) {
			font-size: 1rem;
			transition: transform 0.2s;
		}

		&[aria-expanded='true'] :global(.caret) {
			transform: rotate(180deg);
		}

		&:hover,
		&[aria-expanded='true'] {
			border-color: var(--green);
		}

		&.on {
			background: var(--green);
			border-color: var(--green);
			color: var(--bg);
		}

		&:focus-visible {
			outline: 3px solid var(--ochre);
			outline-offset: 3px;
		}
	}

	.menu {
		position: absolute;
		top: calc(100% + 0.5rem);
		left: 0;
		z-index: 30;
		min-width: 15rem;
		max-height: min(22rem, 60vh);
		overflow-y: auto;
		margin: 0;
		padding: 0.4rem;
		list-style: none;
		border: 1px solid var(--bg-3);
		border-radius: 1rem;
		background: var(--bg);
		box-shadow: 0 22px 44px -22px hsl(30 25% 9% / 0.4);
		animation: menu-in 0.15s ease-out;

		li {
			margin: 0;
		}

		button {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 1rem;
			width: 100%;
			min-height: 2.6rem;
			padding: 0 0.8rem;
			border: none;
			border-radius: 0.65rem;
			background: transparent;
			font-family: 'Space Mono', monospace;
			font-size: 0.95rem;
			color: var(--txt);
			text-align: left;
			cursor: pointer;

			&:hover {
				background: var(--bg-2);
			}

			&.sel {
				color: var(--green);
				background: hsla(148, 48%, 26%, 0.09);
			}

			&:focus-visible {
				outline: 3px solid var(--ochre);
				outline-offset: -3px;
			}

			.n {
				display: inline-flex;
				align-items: center;
				gap: 0.4rem;
				color: var(--txt-3);
			}
		}
	}

	@keyframes menu-in {
		from {
			opacity: 0;
			transform: translateY(-6px);
		}
	}

	/* ─── shared card bits ─── */
	.hero,
	.card {
		display: block;
		overflow: hidden;
		border: 1px solid var(--bg-3);
		border-radius: 1rem;
		background: var(--bg);
		transition:
			transform 0.25s,
			box-shadow 0.25s,
			border-color 0.25s;

		&:hover {
			transform: translateY(-3px);
			border-color: var(--green);
			box-shadow: 0 18px 36px -22px hsla(148, 48%, 18%, 0.55);
		}

		.art {
			position: relative;
			overflow: hidden;
		}

		.art :global(.cover) {
			transition: transform 0.5s;
		}

		&:hover .art :global(.cover) {
			transform: scale(1.04);
		}
	}

	.by {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0 0.7ch;
		font-family: 'Space Mono', monospace;
		font-size: 0.85rem;
		color: var(--txt-2);

		img {
			width: 1.75rem;
			height: 1.75rem;
			margin-right: 0.3rem;
			border-radius: 50%;
			object-fit: cover;
		}

		.dot {
			color: var(--txt-3);
		}
	}

	.desc {
		margin: 0;
		color: var(--txt-2);
		line-height: 1.55;
	}

	/* ─── hero (latest) ─── */
	.hero {
		display: grid;
		margin-bottom: 1.75rem;

		.body {
			display: flex;
			flex-direction: column;
			gap: 0.75rem;
			justify-content: center;
			padding: 1.25rem 1.25rem 1.5rem;
		}

		.label {
			align-self: flex-start;
			padding: 0.15rem 0.7rem;
			border-radius: 999px;
			background: var(--ochre);
			color: hsl(30, 25%, 9%);
			font-family: 'Space Mono', monospace;
			font-size: 0.8rem;

			em {
				font-style: normal;
			}
		}

		h2 {
			margin: 0;
			font-size: clamp(1.5rem, 5vw, 2.1rem);
			color: var(--txt-0);
		}

		.desc {
			font-size: 1.1rem;
		}
	}

	/* ─── card grid ─── */
	.grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.25rem;
	}

	.card {
		display: flex;
		flex-direction: column;

		.body {
			display: flex;
			flex: 1;
			flex-direction: column;
			gap: 0.6rem;
			padding: 1rem 1.1rem 1.1rem;
		}

		h3 {
			margin: 0;
			font-size: 1.2rem;
			line-height: 1.3;
			color: var(--txt-0);
		}

		.desc {
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 3;
			line-clamp: 3;
			overflow: hidden;
			font-size: 0.95rem;
		}

		.by {
			margin-top: auto;
			padding-top: 0.6rem;
		}
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;

		span {
			padding: 0.1rem 0.6rem;
			border-radius: 999px;
			background: var(--bg-2);
			font-family: 'Space Mono', monospace;
			font-size: 0.75rem;
			color: var(--txt-2);
		}
	}

	/* shown only in dev, for posts that are still drafts */
	.draft {
		position: absolute;
		top: 0.6rem;
		right: 0.6rem;
		padding: 0.1rem 0.6rem;
		border-radius: 999px;
		background: hsla(30, 25%, 9%, 0.85);
		color: #fff;
		font-family: 'Space Mono', monospace;
		font-size: 0.75rem;
	}

	.empty {
		font-family: 'Space Mono', monospace;
		color: var(--txt-2);

		.reset {
			background: none;
			color: var(--green);
			text-decoration: underline;
			font: inherit;
		}
	}

	@media (min-width: 700px) {
		main {
			padding: 0 2rem;
		}

		.grid {
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 1.5rem;
		}
	}

	@media (min-width: 900px) {
		.hero {
			grid-template-columns: minmax(0, 1.25fr) minmax(0, 1fr);

			.body {
				padding: 1.75rem;
			}
		}
	}

	@media (min-width: 1100px) {
		.grid {
			grid-template-columns: repeat(3, minmax(0, 1fr));
		}
	}
</style>
