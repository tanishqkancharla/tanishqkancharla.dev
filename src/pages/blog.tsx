import fs from "fs-extra";
import path from "path";
import React from "react";
import { isDefined } from "remeda";
import { Article } from "../components/Article";
import { Bookmark } from "../components/blocks/Bookmark";
import { Divider } from "../components/blocks/Divider";
import { P } from "../components/blocks/Paragraph";
import { Page } from "../components/Page";
import { parseTK, TKMetadata } from "../parser/parseTK";
import { listDirectory } from "../tools/listDirectory";
import { rootPath } from "../tools/rootPath";
import { WebsiteContext } from "../WebsiteContext";

type Metadata = TKMetadata & { href: string };

type PropsType = { postMetadatas: Metadata[] };

export async function getStaticProps(
	context: WebsiteContext
): Promise<PropsType> {
	const blogPostsDirPath = rootPath("src/pages/blog");
	const blogPostPaths = await listDirectory(blogPostsDirPath);
	const blogPostMetadatas = await Promise.all(
		blogPostPaths.map(async (result) => {
			if (result.isDir) return undefined;
			const blogPostPath = path.join(blogPostsDirPath, result.name);
			const rawContents = await fs.readFile(blogPostPath, "utf8");
			const { metadata } = parseTK(rawContents);

			return { ...metadata, href: `/blog/${result.name.slice(0, -3)}` };
		})
	);

	return { postMetadatas: blogPostMetadatas.filter(isDefined) };
}

function Blog(props: PropsType) {
	const { postMetadatas } = props;

	return (
		<Page title="Blog">
			<Article>
				<P>
					Moonrise is my personal blog. It&apos;s still small...but I talk about
					computers, programming, interfaces and myself.
				</P>
				<Divider />
				{postMetadatas
					.sort((a, b) => {
						if (a.date.year !== b.date.year) return b.date.year - a.date.year;
						else return b.date.month - a.date.month;
					})
					.map((post, i) => (
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
