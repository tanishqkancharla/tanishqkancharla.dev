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
	width: clamp(70%, 700px, 83.333333%);
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

export const GalleryCard = styled.div`
	position: relative;
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

export const GalleryCardLink = styled.a`
	::before {
		content: " ";
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
`;

export const GalleryCardContent = styled.div`
	padding: 0 16px;
`;
