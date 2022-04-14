import styled from "styled-components";
import { borderColor } from "../../styles/vars";

export const Divider = styled.hr`
	border-color: ${borderColor};
	border-top-width: 1.5px;
	margin-top: 0.3rem;
	margin-bottom: 0.3rem;
	width: 100%;
	border-style: solid;
`;
