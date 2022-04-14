import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ServerStyleSheet, StyleSheetManager } from "styled-components";
import { WebsiteContext } from "..";
import { Page } from "../components/Page";
import { parseTK } from "../parser/parseTK";

export function compilePost(contents: string, context: WebsiteContext): string {
	const ast = parseTK(contents);

	const sheet = new ServerStyleSheet();
	try {
		let renderedPost = renderToStaticMarkup(
			<StyleSheetManager sheet={sheet.instance}>
				<Page ast={ast} context={context} />
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
