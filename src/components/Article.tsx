import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { TransformedBlock } from "../compiler/compile";
import { Block } from "./Block";

export const Article = styled.article`
	display: flex;
	flex-direction: column;
`;

export function TKArticle(props: { blocks: TransformedBlock[] }) {
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
			{props.blocks.map((block, index) => (
				<Block key={index} block={block} />
			))}
		</Article>
	);
}
