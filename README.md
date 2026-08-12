# stevenqian.com

Personal site built with [Astro](https://astro.build), deployed to GitHub Pages.

- **Design** — editorial system: off-white canvas, warm near-black ink, pastel
  atmospheric gradients. Display type is EB Garamond at weight 300; body is Inter.
  Tokens live in [`src/styles/global.css`](src/styles/global.css).
- **Projects** — edited through a browser admin at `/admin` (Sveltia CMS).
- **Resume** — [`public/resume.pdf`](public/resume.pdf) is the single source of truth.

---

## Day-to-day: how to update the site

### Add or edit a project

1. Go to **<https://stevenqian.com/admin>**
2. Sign in with GitHub.
3. Add/edit a project, then **Publish**.

Saving commits a markdown file to `src/content/projects/` and the site rebuilds
automatically (about a minute). No code, no terminal.

Every project gets **its own page** at `/projects/<slug>`, generated from the
file. The cards on `/projects` and the home page link into it.

**Fields**

| Field | Shows up as |
|---|---|
| Title | Card heading and page `<h1>` |
| Short summary | Card teaser and the line under the title |
| Organization / Your role / Date label | The fact rail beside the write-up |
| Sort date | Ordering only — newest first |
| Featured | Pins it to the home page |
| Cover image | Card thumbnail and the banner on the project page |
| Video | YouTube/Vimeo link or an uploaded `.mp4` — **replaces** the banner |
| Gallery | Grid of extra images below the write-up; click to enlarge |
| Live link / Source code | Buttons at the top of the project page |
| Tags | Chips on the card and in the fact rail |
| Hide | Removes it from the site without deleting it |
| Full write-up | The page body — headings, lists, links, inline images |

### Adding media

Drag images straight into the CMS — they upload to `public/assets/projects/`.

- **Cover** — one image per project, 16:10 works best.
- **Gallery** — as many as you like, each with an optional caption.
- **Video** — paste a YouTube or Vimeo URL, or upload an `.mp4` and enter
  `/assets/projects/yourfile.mp4`.

A project with no cover falls back to a typographic tile, so nothing looks broken
while you're still gathering screenshots.

### Update the resume

Replace **`public/resume.pdf`** with your new PDF — same filename. That's it.
The resume page renders that file directly, so nothing else needs changing.

You can do it from GitHub's web UI: open `public/resume.pdf` → **…** → *Upload
new file* (or drag the new PDF into the `public/` folder with the same name).

### Edit page text (about, hero, contact)

Those live in `src/pages/*.astro` as plain text — edit and commit.

---

## One-time setup (required before `/admin` works)

The admin page needs a small OAuth relay so GitHub can authorize you. This is a
one-time, no-cost setup.

### 1. Create a GitHub OAuth app

1. <https://github.com/settings/developers> → **New OAuth App**
2. Fill in:
   - **Application name:** `stevenqian.com CMS`
   - **Homepage URL:** `https://stevenqian.com`
   - **Authorization callback URL:** `https://sveltia-cms-auth.stevenqian2004.workers.dev/callback`
     (you'll get this exact URL in step 2 — put a placeholder for now and edit it after)
3. Click **Register application**, then **Generate a new client secret**.
4. Keep the **Client ID** and **Client Secret** — you'll paste them into Cloudflare,
   never into this repo.

### 2. Deploy the auth relay (Cloudflare Workers, free)

Use the maintained worker: <https://github.com/sveltia/sveltia-cms-auth>

1. Sign in at <https://dash.cloudflare.com> → **Workers & Pages** → **Create**
2. Deploy the `sveltia-cms-auth` worker (the repo README has a one-click deploy button).
3. In the worker's **Settings → Variables**, add:
   | Name | Value |
   |---|---|
   | `GITHUB_CLIENT_ID` | your Client ID |
   | `GITHUB_CLIENT_SECRET` | your Client Secret (mark as **encrypted**) |
   | `ALLOWED_DOMAINS` | `stevenqian.com` |
4. Copy the worker URL (e.g. `https://sveltia-cms-auth.stevenqian2004.workers.dev`).
5. Go back to the GitHub OAuth app and set the callback URL to
   `https://sveltia-cms-auth.stevenqian2004.workers.dev/callback`.

### 3. Point the CMS at your worker

In [`public/admin/config.yml`](public/admin/config.yml), replace the placeholder:

```yaml
backend:
  base_url: https://REPLACE-ME.workers.dev   # ← your worker URL
```

Commit that change.

### 4. Switch GitHub Pages to build with Actions

The site is now built by a workflow instead of being served as raw files.

**Repo → Settings → Pages → Build and deployment → Source: _GitHub Actions_**

(Currently it's set to "Deploy from a branch", which would publish the source
files rather than the built site.)

After that, every push to `main` builds and deploys via
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

---

## Local development

```bash
npm install
npm run dev
```

Then open <http://localhost:4321>.

| Command | Does |
|---|---|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the built site locally |

### Project layout

```
public/
  admin/         Sveltia CMS (admin UI + config)
  assets/        Images, including CMS uploads (projects/)
  resume.pdf     Source of truth for the resume page
  CNAME          Custom domain
src/
  components/    Nav, Footer, ProjectCard, ResumeViewer,
                 MediaGallery (lightbox), VideoEmbed
  content/
    projects/    One markdown file per project — what /admin edits
  layouts/       BaseLayout (head, fonts, nav/footer, motion)
  pages/
    index.astro        Home
    resume.astro       Resume (renders public/resume.pdf)
    contact.astro      Contact
    projects/
      index.astro      Project list
      [id].astro       One page per project, generated from content
  styles/        global.css — all design tokens and motion
  content.config.ts   Schema for the projects collection
```

### Motion

Animation lives in `global.css`: scroll reveals (`.reveal`), staggered grids
(`.stagger`), load-in entrances (`.rise`, offset with `--d`), drifting gradient
orbs, and cross-page transitions via Astro's `ClientRouter`.

Everything is disabled under `prefers-reduced-motion`. Two things to keep in mind
if you extend it:

- Don't also declare `@view-transition { navigation: auto }` — `ClientRouter`
  already drives transitions, and running both leaves a stuck snapshot over the page.
- Avoid permanent `will-change: transform` on the large orbs; it promotes several
  big layers and causes dropped paints on weaker GPUs.

### Notes

- The resume page renders the PDF onto styled canvases with `pdfjs-dist`, so it
  matches the site's light editorial look instead of the browser's dark PDF viewer.
  That library only loads on `/resume`.
- If you add a field in `public/admin/config.yml`, add it to the schema in
  `src/content.config.ts` too, or the build will reject the new frontmatter.
