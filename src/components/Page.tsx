import React from "react";
import styled from "styled-components";
import { usePageContext } from "../server/PageContext";
import { bodyTextColor } from "../styles/vars";
import { Body } from "./Body";
import { Footer } from "./Footer";
import { Head } from "./Head";
import { Header } from "./Header";
import { Style } from "./Style";

type PageProps = {
	children: React.ReactNode;
};

const _Page = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	margin-top: 0.5rem;
	color: ${bodyTextColor};
`;

function Noscript() {
	return (
		<noscript>
			<style
				dangerouslySetInnerHTML={{
					__html: `
  article > * {
    opacity: 1 !important;
  }
  div > * {
    opacity: 1 !important;
  }
`,
				}}
			></style>
		</noscript>
	);
}

export function Page({ children }: PageProps) {
	const { title } = usePageContext();

	return (
		<html lang="en">
			<Head />
			<Style />
			<Body>
				<Noscript />
				<Header title={title} />
				<div style={{ position: "relative" }}>
					<div
						aria-label="Snow"
						id="snow"
						style={{
							zIndex: -1,
							position: "absolute",
							width: "100%",
							height: "100%",
						}}
					></div>

					{/* So children show above the snow */}
					<_Page>{children}</_Page>
					<Footer />
				</div>
			</Body>
		</html>
	);
}
