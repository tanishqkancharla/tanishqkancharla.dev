import React from "react";
import { WebsiteContext } from "..";
import { TKDoc } from "../parser/parseTK";
import { TKArticle } from "./Article";
import { Body } from "./Body";
import { Font } from "./Font";
import { Head } from "./Head";
import { TKHeader } from "./Header";

type PageProps = {
	ast: TKDoc;
	context: WebsiteContext;
};

export function Page({ ast, context }: PageProps) {
	const { headerImageURL } = context;
	const { metadata, blocks } = ast;

	return (
		<html>
			<Head />
			<Font />
			<Body>
				<TKHeader title={metadata.title} headerImageURL={headerImageURL} />
				<TKArticle blocks={blocks} />
			</Body>
		</html>
	);
}
