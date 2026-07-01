import path from "path";
import styled from "styled-components";
import { useWebsiteContext } from "../server/WebsiteContext";
import {
	HEADER_IMAGE_HEIGHT,
	HEADER_IMAGE_WIDTH,
	headerImageDefaultSrc,
	resolutionSrcSet,
} from "../styles/resolutions";
import {
	articleWidth,
	tertiateBackgroundColor,
	transparentBackground,
} from "../styles/vars";

export const _Header = styled.div`
	height: 18rem;
	min-height: 250px;
	overflow: hidden;
	position: relative;
	width: 100%;
	z-index: 1;
`;

const HeaderImage = styled.div`
	position: relative;
	width: 100%;
	height: 100%;
	background-size: cover;
	background-position: center;
	background-color: ${tertiateBackgroundColor};

	& .header-shader-root {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	& img.header-img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
		opacity: 0;
		transition: opacity 150ms ease-out;
	}

	& img.header-img.loaded {
		opacity: 1;
	}

	&.header-shader-active img.header-img {
		opacity: 0;
	}

	@media (scripting: none) {
		& img.header-img {
			opacity: 1;
		}
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
`;

const BannerTitle = styled.h1`
	display: block;
	margin: 0;
	font-weight: 600;
	font-size: 2.5rem;
	line-height: 3rem;
	color: rgba(250, 250, 250, 1);
	width: ${articleWidth};
`;

export function Header(props: { title: string }) {
	const { headerImageURL, headerImageAlt, headerImageCredits } =
		useWebsiteContext();
	const { title } = props;
	const { name } = path.parse(headerImageURL);
	const src = headerImageDefaultSrc(name);
	const srcset = resolutionSrcSet(name);

	return (
		<_Header>
			<HeaderImage
				className="header-image"
				style={{ backgroundImage: `url(${src})` }}
			>
				<div
					className="header-shader-root"
					data-image={src}
					aria-hidden="true"
				/>
				<img
					className="header-img"
					src={src}
					alt={headerImageAlt}
					srcSet={srcset}
					sizes="100vw"
					width={HEADER_IMAGE_WIDTH}
					height={HEADER_IMAGE_HEIGHT}
					fetchPriority="high"
					decoding="async"
				/>
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
				<BannerTitle>{title}</BannerTitle>
			</Banner>
		</_Header>
	);
}
