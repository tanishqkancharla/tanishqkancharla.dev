import React, { useMemo, useRef } from "react";
import { tkParser } from "tk-parser";
import { ReactFS, useDirectory, useFile } from "../tools/ReactFS";
import { rootPath } from "../tools/rootPath";

function BuildTkPost(props: { path: string }) {
	const postContents = useFile(props.path);
	const prevAsyncDataValues = useRef<any[] | undefined>(undefined);

	const parsedContents = useMemo(
		() => tkParser.run(postContents),
		[postContents]
	);

	const asyncDataValues = useMemo(() => {}, [parsedContents]);
}

function BuildTKPosts(props: { dirPath: string }) {
	const dirItems = useDirectory(props.dirPath);

	return null;
}

function BuildWebsite() {
	return (
		<>
			<BuildTKPosts dirPath="." />
		</>
	);
}

export const build = () =>
	ReactFS.build(<BuildWebsite />, rootPath("src/pages"), rootPath("dist"));

export const dev = () =>
	ReactFS.dev(<BuildWebsite />, "../pages/", "../../dist");
