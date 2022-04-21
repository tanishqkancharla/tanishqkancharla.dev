import React from "react";
import { randomString } from "remeda";
import { TransformedBlock } from "../compiler/compile";
import { BlockLink } from "./blocks/BlockLink";
import { Blockquote } from "./blocks/Blockquote";
import { Bookmark } from "./blocks/Bookmark";
import { CodeBlock } from "./blocks/CodeBlock";
import { Divider } from "./blocks/Divider";
import { H1, H2, H3 } from "./blocks/Heading";
import { Li, Ul } from "./blocks/List";
import { P } from "./blocks/Paragraph";
import { RichTextParagraph } from "./blocks/RichText";
import { Toggle } from "./blocks/Toggle";
import { Tweet } from "./blocks/Tweet";

export function Block(props: { block: TransformedBlock }): JSX.Element | null {
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
		case "toggle": {
			return <Toggle block={block} />;
		}
		case "tweet": {
			return <Tweet html={block.html} />;
		}
		case "bookmark": {
			return (
				<Bookmark title={block.title} url={block.url}>
					<P>{block.description}</P>
				</Bookmark>
			);
		}
		case "blockquote": {
			const content = block.content.map((richTextTokens) => (
				<RichTextParagraph key={randomString(10)}>
					{richTextTokens}
				</RichTextParagraph>
			));

			return <Blockquote content={content} />;
		}
		case "paragraph": {
			return <RichTextParagraph>{block.content}</RichTextParagraph>;
		}
		default: {
			throw new Error(`Unknown block: ${JSON.stringify(block, null, 2)}`);
		}
	}
}
