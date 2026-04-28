import fs from "node:fs/promises";
import type { Dirent } from "node:fs";
import { isDefined } from "../utils/typeUtils";

export type ListDirectoryResult = { name: string; isDir: boolean };

export async function listDirectory(
	dirPath: string
): Promise<ListDirectoryResult[]> {
	let items: Dirent[] = [];
	try {
		items = await fs.readdir(dirPath, { withFileTypes: true });
	} catch (error) {}
	return items
		.map((item) =>
			item.isDirectory()
				? { name: item.name, isDir: true }
				: item.isFile()
				? { name: item.name, isDir: false }
				: undefined
		)
		.filter(isDefined);
}
