import styled from "styled-components";
import {
	blockMargin,
	borderColor,
	borderRadius,
	galleryWidth,
	shadowMd,
	transitionLg,
} from "../styles/vars";

export const Gallery = styled.div`
	margin: ${blockMargin} 0;
	width: ${galleryWidth};
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-row-gap: 1rem;
	grid-column-gap: 1rem;
`;

export const GalleryItem = styled.div`
	height: 250px;
	border-color: ${borderColor};
	border-radius: ${borderRadius};
	border-style: solid;

	padding: 0 16px;

	${transitionLg}
	:hover {
		${shadowMd}
	}
`;
