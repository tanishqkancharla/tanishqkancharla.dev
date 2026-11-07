import { ImgHTMLAttributes } from "react";
import { useWebsiteContext } from "../server/WebsiteContext";

export function PreparedImage(props: ImgHTMLAttributes<HTMLImageElement>) {
	const { imageAssets } = useWebsiteContext();
	// HTML URL attributes ignore surrounding whitespace; TK image blocks may
	// retain the space after their delimiter.
	const asset = props.src ? imageAssets[props.src.trim()] : undefined;
	const candidates = props.srcSet?.split(",").map((candidate) => {
		const [url, ...descriptor] = candidate.trim().split(/\s+/);
		return { url, descriptor: descriptor.join(" ") };
	});
	const mappedSrcSet =
		candidates
			?.map(({ url, descriptor }) =>
				`${imageAssets[url]?.src ?? url} ${descriptor}`.trim()
			)
			.join(", ");
	return (
		<img
			width={asset?.width}
			height={asset?.height}
			{...props}
			src={asset?.src ?? props.src}
			srcSet={mappedSrcSet}
		/>
	);
}
