import type React from "react";
import styled from "styled-components";
import { enterAnimation } from "../styles/enterAnimation";
import { articleWidth } from "../styles/vars";
import { Breadcrumbs } from "./Breadcrumbs";

const _Article = styled.article`
	width: ${articleWidth};

	${enterAnimation({
		name: "enter-article",
		fromTransform: "translate(0, 2rem) scale(0.8)",
		staggerStep: 0.02,
	})}
`;

export function Article(props: { children: React.ReactNode }) {
	return (
		<_Article>
			<Breadcrumbs />
			{props.children}
		</_Article>
	);
}
