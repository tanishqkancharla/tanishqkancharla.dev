import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import { TKBlock } from "../parser/parseTK";
import { bodyTextColor, width } from "../styles/vars";
import { Block } from "./Block";
import { Footer } from "./Footer";

const Article = styled.article`
	display: flex;
	flex-direction: column;
	margin-left: auto;
	margin-right: auto;
	margin-top: 0.5rem;
	color: ${bodyTextColor};
	width: ${width};
`;

export function TKArticle(props: { blocks: TKBlock[] }) {
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
			<Footer />
		</Article>
	);
}

export default TKArticle;
