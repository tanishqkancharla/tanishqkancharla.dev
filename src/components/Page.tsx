import React from "react";
import { TKDoc } from "../parser/parseTK";
import { Article } from "./Article";
import { Body } from "./blocks/Body";
import { Font } from "./Font";
import { Head } from "./Head";
import { Header } from "./Header";

type PageProps = {
	ast: TKDoc;
};

export function Page(props: PageProps) {
	const {
		ast: { metadata, blocks },
	} = props;

	return (
		<html>
			<Head />
			<Font />
			<Body>
				<Header title={metadata.title} />
				<Article blocks={blocks} />
			</Body>
		</html>
	);
}