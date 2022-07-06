import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { isString } from "remeda";
import { ServerStyleSheet, StyleSheetManager } from "styled-components";
import { parseTK, TKDoc } from "tk-parser";
import { TKPage } from "../../components/TKPage";
import { WebsiteContext } from "../../config";
import { PageContext, PageContextProvider } from "../PageContext";
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
	console.log("Compiling page: ", href);
	console.log("-----------------------");
	const ast: TKDoc = parseTK(contents);

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

<<<<<<< HEAD
	const transformedDoc: CompiledDoc = {
=======
	console.log("-----------------------");

	const transformedDoc: TransformedDoc = {
>>>>>>> main
		metadata: ast.metadata,
		blocks: compiledBlocks,
	};

	let title = "Moonrise";

	if (isString(ast.metadata.title)) {
		title = ast.metadata.title;
	}

	const pageContext: PageContext = {
		href,
		title,
	};

<<<<<<< HEAD
	const Component = (transformedDoc: CompiledDoc) => (
		<Page>
			<TKArticle doc={transformedDoc} />
		</Page>
	);

=======
>>>>>>> main
	return compileReactComponent(
		TKPage,
		{ doc: transformedDoc },
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

		return renderedPost;
	} finally {
		sheet.seal();
<<<<<<< HEAD
		throw error;
=======
>>>>>>> main
	}
}
