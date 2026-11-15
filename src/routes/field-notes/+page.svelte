<script>
	import { journey } from '$lib/js/journey.js';

	// personal photos are read straight from src/content/journey/.
	// `metadata` gives each photo's real width/height so tiles reserve the right
	// space before anything loads; `thumbs` are small webp copies for the grid.
	const metas = import.meta.glob('/src/content/journey/*.{jpg,jpeg,png,webp,avif}', {
		import: 'default',
		eager: true,
		query: { as: 'metadata' }
	});
	const thumbs = import.meta.glob('/src/content/journey/*.{jpg,jpeg,png,webp,avif}', {
		import: 'default',
		eager: true,
		query: { w: '900', format: 'webp' }
	});
	const videos = import.meta.glob('/src/content/journey/*.{mp4,webm,mov}', {
		import: 'default',
		eager: true,
		query: '?url'
	});

	function find(map, name) {
		if (!name) return null;
		for (const [path, value] of Object.entries(map)) {
			if (path.endsWith('/' + name)) return value;
		}
		return null;
	}

	// one flat list of everything that actually exists, in chapter order. entries
	// whose file isn't there yet are simply left out. `idx` is the position in the
	// viewer, so a tile in any chapter opens the right photo.
	const items = journey.chapters
		.flatMap((chapter) =>
			chapter.media.map((entry) => {
				if (entry.video) {
					const url = find(videos, entry.video);
					if (!url) return null;
					const poster = find(metas, entry.poster);
					const thumb = find(thumbs, entry.poster);
					return {
						...entry,
						chapter,
						kind: 'video',
						url,
						poster: poster?.src,
						thumb: thumb ?? poster?.src,
						w: poster?.width ?? 1600,
						h: poster?.height ?? 900
					};
				}
				const meta = find(metas, entry.photo);
				if (!meta) return null;
				return {
					...entry,
					chapter,
					kind: 'photo',
					url: meta.src,
					thumb: find(thumbs, entry.photo) ?? meta.src,
					w: meta.width,
					h: meta.height
				};
			})
		)
		.filter(Boolean)
		.map((it, idx) => ({ ...it, idx }));

	// chapters that have at least one photo; the first photo is the featured one
	const sections = journey.chapters
		.map((chapter) => {
			const own = items.filter((i) => i.chapter.id === chapter.id);
			return { chapter, feature: own[0], rest: own.slice(1) };
		})
		.filter((s) => s.feature);

	let current = $state(null);
	let dialogEl = $state(null);

	const visible = items;
	const item = $derived(current === null ? null : (visible[current] ?? null));

	function openAt(i) {
		current = i;
		dialogEl?.showModal();
	}

	function step(delta) {
		if (current === null) return;
		current = (current + delta + visible.length) % visible.length;
	}

	function onKey(e) {
		if (e.key === 'ArrowRight') step(1);
		else if (e.key === 'ArrowLeft') step(-1);
	}

	// tapping the dark area around the viewer closes it
	function onBackdrop(e) {
		if (e.target === dialogEl) dialogEl.close();
	}

	// swipe left/right on touch screens
	let startX = 0;
	function onDown(e) {
		startX = e.clientX;
	}
	function onUp(e) {
		if (e.target.closest('video, button, a')) return;
		const dx = e.clientX - startX;
		if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
	}

	// gentle fade-up as a section scrolls into view. anything already on screen
	// when it mounts is left alone (no flash), and reduced motion skips it.
	function reveal(node) {
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		if (node.getBoundingClientRect().top < window.innerHeight * 0.9) return;
		node.classList.add('rv');
		const io = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					node.classList.add('in');
					io.disconnect();
				}
			},
			{ threshold: 0.1 }
		);
		io.observe(node);
		return () => io.disconnect();
	}

	const pad = (n) => String(n).padStart(2, '0');
</script>

<main>
	<header class="hero">
		<span class="eyebrow">Personal</span>
		<h1>{journey.intro.title}</h1>
		<p class="lede">{journey.intro.text}</p>
		{#if journey.intro.note}
			<aside class="note" {@attach reveal}>
				<span class="eyebrow">A note from me</span>
				{#each journey.intro.note.paragraphs as para}
					<p>{para}</p>
				{/each}
				<span class="signoff">{journey.intro.note.signoff}</span>
			</aside>
		{/if}
		{#if items.length}
			<p class="count">
				{items.length} moments <span aria-hidden="true">·</span>
				{sections.length}
				{sections.length === 1 ? 'chapter' : 'chapters'} so far
			</p>
		{/if}
	</header>

	{#each sections as { chapter, feature, rest }, n (chapter.id)}
		<section class="chapter" id={chapter.id}>
			<div class="chapter-head" {@attach reveal}>
				<span class="num" aria-hidden="true">{pad(n + 1)}</span>
				<div>
					<span class="eyebrow">{chapter.years}</span>
					<h2>{chapter.title}</h2>
					<p>{chapter.text}</p>
				</div>
			</div>

			<article class="feature" class:flip={n % 2 === 1} {@attach reveal}>
				<button
					class="photo"
					onclick={() => openAt(feature.idx)}
					aria-label="Open: {feature.title ?? feature.caption}"
				>
					<img
						src={feature.thumb}
						alt={feature.caption}
						width={feature.w}
						height={feature.h}
						loading={n === 0 ? 'eager' : 'lazy'}
						decoding="async"
					/>
					{#if feature.kind === 'video'}<span class="badge" aria-hidden="true">▶</span>{/if}
				</button>
				<div class="copy">
					<h3>{feature.title ?? chapter.title}</h3>
					{#if feature.where || feature.when}
						<p class="meta-line">
							{[feature.where, feature.when].filter(Boolean).join(' · ')}
						</p>
					{/if}
					<p class="cap-line">{feature.caption}</p>
					{#if feature.story}<p class="story-text">{feature.story}</p>{/if}
					<button class="more" onclick={() => openAt(feature.idx)}>
						Open photo <span aria-hidden="true">→</span>
					</button>
				</div>
			</article>

			{#if rest.length}
				<div class="grid">
					{#each rest as it (it.url)}
						<figure class="card" {@attach reveal}>
							<button
								class="thumb"
								onclick={() => openAt(it.idx)}
								aria-label="Open: {it.title ?? it.caption}"
							>
								<img
									src={it.thumb}
									alt={it.caption}
									width={it.w}
									height={it.h}
									loading="lazy"
									decoding="async"
								/>
								{#if it.kind === 'video'}<span class="badge" aria-hidden="true">▶</span>{/if}
							</button>
							<figcaption>
								<strong>{it.title ?? chapter.title}</strong>
								<span>{it.caption}</span>
							</figcaption>
						</figure>
					{/each}
				</div>
			{/if}
		</section>
	{/each}

	{#if items.length === 0}
		<p class="empty">Photos are on their way.</p>
	{/if}

	<footer class="closing" {@attach reveal}>
		<p class="more-soon">More chapters as they happen.</p>
		<div class="cta">
			<a class="btn solid" href="/projects">See my work <span aria-hidden="true">→</span></a>
			<a class="btn line" href="/contact">Say hello</a>
		</div>
	</footer>
</main>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<dialog
	bind:this={dialogEl}
	onclose={() => (current = null)}
	onclick={onBackdrop}
	onkeydown={onKey}
	aria-label="photo viewer"
>
	{#if item}
		<div class="viewer" onpointerdown={onDown} onpointerup={onUp}>
			<div class="stage">
				{#key item.url}
					{#if item.kind === 'video'}
						<video src={item.url} poster={item.poster} controls autoplay playsinline></video>
					{:else}
						<img src={item.url} alt={item.caption} width={item.w} height={item.h} />
					{/if}
				{/key}

				{#if visible.length > 1}
					<button class="arrow prev" onclick={() => step(-1)} aria-label="previous photo">‹</button>
					<button class="arrow next" onclick={() => step(1)} aria-label="next photo">›</button>
				{/if}
			</div>

			<aside class="info">
				<div class="meta">
					<span class="chip">{item.chapter.years}</span>
					<span class="count">{current + 1} / {visible.length}</span>
				</div>
				<h2>{item.title ?? item.chapter.title}</h2>
				<p class="caption">{item.caption}</p>
				{#if item.story}
					<p class="story">{item.story}</p>
				{/if}
			</aside>
		</div>
		<button class="close" onclick={() => dialogEl.close()} aria-label="close viewer">
			close ✕
		</button>
	{/if}
</dialog>

<style>
	main {
		width: 100%;
		max-width: 72rem;
		margin: 0 auto 8rem auto;
		padding: 0 1.25rem;
	}

	.eyebrow {
		font-family: 'Space Mono', monospace;
		font-size: 0.8rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--green);
	}

	/* ─── hero ─── */
	.hero {
		max-width: 46rem;
		padding: 1rem 0 3rem;

		h1 {
			margin: 0.5rem 0 1rem;
			font-size: clamp(2.6rem, 8vw, 4.5rem);
			line-height: 1.02;
			letter-spacing: -0.01em;
		}

		.lede {
			margin: 0;
			font-size: clamp(1.1rem, 2.6vw, 1.3rem);
			line-height: 1.6;
			color: var(--txt-2);
		}

		.count {
			margin: 1.5rem 0 0;
			font-family: 'Space Mono', monospace;
			font-size: 0.9rem;
			color: var(--txt-3);
		}
	}

	/* ─── note from me ─── */
	.note {
		position: relative;
		max-width: 38rem;
		margin: 2rem 0 0;
		padding: 1.4rem 1.6rem 1.25rem;
		border-left: 4px solid var(--ochre);
		border-radius: 0 14px 14px 0;
		background: var(--bg-2);

		.eyebrow {
			display: block;
			margin-bottom: 0.7rem;
			color: var(--ochre);
		}

		p {
			margin: 0 0 0.8rem;
			font-size: 1.1rem;
			line-height: 1.7;
			color: var(--txt);
		}

		.signoff {
			display: block;
			margin-top: 0.4rem;
			font-family: 'Space Mono', monospace;
			font-size: 1rem;
			color: var(--green);
		}
	}

	/* ─── chapter ─── */
	.chapter {
		margin-top: 4.5rem;
		padding-top: 2.5rem;
		border-top: 1px solid var(--bg-3);
		scroll-margin-top: 5rem;
	}

	.chapter-head {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 1.25rem;
		max-width: 48rem;
		margin-bottom: 2.25rem;

		.num {
			font-family: 'Space Mono', monospace;
			font-size: clamp(2.5rem, 7vw, 4rem);
			line-height: 1;
			color: var(--ochre);
			opacity: 0.85;
		}

		h2 {
			margin: 0.35rem 0 0.6rem;
			font-size: clamp(1.7rem, 4.5vw, 2.4rem);
			line-height: 1.12;
		}

		p {
			margin: 0;
			font-size: 1.1rem;
			line-height: 1.65;
			color: var(--txt-2);
		}
	}

	/* ─── featured photo + its story ─── */
	.feature {
		display: grid;
		gap: 1.5rem;
		margin-bottom: 2.75rem;
		align-items: center;
	}

	.photo,
	.thumb {
		position: relative;
		display: block;
		width: 100%;
		padding: 0;
		overflow: hidden;
		border-radius: 14px;
		background: var(--bg-3);
		border: 1px solid var(--bg-3);
		box-shadow:
			0 1px 0 var(--bg-3),
			0 22px 44px -26px hsl(30 25% 9% / 0.4);
		cursor: zoom-in;

		img {
			display: block;
			width: 100%;
			height: auto;
			transition: transform 0.5s cubic-bezier(0.2, 0.7, 0.2, 1);
		}

		&:hover img {
			transform: scale(1.03);
		}
		&:focus-visible {
			outline: 3px solid var(--ochre);
			outline-offset: 4px;
		}
	}

	.photo img {
		aspect-ratio: 3 / 2;
		object-fit: cover;
	}

	.badge {
		position: absolute;
		right: 0.75rem;
		bottom: 0.75rem;
		display: grid;
		place-items: center;
		width: 2.5rem;
		height: 2.5rem;
		border-radius: 50%;
		background: var(--green);
		color: var(--bg);
		font-size: 0.85rem;
	}

	.copy {
		h3 {
			margin: 0 0 0.35rem;
			font-size: clamp(1.4rem, 3.4vw, 1.9rem);
			line-height: 1.15;
		}

		.meta-line {
			margin: 0 0 0.6rem;
			font-family: 'Space Mono', monospace;
			font-size: 0.85rem;
			color: var(--txt-3);
		}

		.cap-line {
			margin: 0 0 0.8rem;
			font-size: 1.05rem;
			font-style: italic;
			color: var(--txt-2);
		}

		.story-text {
			margin: 0 0 1.1rem;
			font-size: 1.05rem;
			line-height: 1.7;
		}
	}

	.more {
		display: inline-flex;
		align-items: center;
		gap: 0.5ch;
		min-height: 2.75rem;
		padding: 0;
		background: none;
		border: none;
		font-family: 'Space Mono', monospace;
		font-size: 0.95rem;
		color: var(--green);
		cursor: pointer;

		span {
			transition: transform 0.2s;
		}
		&:hover span {
			transform: translateX(0.3em);
		}
		&:focus-visible {
			outline: 3px solid var(--ochre);
			outline-offset: 2px;
		}
	}

	/* ─── the rest of the chapter: masonry, captions always visible ─── */
	.grid {
		column-count: 1;
		column-gap: 1.1rem;
	}

	.card {
		margin: 0 0 1.5rem;
		break-inside: avoid;

		figcaption {
			display: grid;
			gap: 0.15rem;
			padding: 0.75rem 0.15rem 0;

			strong {
				font-family: 'Space Mono', monospace;
				font-size: 1rem;
				font-weight: 400;
				color: var(--txt-0);
			}

			span {
				font-size: 0.95rem;
				line-height: 1.5;
				color: var(--txt-2);
			}
		}
	}

	/* ─── closing ─── */
	.closing {
		margin-top: 5rem;
		padding-top: 2.5rem;
		border-top: 1px solid var(--bg-3);
		text-align: center;

		.more-soon {
			margin: 0 0 1.25rem;
			font-family: 'Space Mono', monospace;
			font-size: 1.1rem;
			color: var(--txt-2);
		}

		.cta {
			display: flex;
			flex-wrap: wrap;
			justify-content: center;
			gap: 0.6rem;
		}
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

	.empty {
		color: var(--txt-2);
	}

	/* scroll reveal (class added by the reveal attachment) */
	:global(.rv) {
		opacity: 0;
		transform: translateY(18px);
		transition:
			opacity 0.6s ease,
			transform 0.6s cubic-bezier(0.2, 0.7, 0.2, 1);
	}
	:global(.rv.in) {
		opacity: 1;
		transform: none;
	}

	@media (min-width: 700px) {
		.grid {
			column-count: 2;
		}
	}

	@media (min-width: 900px) {
		.chapter {
			margin-top: 6rem;
		}

		.feature {
			grid-template-columns: minmax(0, 1.45fr) minmax(0, 1fr);
			gap: 3rem;

			&.flip {
				grid-template-columns: minmax(0, 1fr) minmax(0, 1.45fr);

				.photo {
					order: 2;
				}
			}
		}

		.grid {
			column-count: 3;
		}
	}

	/* ─── viewer ─── */
	:global(body:has(dialog[open])) {
		overflow: hidden;
	}

	dialog {
		width: 100%;
		max-width: none;
		height: 100dvh;
		max-height: none;
		margin: 0;
		padding: 0;
		border: none;
		background: hsl(148, 40%, 6%);
		color: #fff;

		&::backdrop {
			background: transparent;
		}
		&[open] {
			display: block;
			animation: fade 0.2s both;
		}
	}

	.viewer {
		display: grid;
		grid-template-rows: minmax(0, 1fr) auto;
		height: 100%;
		touch-action: pan-y;
	}

	.stage {
		position: relative;
		display: grid;
		place-items: center;
		min-height: 0;
		padding: 3.5rem 0 0.5rem;

		img,
		video {
			display: block;
			max-width: 100%;
			max-height: 100%;
			width: auto;
			height: auto;
			object-fit: contain;
			background: #000;
		}
	}

	.arrow {
		position: absolute;
		top: 50%;
		display: grid;
		place-items: center;
		width: 2.75rem;
		height: 2.75rem;
		margin-top: -0.75rem;
		border-radius: 50%;
		background: hsla(0, 0%, 0%, 0.5);
		color: #fff;
		font-size: 1.75rem;
		line-height: 1;

		&.prev {
			left: 0.5rem;
		}
		&.next {
			right: 0.5rem;
		}
		&:hover {
			background: hsla(0, 0%, 0%, 0.75);
		}
	}

	.info {
		max-height: 38dvh;
		overflow-y: auto;
		padding: 1rem 1.25rem 1.5rem;

		.meta {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 1rem;
			margin-bottom: 0.5rem;
			font-family: 'Space Mono', monospace;
			font-size: 0.85rem;
		}

		.chip {
			padding: 0.2rem 0.7rem;
			border-radius: 999px;
			background: var(--ochre);
			color: hsl(30, 25%, 9%);
		}

		.count {
			opacity: 0.65;
		}

		h2 {
			margin: 0 0 0.5rem 0;
			font-size: 1.5rem;
			color: #fff;
		}

		p {
			margin: 0 0 0.75rem 0;
			font-size: 1rem;
			line-height: 1.6;
		}

		.caption {
			color: hsl(40, 30%, 88%);
		}

		.story {
			color: hsl(40, 15%, 72%);
		}
	}

	.close {
		position: absolute;
		top: max(0.75rem, env(safe-area-inset-top));
		right: 0.75rem;
		z-index: 2;
		min-height: 2.75rem;
		padding: 0 1rem;
		border-radius: 999px;
		background: hsla(0, 0%, 0%, 0.55);
		color: #fff;
		font-family: 'Space Mono', monospace;
		font-size: 0.95rem;
	}

	@media (min-width: 900px) {
		.viewer {
			grid-template-rows: none;
			grid-template-columns: minmax(0, 1fr) 24rem;
		}

		.stage {
			padding: 2rem 1rem 2rem 2rem;
		}

		.arrow {
			margin-top: -1.375rem;
		}

		.info {
			max-height: none;
			padding: 4.5rem 2rem 2rem 1.5rem;
			border-left: 1px solid hsla(0, 0%, 100%, 0.12);

			h2 {
				font-size: 1.75rem;
			}
		}
	}

	@keyframes fade {
		from {
			opacity: 0;
		}
	}
</style>
