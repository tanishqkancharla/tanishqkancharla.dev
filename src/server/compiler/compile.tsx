import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
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

export type CompiledBlock = TypeTransformedBlocks<
	"bookmark",
	LoadedBookmark,
	"tweet",
	LoadedTweet,
	"codeBlock",
	LoadedCodeBlock
>;

export type CompiledDoc = {
	metadata: TKDoc["metadata"];
	blocks: CompiledBlock[];
};

export async function compilePost(
	contents: string,
	websiteContext: WebsiteContext,
	href: string
): Promise<string> {
	const ast = parseTK(contents);

	const compiledBlocks: CompiledBlock[] = await Promise.all(
		ast.blocks.map((block) => {
			switch (block.type) {
				case "tweet":
					return tweetLoader(block);
				case "bookmark":
					return bookmarkLoader(block);
				case "codeBlock":
					return codeBlockLoader(block);
				default:
					return block;
			}
		})
	);

	const transformedDoc: CompiledDoc = {
		metadata: ast.metadata,
		blocks: compiledBlocks,
	};

	const pageContext: PageContext = {
		href,
		title: ast.metadata?.title || "Moonrise",
	};

	const Component = (transformedDoc: CompiledDoc) => (
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
		// Insert right before the body.
		renderedPost =
			renderedPost.slice(0, bodyIndex) +
			styleTags +
			renderedPost.slice(bodyIndex, undefined);

		sheet.seal();

		return renderedPost;
	} catch (error) {
		sheet.seal();
		throw error;
	}
}
