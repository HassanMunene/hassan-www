import { nameFromPath, importOgImage, getPosts, readingMinutes } from '$lib/js/posts.js';
import { error } from '@sveltejs/kit';
import { dev } from '$app/environment';

export async function load({ params }) {
	const modules = import.meta.glob('/src/content/blog/*/*.md');
	const raws = import.meta.glob('/src/content/blog/*/*.md', { query: '?raw', import: 'default' });

	let match = {};

	for (const [path, resolver] of Object.entries(modules)) {
		if (nameFromPath(path) === params.slug) {
			match = { path, resolver };
			break;
		}
	}

	const post = await match?.resolver?.();

	if (!post || (!post.metadata.published && !dev)) {
		throw error(404, 'post not found');
	}

	let imagePath = match.path.split('/').slice(0, -1).join('/') + '/' + post.metadata.ogImage;
	let image = await importOgImage(imagePath);

	const raw = await raws[match.path]?.();
	const minutes = readingMinutes(raw);

	// neighbours and related posts, newest first
	const all = (await getPosts(modules)).sort((a, b) => new Date(b.date) - new Date(a.date));
	const i = all.findIndex((p) => p.slug === params.slug);
	const tags = post.metadata.tags ?? [];
	const related = all
		.filter((p) => p.slug !== params.slug && p.tags?.some((t) => tags.includes(t)))
		.slice(0, 2);

	return {
		post,
		slug: params.slug,
		minutes,
		newer: i > 0 ? all[i - 1] : null,
		older: i >= 0 && i < all.length - 1 ? all[i + 1] : null,
		related,
		meta: {
			title: post.metadata.name,
			description: post.metadata.description,
			type: 'article',
			image
		}
	};
}
