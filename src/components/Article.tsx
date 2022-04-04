import React from "react";
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
	return (
		<Article>
			{props.blocks.map((block, index) => (
				<Block key={index} block={block} />
			))}
			<Footer />
		</Article>
	);
}
