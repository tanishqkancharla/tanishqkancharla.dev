import { fetch as fetch_og } from "fetch-opengraph";
import { TKBlockTransformer } from "./Transformer";

export type LoadedBookmark = {
	type: "bookmark";
	title: string;
	description: string;
	url: string;
};

type BookmarkLoader = TKBlockTransformer<"bookmark", LoadedBookmark>;

export const bookmarkLoader: BookmarkLoader = async (block: {
	type: "bookmark";
	url: string;
}) => {
	console.log("Loading bookmark", block.url);
	let description: string, title: string;

	try {
		const ogMetadata = await fetch_og(block.url);
		description = ogMetadata.description;
		title = ogMetadata.title;
	} catch {
		throw new Error(`Could not fetch opengraph metadata for ${block.url} `);
	}

	return { ...block, title, description } as const;
};
