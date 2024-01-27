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
	tags?: string[];
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
export interface LinkItem {
	title: string;
	url: string;
	description?: string;
}
export interface LinkBlock {
	title: string;
	description?: string;
	items: LinkItem[];
}
export const GOOGLE_ANALYTICS_ID = "G-5253DZFQN6";
export const LinkBlocks: LinkBlock[] = [
	{
		title: "⏯️ Must See Videos",
		description:
			"These are videos that are highly recommended, and are a must watch. Some videos may be hard to find or may also be controversial.",
		items: [
			{
				title: "📙 Logos XXI",
				url: "https://www.youtube.com/playlist?list=PLRIiWpHT58JLYrgHMzHd87j03qHqspDz3",
				description: "German Plato's Lectures on the 21st Century",
			},
			{
				title: "🤖 Narrative AI - DARPA Bots",
				url: "https://www.youtube.com/watch?v=PeZf-E_1tz0",
				description:
					"A video about the future of AI and how it is controlling the world via DARPA Bots",
			},
			{
				title: "🤖 Bard Chat Research",
				url: "https://bard.google.com/share/3bde2c18a224",
				description:
					"A sharable link to access an interesting conversation with Google Bard",
			},
		],
	},

	{
		title: "⚙️ Important Documentation",
		description:
			"Documentation links for important packages that I may be using currently.",
		items: [
			{
				title: "📈 Pandas (Python) Documentation",
				url: "https://pandas.pydata.org/docs/index.html",
				description: "Documentation for Pandas, a Python Data Analysis Library",
			},
			{
				title: "📊 Matplotlib (Python) Documentation",
				url: "https://matplotlib.org/stable/contents.html",
				description:
					"Documentation for Matplotlib, a Python Data Visualization Library",
			},
			{
				title: "📚 SvelteKit Documentation",
				url: "https://kit.svelte.dev/docs",
				description: "Documentation for SvelteKit, a Svelte Framework",
			},
			{
				title: "💹 Alpha Vantage Documentation",
				url: "https://www.alphavantage.co/documentation/",
				description: "Documentation for Alpha Vantage, a Stock API",
			},
			{
				title: "📈 Mplfinance Documentation",
				url: "https://github.com/matplotlib/mplfinance",
				description: "Documentation for Mplfinance",
			},
			{
				title: "🐍 Python Module Index",
				url: "https://docs.python.org/3/py-modindex.html",
				description:
					"Python Module Index - A list of all Standard Python Modules",
			},
			{
				title: "📈 Pandas Cheat Sheet",
				url: "https://pandas.pydata.org/Pandas_Cheat_Sheet.pdf",
				description: "Pandas Cheat Sheet",
			},
			{
				title: "⚙️ Pydantic Documentation",
				url: "https://docs.pydantic.dev/latest/",
				description: "Pydantic Documentation",
			},
			{
				title: "💻 TkInter / Tcl Documentation",
				url: "https://tcl.tk/man/tcl8.6/contents.htm",
				description: "TkInter / Tcl Documentation",
			},
		],
	},
];

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
export const SITE_TITLE = "📖 Urban Archives";
export const SITE_DESCRIPTION = "Welcome to my website!";
//export const SITE_PATH: string = "astro-notes-db";
export const SITE_PATH: string = "";
export const HEADER_ITEMS: HeaderItem[] = [
	{ title: "Home", url: "/" },
	{ title: "Links", url: "/links" },
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
