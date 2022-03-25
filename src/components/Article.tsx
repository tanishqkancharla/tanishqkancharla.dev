import React from "react";
import { TKBlock } from "../parser/parseTK";
import { Block } from "./Block";

export function Article(props: { blocks: TKBlock[] }) {
	return (
		<article>
			{props.blocks.map((block, index) => (
				<Block key={index} block={block} />
			))}
		</article>
	);
}
