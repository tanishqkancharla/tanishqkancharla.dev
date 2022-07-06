import React from "react";
import { randomString } from "remeda";
import styled from "styled-components";
import { RichTextContent } from "tk-parser/dist/blocks/richText";
import { accentColor, blockMargin } from "../../styles/vars";
import { P } from "./Paragraph";
import { RichTextParagraph } from "./RichText";

const Summary = styled.summary`
	&::-webkit-details-marker {
		color: ${accentColor};
	}

	&::marker {
		color: ${accentColor};
	}
`;

const Details = styled.details`
	margin: ${blockMargin} 0;

	${P} {
		margin-top: 6px;
		margin-left: 4px;
		border-color: var(--accent-color);
		border-left-width: 3.5px;
		padding-left: 10px;
	}
`;

export function Toggle(props: { label: string; content: RichTextContent[] }) {
	return (
		<Details>
			<Summary>{props.label}</Summary>
			{props.content.map((content) => (
				<RichTextParagraph key={randomString(10)}>{content}</RichTextParagraph>
			))}
		</Details>
	);
}
