import * as fs from "fs/promises";
import path from "path";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Page } from "../components/Page";
import { parseTK } from "../parser/parseTK";

export async function compile(args: { postsDir: string; outDir: string }) {
	const { postsDir, outDir } = args;
	const dirItems = await fs.readdir(postsDir);

	const posts = dirItems.filter((path) => path.endsWith(".tk"));

	for (const postFileName of posts) {
		const contents = await fs.readFile(
			path.join(postsDir, postFileName),
			"utf8"
		);
		const ast = parseTK(contents);

		const renderedPost = renderToStaticMarkup(<Page ast={ast} />);

		const postName = path.parse(postFileName).name;

		await fs.writeFile(
			path.join(outDir, `${postName}.html`),
			renderedPost,
			"utf8"
		);
	}
}
