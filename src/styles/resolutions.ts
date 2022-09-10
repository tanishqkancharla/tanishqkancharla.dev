export const resolutions = [480, 640, 1280, 2880];

export const resolutionFileName = (fileName: string, resolution: number) => {
	return `${fileName}-${resolution}.jpg`;
};

export const resolutionSrcSet = (fileName: string) => {
	return resolutions.map((res) => `/${fileName}-${res}.jpg ${res}w`).join(", ");
};
