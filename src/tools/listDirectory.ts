import fs from "fs-extra";
import { isDefined } from "remeda";

export type ListDirectoryResult = { name: string; isDir: boolean };

export async function listDirectory(
	dirPath: string
): Promise<ListDirectoryResult[]> {
	let items: fs.Dirent[] = [];
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
