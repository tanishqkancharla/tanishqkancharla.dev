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
import fs from "node:fs/promises";
import path from "path";
import styled, { css } from "styled-components";
import { parseTK } from "tk-parser";
import { _H3 as H3 } from "../components/blocks/Heading";
import { P } from "../components/blocks/Paragraph";
import { Breadcrumbs } from "../components/Breadcrumbs";
import {
	Gallery,
	GalleryCard,
	GalleryCardContent,
} from "../components/Gallery";
import { Page } from "../components/Page";
import { PreparedImage } from "../components/PreparedImage";
import {
	accentColor,
	blockMarginLg,
	borderColor,
	borderRadius,
	fontSm,
	headingTextColor,
	secondaryBodyTextColor,
	tertiaryBodyTextColor,
	tertiateBackgroundColor,
	transitionSm,
} from "../styles/vars";
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

	/** Still header, also shown as the poster of `header_video_src`. */
	header_image_src?: string;
	header_video_src?: string;
	last_edited?: string;
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
		header_image_src: dt.string,
		header_video_src: dt.string,
		last_edited: dt.string,
		tags: dt.array(dt.string),
		github: dt.string,
		href: dt.string,
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
				? { ...metadata, href: metadata.href ?? href }
				: undefined;
		})
	);

	const statusPriority: Record<ProjectStatus, number> = {
		"in-progress": 0,
		thinking: 1,
		published: 2,
		archived: 3,
	};

	const sortedMetadatas = [...projectPostMetadatas.filter(isDefined)].sort((a, b) => {
		const statusDiff = statusPriority[a.status] - statusPriority[b.status];
		if (statusDiff !== 0) return statusDiff;
		const aDate = a.last_edited ? Date.parse(a.last_edited) : 0;
		const bDate = b.last_edited ? Date.parse(b.last_edited) : 0;
		return bDate - aDate; // desc
	});

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

const Status = styled.div<{ $status: ProjectStatus }>`
	display: inline-block;
	border-radius: ${borderRadius};
	padding: 2px 4px;
	font-size: ${fontSm};
	color: ${({ $status }) => statusColor[$status]};
	background-color: ${({ $status }) => statusBackgroundColor[$status]};
`;

const ProjectCard = styled(GalleryCard)`
	display: flex;
	flex-direction: column;
	height: auto;
`;

// The poster is a lazy <img>; the video sits on top of it and stays transparent
// until it has frames, so posters below the fold are not fetched up front.
const ProjectMedia = styled.div`
	position: relative;
	aspect-ratio: 16 / 5;
	background-color: ${tertiateBackgroundColor};
	border-bottom: 1px solid ${borderColor};

	& > video,
	& > img {
		position: absolute;
		inset: 0;
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: top;
	}
`;

const ProjectContent = styled(GalleryCardContent)`
	display: flex;
	flex: 1;
	flex-direction: column;
	padding-bottom: 12px;
`;

const ProjectMeta = styled.div`
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 4px 8px;
	margin-top: auto;
	padding-top: 4px;
`;

const CardTag = styled.span`
	font-size: ${fontSm};
	color: ${secondaryBodyTextColor};
	${transitionSm}
`;

const FilterInput = styled.input`
	position: absolute;
	opacity: 0;
	pointer-events: none;
`;

const FilterBar = styled.div`
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 6px;
	margin-top: ${blockMarginLg};
`;

const FilterLabel = styled.label`
	display: inline-flex;
	gap: 5px;
	border: 1px solid ${borderColor};
	border-radius: ${borderRadius};
	padding: 2px 8px;
	font-size: ${fontSm};
	cursor: pointer;
	user-select: none;
	${transitionSm}

	&:hover {
		border-color: ${accentColor};
		color: ${headingTextColor};
	}
`;

const FilterCount = styled.span`
	color: ${tertiaryBodyTextColor};
`;

const FilterDivider = styled.span`
	align-self: stretch;
	width: 1px;
	margin: 2px 4px;
	background-color: ${borderColor};
`;

// Filtering is pure CSS: each tag is a radio input placed before the bar and
// the gallery, so `:checked ~` selectors work without client-side JavaScript.
const Projects = styled.div<{ $tags: string[] }>`
	position: relative;
	width: clamp(70%, 700px, 83.333333%);

	& > ${Gallery} {
		width: 100%;
	}

	${({ $tags }) =>
		["all", ...$tags].map(
			(tag) => css`
				#${filterId(tag)}:checked ~ ${FilterBar} label[for="${filterId(tag)}"] {
					border-color: ${accentColor};
					background-color: ${accentColor};
					color: ${headingTextColor};

					${FilterCount} {
						color: ${headingTextColor};
					}
				}

				#${filterId(tag)}:focus-visible ~ ${FilterBar} label[for="${filterId(tag)}"] {
					outline: 2px solid ${headingTextColor};
					outline-offset: 2px;
				}
			`
		)}

	${({ $tags }) =>
		$tags.map(
			(tag) => css`
				#${filterId(tag)}:checked ~ ${Gallery} > :not([data-tags~="${tag}"]) {
					display: none;
				}

				#${filterId(tag)}:checked ~ ${Gallery} ${CardTag}[data-tag="${tag}"] {
					color: ${headingTextColor};
				}
			`
		)}
`;

const filterId = (tag: string) => `project-tag-${tag}`;

// Topic tags are listed before language tags; each group is sorted by usage.
const languageTags = ["typescript", "javascript", "swift", "rust"];

// The header clip is muted and only plays while its card is hovered or focused.
const hoverPlayScript = `
for (const card of document.querySelectorAll("[data-hover-play]")) {
	const video = card.querySelector("video");
	video.muted = true;
	const play = () => {
		if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		video.play().catch(() => {});
	};
	const stop = () => {
		video.pause();
		video.currentTime = 0;
	};
	card.addEventListener("pointerenter", (event) => {
		if (event.pointerType === "mouse") play();
	});
	card.addEventListener("pointerleave", stop);
	// Taps also focus the link; only keyboard focus should start a clip.
	card.addEventListener("focus", () => {
		if (card.matches(":focus-visible")) play();
	});
	card.addEventListener("blur", stop);
}
`;

function ProjectItem(props: { metadata: ProjectMetadata }) {
	const {
		href,
		github,
		title,
		description,
		header_image_src,
		header_video_src,
		status,
		tags,
	} = props.metadata;
	const cardHref = github ?? href;
	const isExternal = /^https?:\/\//.test(cardHref);
	return (
		<ProjectCard
			href={cardHref}
			data-tags={tags?.join(" ")}
			data-hover-play={header_video_src ? "" : undefined}
			{...(isExternal ? { target: "_blank", rel: "noreferrer" } : {})}
		>
			{header_image_src && (
				<ProjectMedia>
					<PreparedImage
						src={header_image_src}
						alt=""
						loading="lazy"
						decoding="async"
					/>
					{header_video_src && (
						<video
							src={header_video_src}
							muted
							loop
							playsInline
							preload="none"
							disablePictureInPicture
							aria-hidden
						/>
					)}
				</ProjectMedia>
			)}

			<ProjectContent>
				<H3>{title}</H3>
				<P>{description}</P>
				<ProjectMeta>
					<Status $status={status}>{status}</Status>
					{tags?.map((tag) => (
						<CardTag key={tag} data-tag={tag}>
							#{tag}
						</CardTag>
					))}
				</ProjectMeta>
			</ProjectContent>
		</ProjectCard>
	);
}

function TagFilter(props: { tag: string; count: number; label?: string }) {
	return (
		<FilterLabel htmlFor={filterId(props.tag)}>
			{props.label ?? props.tag}
			<FilterCount>{props.count}</FilterCount>
		</FilterLabel>
	);
}

function ProjectsPage(props: PropsType) {
	const { projectMetadatas } = props;
	const counts = new Map<string, number>();
	for (const { tags } of projectMetadatas) {
		for (const tag of tags ?? []) counts.set(tag, (counts.get(tag) ?? 0) + 1);
	}
	const byUsage = [...counts.keys()].sort(
		(a, b) => counts.get(b)! - counts.get(a)! || a.localeCompare(b)
	);
	const topics = byUsage.filter((tag) => !languageTags.includes(tag));
	const languages = byUsage.filter((tag) => languageTags.includes(tag));
	const tags = [...topics, ...languages];

	return (
		<Page>
			<Breadcrumbs />
			<Projects $tags={tags}>
				{["all", ...tags].map((tag) => (
					<FilterInput
						key={tag}
						type="radio"
						name="project-tag"
						id={filterId(tag)}
						value={tag}
						defaultChecked={tag === "all"}
					/>
				))}
				<FilterBar role="group" aria-label="Filter projects by tag">
					<TagFilter tag="all" label="All" count={projectMetadatas.length} />
					{topics.map((tag) => (
						<TagFilter key={tag} tag={tag} count={counts.get(tag)!} />
					))}
					<FilterDivider />
					{languages.map((tag) => (
						<TagFilter key={tag} tag={tag} count={counts.get(tag)!} />
					))}
				</FilterBar>
				<Gallery className="gallery">
					{projectMetadatas.map((metadata) => (
						<ProjectItem
							key={metadata.github ?? metadata.href}
							metadata={metadata}
						/>
					))}
				</Gallery>
			</Projects>
			<script dangerouslySetInnerHTML={{ __html: hoverPlayScript }} />
		</Page>
	);
}

export default ProjectsPage;
