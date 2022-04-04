import React from "react";
import { TKBlock } from "../parser/parseTK";
import { BlockLink } from "./blocks/BlockLink";
import { CodeBlock } from "./blocks/CodeBlock";
import { Divider } from "./blocks/Divider";
import { H1, H2, H3 } from "./blocks/Heading";
import { Li, Ul } from "./blocks/List";
import { P } from "./blocks/Paragraph";

export function Block(props: { block: TKBlock }): JSX.Element | null {
	const block = props.block;

	switch (block.type) {
		case "codeBlock": {
			return <CodeBlock lang={block.lang} content={block.content} />;
		}
		case "divider": {
			return <Divider />;
		}
		case "h1": {
			return <H1>{block.content}</H1>;
		}
		case "h2": {
			return <H2>{block.content}</H2>;
		}
		case "h3": {
			return <H3>{block.content}</H3>;
		}
		case "unorderedList": {
			return (
				<Ul>
					{block.listItems.map((listItem, index) => (
						<Li key={index}>{listItem}</Li>
					))}
				</Ul>
			);
		}
		case "newLine": {
			return null;
		}
		case "blockLink": {
			return <BlockLink block={block} />;
		}
		case "twitter": {
			return <P>{block.url}</P>;
		}
		case "paragraph": {
			return <P>{block.content}</P>;
		}
		default: {
			throw new Error(`Unknown block: ${block}`);
		}
	}
}
