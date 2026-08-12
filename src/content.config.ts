import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Projects collection — one Markdown file per project.
// These files are what the /admin (Sveltia CMS) page edits.
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    organization: z.string().optional(),
    // Human-friendly label shown on the card, e.g. "August 2024 – Present"
    dateLabel: z.string().optional(),
    // Real date used only for sorting (newest first)
    date: z.coerce.date(),
    featured: z.boolean().default(false),
    // Optional cover image (path under /public, uploaded via the CMS)
    cover: z.string().optional(),
    // Optional external link (live demo, repo, article)
    link: z.string().url().optional(),
    tags: z.array(z.string()).default([]),
    // Set true to hide a project without deleting it
    draft: z.boolean().default(false),
  }),
});

export const collections = { projects };
