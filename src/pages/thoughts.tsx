import fs from "fs-extra";
import path from "path";
import React from "react";
import { isDefined } from "remeda";
import styled from "styled-components";
import { Article } from "../components/Article";
import { P } from "../components/blocks/Paragraph";
import { Page } from "../components/Page";
import { parseTK, TKMetadata } from "../server/parser/parseTK";
import {
	accentColor,
	blockMargin,
	bodyTextColor,
	borderColor,
	secondaryBodyTextColor,
	transitionSm,
} from "../styles/vars";
import { listDirectory } from "../tools/listDirectory";
import { rootPath } from "../tools/rootPath";
import { sortByDate } from "../utils/typeUtils";

type ThoughtMetadata = TKMetadata & { href: string };

type PropsType = { metadatas: ThoughtMetadata[] };

export async function getStaticProps(): Promise<PropsType> {
	const thoughtPostsDirPath = rootPath("src/pages/thoughts");
	const thoughtPostPaths = await listDirectory(thoughtPostsDirPath);
	const thoughtPostMetadatas = await Promise.all(
		thoughtPostPaths.map(async (result) => {
			if (result.isDir) return undefined;
			const thoughtPostPath = path.join(thoughtPostsDirPath, result.name);
			const rawContents = await fs.readFile(thoughtPostPath, "utf8");
			const { metadata } = parseTK(rawContents);
			if (!metadata) return undefined;

			return { ...metadata, href: `/thoughts/${result.name.slice(0, -3)}` };
		})
	);

	return { metadatas: thoughtPostMetadatas.filter(isDefined) };
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

const StyledThoughtsRow = styled.a`
	color: ${bodyTextColor};
	display: block;

	padding: 5px;
	font-weight: 400;
	border-top: solid ${borderColor} 1.5px;
	border-bottom: solid transparent 1.5px;

	display: flex;
	flex-direction: row;
	align-items: center;

	:last-child {
		border-bottom: solid ${borderColor} 1.5px;
	}

	text-decoration: none;

	${transitionSm}

	:hover {
		cursor: pointer;
		border-color: ${accentColor};
		color: ${accentColor};
	}

	:focus {
		outline: none;
		border-color: ${accentColor};
	}
`;

const StyledThoughtsTable = styled.div`
	margin-top: ${blockMargin};
	width: 100%;
	border-spacing: 0;
	color: ${bodyTextColor};

	${StyledThoughtsRow} {
		background-color: rgba(0, 0, 0, 0.3);
		box-shadow: inset 0 0 12px 1px rgba(0, 0, 0, 0.6);
	}
`;

function DateItem(props: { date: TKMetadata["date"] }) {
	const date = new Date(props.date.year, props.date.month - 1);
	return (
		<>
			{date.toLocaleDateString("en", {
				year: "numeric",
				month: "long",
			})}
		</>
	);
}

function ThoughtsDBRow(props: ThoughtMetadata) {
	const { href, title, date } = props;

	return (
		<StyledThoughtsRow href={href} role={"row"}>
			<ThoughtsRowName>{title}</ThoughtsRowName>
			<ThoughtsRowDate>
				<DateItem date={date} />
			</ThoughtsRowDate>
		</StyledThoughtsRow>
	);
}

function Thoughts(props: PropsType) {
	const { metadatas } = props;

	return (
		<Page>
			<Article>
				<P id="thoughts-table-desc">
					This is my personal table for thoughts: a collection of whims,
					half-baked ideas, and streams of consciousness.
				</P>
				<StyledThoughtsTable
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
					{sortByDate(metadatas).map((post, i) => (
						<ThoughtsDBRow {...post} key={i} />
					))}
				</StyledThoughtsTable>
			</Article>
		</Page>
	);
}

export default Thoughts;
