import * as path from "path";

export function rootPath(arg: string) {
	return path.join(__dirname, "../..", arg);
}
