import styled from "styled-components";
import { fontSm, secondaryBodyTextColor } from "../../styles/vars";
import { PreparedImage } from "../PreparedImage";

const Figure = styled.figure`
	margin: 0;
	margin-top: 1rem;
	margin-bottom: 1rem;

	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.3rem;

	& img {
		max-width: 100%;
	}
`;

const Figcaption = styled.figcaption`
	font-size: ${fontSm};
	color: ${secondaryBodyTextColor};
`;

export function Image(props: { url: string; caption?: string }) {
	return (
		<Figure>
			{/* Preserve automatic sizing: intrinsic attributes changed fractional layout. */}
			<PreparedImage
				src={props.url}
				width={undefined}
				height={undefined}
				loading="lazy"
				decoding="async"
			/>
			<Figcaption>{props.caption}</Figcaption>
		</Figure>
	);
}
