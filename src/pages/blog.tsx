import fs from "fs-extra";
import path from "path";
import React from "react";
import { isDefined, reverse, sortBy } from "remeda";
import { parseTK, TKDoc } from "tk-parser";
import { Article } from "../components/Article";
import { Bookmark } from "../components/blocks/Bookmark";
import { Divider } from "../components/blocks/Divider";
import { P } from "../components/blocks/Paragraph";
import { Page } from "../components/Page";
import { WebsiteContext } from "../config";
import { listDirectory } from "../tools/listDirectory";

type Metadata = {
	title: string;
	description: string;
	date: Date;
	href: string;
};

type PropsType = { postMetadatas: Metadata[] };

function checkMetadata(metadata: TKDoc["metadata"]) {
	if (!metadata.title) throw new Error("Missing title");
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

	return {
		title: metadata.title,
		description: metadata.description,
		date,
	};
}

export async function getStaticProps(
	context: WebsiteContext
): Promise<PropsType> {
	const blogPostsDirPath = path.join(context.postsDir, "blog");
	const blogPostPaths = await listDirectory(blogPostsDirPath);

	const blogPostMetadatas = await Promise.all(
		blogPostPaths.map(async ({ name, isDir }) => {
			if (isDir) return undefined;
			const blogPostPath = path.join(blogPostsDirPath, name);
			const rawContents = await fs.readFile(blogPostPath, "utf8");
			const ast = parseTK(rawContents);

			const metadata = checkMetadata(ast.metadata);

			return { ...metadata, href: `/blog/${name.slice(0, -3)}` };
		})
	);

	return { postMetadatas: blogPostMetadatas.filter(isDefined) };
}

export const title = "Blog";

function Blog(props: PropsType) {
	const { postMetadatas } = props;

	const sortedMetadatas = reverse(sortBy(postMetadatas, (post) => post.date));

	return (
		<Page>
			<Article>
				<P>
					This is my personal blog. It&apos;s still small...but I talk about
					computers, programming, interfaces and myself.
				</P>
				<Divider />
				{sortedMetadatas.map((post) => (
					<Bookmark
						title={post.title}
						url={post.href}
						date={post.date}
						key={post.href}
					>
						<P>{post.description}</P>
					</Bookmark>
				))}
			</Article>
		</Page>
	);
}

export default Blog;
