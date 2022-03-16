import * as fs from "fs/promises";
import path from "path";
import { parseTK } from ".";
import { compileBlock } from "./compileBlock";

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
		const compiledPost = compileTKDoc({ ast });
		const postName = path.parse(postFileName).name;
		await fs.writeFile(
			path.join(outDir, `${postName}.html`),
			compiledPost,
			"utf8"
		);
	}
}

function compileTKDoc(args: { ast: ReturnType<typeof parseTK> }): string {
	return args.ast.blocks.map((block) => compileBlock(block)).join("\n");
}
