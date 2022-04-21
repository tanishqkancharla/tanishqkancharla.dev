import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ServerStyleSheet, StyleSheetManager } from "styled-components";
import { TKArticle } from "../components/Article";
import { Page } from "../components/Page";
import { PageContextProvider } from "../PageContext";
import { parseTK, TKBlock, TKDoc } from "../parser/parseTK";
import { WebsiteContext, WebsiteContextProvider } from "../WebsiteContext";
import { bookmarkLoader, LoadedBookmark } from "./bookmarkLoader";
import { LoadedTweet, tweetLoader } from "./tweetLoader";

export type TransformedBlock =
	| Exclude<TKBlock, { type: "tweet" } | { type: "bookmark" }>
	| LoadedTweet
	| LoadedBookmark;

type TransformedDoc = {
	metadata: TKDoc["metadata"];
	blocks: TransformedBlock[];
};

export async function compilePost(
	contents: string,
	context: WebsiteContext,
	href: string
): Promise<string> {
	const ast = parseTK(contents);

	const transformedBlocks = await Promise.all(
		ast.blocks.map(
			async (block) =>
				(await bookmarkLoader(
					(await tweetLoader(block)) as TKBlock
				)) as TransformedBlock
		)
	);

	const transformedAst: TransformedDoc = {
		metadata: ast.metadata,
		blocks: transformedBlocks,
	};

	const sheet = new ServerStyleSheet();
	try {
		let renderedPost = renderToStaticMarkup(
			<StyleSheetManager sheet={sheet.instance}>
				<WebsiteContextProvider value={context}>
					<PageContextProvider value={{ href }}>
						<Page title={transformedAst.metadata.title}>
							<TKArticle blocks={transformedAst.blocks} />
						</Page>
					</PageContextProvider>
				</WebsiteContextProvider>
			</StyleSheetManager>
		);

		const styleTags = sheet.getStyleTags();

		const bodyIndex = renderedPost.indexOf("<body");
		renderedPost =
			renderedPost.slice(0, bodyIndex) +
			styleTags +
			renderedPost.slice(bodyIndex, undefined);

		sheet.seal();

		return renderedPost;
	} catch (e) {
		sheet.seal();
		throw e;
	}
}

export function compileReactComponent<P>(
	Component: React.JSXElementConstructor<P>,
	props: P,
	context: WebsiteContext,
	href: string
): string {
	const sheet = new ServerStyleSheet();
	try {
		let renderedPost = renderToStaticMarkup(
			<StyleSheetManager sheet={sheet.instance}>
				<WebsiteContextProvider value={context}>
					<PageContextProvider value={{ href }}>
						<Component {...props} />
					</PageContextProvider>
				</WebsiteContextProvider>
			</StyleSheetManager>
		);

		const styleTags = sheet.getStyleTags();

		const bodyIndex = renderedPost.indexOf("<body");
		renderedPost =
			renderedPost.slice(0, bodyIndex) +
			styleTags +
			renderedPost.slice(bodyIndex, undefined);

		sheet.seal();

		return renderedPost;
	} catch (e) {
		sheet.seal();
		throw e;
	}
}
