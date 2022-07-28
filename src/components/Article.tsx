import React from "react";
import styled from "styled-components";
import { articleWidth } from "../styles/vars";
import { Breadcrumbs } from "./Breadcrumbs";

const _Article = styled.article`
	display: flex;
	flex-direction: column;
	width: ${articleWidth};

	& > * {
		// This gets animated to opacity 1 in client code
		opacity: 0;
	}
`;

export function Article(props: { children: React.ReactNode }) {
	return (
		<_Article>
			<Breadcrumbs />
			{props.children}
		</_Article>
	);
}
