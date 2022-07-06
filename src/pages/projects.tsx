import * as dt from "data-type-ts";
import fs from "fs-extra";
import path from "path";
import React from "react";
import { parseTK } from "tk-parser";
import { H3 } from "../components/blocks/Heading";
import { P } from "../components/blocks/Paragraph";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { Gallery, GalleryLinkItem } from "../components/Gallery";
import { Page } from "../components/Page";
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
	| "javascript"
	| "typescript";

const projectTagType = dt.or(
	dt.literal("web"),
	dt.literal("swift"),
	dt.literal("rust"),
	dt.literal("python"),
	dt.literal("school"),
	dt.literal("c"),
	dt.literal("javascript"),
	dt.literal("typescript")
);

type ProjectStatus = "thinking" | "published" | "in-progress" | "archived";
const projectStatusType = dt.or(
	dt.literal("thinking"),
	dt.literal("published"),
	dt.literal("in-progress"),
	dt.literal("archived")
);

type ProjectMetadata = {
	title: string;
	description: string;
	status: ProjectStatus;
	href: string;
	tags?: ProjectTag[];
	github?: string;
};

const projectMetadataType: dt.RuntimeDataType<ProjectMetadata> = dt.object({
	required: {
		title: dt.string,
		description: dt.string,
		status: projectStatusType,
	},
	optional: {
		tags: dt.array(projectTagType),
		github: dt.string,
	},
});

export async function getStaticProps(): Promise<PropsType> {
	const projectPostsDirPath = rootPath("src/pages/projects");
	const projectPostPaths = await listDirectory(projectPostsDirPath);

	const projectPostMetadatas = await Promise.all(
		projectPostPaths.map(async (result) => {
			if (result.isDir) return undefined;
			const { name } = path.parse(result.name);
			const projectPostPath = path.join(projectPostsDirPath, result.name);
			const rawContents = await fs.readFile(projectPostPath, "utf8");
			const { metadata } = parseTK(rawContents);
			const href = `projects/${name}`;

			const validateError = projectMetadataType.validate(metadata);

			if (validateError) {
				console.warn(`
Couldn't parse project metadata of ${result.name}:
${validateError}`);
			}

			return projectMetadataType.is(metadata)
				? { ...metadata, href }
				: undefined;
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
