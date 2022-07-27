import {
	blueDark,
	blueDarkA,
	greenDark,
	greenDarkA,
	orangeDark,
	orangeDarkA,
	violetDark,
	violetDarkA,
} from "@radix-ui/colors";
import * as dt from "data-type-ts";
import fs from "fs-extra";
import path from "path";
import React from "react";
import { sortBy } from "remeda";
import styled from "styled-components";
import { parseTK } from "tk-parser";
import { H3 } from "../components/blocks/Heading";
import { P } from "../components/blocks/Paragraph";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { Gallery, GalleryLinkItem } from "../components/Gallery";
import { Page } from "../components/Page";
import { borderRadius, fontSm } from "../styles/vars";
import { listDirectory } from "../tools/listDirectory";
import { rootPath } from "../tools/rootPath";
import { isDefined } from "../utils/typeUtils";

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
	last_edited: string;
	tags?: string[];
	github?: string;
};

const projectMetadataType: dt.RuntimeDataType<ProjectMetadata> = dt.object({
	required: {
		title: dt.string,
		description: dt.string,
		status: projectStatusType,
	},
	optional: {
		last_edited: dt.string,
		tags: dt.array(dt.string),
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

	const statusPriority: Record<ProjectStatus, number> = {
		"in-progress": 0,
		thinking: 1,
		published: 2,
		archived: 3,
	};

	const sortedMetadatas = sortBy(
		projectPostMetadatas.filter(isDefined),
		(metadata) => statusPriority[metadata.status],
		[({ last_edited }) => (last_edited ? Date.parse(last_edited) : 0), "desc"]
	);

	return { projectMetadatas: sortedMetadatas };
}

type PropsType = { projectMetadatas: ProjectMetadata[] };

const statusColor = {
	thinking: blueDark["blue11"],
	published: greenDark["green11"],
	"in-progress": orangeDark["orange11"],
	archived: violetDark["violet11"],
};

const statusBackgroundColor = {
	thinking: blueDarkA["blueA4"],
	published: greenDarkA["greenA4"],
	"in-progress": orangeDarkA["orangeA4"],
	archived: violetDarkA["violetA4"],
};

const Status = styled.div`
	display: inline-block;
	margin: 4px 0;
	border-radius: ${borderRadius};
	padding: 2px 4px;
	font-size: ${fontSm};
	color: ${({ children }: { children: ProjectStatus }) =>
		statusColor[children]};
	background-color: ${({ children }: { children: ProjectStatus }) =>
		statusBackgroundColor[children]};
`;

const Tag = styled.span`
	display: inline-block;
	font-style: italic;
	font-size: ${fontSm};
	padding: 2px;
`;

function ProjectItem(props: { metadata: ProjectMetadata }) {
	const { href, title, description, github, status, tags } = props.metadata;
	return (
		<GalleryLinkItem href={href}>
			<H3>{title}</H3>
			<P>{description}</P>
			<Status>{status}</Status>
			<div>
				{tags?.map((tag, index) => (
					<React.Fragment key={tag}>
						<Tag>{tag}</Tag>
						{index + 1 !== tags?.length && ","}
					</React.Fragment>
				))}
			</div>
		</GalleryLinkItem>
	);
}

function ProjectsPage(props: PropsType) {
	return (
		<Page>
			<Breadcrumbs />
			<Gallery className="gallery">
				{props.projectMetadatas.map((metadata) => (
					<ProjectItem key={metadata.href} metadata={metadata} />
				))}
			</Gallery>
		</Page>
	);
}

export default ProjectsPage;
