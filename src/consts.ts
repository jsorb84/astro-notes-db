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
export const SITE_PATH: string = "astro-notes-db";
//export const SITE_PATH: string = "";
export const HEADER_ITEMS: HeaderItem[] = [
	{ title: "Home", url: "/" },
	{ title: "Docs", url: "/docs" },
	{ title: "Notes", url: "/notes" },
];
