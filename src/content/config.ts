import { defineCollection, reference, z } from "astro:content";

const docs = defineCollection({
	type: "content",

	schema: z.object({
		title: z.string(),
		coverImage: z.string().url().optional(),
		description: z.string().optional(),
		pubDate: z.date().optional(),
		keywords: z.string().optional(),
		author: z.string().optional(),
		category: reference("category").optional(),
	}),
});
const category = defineCollection({
	type: "data",
	schema: z.object({
		name: z.string(),
		keywords: z.string().optional(),
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
		category: reference("category").optional(),
	}),
});
export const collections = { docs, notes, category };
