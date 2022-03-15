import * as fs from "fs/promises";
import path from "path";
import { compileBlock } from "./compileBlock";
import { parseTK } from "./parser";

export async function compile(args: { postsDir: string; outDir: string }) {
	const { postsDir, outDir } = args;
	const dirItems = await fs.readdir(postsDir);

	const posts = dirItems.filter((path) => path.endsWith(".tk"));

	for (const postName of posts) {
		const contents = await fs.readFile(path.join(postsDir, postName), "utf8");
		const ast = parseTK(contents);
		const compiledPost = compileTKDoc({ ast });
		await fs.writeFile(path.join(outDir, postName), compiledPost, "utf8");
	}
}

function compileTKDoc(args: { ast: ReturnType<typeof parseTK> }): string {
	return args.ast.blocks.map((block) => compileBlock(block)).join("\n");
}
