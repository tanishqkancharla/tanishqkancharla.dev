import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ServerStyleSheet, StyleSheetManager } from "styled-components";
import { TKArticle } from "../components/Article";
import { Page } from "../components/Page";
import { PageContext, PageContextProvider } from "../PageContext";
import { parseTK, TKDoc } from "../parser/parseTK";
import { WebsiteContext, WebsiteContextProvider } from "../WebsiteContext";
import { bookmarkLoader, LoadedBookmark } from "./bookmarkLoader";
import { codeBlockLoader, LoadedCodeBlock } from "./codeblockLoader";
import { TypeTransformedBlocks } from "./Transformer";
import { LoadedTweet, tweetLoader } from "./tweetLoader";

export type TransformedBlock = TypeTransformedBlocks<
	"bookmark",
	LoadedBookmark,
	"tweet",
	LoadedTweet,
	"codeBlock",
	LoadedCodeBlock
>;

type TransformedDoc = {
	metadata: TKDoc["metadata"];
	blocks: TransformedBlock[];
};

export async function compilePost(
	contents: string,
	websiteContext: WebsiteContext,
	pageContext: PageContext
): Promise<string> {
	const ast = parseTK(contents);

	const transformedBlocks: TransformedBlock[] = await Promise.all(
		ast.blocks.map(async (block) => {
			switch (block.type) {
				case "tweet":
					return await tweetLoader(block);
				case "bookmark":
					return await bookmarkLoader(block);
				case "codeBlock":
					return await codeBlockLoader(block);
				default:
					return block;
			}
		})
	);

	const transformedAst: TransformedDoc = {
		metadata: ast.metadata,
		blocks: transformedBlocks,
	};

	const sheet = new ServerStyleSheet();
	try {
		let renderedPost = renderToStaticMarkup(
			<StyleSheetManager sheet={sheet.instance}>
				<WebsiteContextProvider value={websiteContext}>
					<PageContextProvider value={pageContext}>
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
	websiteContext: WebsiteContext,
	pageContext: PageContext
): string {
	const sheet = new ServerStyleSheet();

	try {
		let renderedPost = renderToStaticMarkup(
			<StyleSheetManager sheet={sheet.instance}>
				<WebsiteContextProvider value={websiteContext}>
					<PageContextProvider value={pageContext}>
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
