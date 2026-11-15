<script>
	// generated cover art for a post: same slug, same cover, always.
	// palette + pattern are picked from a hash of the slug, so every post looks
	// different but stays inside the site's green / ochre / clay colours.
	let { slug, title, tag = '', size = 'card', showTitle = false } = $props();

	const palettes = [
		{ bg: 'var(--green)', fg: 'var(--bg)', a1: 'var(--ochre)', a2: 'var(--bg)' },
		{ bg: 'var(--bg-2)', fg: 'var(--txt-0)', a1: 'var(--green)', a2: 'var(--clay)' },
		// a touch deeper than the site's clay so small text on it passes 4.5:1
		{ bg: 'hsl(14, 60%, 40%)', fg: 'var(--bg)', a1: 'var(--ochre)', a2: 'var(--bg)' },
		{ bg: 'var(--ochre)', fg: 'hsl(30, 25%, 9%)', a1: 'var(--green)', a2: 'var(--bg)' },
		{ bg: 'hsl(148, 40%, 11%)', fg: 'var(--bg)', a1: 'var(--ochre)', a2: 'var(--clay)' },
		{ bg: 'hsl(148, 28%, 86%)', fg: 'hsl(148, 48%, 18%)', a1: 'var(--green)', a2: 'var(--ochre)' }
	];

	function hash(str) {
		let h = 2166136261;
		for (const c of str) {
			h ^= c.charCodeAt(0);
			h = Math.imul(h, 16777619);
		}
		return h >>> 0;
	}

	// small seeded random so the art is stable between renders
	function rng(seed) {
		let a = seed;
		return () => {
			a |= 0;
			a = (a + 0x6d2b79f5) | 0;
			let t = Math.imul(a ^ (a >>> 15), 1 | a);
			t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
			return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
		};
	}

	const W = 120;
	const H = 63;

	function build(pattern, rand) {
		const shapes = [];
		if (pattern === 'rings') {
			const cx = 70 + rand() * 40;
			const cy = 8 + rand() * 40;
			for (let i = 0, r = 7; r < 80; i++, r += 8) {
				shapes.push({ t: 'circle', cx, cy, r, o: 0.18 + (i % 2) * 0.22 });
			}
		} else if (pattern === 'dots') {
			const cx = 80 + rand() * 30;
			const cy = 10 + rand() * 40;
			for (let x = 2; x < W; x += 5) {
				for (let y = 2; y < H; y += 5) {
					const near = Math.max(0, 1 - Math.hypot(x - cx, y - cy) / 48);
					if (near > 0.04)
						shapes.push({ t: 'dot', x, y, r: 0.3 + near * 1.7, o: 0.35 + near * 0.55 });
				}
			}
		} else if (pattern === 'waves') {
			for (let i = 0; i < 7; i++) {
				const y = 14 + i * 6;
				const amp = 4 + rand() * 8;
				const phase = rand() * 20;
				shapes.push({
					t: 'path',
					d: `M0,${y} Q${30 + phase},${y - amp} 60,${y} T${W},${y}`,
					o: 0.25 + (i % 3) * 0.2,
					alt: i % 2
				});
			}
		} else {
			// blocks, in the spirit of the contribution graph
			for (let col = 0; col < 17; col++) {
				for (let row = 0; row < 9; row++) {
					if (col < 5) continue; // keep a little room on the left for the tag chip
					const v = rand();
					if (v > 0.38)
						shapes.push({ t: 'rect', x: col * 7.4, y: row * 7.4, o: 0.2 + v * 0.7, alt: v > 0.8 });
				}
			}
		}
		return shapes;
	}

	const h = $derived(hash(slug));
	const pal = $derived(palettes[h % palettes.length]);
	const pattern = $derived(['rings', 'dots', 'waves', 'blocks'][(h >>> 3) % 4]);
	const shapes = $derived(build(pattern, rng(h)));
</script>

<div
	class="cover {size}"
	style="--cv-bg: {pal.bg}; --fg: {pal.fg}; --a1: {pal.a1}; --a2: {pal.a2}"
	role="img"
	aria-label="cover art for {title}"
>
	<svg viewBox="0 0 {W} {H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
		{#each shapes as s}
			{#if s.t === 'circle'}
				<circle
					cx={s.cx}
					cy={s.cy}
					r={s.r}
					fill="none"
					stroke="var(--a1)"
					stroke-width="0.7"
					opacity={s.o}
				/>
			{:else if s.t === 'dot'}
				<circle cx={s.x} cy={s.y} r={s.r} fill="var(--a1)" opacity={s.o} />
			{:else if s.t === 'path'}
				<path
					d={s.d}
					fill="none"
					stroke={s.alt ? 'var(--a2)' : 'var(--a1)'}
					stroke-width="0.8"
					opacity={s.o}
				/>
			{:else}
				<rect
					x={s.x}
					y={s.y}
					width="6.4"
					height="6.4"
					rx="1"
					fill={s.alt ? 'var(--a2)' : 'var(--a1)'}
					opacity={s.o}
				/>
			{/if}
		{/each}
	</svg>

	{#if tag}<span class="chip">{tag}</span>{/if}
	{#if showTitle}<span class="title">{title}</span>{/if}
	<span class="mark">munene</span>
</div>

<style>
	.cover {
		position: relative;
		container-type: inline-size;
		display: block;
		aspect-ratio: 1200 / 630;
		overflow: hidden;
		background: var(--cv-bg);
		color: var(--fg);
	}

	svg {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	/* solid, inverted pills: readable on any palette, whatever pattern runs behind */
	.chip {
		position: absolute;
		top: 5cqw;
		left: 5cqw;
		padding: 0.9cqw 3cqw;
		border-radius: 999px;
		background: var(--fg);
		font-family: 'Space Mono', monospace;
		font-size: 3.4cqw;
		line-height: 1.2;
		color: var(--cv-bg);
		box-shadow: 0 0.6cqw 2cqw -0.8cqw rgb(0 0 0 / 0.35);
	}

	.title {
		z-index: 1;
		position: absolute;
		left: 5cqw;
		right: 32cqw;
		bottom: 6cqw;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 4;
		line-clamp: 4;
		overflow: hidden;
		font-family: 'Space Mono', monospace;
		font-size: 6.2cqw;
		line-height: 1.15;
		letter-spacing: -0.02em;
		color: var(--fg);
	}

	.hero .title {
		font-size: 5.2cqw;
		right: 36cqw;
	}

	.mark {
		position: absolute;
		right: 4cqw;
		bottom: 4cqw;
		padding: 0.7cqw 2.2cqw;
		border-radius: 999px;
		background: color-mix(in srgb, var(--cv-bg) 88%, transparent);
		font-family: 'Space Mono', monospace;
		font-size: 3cqw;
		line-height: 1.2;
		color: var(--fg);
	}
</style>
