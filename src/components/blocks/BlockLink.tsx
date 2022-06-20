import React from "react";
import styled from "styled-components";
import {
	accentColor,
	bodyTextColor,
	borderColor,
	borderRadius,
	borderWidth,
	transitionDurationSm,
} from "../../styles/vars";
import { P } from "./Paragraph";

const BlockLinkA = styled.a`
	display: inline-block;
	color: ${bodyTextColor};

	border-style: solid;
	border-color: ${borderColor};
	border-radius: ${borderRadius};
	border-width: ${borderWidth};

	padding: 0.25rem;

	text-decoration: none;

	transition-property: background-color, border-color, color, fill, stroke,
		opacity, box-shadow, transform;
	transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
	transition-duration: ${transitionDurationSm};

	width: fit-content;

	& .title {
		margin: 0;
	}

	&:hover {
		color: ${accentColor};
		border-color: ${accentColor};
	}
`;

export function BlockLink(props: { content: string; url: string }) {
	const { content, url } = props;
	return (
		<P>
			<BlockLinkA href={url}>{content}</BlockLinkA>
		</P>
	);
}
