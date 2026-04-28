import { TKBlockTransformer } from "./Transformer";

export type LoadedTweet = { type: "tweet"; html: string };

type TweetLoader = TKBlockTransformer<"tweet", LoadedTweet>;

export const tweetLoader: TweetLoader = async (block) => {
	console.log("Loading tweet", block.url);

	try {
		const res = await fetch(
			`https://publish.twitter.com/oembed?url=${block.url}`
		);

		if (!res.ok) {
			console.warn(`Tweet oembed failed (${res.status}) for ${block.url}`);
			return { type: "tweet", html: tweetFallback(block.url) } as const;
		}

		const { html } = (await res.json()) as { html: string };
		return { type: "tweet", html } as const;
	} catch (error) {
		console.warn(`Failed to load tweet ${block.url}:`, error);
		return { type: "tweet", html: tweetFallback(block.url) } as const;
	}
};

function tweetFallback(url: string): string {
	return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`;
}
