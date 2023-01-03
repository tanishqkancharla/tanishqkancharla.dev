export const resolutions = [480, 640, 1280, 2880] as const;

export const resolutionFileName = (
	fileName: string,
	resolution: 480 | 640 | 1280 | 2880
) => {
	return `${fileName}-${resolution}.jpg`;
};

export const resolutionSrcSet = (fileName: string) => {
	return resolutions.map((res) => `/${fileName}-${res}.jpg ${res}w`).join(", ");
};
