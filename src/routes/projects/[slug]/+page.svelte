<script>
	import Image from '$lib/components/Image.svelte';

	let { data } = $props();

	let { default: content, metadata } = data.post;

	const Content = $derived(content);

	const hero = metadata.images?.[0];
	const inset = metadata.images?.[1];
	const insetLabel = metadata.insetLabel ?? 'In the field';
	const gallery = metadata.images?.slice(2) ?? [];
	const stack = metadata.stack ?? [];
	const stats = metadata.stats ?? [];

	const facts = [
		{ label: 'role', value: metadata.role },
		{ label: 'status', value: metadata.status },
		{ label: 'channels', value: metadata.channels }
	].filter((f) => f.value);
</script>

<main>
	<header class="head">
		<a href="/projects" class="back"><span class="arrow">&lt;-</span>projects</a>
		<div class="title-row">
			<h1>{metadata.name}</h1>
			<div class="links">
				{#if metadata.website}
					<a class="external" href={metadata.website} target="_blank" rel="noopener">
						site<span class="arrow">/></span>
					</a>
				{/if}
				{#if metadata.github}
					<a class="external" href={metadata.github} target="_blank" rel="noopener">
						github<span class="arrow">/></span>
					</a>
				{/if}
			</div>
		</div>
		<p class="description">{metadata.description}</p>
	</header>

	{#if hero}
		<figure class="hero" class:has-inset={inset}>
			<div class="frame">
				<Image
					image={hero}
					alt={metadata.name}
					sizes="(min-width: 1100px) 1040px, 100vw"
					loading="eager"
					fetchpriority="high"
				/>
			</div>
			{#if inset}
				<div class="inset">
					<div class="frame">
						<Image
							image={inset}
							alt={insetLabel}
							sizes="(min-width: 1100px) 360px, 80vw"
							loading="eager"
						/>
					</div>
					<figcaption>{insetLabel}</figcaption>
				</div>
			{/if}
		</figure>
	{/if}

	{#if facts.length || stats.length || stack.length}
		<section class="meta">
			{#if stats.length}
				<div class="stats">
					{#each stats as s}
						<div class="stat">
							<span class="n">{s.n}</span>
							<span class="l">{s.label}</span>
						</div>
					{/each}
				</div>
			{/if}
			<dl class="facts">
				{#each facts as f}
					<div>
						<dt>{f.label}</dt>
						<dd>{f.value}</dd>
					</div>
				{/each}
				{#if stack.length}
					<div class="stack-row">
						<dt>stack</dt>
						<dd class="chips">
							{#each stack as s}<span class="chip">{s}</span>{/each}
						</dd>
					</div>
				{/if}
			</dl>
		</section>
	{/if}

	<div class="content">
		<Content />
	</div>

	{#if gallery.length}
		<section class="gallery">
			<h2>More</h2>
			<div class="grid" class:single={gallery.length === 1}>
				{#each gallery as image}
					<figure>
						<div class="frame">
							<Image
								{image}
								alt={metadata.name}
								sizes="(min-width: 1100px) 1040px, 100vw"
								loading="lazy"
							/>
						</div>
					</figure>
				{/each}
			</div>
		</section>
	{/if}
</main>

<style>
	main {
		width: 100%;
		max-width: 66rem;
		margin: 0 auto;
		padding: 1.5rem 1.5rem 10rem;
	}

	.head {
		max-width: 53rem;
		margin: 0 auto 2rem;
	}

	.title-row {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		gap: 0.5rem 2rem;
		margin-top: 1rem;
	}

	h1 {
		font-size: clamp(2rem, 5vw, 3rem);
		line-height: 1.1;
		margin: 0 auto 0 0;
	}

	.links {
		display: flex;
		gap: 1rem 1.5rem;
	}

	.description {
		font-size: 1.2rem;
		margin: 0.75rem 0 0;
		color: var(--txt-2);
		max-width: 44rem;
	}

	.frame {
		border-radius: 14px;
		overflow: hidden;
		border: 1px solid var(--bg-3);
		background: var(--bg-2);
		box-shadow:
			0 1px 0 var(--bg-3),
			0 24px 48px -28px hsl(30 25% 9% / 0.35);
		--aspect-ratio: 16 / 9;
	}

	.hero {
		position: relative;
		margin: 0 0 2.5rem;
	}

	.hero.has-inset {
		margin-bottom: 5rem;
	}

	.inset {
		position: absolute;
		right: 1.5rem;
		bottom: -2.5rem;
		width: 30%;
		max-width: 20rem;
		transform: rotate(1.5deg);
	}

	.inset .frame {
		border: 4px solid var(--bg);
		box-shadow: 0 18px 40px -16px hsl(30 25% 9% / 0.5);
		--aspect-ratio: 4 / 3;
	}

	.inset figcaption {
		position: absolute;
		left: 0.6rem;
		bottom: 0.6rem;
		font-family: 'Space Mono', monospace;
		font-size: 0.75rem;
		padding: 0.2rem 0.6rem;
		border-radius: 999px;
		background: var(--bg);
		color: var(--txt);
		border: 1px solid var(--bg-3);
	}

	/* meta strip */
	.meta {
		max-width: 53rem;
		margin: 0 auto 3rem;
		display: grid;
		gap: 2rem;
	}

	.stats {
		display: flex;
		flex-wrap: wrap;
		gap: 1.25rem 3rem;
		padding-bottom: 2rem;
		border-bottom: 1px solid var(--bg-3);
	}

	.stat {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}

	.stat .n {
		font-size: clamp(2.25rem, 6vw, 3.25rem);
		line-height: 1;
		font-weight: 700;
		color: var(--green);
		letter-spacing: -0.02em;
	}

	.stat .l {
		font-size: 0.9rem;
		color: var(--txt-2);
	}

	.facts {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr));
		gap: 1.5rem 2rem;
		margin: 0;
	}

	.facts div {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.facts .stack-row {
		grid-column: 1 / -1;
	}

	dt {
		font-family: 'Space Mono', monospace;
		font-size: 0.75rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--txt-3);
	}

	dd {
		margin: 0;
		color: var(--txt);
	}

	.chips {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.chip {
		font-family: 'Space Mono', monospace;
		font-size: 0.85rem;
		padding: 0.25rem 0.7rem;
		border: 1px solid var(--bg-3);
		background: var(--bg-2);
		border-radius: 999px;
	}

	.content {
		max-width: 53rem;
		margin: 0 auto;
	}

	/* gallery */
	.gallery {
		margin-top: 5rem;
	}

	.gallery h2 {
		max-width: 53rem;
		margin: 0 auto 1.25rem;
		font-size: 1.5rem;
	}

	.grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1.25rem;
	}

	.grid.single {
		grid-template-columns: 1fr;
	}

	.grid figure {
		margin: 0;
	}

	@media (max-width: 700px) {
		main {
			padding: 1rem 1rem 6rem;
		}
		.grid {
			grid-template-columns: 1fr;
		}
		.frame {
			border-radius: 10px;
		}
		.hero.has-inset {
			margin-bottom: 3.5rem;
		}
		.inset {
			width: 52%;
			right: 0.75rem;
			bottom: -2rem;
		}
	}
</style>
