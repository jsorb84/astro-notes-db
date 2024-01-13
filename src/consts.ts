// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

type HeaderItem = {
	title: string;
	url: string;
};
export interface PageSEO {
	title: string;
	url: string;
	keywords: string;
	image: string;
	description: string;
	author: string;
	pubDate?: Date;
}
export interface NPMPackage {
	name: string;
	description: string;
	version: string;
	npmurl: string;
	docsurl: string;
}

export const makeLink = (path: string | URL | null | undefined) => {
	// Input something like /docs needs to add path to /path/docs
	if (path === undefined || path === null) return;
	if (typeof path === "object") return path;
	if (typeof path == "string") {
		const str = `${SITE_PATH != "" ? `/${SITE_PATH}/` : ""}${path}`;
		const rep = str.includes("//") ? str.replaceAll("//", "/") : str;
		return rep;
	}
	return path;
};
export const makeLinkString = (path: string) => {
	const str = `${SITE_PATH != "" ? `/${SITE_PATH}/` : ""}${path}`;
	const rep = str.includes("//") ? str.replaceAll("//", "/") : str;
	return rep;
};
export const SITE_TITLE = "Urban Archives";
export const SITE_DESCRIPTION = "Welcome to my website!";
//export const SITE_PATH: string = "astro-notes-db";
export const SITE_PATH: string = "";
export const HEADER_ITEMS: HeaderItem[] = [
	{ title: "Home", url: "/" },
	{ title: "Docs", url: "/docs" },
	{ title: "Notes", url: "/notes" },
	{ title: "My Packages", url: "/packages" },
];
export const NPM_PACKAGES: NPMPackage[] = [
	{
		name: "@theofficialurban/svelte-utils",
		description: "A collection of my personal Svelte Utilities",
		version: "v1.3.2",
		npmurl: "https://www.npmjs.com/package/@theofficialurban/svelte-utils",
		docsurl: "https://archive.officialurban.xyz/docs/svelte-utilities",
	},
	{
		name: "@theofficialurban/svelte-gradience",
		description: "A Svelte Component for a gradient background",
		version: "v1.0.5",
		npmurl: "https://www.npmjs.com/package/@theofficialurban/svelte-gradience",
		docsurl: "https://archive.officialurban.xyz/docs/svelte-gradience",
	},
	{
		name: "@theofficialurban/sveltewrite",
		description: "A set of Svelte Components for Appwrite & Reactivity",
		version: "v1.5.1",
		npmurl: "https://www.npmjs.com/package/@theofficialurban/sveltewrite",
		docsurl: "https://archive.officialurban.xyz/docs/sveltewrite",
	},
];
