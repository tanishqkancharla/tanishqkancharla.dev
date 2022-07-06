import styled from "styled-components";
import {
	accentColor,
	bodyTextColor,
	borderColor,
	transitionSm,
} from "../styles/vars";

export const StyledRow = styled.a`
	color: ${bodyTextColor};
	display: block;

	padding: 5px;
	font-weight: 400;
	border-top: solid ${borderColor} 1.5px;
	border-bottom: solid transparent 1.5px;

	display: flex;
	flex-direction: row;
	align-items: center;

	:last-child {
		border-bottom: solid ${borderColor} 1.5px;
	}

	text-decoration: none;

	${transitionSm}

	:hover {
		cursor: pointer;
		border-color: ${accentColor};
		color: ${accentColor};
	}

	:focus {
		outline: none;
		border-color: ${accentColor};
	}
`;

export const StyledTable = styled.div`
	margin-top: 20px;
	width: 100%;
	border-spacing: 0;
	color: ${bodyTextColor};

	${StyledRow} {
		background-color: rgba(0, 0, 0, 0.3);
		box-shadow: inset 0 0 12px 1px rgba(0, 0, 0, 0.6);
	}
`;
