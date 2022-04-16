import * as path from "path";
import { listDirectory } from "./listDirectory";

export async function* crawlDirectory(dirPath: string): AsyncIterable<string> {
	const children = await listDirectory(dirPath);
	for (const child of children) {
		const childPath = path.join(dirPath, child.name);
		if (child.isDir) {
			yield* await crawlDirectory(childPath);
		} else {
			yield childPath;
		}
	}
}
