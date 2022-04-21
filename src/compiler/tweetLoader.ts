import fetch from "node-fetch";
import { TKBlockTransformer } from "./Transformer";

export type LoadedTweet = { type: "tweet"; html: string };

type TweetLoader = TKBlockTransformer<"tweet", LoadedTweet>;

export const tweetLoader: TweetLoader = async (block) => {
	console.log("Loading tweet", block.url);

	const { html } = await fetch(
		`https://publish.twitter.com/oembed?url=${block.url}`
	).then((res) => res.json() as any);

	return { type: "tweet", html } as const;
};
