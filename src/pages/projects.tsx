import React from "react";
import { H3 } from "../components/blocks/Heading";
import { P } from "../components/blocks/Paragraph";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { Gallery, GalleryItem } from "../components/Gallery";
import { Page } from "../components/Page";

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
	github?: string;
	tags: ProjectTag[];
	status: ProjectStatus;
};

type PropsType = { projectMetadatas: ProjectMetadata[] };

function ProjectItem() {
	return (
		<GalleryItem>
			<H3>Sunrise</H3>
			<P>
				A project idea I'm still thinking about after people seemed to like my
				redesign of the terminal.
			</P>
		</GalleryItem>
	);
}

function ProjectsPage() {
	return (
		<Page>
			<Breadcrumbs />
			<Gallery>
				<ProjectItem />
				<GalleryItem>Hello</GalleryItem>
				<GalleryItem>Hello</GalleryItem>
				<GalleryItem>Hello</GalleryItem>
				<GalleryItem>Hello</GalleryItem>
				<GalleryItem>Hello</GalleryItem>
			</Gallery>
		</Page>
	);
}

export default ProjectsPage;
