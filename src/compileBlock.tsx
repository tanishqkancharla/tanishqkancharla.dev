import { Element, Fragment, h, render } from "./h";
import { TKBlock } from "./parser";

function compileBlockToJSX(block: TKBlock): Element {
	switch (block.type) {
		case "codeBlock": {
			return (
				<pre lang={block.lang}>
					<code>{block.content}</code>
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
					{block.listItems.map((listItem) => (
						<li>{listItem}</li>
					))}
				</ul>
			);
		}
		case "newLine": {
			return <>""</>;
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

export function compileBlock(block: TKBlock): string {
	const blockJsx = compileBlockToJSX(block);

	return render(blockJsx);
}
