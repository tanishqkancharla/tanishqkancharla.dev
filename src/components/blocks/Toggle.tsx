import React from "react";
import styled from "styled-components";
import { TKBlock } from "../../parser/parseTK";
import { accentColor } from "../../styles/vars";
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
	${P} {
		margin-top: 6px;
		margin-left: 4px;
		border-color: var(--accent-color);
		border-left-width: 3.5px;
		padding-left: 10px;
	}
`;

export function Toggle(props: { block: TKBlock<"toggle"> }) {
	return (
		<Details>
			<Summary>{props.block.label}</Summary>
			<RichTextParagraph>{props.block.content}</RichTextParagraph>
		</Details>
	);
}
