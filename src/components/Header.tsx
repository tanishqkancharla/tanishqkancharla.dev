import path from "path";
import React from "react";
import styled from "styled-components";
import { useWebsiteContext } from "../server/WebsiteContext";
import { resolutionSrcSet } from "../styles/resolutions";
import { articleWidth, transparentBackground } from "../styles/vars";
import { H1 } from "./blocks/Heading";

export const _Header = styled.div`
	height: 18rem;
	min-height: 250px;
	overflow: hidden;
	position: relative;
	width: 100%;
	z-index: 1;
`;

const HeaderImage = styled.div`
	width: 100%;
	height: 100%;

	& img {
		height: 100%;
		width: 100%;
		object-fit: cover;
	}
`;

const HeaderImageCredits = styled.a`
	position: absolute;
	bottom: 0;
	right: 0.25rem;
	z-index: 2;
	text-decoration: none;

	&:hover {
		text-decoration: none;
	}
`;

const Banner = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	height: auto;
	position: absolute;
	bottom: 0;

	box-shadow: 1;
	width: 100%;

	/* Fallback color */
	background-color: rgb(0, 0, 0);
	/* White w/opacity/see-through */
	background-color: ${transparentBackground};
	-webkit-backdrop-filter: blur(8px);
	backdrop-filter: blur(8px);

	& h1 {
		display: block;
		margin-top: 0;
		margin-bottom: 0;
		color: rgba(250, 250, 250, 1);
		width: ${articleWidth};
	}
`;

export function Header(props: { title: string }) {
	const { headerImageURL, headerImageAlt, headerImageCredits } =
		useWebsiteContext();
	const { title } = props;
	const { name } = path.parse(headerImageURL);
	const srcset = resolutionSrcSet(name);

	return (
		<_Header>
			<HeaderImage>
				<img src={headerImageURL} alt={headerImageAlt} srcSet={srcset} />
			</HeaderImage>
			<HeaderImageCredits
				className={`img-credits`}
				target="_blank"
				rel="noreferrer"
				href={headerImageCredits}
			>
				<span role="img" aria-label="Camera">
					📸
				</span>
			</HeaderImageCredits>

			<Banner>
				<H1>{title}</H1>
			</Banner>
		</_Header>
	);
}
