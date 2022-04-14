import styled from "styled-components";
import { backgroundColor } from "../styles/vars";

export const Body = styled.body`
	font-family: "Source Sans Pro", ui-sans-serif, system-ui, -apple-system,
		BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans",
		sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
		"Noto Color Emoji";
	font-weight: 400;
	background-color: ${backgroundColor};
	height: 100%;
	width: 100%;
	margin: 0;
`;
