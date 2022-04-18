import React from "react";
import styled from "styled-components";
import {
	accentColor,
	borderColor,
	secondaryBodyTextColor,
	transitionDurationSm,
} from "../../styles/vars";
import { H3 } from "./Heading";
import { P } from "./Paragraph";
import { A } from "./RichText";

const _Bookmark = styled.a`
	border-style: solid;
	border-color: ${borderColor};
	border-radius: 0.25rem;
	border-width: 2px;

	display: block;
	margin-top: 0.5rem;
	margin-bottom: 0.5rem;
	padding: 0.5rem;
	text-decoration: none;

	transition-property: background-color, border-color, color, fill, stroke,
		opacity, box-shadow, transform;
	transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
	transition-duration: ${transitionDurationSm};

	&:hover {
		border-color: ${accentColor};
	}

	${P} {
		font-size: 85%;
		line-height: 1.25rem;

		color: ${secondaryBodyTextColor};
		text-overflow: ellipsis;
		overflow: hidden;
		display: -webkit-box !important;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		white-space: normal;
	}

	${P}:not(:last-of-type) {
		margin-bottom: 0.25rem;
	}

	${H3} {
		margin-top: 0px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.block-link-lg .favicon {
		margin-right: 0.5rem;
		position: relative;
		height: 1rem;
		width: 1rem;
		display: inline;
	}

	${A} {
		color: var(--body-text-color);
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 85%;
		max-width: 80%;
	}

	& :last-child {
		margin-bottom: 0px;
	}
`;

export function Bookmark(props: {
	title: string;
	href: string;
	children: React.ReactElement;
}) {
	return (
		<_Bookmark href={props.href}>
			<H3>{props.title}</H3>
			{props.children}
		</_Bookmark>
	);
}
