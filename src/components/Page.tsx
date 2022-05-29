import React from "react";
import styled from "styled-components";
import { usePageContext } from "../PageContext";
import { bodyTextColor, pageWidth } from "../styles/vars";
import { isDefined } from "../utils/typeUtils";
import { Body } from "./Body";
import { Breadcrumbs } from "./Breadcrumbs";
import { Footer } from "./Footer";
import { Head } from "./Head";
import { Header } from "./Header";
import { Style } from "./Style";

type PageProps = {
	children: React.ReactNode;
};

const _Page = styled.div`
	margin-left: auto;
	margin-right: auto;
	margin-top: 0.5rem;
	color: ${bodyTextColor};
	width: ${pageWidth};
`;

export function Page({ children }: PageProps) {
	const { href, title } = usePageContext();

	const dirItems = href.split("/");

	const navItems = dirItems
		.map((dirItem, index) => {
			if (dirItem === "index") return;
			const name = dirItem;
			const dirItemsUpToHere = dirItems.slice(0, index + 1);
			const href = "/".concat(dirItemsUpToHere.join("/"));
			return { name, href };
		})
		.filter(isDefined);

	return (
		<html lang="en">
			<Head />
			<Style />
			<Body>
				<Header title={title} />
				<_Page>
					<Breadcrumbs navItems={navItems} />
					{children}
				</_Page>
				<Footer />
			</Body>
		</html>
	);
}
