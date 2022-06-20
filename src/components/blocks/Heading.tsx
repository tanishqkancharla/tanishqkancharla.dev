import styled from "styled-components";
import {
	blockMargin,
	headingTextColor,
	secondaryHeadingTextColor,
} from "../../styles/vars";

export const H1 = styled.h1`
	font-weight: 600;
	font-size: 2.5rem;
	line-height: 3rem;
	margin-top: 1.5rem;
	margin-bottom: ${blockMargin};
	text-decoration: underline;
	color: ${headingTextColor};
`;

export const H2 = styled.h2`
	font-weight: 600;
	font-size: 1.375rem;
	line-height: 1.75rem;
	margin-top: 1rem;
	margin-bottom: ${blockMargin};
	color: ${headingTextColor};
`;

export const H3 = styled.h3`
	font-weight: 600;
	font-size: 1.125rem;
	margin-top: 1rem;
	margin-bottom: ${blockMargin};
	line-height: 1.75rem;
	color: ${secondaryHeadingTextColor};
`;

export const H4 = styled.h4`
	font-size: 1.125rem;
	margin-top: 1rem;
	margin-bottom: ${blockMargin};
	line-height: 1.75rem;
	color: ${secondaryHeadingTextColor};
`;
