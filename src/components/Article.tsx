import styled from "styled-components";

export const Article = styled.article`
	display: flex;
	flex-direction: column;

	& > * {
		// This gets animated to opacity 1 in client code
		opacity: 0;
	}
`;
