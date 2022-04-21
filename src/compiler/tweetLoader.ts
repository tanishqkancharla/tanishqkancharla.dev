import { TKBlock } from "../parser/parseTK";
import { TKBlockTransformer } from "./Transformer";

export type LoadedTweet = { type: "tweet"; html: string };

type TweetLoader = TKBlockTransformer<"tweet", LoadedTweet>;

export const tweetLoader: TweetLoader = async (block: TKBlock) => {
	if (block.type !== "tweet") return block;

	console.log("Loading TWEET", block.url);

	const { html } = await fetch(
		`https://publish.twitter.com/oembed?url=${block.url}`
	).then((res) => res.json());

	return { type: "tweet", html } as const;
};
