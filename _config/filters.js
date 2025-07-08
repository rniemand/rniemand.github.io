import { DateTime } from "luxon";

export default function (eleventyConfig) {
	eleventyConfig.addFilter("readableDate", (dateObj, format, zone) => {
		// Formatting tokens for Luxon: https://moment.github.io/luxon/#/formatting?id=table-of-tokens
		return DateTime.fromJSDate(dateObj, { zone: zone || "utc" }).toFormat(format || "dd LLLL yyyy");
	});

	eleventyConfig.addFilter("htmlDateString", (dateObj) => {
		// dateObj input: https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
		return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat('yyyy-LL-dd');
	});

	eleventyConfig.addFilter('stringify', (data) => {
		return JSON.stringify(Object.keys(data), null, "\t")
	});

	eleventyConfig.addFilter('postBanner', (post, page) => {
		let climbDirs = page.url.split('/').length - 1;
		let finalPath = '';
		for (let i = 0; i < climbDirs; i++) finalPath += '../';
		return finalPath + 'img/post-banners/' + post.data.banner;
	});

	eleventyConfig.addFilter('pageSlug', (page) => {
		let stripped = page.url.replaceAll('/', '_').replaceAll('-', '');
		return stripped.substring(1, stripped.length - 1);
	});

	eleventyConfig.addFilter('postLogo', (post, page) => {
		let climbDirs = page.url.split('/').length - 1;
		let finalPath = '';
		for (let i = 0; i < climbDirs; i++) finalPath += '../';
		return finalPath + 'img/post-logos/' + post.data.logo;
	});

	// Get the first `n` elements of a collection.
	eleventyConfig.addFilter("head", (array, n) => {
		if (!Array.isArray(array) || array.length === 0) {
			return [];
		}
		if (n < 0) {
			return array.slice(n);
		}

		return array.slice(0, n);
	});

	// Return the smallest number argument
	eleventyConfig.addFilter("min", (...numbers) => {
		return Math.min.apply(null, numbers);
	});

	// Return the keys used in an object
	eleventyConfig.addFilter("getKeys", target => {
		return Object.keys(target);
	});

	eleventyConfig.addFilter("filterTagList", function filterTagList(tags) {
		return (tags || []).filter(tag => ["all", "posts"].indexOf(tag) === -1);
	});

	eleventyConfig.addFilter("sortAlphabetically", strings =>
		(strings || []).sort((b, a) => b.localeCompare(a))
	);
};
