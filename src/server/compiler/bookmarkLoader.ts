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
	const { description, title } = await fetch_og(block.url);

	return { ...block, title, description } as const;
};
