import styled from "styled-components";
import {
	accentColor,
	blockMarginLg,
	bodyTextColor,
	borderColor,
	borderRadius,
	borderWidth,
	mediaPhone,
	mediaTablet,
	shadowMd,
	transitionLg,
} from "../styles/vars";

export const Gallery = styled.div`
	margin: ${blockMarginLg} 0;
	width: clamp(75%, 800px, 90%);
	display: grid;
	grid-template-columns: repeat(3, 1fr);

	${mediaTablet} {
		grid-template-columns: repeat(2, 1fr);
	}

	${mediaPhone} {
		grid-template-columns: repeat(1, 1fr);
	}

	& > * {
		// This gets animated to opacity 1 in client code
		opacity: 0;
	}

	row-gap: 1rem;
	column-gap: 1rem;
`;

export const GalleryLinkItem = styled.a`
	display: block;
	text-decoration: none;
	color: ${bodyTextColor};
	overflow: hidden;

	height: 300px;
	border-width: ${borderWidth};
	border-color: ${borderColor};
	border-radius: ${borderRadius};
	border-style: solid;

	${transitionLg}
	:hover {
		border-color: ${accentColor};
		${shadowMd}
	}
`;

export const GalleryItemContent = styled.div`
	padding: 0 16px;
`;
