import styled from "styled-components";
import {
	accentColor,
	blockMarginLg,
	bodyTextColor,
	borderColor,
	borderRadius,
	borderWidth,
	galleryWidth,
	mediaPhone,
	mediaTablet,
	shadowMd,
	transitionLg,
} from "../styles/vars";

export const Gallery = styled.div`
	margin: ${blockMarginLg} 0;
	width: ${galleryWidth};
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

	height: 250px;
	border-width: ${borderWidth};
	border-color: ${borderColor};
	border-radius: ${borderRadius};
	border-style: solid;

	padding: 0 16px;

	${transitionLg}
	:hover {
		border-color: ${accentColor};
		${shadowMd}
	}
`;
