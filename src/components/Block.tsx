import React from "react";
import { TKBlock } from "../parser/parseTK";

function escapeHTML(unsafeHTML: string): string {
	return unsafeHTML
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&#039;");
}

export function Block(props: { block: TKBlock }): JSX.Element | null {
	const block = props.block;

	switch (block.type) {
		case "codeBlock": {
			return (
				<pre lang={block.lang}>
					<code>{escapeHTML(block.content)}</code>
				</pre>
			);
		}
		case "divider": {
			return <hr />;
		}
		case "h1": {
			return <h1>{block.content}</h1>;
		}
		case "h2": {
			return <h2>{block.content}</h2>;
		}
		case "h3": {
			return <h3>{block.content}</h3>;
		}
		case "unorderedList": {
			return (
				<ul>
					{block.listItems.map((listItem, index) => (
						<li key={index}>{listItem}</li>
					))}
				</ul>
			);
		}
		case "newLine": {
			return null;
		}
		case "twitter": {
			return <p>{block.url}</p>;
		}
		case "paragraph": {
			return <p>{block.content}</p>;
		}
		default: {
			throw new Error(`Unknown block: ${block}`);
		}
	}
}
