# www

Hassan Munene's personal site: about, projects, blog and field notes.

Built with SvelteKit (Svelte 5), mdsvex and shiki, prerendered with `adapter-static` and deployed to a VPS behind Caddy (see `deploy/SETUP.md`).

```sh
bun install
bun run dev      # local dev
bun run build    # static build into build/
DEPLOY_HOST=user@ip bun run deploy   # build + rsync to the VPS
```
