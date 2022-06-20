import React from "react";
import { CompiledDoc } from "../server/compiler/compile";
import { Article } from "./Article";
import { Block } from "./Block";
import { Divider } from "./blocks/Divider";
import { P } from "./blocks/Paragraph";

export function TKArticle(props: { doc: CompiledDoc }) {
	const { blocks, metadata } = props.doc;

	return (
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
	);
}
