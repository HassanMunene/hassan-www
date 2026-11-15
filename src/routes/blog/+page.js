import { getPosts, nameFromPath, readingMinutes } from '$lib/js/posts.js';

export async function load() {
	const modules = import.meta.glob('/src/content/blog/*/*.md');
	const raws = import.meta.glob('/src/content/blog/*/*.md', { query: '?raw', import: 'default' });

	let posts = await getPosts(modules);

	// reading time comes from the raw markdown of each post
	const minutes = {};
	await Promise.all(
		Object.entries(raws).map(async ([path, load]) => {
			minutes[nameFromPath(path)] = readingMinutes(await load());
		})
	);
	posts = posts.map((post) => ({ ...post, minutes: minutes[post.slug] ?? 1 }));

	posts.sort((a, b) => new Date(b.date) - new Date(a.date));

	return {
		posts,
		meta: {
			title: 'Blog',
			description: 'Notes on backend engineering, reliability and building for farmers in Kenya.'
		}
	};
}
