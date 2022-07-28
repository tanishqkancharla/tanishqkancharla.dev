import fs from "fs-extra";
import path from "path";
import React from "react";
import { isDefined, reverse, sortBy } from "remeda";
import styled from "styled-components";
import { parseTK, TKDoc } from "tk-parser";
import { Article } from "../components/Article";
import { P } from "../components/blocks/Paragraph";
import { Page } from "../components/Page";
import { StyledRow, StyledTable } from "../components/StyledTable";
import { secondaryBodyTextColor } from "../styles/vars";
import { listDirectory } from "../tools/listDirectory";
import { rootPath } from "../tools/rootPath";

type Metadata = {
	title: string;
	description: string;
	date: Date;
	// tags: string[];

	href: string;
};

type PropsType = { postMetadatas: Metadata[] };

function checkMetadata(metadata: TKDoc["metadata"]) {
	if (!metadata.title) throw new Error(`Missing title ${metadata}`);
	if (Array.isArray(metadata.title))
		throw new Error("Expected title to be string");

	if (!metadata.description) throw new Error("Missing description");
	if (Array.isArray(metadata.description))
		throw new Error("Expected description to be string");

	if (!metadata.date) throw new Error("Missing date");
	if (Array.isArray(metadata.date))
		throw new Error("Expected date to be string");
	const date = new Date(metadata.date);
	if (date.toString() === "Invalid Date")
		throw new Error(`Date ${metadata.date} was malformed`);

	// if (!metadata.tags) throw new Error("Missing tags");
	// if (!Array.isArray(metadata.tags))
	// 	throw new Error("Expected tags to be string array");

	return {
		title: metadata.title,
		description: metadata.description,
		date,
	};
}

export async function getStaticProps(): Promise<PropsType> {
	const thoughtPostsDirPath = rootPath("src/pages/thoughts");
	const thoughtPostPaths = await listDirectory(thoughtPostsDirPath);

	const thoughtPostMetadatas = await Promise.all(
		thoughtPostPaths.map(async (result) => {
			if (result.isDir) return undefined;
			const thoughtPostPath = path.join(thoughtPostsDirPath, result.name);
			const rawContents = await fs.readFile(thoughtPostPath, "utf8");
			const ast = parseTK(rawContents);

			const metadata = checkMetadata(ast.metadata);

			if (!metadata) return undefined;

			return { ...metadata, href: `/thoughts/${result.name.slice(0, -3)}` };
		})
	);

	return { postMetadatas: thoughtPostMetadatas.filter(isDefined) };
}

export const title = "Thoughts";

const ThoughtsRowName = styled.div`
	width: 65%;
`;

const ThoughtsRowDate = styled.div`
	flex: 1 1 auto;
`;

const ThoughtsHeader = styled.div`
	text-align: left;
	font-weight: normal;

	display: flex;
	flex-direction: row;
	align-items: center;

	color: ${secondaryBodyTextColor};

	padding: 5px;
`;

const dateFormatter = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });

function ThoughtsDBRow(props: Metadata) {
	const { href, title, date } = props;

	return (
		<StyledRow href={href} role={"row"}>
			<ThoughtsRowName>{title}</ThoughtsRowName>
			<ThoughtsRowDate>{dateFormatter.format(date)}</ThoughtsRowDate>
		</StyledRow>
	);
}

function Thoughts(props: PropsType) {
	const { postMetadatas } = props;

	const sortedMetadatas = reverse(sortBy(postMetadatas, (post) => post.date));

	return (
		<Page>
			<Article>
				<P>
					This is my personal table for thoughts: a collection of whims,
					half-baked ideas, and streams of consciousness.
				</P>
				<StyledTable
					aria-label="Thoughts"
					aria-describedby="thoughts-table-desc"
					role={"table"}
				>
					<div role="row">
						<ThoughtsHeader role="columnheader">
							<ThoughtsRowName role="columnheader">Name</ThoughtsRowName>
							<ThoughtsRowDate role="columnheader">Date</ThoughtsRowDate>
						</ThoughtsHeader>
					</div>
					{sortedMetadatas.map((post, i) => (
						<ThoughtsDBRow {...post} key={i} />
					))}
				</StyledTable>
			</Article>
		</Page>
	);
}

export default Thoughts;
