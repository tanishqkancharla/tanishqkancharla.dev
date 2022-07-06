import React from "react";
import { TransformedDoc } from "../server/compiler/compile";
import { Article } from "./Article";
import { Block } from "./Block";
import { Divider } from "./blocks/Divider";
import { P } from "./blocks/Paragraph";
import { Page } from "./Page";

export function TKPage(props: { doc: TransformedDoc }) {
	const { blocks, metadata } = props.doc;

	return (
		<Page>
			<Article>
				{metadata?.description && (
					<>
						<P>{metadata.description}</P>
						<Divider />
					</>
				)}
				{blocks.map((block, index) => (
					<Block key={index} block={block} />
				))}
			</Article>
		</Page>
	);
}
