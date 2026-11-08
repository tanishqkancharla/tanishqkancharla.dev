export const HEADER_IMAGE_WIDTH = 5760;
export const HEADER_IMAGE_HEIGHT = 1152;

// The header is 18rem tall and the 5:1 strip covers it, so the strip is never
// drawn narrower than 90rem. Below 40rem only the strip's center shows, so a
// 40rem × 18rem center crop of the strip is served instead.
export const headerWidths = [1440, 1920, 2880, 3840, 5760];
export const headerSizes = "(max-width: 90rem) 90rem, 100vw";
export const narrowHeaderWidths = [640, 1280, 1920];
export const narrowHeaderMedia = "(max-width: 40rem)";
export const narrowHeaderSizes = "40rem";

export const resolutionFileName = (fileName: string, resolution: number) => {
	return `${fileName}-${resolution}.jpg`;
};

export const narrowFileName = (fileName: string, resolution: number) =>
	resolutionFileName(`${fileName}-narrow`, resolution);

export const headerSrcSet = (fileName: string) =>
	headerWidths
		.map((res) => `/${resolutionFileName(fileName, res)} ${res}w`)
		.join(", ");

export const narrowHeaderSrcSet = (fileName: string) =>
	narrowHeaderWidths
		.map((res) => `/${narrowFileName(fileName, res)} ${res}w`)
		.join(", ");

export const headerImageDefaultSrc = (fileName: string) =>
	`/${resolutionFileName(fileName, headerWidths[0])}`;
