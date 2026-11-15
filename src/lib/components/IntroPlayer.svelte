<script>
	import introVideo from '../../content/journey/intro.mp4?url';
	import introPoster from '../../content/journey/intro-poster.jpg?url';
	import introCaptions from '../../content/journey/intro.en.vtt?url';

	let dialogEl = $state(null);
	let videoEl = $state(null);
	let ended = $state(false);

	// plain listener on the video; shows the end card when playback finishes
	function watchEnded(node) {
		const onEnded = () => (ended = true);
		node.addEventListener('ended', onEnded);
		return () => node.removeEventListener('ended', onEnded);
	}

	// call from the page: <IntroPlayer bind:this={player} /> then player.open()
	export function open() {
		ended = false;
		dialogEl?.showModal();
		// the tap that opened the dialog counts as the gesture, so sound is allowed
		videoEl?.play().catch(() => {});
	}

	function close() {
		dialogEl?.close();
	}

	function onClose() {
		videoEl?.pause();
		if (videoEl) videoEl.currentTime = 0;
	}

	function replay() {
		ended = false;
		if (videoEl) {
			videoEl.currentTime = 0;
			videoEl.play().catch(() => {});
		}
	}

	// clicking the dark backdrop (the dialog element itself) closes it
	function onDialogClick(e) {
		if (e.target === dialogEl) close();
	}
</script>

<dialog bind:this={dialogEl} onclose={onClose} onclick={onDialogClick} aria-label="Intro video">
	<div class="player">
		<video
			bind:this={videoEl}
			src={introVideo}
			poster={introPoster}
			controls
			playsinline
			preload="metadata"
			{@attach watchEnded}
		>
			<track kind="captions" src={introCaptions} srclang="en" label="English" default />
		</video>

		{#if ended}
			<div class="end" role="group" aria-label="After the video">
				<span class="kicker">That was my intro</span>
				<h2>Thanks for watching.</h2>
				<p>Shamba Records serves 150,000+ farmers like him.</p>
				<div class="actions">
					<a class="end-btn primary" href="/projects/shamba-records-platform">
						See the Shamba platform <span aria-hidden="true">→</span>
					</a>
					<a class="end-btn" href="/projects">All my work</a>
					<a class="end-btn" href="/contact">Say hello</a>
				</div>
				<button class="replay" onclick={replay}>↺ Replay</button>
			</div>
		{/if}

		<button class="close" onclick={close} aria-label="Close video">Close ✕</button>
	</div>
</dialog>

<style>
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
			display: grid;
			place-items: center;
			animation: fade 0.25s both;
		}
	}

	.player {
		position: relative;
		width: 100%;
		max-width: 64rem;
		max-height: 100dvh;

		video {
			display: block;
			width: 100%;
			max-height: 100dvh;
			background: #000;
		}

		video::cue {
			font-family: 'Space Grotesk', system-ui, sans-serif;
			font-size: 1.15rem;
			line-height: 1.35;
			color: #fff;
			background: hsla(148, 40%, 6%, 0.78);
		}
	}

	.close {
		position: absolute;
		top: max(0.75rem, env(safe-area-inset-top));
		right: 0.75rem;
		min-height: 2.75rem;
		padding: 0 1rem;
		border-radius: 999px;
		background: hsla(0, 0%, 0%, 0.55);
		color: #fff;
		font-family: 'Space Mono', monospace;
		font-size: 0.95rem;
	}

	.end {
		position: absolute;
		inset: 0 0 3rem 0;
		display: grid;
		align-content: center;
		justify-items: center;
		gap: 0.6rem;
		padding: 1rem 1.25rem;
		background: hsla(148, 40%, 6%, 0.8);
		backdrop-filter: blur(10px);
		text-align: center;
		animation: rise 0.45s both;

		.kicker {
			font-family: 'Space Mono', monospace;
			font-size: 0.8rem;
			letter-spacing: 0.12em;
			text-transform: uppercase;
			color: var(--ochre);
		}

		h2 {
			margin: 0;
			font-family: 'Space Mono', monospace;
			font-size: clamp(1.5rem, 5vw, 2.4rem);
			font-weight: 400;
			line-height: 1.15;
			color: #fff;
		}

		p {
			margin: 0 0 0.6rem;
			max-width: 30rem;
			font-size: clamp(0.95rem, 2.6vw, 1.1rem);
			color: hsla(0, 0%, 100%, 0.78);
		}
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 0.5rem;
	}

	.replay {
		min-height: 2.5rem;
		padding: 0 0.75rem;
		background: none;
		border: none;
		color: hsla(0, 0%, 100%, 0.75);
		font-family: 'Space Mono', monospace;
		font-size: 0.95rem;
		cursor: pointer;

		&:hover {
			color: #fff;
		}
		&:focus-visible {
			outline: 3px solid var(--ochre);
			outline-offset: 2px;
		}
	}

	.end-btn {
		display: inline-flex;
		align-items: center;
		min-height: 2.75rem;
		padding: 0 1.25rem;
		border-radius: 999px;
		border: 2px solid hsla(0, 0%, 100%, 0.5);
		color: #fff;
		font-family: 'Space Mono', monospace;
		font-size: 1rem;
		background: transparent;

		&.primary {
			background: var(--ochre);
			border-color: var(--ochre);
			color: hsl(30, 25%, 9%);
		}

		span {
			margin-left: 0.4ch;
		}
		&:hover {
			border-color: #fff;
		}
		&.primary:hover {
			border-color: var(--ochre);
			filter: brightness(1.08);
		}
	}

	@media (min-width: 900px) {
		dialog[open] {
			padding: 2rem;
		}

		.player {
			border-radius: 1rem;
			overflow: hidden;
		}
	}

	@keyframes fade {
		from {
			opacity: 0;
		}
	}

	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(14px);
		}
	}
</style>
