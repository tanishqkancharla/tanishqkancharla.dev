import React from "react";
import styled from "styled-components";
import {
	blockMargin,
	headingTextColor,
	secondaryHeadingTextColor,
} from "../../styles/vars";

const _H1 = styled.h1`
	font-weight: 600;
	font-size: 2.5rem;
	line-height: 3rem;
	margin-top: 1.5rem;
	margin-bottom: ${blockMargin};
	text-decoration: underline;
	color: ${headingTextColor};
`;

export const _H2 = styled.h2`
	font-weight: 600;
	font-size: 1.375rem;
	line-height: 1.75rem;
	margin-top: 1rem;
	margin-bottom: ${blockMargin};
	color: ${headingTextColor};
`;

export const _H3 = styled.h3`
	font-weight: 600;
	font-size: 1.125rem;
	margin-top: 1rem;
	margin-bottom: ${blockMargin};
	line-height: 1.75rem;
	color: ${secondaryHeadingTextColor};
`;

const HeadingAnchor = styled.a`
	text-decoration: none;
	color: ${headingTextColor};
`;

export function H1(props: { children: string }) {
	const id = props.children.replaceAll(" ", "-").toLocaleLowerCase();

	return (
		<_H1 id={id}>
			<HeadingAnchor href={`#${id}`}>{props.children}</HeadingAnchor>
		</_H1>
	);
}

export function H2(props: { children: string }) {
	const id = props.children.replaceAll(" ", "-").toLocaleLowerCase();

	return (
		<_H2 id={id}>
			<HeadingAnchor href={`#${id}`}>{props.children}</HeadingAnchor>
		</_H2>
	);
}

export function H3(props: { children: string }) {
	const id = props.children.replaceAll(" ", "-").toLocaleLowerCase();

	return (
		<_H3 id={id}>
			<HeadingAnchor href={`#${id}`}>{props.children}</HeadingAnchor>
		</_H3>
	);
}

export const H4 = styled.h4`
	font-size: 1.125rem;
	margin-top: 1rem;
	margin-bottom: ${blockMargin};
	line-height: 1.75rem;
	color: ${secondaryHeadingTextColor};
`;
