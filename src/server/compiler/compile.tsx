import React from "react";
import { renderToString } from "react-dom/server";
import { ServerStyleSheet, StyleSheetManager } from "styled-components";
import { Page } from "../../components/Page";
import { TKArticle } from "../../components/TKArticle";
import { WebsiteContext } from "../../config";
import { PageContext, PageContextProvider } from "../PageContext";
import { parseTK, TKDoc } from "../parser/parseTK";
import { WebsiteContextProvider } from "../WebsiteContext";
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

export type TransformedDoc = {
	metadata: TKDoc["metadata"];
	blocks: TransformedBlock[];
};

export async function compilePost(
	contents: string,
	websiteContext: WebsiteContext,
	href: string
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

	const transformedDoc: TransformedDoc = {
		metadata: ast.metadata,
		blocks: transformedBlocks,
	};

	const pageContext: PageContext = {
		href,
		title: ast.metadata?.title || "Moonrise",
	};

	const Component = (transformedDoc: TransformedDoc) => (
		<Page>
			<TKArticle doc={transformedDoc} />
		</Page>
	);

	return compileReactComponent(
		Component,
		transformedDoc,
		websiteContext,
		pageContext
	);
}

export function compileReactComponent<P>(
	Component: React.JSXElementConstructor<P>,
	props: P,
	websiteContext: WebsiteContext,
	pageContext: PageContext
): string {
	const sheet = new ServerStyleSheet();

	try {
		let renderedPost = renderToString(
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
		// Insert right before the body.
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
