<script>
	import { site } from '$lib/js/site.js';
	import MailIcon from '~icons/ph/envelope-simple';
	import LinkedinIcon from '~icons/ph/linkedin-logo';
	import GithubIcon from '~icons/ph/github-logo';
	import XIcon from '~icons/ph/x-logo';
	import CopyIcon from '~icons/ph/copy';
	import CheckIcon from '~icons/ph/check';
	import SendIcon from '~icons/ph/paper-plane-tilt';
	import PinIcon from '~icons/ph/map-pin';
	import WarnIcon from '~icons/ph/warning-circle';
	import portrait from '../../content/journey/intro-poster.jpg?url';

	// assembled at runtime so the address never appears in the static html
	let email = $state('');
	$effect(() => {
		email = ['awanzihassan6', 'gmail.com'].join('@');
	});

	const topics = ['Say hi', 'Work together', 'A question'];

	let topic = $state(topics[0]);
	let status = $state('idle'); // idle | sending | sent | error
	let copied = $state(false);

	// with a web3forms key the message is delivered to your inbox; without one the
	// visitor's own mail app opens, prefilled, so the form still works
	const hasKey = Boolean(site.web3formsKey);

	async function submit(event) {
		event.preventDefault();
		const form = event.currentTarget;
		const data = Object.fromEntries(new FormData(form));

		if (!hasKey) {
			const body = `${data.message}\n\n— ${data.name} (${data.email})`;
			location.href = `mailto:${email}?subject=${encodeURIComponent(`[${topic}] from ${data.name}`)}&body=${encodeURIComponent(body)}`;
			return;
		}

		status = 'sending';
		try {
			const res = await fetch('https://api.web3forms.com/submit', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
				body: JSON.stringify({
					...data,
					topic,
					access_key: site.web3formsKey,
					subject: `[${topic}] message from ${data.name} via ${site.domain}`,
					from_name: site.domain
				})
			});
			const result = await res.json();
			if (result.success) {
				status = 'sent';
				form.reset();
				topic = topics[0];
			} else {
				status = 'error';
			}
		} catch {
			status = 'error';
		}
	}

	async function copyEmail() {
		try {
			await navigator.clipboard.writeText(email);
			copied = true;
			setTimeout(() => (copied = false), 1500);
		} catch {
			/* clipboard blocked: the address is still visible to copy by hand */
		}
	}

	const channels = [
		{
			name: 'LinkedIn',
			note: 'Best for work',
			href: 'https://www.linkedin.com/in/hassan-munene-41290b237',
			icon: LinkedinIcon
		},
		{ name: 'GitHub', note: 'The code', href: 'https://github.com/HassanMunene', icon: GithubIcon },
		{ name: 'X / Twitter', note: 'Say hi', href: 'https://x.com/awanzii', icon: XIcon }
	];
</script>

<main>
	<h1>Contact</h1>
	<p class="lede">
		Got a question, an idea, or something you want to build? I'd like to hear it. I read every
		message myself.
	</p>

	<div class="layout">
		<!-- quick ways to reach me -->
		<section class="channels" aria-label="Ways to reach me">
			<div class="person">
				<img src={portrait} alt="Munene smiling and waving, in a green Shamba Records polo" />
				<div>
					<p class="name">Hassan Munene</p>
					<p class="role">Software engineer, Shamba Records</p>
				</div>
			</div>
			<p class="blurb">
				Happy to talk about backend systems, USSD and payments, building for farmers, or whatever
				you're working on.
			</p>

			<div class="card email">
				<span class="ico"><MailIcon /></span>
				<div class="txt">
					<span class="label">Email</span>
					{#if email}
						<a class="value" href={`mailto:${email}`}>{email}</a>
					{:else}
						<span class="value">&nbsp;</span>
					{/if}
				</div>
				<button class="copy" onclick={copyEmail} aria-label="Copy email address">
					{#if copied}<CheckIcon />{:else}<CopyIcon />{/if}
				</button>
			</div>

			{#each channels as { name, note, href, icon: Icon }}
				<a class="card" {href} target="_blank" rel="noopener noreferrer">
					<span class="ico"><Icon /></span>
					<div class="txt">
						<span class="label">{name}</span>
						<span class="value">{note}</span>
					</div>
					<span class="go" aria-hidden="true">↗</span>
				</a>
			{/each}

			<p class="where"><PinIcon /> Based in Nairobi, Kenya</p>
		</section>

		<!-- the form -->
		<div class="right">
			<section class="panel" aria-label="Send a message">
				{#if status === 'sent'}
					<div class="thanks" role="status">
						<span class="tick"><CheckIcon /></span>
						<h2>Message sent.</h2>
						<p>Thank you. I'll get back to you as soon as I can.</p>
						<button class="btn line" onclick={() => (status = 'idle')}>Send another</button>
					</div>
				{:else}
					<form onsubmit={submit}>
						<fieldset class="topics">
							<legend>What's it about?</legend>
							{#each topics as t}
								<label class:on={topic === t}>
									<input type="radio" name="topic" value={t} bind:group={topic} />
									{t}
								</label>
							{/each}
						</fieldset>

						<div class="row">
							<label class="field">
								<span>Name</span>
								<input type="text" name="name" autocomplete="name" required />
							</label>
							<label class="field">
								<span>Email</span>
								<input type="email" name="email" autocomplete="email" required />
							</label>
						</div>

						<label class="field">
							<span>Message</span>
							<textarea name="message" rows="6" required></textarea>
						</label>

						<!-- honeypot: real visitors never see or fill this -->
						<input type="checkbox" name="botcheck" class="bot" tabindex="-1" autocomplete="off" />

						<button class="btn solid" type="submit" disabled={status === 'sending'}>
							{#if status === 'sending'}Sending…{:else}<SendIcon /> Send message{/if}
						</button>

						{#if status === 'error'}
							<p class="error" role="alert">
								<WarnIcon /> That didn't go through. Try again, or email me directly.
							</p>
						{/if}
						{#if !hasKey}
							<p class="hint">This opens your email app with the message ready to send.</p>
						{/if}
					</form>
				{/if}
			</section>

			<div class="next">
				<p class="next-title">What happens next</p>
				<ol>
					<li>You send me a message here, or write to my email directly.</li>
					<li>I read it myself.</li>
					<li>I reply by email as soon as I can.</li>
				</ol>
			</div>
		</div>
	</div>
</main>

<style>
	main {
		width: 100%;
		max-width: 64rem;
		margin: 0 auto 8rem auto;
		padding: 0 1.25rem;
	}

	.lede {
		max-width: 36rem;
		margin: 0 0 2rem;
		color: var(--txt-2);
	}

	.layout {
		display: grid;
		gap: 1.5rem;
	}

	/* ─── channels ─── */
	.channels {
		display: grid;
		gap: 0.6rem;
		align-content: start;
	}

	/* ─── the person behind the page ─── */
	.person {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 0.2rem;

		img {
			width: 4.5rem;
			height: 4.5rem;
			flex-shrink: 0;
			border-radius: 50%;
			object-fit: cover;
			object-position: 51% 30%;
			box-shadow:
				0 0 0 3px var(--bg),
				0 0 0 5px var(--green);
		}

		p {
			margin: 0;
		}

		.name {
			font-family: 'Space Mono', monospace;
			font-size: 1.2rem;
			color: var(--txt-0);
		}

		.role {
			margin-top: 0.15rem;
			font-size: 0.95rem;
			color: var(--txt-2);
		}
	}

	.blurb {
		margin: 0 0 0.6rem;
		font-size: 1rem;
		line-height: 1.6;
		color: var(--txt-2);
	}

	.card {
		display: flex;
		align-items: center;
		gap: 0.9rem;
		min-height: 4rem;
		padding: 0.7rem 1rem;
		border: 2px solid var(--bg-3);
		border-radius: 0.9rem;
		background: var(--bg);
		transition:
			border-color 0.2s,
			background 0.2s,
			transform 0.2s;

		&:hover {
			border-color: var(--green);
			background: var(--bg-2);
		}

		.ico {
			display: grid;
			place-items: center;
			flex-shrink: 0;
			width: 2.5rem;
			height: 2.5rem;
			border-radius: 50%;
			background: hsla(148, 48%, 26%, 0.1);
			color: var(--green);
			font-size: 1.3rem;
		}

		.txt {
			display: flex;
			flex: 1;
			flex-direction: column;
			min-width: 0;
		}

		.label {
			font-family: 'Space Mono', monospace;
			font-size: 0.8rem;
			color: var(--txt-3);
		}

		.value {
			overflow-wrap: anywhere;
			font-family: 'Space Mono', monospace;
			font-size: 1rem;
			color: var(--txt-0);
		}

		.go {
			font-size: 1.2rem;
			color: var(--green);
			transition: transform 0.2s;
		}

		&:hover .go {
			transform: translate(2px, -2px);
		}
	}

	.email .value {
		overflow-wrap: normal;
		font-size: 0.9rem;
	}

	.copy {
		display: grid;
		place-items: center;
		flex-shrink: 0;
		width: 2.75rem;
		height: 2.75rem;
		border-radius: 50%;
		background: transparent;
		color: var(--txt-2);
		font-size: 1.2rem;
		transition:
			background 0.2s,
			color 0.2s;

		&:hover {
			background: var(--bg-3);
			color: var(--green);
		}
	}

	.where {
		display: flex;
		align-items: center;
		gap: 0.5ch;
		margin: 0.5rem 0 0;
		font-family: 'Space Mono', monospace;
		font-size: 0.9rem;
		color: var(--txt-2);
	}

	.right {
		display: grid;
		gap: 1.25rem;
		align-content: start;
	}

	.next {
		padding: 1rem 1.1rem;
		border-left: 3px solid var(--ochre);
		border-radius: 0 0.8rem 0.8rem 0;
		background: var(--bg-2);

		.next-title {
			margin: 0 0 0.5rem;
			font-family: 'Space Mono', monospace;
			font-size: 0.8rem;
			letter-spacing: 0.1em;
			text-transform: uppercase;
			color: var(--ochre);
		}

		ol {
			margin: 0;
			padding-left: 1.25rem;
			font-size: 0.98rem;
			line-height: 1.65;
			color: var(--txt);
		}
	}

	/* ─── form panel ─── */
	.panel {
		padding: 1.25rem;
		border-radius: 1.1rem;
		background: var(--bg-2);
	}

	form {
		display: grid;
		gap: 1rem;
	}

	.topics {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin: 0;
		padding: 0;
		border: none;

		legend {
			margin-bottom: 0.5rem;
			padding: 0;
			font-family: 'Space Mono', monospace;
			font-size: 0.85rem;
			color: var(--txt-2);
		}

		label {
			position: relative;
			display: inline-flex;
			align-items: center;
			min-height: 2.5rem;
			padding: 0 1rem;
			border: 2px solid var(--bg-3);
			border-radius: 999px;
			background: var(--bg);
			font-family: 'Space Mono', monospace;
			font-size: 0.9rem;
			cursor: pointer;
			transition:
				border-color 0.2s,
				background 0.2s,
				color 0.2s;

			&:hover {
				border-color: var(--green);
			}

			&.on {
				background: var(--green);
				border-color: var(--green);
				color: var(--bg);
			}

			&:has(input:focus-visible) {
				outline: 3px solid var(--ochre);
				outline-offset: 2px;
			}

			input {
				position: absolute;
				opacity: 0;
				pointer-events: none;
			}
		}
	}

	.row {
		display: grid;
		gap: 1rem;
	}

	.field {
		display: grid;
		gap: 0.4rem;

		span {
			font-family: 'Space Mono', monospace;
			font-size: 0.85rem;
			color: var(--txt-2);
		}

		input,
		textarea {
			width: 100%;
			padding: 0.85rem 1rem;
			border: 2px solid var(--bg-3);
			border-radius: 0.7rem;
			background: var(--bg);
			color: var(--txt);
			font: inherit;
			font-size: 1.05rem;
			transition:
				border-color 0.2s,
				box-shadow 0.2s;

			&:focus {
				outline: none;
				border-color: var(--green);
				box-shadow: 0 0 0 3px hsla(148, 48%, 26%, 0.15);
			}
		}

		textarea {
			resize: vertical;
			min-height: 8rem;
		}
	}

	.bot {
		position: absolute;
		left: -9999px;
		opacity: 0;
	}

	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.6ch;
		min-height: 3.1rem;
		padding: 0 1.5rem;
		border: 2px solid var(--green);
		border-radius: 999px;
		background: transparent;
		font-family: 'Space Mono', monospace;
		font-size: 1.05rem;
		transition:
			background 0.2s,
			color 0.2s;

		&.solid {
			background: var(--green);
			color: var(--bg);

			&:hover:not(:disabled) {
				background: hsl(148, 48%, 19%);
				border-color: hsl(148, 48%, 19%);
			}

			&:disabled {
				opacity: 0.7;
				cursor: progress;
			}
		}

		&.line {
			color: var(--green);

			&:hover {
				background: hsla(148, 48%, 26%, 0.09);
			}
		}
	}

	.hint,
	.error {
		margin: 0;
		font-size: 0.9rem;
		color: var(--txt-2);
	}

	.error {
		display: flex;
		align-items: center;
		gap: 0.5ch;
		color: var(--clay);
	}

	.thanks {
		display: grid;
		justify-items: start;
		gap: 0.5rem;
		padding: 1rem 0.25rem;

		.tick {
			display: grid;
			place-items: center;
			width: 3rem;
			height: 3rem;
			border-radius: 50%;
			background: var(--green);
			color: var(--bg);
			font-size: 1.6rem;
		}

		h2 {
			margin: 0.5rem 0 0;
			font-size: 1.6rem;
		}

		p {
			margin: 0 0 0.75rem;
			color: var(--txt-2);
		}
	}

	@media (min-width: 640px) {
		.row {
			grid-template-columns: 1fr 1fr;
		}

		.panel {
			padding: 1.75rem;
		}
	}

	@media (min-width: 900px) {
		main {
			padding: 0 2rem;
		}

		.layout {
			grid-template-columns: minmax(0, 24rem) minmax(0, 1fr);
			gap: 2.5rem;
			align-items: start;
		}
	}
</style>
