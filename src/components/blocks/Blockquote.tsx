import React from "react";
import styled from "styled-components";
import { accentColor } from "../../styles/vars";

const _Blockquote = styled.blockquote`
	margin: 0;
	border-style: solid;
	border-width: 0;
	border-color: ${accentColor};
	border-left-width: 3.5px;
	padding-left: 1rem;
`;

export function Blockquote(props: { content: JSX.Element | JSX.Element[] }) {
	return <_Blockquote>{props.content}</_Blockquote>;
}
