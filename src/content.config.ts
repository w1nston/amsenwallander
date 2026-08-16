import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

let recipes = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/recipes' }),
	schema: z.object({
		title: z.string(),
		slug: z.string(),
		tags: z.array(z.string()),
	})
});

let preparations = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/preparations' }),
	schema: z.object({
		title: z.string(),
		slug: z.string(),
	})
});

let drinks = defineCollection({
    loader: glob({ pattern: '**/*.md', base: './src/drinks' }),
    schema: z.object({
        title: z.string(),
        slug: z.string(),
    })
});

export let collections = {
    drinks,
	preparations,
	recipes,
}
