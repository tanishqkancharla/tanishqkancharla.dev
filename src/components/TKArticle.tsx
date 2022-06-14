import React, { useEffect, useRef } from "react";
import { TransformedDoc } from "../server/compiler/compile";
import { Article } from "./Article";
import { Block } from "./Block";
import { Divider } from "./blocks/Divider";
import { P } from "./blocks/Paragraph";

export function TKArticle(props: { doc: TransformedDoc }) {
	const { blocks, metadata } = props.doc;
	const ref = useRef<HTMLElement>(null);

	useEffect(() => {
		const node = ref.current;
		if (!node) return;
		node.childNodes.forEach((child, index) => {
			if (child instanceof HTMLElement) {
				const prevStyle = child.getAttribute("style");
				child.setAttribute("style", `${prevStyle};--index: ${index};`);
			}
		});
	}, [ref.current]);

	return (
		<Article ref={ref}>
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
