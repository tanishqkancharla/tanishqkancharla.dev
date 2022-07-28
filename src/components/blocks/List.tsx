import styled from "styled-components";
import { blockMargin } from "../../styles/vars";

export const Ul = styled.ul`
	padding-left: 1rem;
	margin: ${blockMargin} 0;
	list-style-type: disc;
`;

export const Ol = styled.ol`
	list-style-type: decimal;
	margin: ${blockMargin} 0;
`;

export const Li = styled.li`
	margin: ${blockMargin} 0;

	line-height: 1.4rem;
	font-size: 1.025rem;
	list-style-position: outside;
`;
