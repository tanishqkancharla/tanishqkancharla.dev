import fs from "fs-extra";
import path from "path";
import React from "react";
import { H3 } from "../components/blocks/Heading";
import { P } from "../components/blocks/Paragraph";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { Gallery, GalleryLinkItem } from "../components/Gallery";
import { Page } from "../components/Page";
import { parseTK } from "../server/parser/parseTK";
import { listDirectory } from "../tools/listDirectory";
import { rootPath } from "../tools/rootPath";
import { isDefined } from "../utils/typeUtils";

type ProjectTag =
	| "web"
	| "swift"
	| "rust"
	| "python"
	| "school"
	| "c"
	| "javascript";

type ProjectStatus = "thinking" | "completed" | "in-progress" | "archived";

type ProjectMetadata = {
	title: string;
	description: string;
	href: string;
	github?: string;
};

export async function getStaticProps(): Promise<PropsType> {
	const projectPostsDirPath = rootPath("src/pages/projects");
	const projectPostPaths = await listDirectory(projectPostsDirPath);

	const projectPostMetadatas = await Promise.all(
		projectPostPaths.map(async (result) => {
			if (result.isDir) return undefined;
			const projectPostPath = path.join(projectPostsDirPath, result.name);
			const rawContents = await fs.readFile(projectPostPath, "utf8");
			const { metadata } = parseTK(rawContents);
			if (!metadata || !metadata.description) return undefined;

			return {
				title: metadata.title,
				description: metadata.description,
				href: `/projects/${result.name.slice(0, -3)}`,
			};
		})
	);

	return { projectMetadatas: projectPostMetadatas.filter(isDefined) };
}

type PropsType = { projectMetadatas: ProjectMetadata[] };

function ProjectItem(props: { metadata: ProjectMetadata }) {
	const { href, title, description } = props.metadata;
	return (
		<GalleryLinkItem href={href}>
			<H3>{title}</H3>
			<P>{description}</P>
		</GalleryLinkItem>
	);
}

function ProjectsPage(props: PropsType) {
	return (
		<Page>
			<Breadcrumbs />
			<Gallery>
				{props.projectMetadatas.map((metadata) => (
					<ProjectItem key={metadata.href} metadata={metadata} />
				))}
			</Gallery>
		</Page>
	);
}

export default ProjectsPage;
