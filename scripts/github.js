// Builds github.json (the contribution graph on the about page) from github's
// public contribution calendar. Used by `vite dev`, by the deploy script, and by
// the daily cron on the server. Scrapes the public contribution
// calendar (no token needed): cell dates/levels come from <td data-date
// data-level>, per-day counts from the matching <tool-tip> elements.
export async function fetchGithub(username) {
	const res = await fetch(`https://github.com/users/${username}/contributions`, {
		headers: { 'User-Agent': 'munenehassan.com' }
	});
	if (!res.ok) throw new Error(`github contributions: HTTP ${res.status}`);
	const html = await res.text();

	const counts = {};
	for (const [, id, count] of html.matchAll(
		/for="(contribution-day-component[\d-]+)"[^>]*>\s*(No|[\d,]+) contribution/g
	)) {
		counts[id] = count === 'No' ? 0 : Number(count.replaceAll(',', ''));
	}

	const days = [];
	for (const [tag] of html.matchAll(/<td[^>]*data-date="[^"]*"[^>]*>/g)) {
		const date = tag.match(/data-date="([^"]+)"/)[1];
		const level = Number(tag.match(/data-level="(\d)"/)?.[1] ?? 0);
		const id = tag.match(/id="([^"]+)"/)?.[1];
		days.push({ date, level, count: counts[id] ?? 0 });
	}
	if (days.length === 0) throw new Error('github contributions: no days parsed');
	days.sort((a, b) => (a.date < b.date ? -1 : 1));

	return {
		updatedAt: Date.now(),
		user: username,
		total: days.reduce((sum, day) => sum + day.count, 0),
		days
	};
}

// cli: node scripts/github.js <username> <outfile>
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

if (process.argv[1] === fileURLToPath(import.meta.url)) {
	const [username, out] = process.argv.slice(2);
	if (!username || !out) {
		console.error('usage: node scripts/github.js <username> <outfile>');
		process.exit(1);
	}
	try {
		const data = await fetchGithub(username);
		fs.writeFileSync(out + '.tmp', JSON.stringify(data));
		fs.renameSync(out + '.tmp', out);
		console.log(`wrote ${out}: ${data.total} contributions`);
	} catch (err) {
		// keep the previous file if github is unreachable
		console.error(err.message);
		process.exit(1);
	}
}
