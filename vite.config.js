import { sveltekit } from '@sveltejs/kit/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { defineConfig } from 'vitest/config';
import Icons from 'unplugin-icons/vite';

// Serves /github.json during `vite dev`. In production the file is written by
// scripts/github.js (at deploy time, then refreshed daily by cron on the server).
const GITHUB_USERNAME = 'HassanMunene';

function workerDev() {
	const handlers = {
		'/github.json': async () => {
			const { fetchGithub } = await import('./scripts/github.js');
			return fetchGithub(GITHUB_USERNAME);
		}
	};

	return {
		name: 'worker-dev',
		apply: 'serve',
		configureServer(server) {
			for (const [path, handler] of Object.entries(handlers)) {
				server.middlewares.use(path, async (req, res) => {
					res.setHeader('Content-Type', 'application/json');
					try {
						res.end(JSON.stringify(await handler()));
					} catch (err) {
						res.statusCode = 503;
						res.end(JSON.stringify({ error: err.message }));
					}
				});
			}
		}
	};
}

export default defineConfig({
	plugins: [
		enhancedImages(),
		sveltekit(),
		Icons({
			compiler: 'svelte'
		}),
		workerDev()
	],
	server: {
		// compile the heavy first-visit pages when the dev server starts, so the
		// first click on the logo (home) doesn't wait on an on-demand compile
		warmup: {
			clientFiles: [
				'./src/routes/+layout.svelte',
				'./src/routes/+page.svelte',
				'./src/routes/projects/+page.svelte',
				'./src/routes/projects/[slug]/+page.svelte',
				'./src/routes/field-notes/+page.svelte',
				'./src/routes/about/+page.svelte'
			]
		}
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
