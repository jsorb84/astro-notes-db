import { defineCollection, z } from "astro:content";

const docs = defineCollection({
	type: "content",

	schema: z.object({
		title: z.string(),
		coverImage: z.string().url().optional(),
		description: z.string().optional(),
		pubDate: z.date().optional(),
		keywords: z.string().optional(),
		author: z.string().optional(),
	}),
});
const notes = defineCollection({
	type: "content",
	schema: z.object({
		title: z.string(),
		coverImage: z.string().url().optional(),
		description: z.string().optional(),
		pubDate: z.date().optional(),
		keywords: z.string().optional(),
		author: z.string().optional(),
	}),
});
export const collections = { docs, notes };
