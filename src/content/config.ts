import { defineCollection, z } from "astro:content";

const docs = defineCollection({
	type: "content",

	schema: z.object({
		title: z.string(),
		coverImage: z.string().url().optional(),
		description: z.string().optional(),
		pubDate: z.date().optional(),
	}),
});
export const collections = { docs };
