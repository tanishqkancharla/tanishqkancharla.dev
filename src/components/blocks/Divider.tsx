import styled from "styled-components";
import { blockMarginLg, borderColor, borderWidth } from "../../styles/vars";

export const Divider = styled.hr`
	border-color: ${borderColor};
	border-width: 0;
	border-top-width: ${borderWidth};

	margin: ${blockMarginLg} 0;

	width: 100%;
	border-style: solid;
`;
