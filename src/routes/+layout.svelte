<script>
	import '../app.css';
	import '$lib/assets/fonts/space-mono.css';
	import '$lib/assets/fonts/space-grotesk.css';
	import { page } from '$app/state';
	import { onMount, untrack } from 'svelte';
	import LogoAnimated from '$lib/components/LogoAnimated.svelte';
	import PageHead from '$lib/components/PageHead.svelte';
	import { fly } from 'svelte/transition';
	import { prefersReducedMotion } from 'svelte/motion';
	import { beforeNavigate, afterNavigate } from '$app/navigation';
	import UserIcon from '~icons/ph/user';
	import SquaresIcon from '~icons/ph/squares-four';
	import PencilIcon from '~icons/ph/pencil-simple-line';
	import CameraIcon from '~icons/ph/camera';
	import MailIcon from '~icons/ph/envelope-simple';

	let { children } = $props();

	const pages = [
		{ name: 'about', path: '/about', icon: UserIcon },
		{ name: 'projects', path: '/projects', icon: SquaresIcon },
		{ name: 'field notes', path: '/field-notes', icon: CameraIcon },
		{ name: 'blog', path: '/blog', icon: PencilIcon },
		{ name: 'contact', path: '/contact', icon: MailIcon }
	];

	let currPage = $state(page.url.pathname);
	let prevPage = $state('');

	// drives the slow-navigation progress bar
	let loading = $state(false);

	beforeNavigate((navigation) => {
		if (!navigation.willUnload && navigation.to) loading = true;
		if (navigation.to?.url.pathname) {
			prevPage = currPage;
			currPage = navigation.to.url.pathname;
		}
	});

	// the container opts out of sveltekit's scroll reset (so the fly transition
	// stays smooth), so with a sticky header we reset it ourselves
	afterNavigate((navigation) => {
		loading = false;
		if (navigation.from?.url.pathname !== navigation.to?.url.pathname) {
			window.scrollTo(0, 0);
			onScroll();
		}
	});

	// ─── header state ───
	const isHome = $derived(page.url.pathname === '/');
	const active = $derived(
		pages.find((p) => page.url.pathname === p.path || page.url.pathname.startsWith(p.path + '/'))
	);

	let scrolled = $state(false);
	let progress = $state(0);

	function onScroll() {
		const y = window.scrollY;
		const max = document.documentElement.scrollHeight - window.innerHeight;
		scrolled = y > 8;
		progress = max > 0 ? Math.min(1, y / max) : 0;
	}

	// ─── sliding highlight behind the desktop links ───
	let linkEls = $state([]);
	let pill = $state({ x: 0, w: 0, on: false });

	function place(el) {
		pill = el
			? { x: el.offsetLeft, w: el.offsetWidth, on: true }
			: { x: pill.x, w: pill.w, on: false };
	}

	function settle() {
		const i = pages.findIndex((p) => p.path === active?.path);
		place(i >= 0 ? linkEls[i] : null);
	}

	$effect(() => {
		// re-run whenever the page (and so the active link) changes
		void active;
		void linkEls.length;
		// settle() reads and writes `pill`; untracked, so this effect doesn't loop on itself
		// (it did on the home page, where no link is active, and broke reactivity there)
		untrack(settle);
	});

	onMount(() => {
		onScroll();
		// font swap changes link widths, so measure again once fonts are in
		document.fonts?.ready.then(settle);
	});

	function transition(path, out) {
		const cleanPath = path.replace(/\/$/, '');
		const cleanPrevPath = prevPage.replace(/\/$/, '');

		let currDepth = cleanPath.split('/').length;
		let prevDepth = cleanPrevPath.split('/').length;

		const currParent = '/' + cleanPath.split('/')[1];
		const prevParent = '/' + cleanPrevPath.split('/')[1];

		let currParentIdx = pages.findIndex((page) => page.path === currParent);
		let prevParentIdx = pages.findIndex((page) => page.path === prevParent);

		if (path === '/') {
			currParentIdx = prevParentIdx;
			currDepth = 1;
		}
		if (prevPage === '/') {
			prevParentIdx = currParentIdx;
			prevDepth = 1;
		}

		let xDiff = currParentIdx - prevParentIdx;
		let yDiff = currDepth - prevDepth;

		if (out) {
			xDiff *= -1;
			yDiff *= -1;
		}
		if (prefersReducedMotion.current) {
			xDiff *= 0;
			yDiff *= 0;
		}

		return {
			duration: 150,
			delay: out ? 0 : 50,
			x: `${xDiff * 20}vh`,
			y: `${yDiff * 20}vh`
		};
	}
</script>

<svelte:window onscroll={onScroll} onresize={() => (onScroll(), settle())} />

<PageHead
	title={page.error ? page.status : page.data.meta.title}
	description={page.error ? page.error.message : page.data.meta.description}
	type={page.data.meta.type}
	image={page.data.meta.image}
/>

{#if loading}
	<div class="nav-progress" role="progressbar" aria-label="loading page"></div>
{/if}

<header class:home={isHome} class:scrolled data-sveltekit-noscroll>
	<div class="dock">
		<div class="row">
			<a class="pfp" href="/" aria-label="homepage">
				<LogoAnimated skipInitialAnimation={true} />
			</a>
			<a class="word" href="/">munene</a>
			{#if active}
				<span class="here" aria-hidden="true">/{active.name}</span>
			{/if}
		</div>

		<nav class="top" aria-label="main" onmouseleave={settle}>
			<span
				class="pill"
				class:on={pill.on}
				style="transform: translateX({pill.x}px); width: {pill.w}px"
				aria-hidden="true"
			></span>
			{#each pages as p, i}
				<a
					bind:this={linkEls[i]}
					class="nav"
					class:active={active?.path === p.path}
					aria-current={active?.path === p.path ? 'page' : undefined}
					href={p.path}
					onmouseenter={() => place(linkEls[i])}
					onfocus={() => place(linkEls[i])}
				>
					{p.name}
				</a>
			{/each}
		</nav>

		<span class="progress" style="transform: scaleX({progress})" aria-hidden="true"></span>
	</div>
</header>

<div class="container" class:has-tabbar={!isHome} data-sveltekit-noscroll>
	{#key page.url.pathname}
		<div
			class="transition"
			in:fly={transition(page.url.pathname, false)}
			out:fly={transition(page.url.pathname, true)}
		>
			{@render children?.()}
		</div>
	{/key}
</div>

{#if !isHome}
	<nav class="tabbar" aria-label="main">
		{#each pages as p}
			<a
				href={p.path}
				class:active={active?.path === p.path}
				aria-current={active?.path === p.path ? 'page' : undefined}
			>
				<p.icon />
				<span>{p.name}</span>
			</a>
		{/each}
	</nav>
{/if}

<style>
	/* only shows if a navigation takes longer than ~150ms, so fast ones stay clean */
	.nav-progress {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 1000;
		height: 3px;
		width: 100%;
		background: linear-gradient(90deg, var(--green), var(--ochre));
		transform-origin: left;
		transform: scaleX(0);
		opacity: 0;
		animation:
			nav-progress-show 0s linear 0.15s forwards,
			nav-progress-grow 10s cubic-bezier(0.1, 0.6, 0.2, 1) 0.15s forwards;
		pointer-events: none;
	}

	@keyframes nav-progress-show {
		to {
			opacity: 1;
		}
	}

	@keyframes nav-progress-grow {
		to {
			transform: scaleX(0.92);
		}
	}

	/* ─── floating pill nav ───
	   the header itself is an invisible sticky strip that keeps the page's top
	   spacing; the visible bar is the centered .dock inside it ─── */
	header {
		position: sticky;
		top: 0;
		z-index: 50;
		flex-shrink: 0;
		height: 5rem;
		pointer-events: none;
		transition:
			height 0.25s ease,
			opacity 0.2s ease;

		/* on the home page the nav stays out of the way entirely */
		&.home {
			height: 0;
			opacity: 0;
			overflow: hidden;
		}
	}

	.dock {
		position: absolute;
		top: 0.9rem;
		left: 50%;
		translate: -50% 0;
		display: flex;
		align-items: center;
		gap: 1.25rem;
		height: 3.5rem;
		padding: 0 0.6rem 0 1rem;
		overflow: hidden;
		border: 1px solid color-mix(in srgb, var(--bg-3) 70%, transparent);
		border-radius: 999px;
		background: color-mix(in srgb, var(--bg) 78%, transparent);
		backdrop-filter: blur(16px) saturate(1.4);
		-webkit-backdrop-filter: blur(16px) saturate(1.4);
		box-shadow: 0 10px 30px -14px hsl(30 25% 9% / 0.28);
		pointer-events: auto;
		transition:
			top 0.3s cubic-bezier(0.3, 1.2, 0.5, 1),
			height 0.3s ease,
			gap 0.3s ease,
			box-shadow 0.3s ease,
			background 0.3s ease;
	}

	/* scrolled: tuck up and tighten, wordmark folds away */
	header.scrolled .dock {
		top: 0.55rem;
		height: 3.1rem;
		gap: 0.9rem;
		background: color-mix(in srgb, var(--bg) 88%, transparent);
		box-shadow: 0 12px 34px -12px hsl(30 25% 9% / 0.35);
	}

	.row {
		display: flex;
		align-items: center;
		gap: 0.7rem;

		.pfp {
			display: flex;
			width: 1.9rem;
			height: 1.9rem;
			flex-shrink: 0;
			transition: transform 0.25s cubic-bezier(0.3, 1.6, 0.5, 1);

			&:hover {
				transform: rotate(-8deg) scale(1.12);
			}
		}

		.word {
			display: grid;
			font-family: 'Space Mono', monospace;
			font-size: 1.15rem;
			color: var(--txt-0);
			max-width: 9rem;
			overflow: hidden;
			white-space: nowrap;
			transition:
				max-width 0.3s ease,
				opacity 0.2s ease;
		}

		.here {
			display: none;
			flex-shrink: 0;
			white-space: nowrap;
			font-family: 'Space Mono', monospace;
			font-size: 1rem;
			color: var(--green);
		}
	}

	header.scrolled .row .word {
		max-width: 0;
		opacity: 0;
	}

	/* divider between identity and links */
	nav.top {
		position: relative;
		display: flex;
		gap: 0.1rem;
		padding-left: 1.1rem;

		&::before {
			content: '';
			position: absolute;
			left: 0;
			top: 50%;
			height: 1.4rem;
			margin-top: -0.7rem;
			border-left: 1px solid var(--bg-3);
		}

		a {
			position: relative;
			z-index: 1;
			padding: 0.4rem 0.85rem;
			font-size: 1.05rem;
			font-family: 'Space Mono', monospace;
			white-space: nowrap;
			color: var(--txt);
			transition: color 0.2s;

			&.active {
				color: var(--green);
			}
		}
	}

	/* sliding highlight under the hovered / current link */
	.pill {
		position: absolute;
		top: 50%;
		left: 0;
		height: 2.3rem;
		margin-top: -1.15rem;
		border-radius: 999px;
		background: hsla(148, 48%, 26%, 0.12);
		opacity: 0;
		transition:
			transform 0.3s cubic-bezier(0.3, 1.2, 0.5, 1),
			width 0.3s cubic-bezier(0.3, 1.2, 0.5, 1),
			opacity 0.2s;

		&.on {
			opacity: 1;
		}
	}

	/* reading progress, clipped along the pill's bottom edge */
	.progress {
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 2px;
		background: linear-gradient(90deg, var(--green), var(--ochre));
		transform-origin: left center;
		transform: scaleX(0);
	}

	.container {
		height: 100%;
		display: grid;
	}

	.transition {
		grid-column-start: 1;
		grid-column-end: 2;
		grid-row-start: 1;
		grid-row-end: 2;
		min-width: 0;
	}

	/* ─── bottom tab bar (phones) ─── */
	.tabbar {
		display: none;
	}

	@media (max-width: 1080px) {
		.dock {
			gap: 0.9rem;
		}
		.row .word {
			display: none;
		}
		nav.top a {
			padding: 0.4rem 0.7rem;
			font-size: 1rem;
		}
	}

	@media (max-width: 820px) {
		header {
			height: 4.25rem;
		}

		.dock {
			height: 3rem;
			padding: 0 1.1rem 0 0.9rem;
		}

		header.scrolled .dock {
			height: 2.8rem;
		}

		nav.top {
			display: none;
		}

		.row .word {
			display: grid;
		}

		.row .here {
			display: inline;
		}

		.container.has-tabbar {
			padding-bottom: calc(4rem + env(safe-area-inset-bottom));
		}

		.tabbar {
			position: fixed;
			left: 0;
			right: 0;
			bottom: 0;
			z-index: 50;
			display: grid;
			grid-template-columns: repeat(5, minmax(0, 1fr));
			padding-bottom: env(safe-area-inset-bottom);
			background: color-mix(in srgb, var(--bg) 88%, transparent);
			backdrop-filter: blur(14px) saturate(1.3);
			-webkit-backdrop-filter: blur(14px) saturate(1.3);
			border-top: 1px solid var(--bg-3);

			a {
				position: relative;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				gap: 0.2rem;
				min-height: 3.75rem;
				font-family: 'Space Mono', monospace;
				font-size: 0.66rem;
				color: var(--txt-2);
				transition: color 0.2s;

				:global(svg) {
					font-size: 1.4rem;
				}

				&.active {
					color: var(--green);
				}

				&.active::before {
					content: '';
					position: absolute;
					top: -1px;
					left: 28%;
					right: 28%;
					height: 2px;
					border-radius: 0 0 2px 2px;
					background: var(--green);
				}
			}
		}
	}
</style>
