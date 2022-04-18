import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ServerStyleSheet, StyleSheetManager } from "styled-components";
import { TKArticle } from "../components/Article";
import { Page } from "../components/Page";
import { PageContextProvider } from "../PageContext";
import { parseTK } from "../parser/parseTK";
import { WebsiteContext, WebsiteContextProvider } from "../WebsiteContext";

export function compilePost(
	contents: string,
	context: WebsiteContext,
	href: string
): string {
	const ast = parseTK(contents);

	const sheet = new ServerStyleSheet();
	try {
		let renderedPost = renderToStaticMarkup(
			<StyleSheetManager sheet={sheet.instance}>
				<WebsiteContextProvider value={context}>
					<PageContextProvider value={{ href }}>
						<Page title={ast.metadata.title}>
							<TKArticle blocks={ast.blocks} />
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
