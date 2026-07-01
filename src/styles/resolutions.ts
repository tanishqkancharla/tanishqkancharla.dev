export const resolutions = [480, 640, 1280, 2880] as const;

export const HEADER_IMAGE_WIDTH = 1280;
export const HEADER_IMAGE_HEIGHT = 853;

export const resolutionFileName = (
	fileName: string,
	resolution: 480 | 640 | 1280 | 2880
) => {
	return `${fileName}-${resolution}.jpg`;
};

export const resolutionSrcSet = (fileName: string) => {
	return resolutions.map((res) => `/${fileName}-${res}.jpg ${res}w`).join(", ");
};

export const headerImageDefaultSrc = (fileName: string) =>
	`/${resolutionFileName(fileName, 1280)}`;
