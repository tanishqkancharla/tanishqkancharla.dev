import React, { useContext } from "react";
import { rootPath } from "./tools/rootPath";

export type WebsiteContext = {
	headerImageURL: string;
	postsDir: string;
	outDir: string;
};

export const defaultWebsiteContext: WebsiteContext = {
	postsDir: rootPath("/src/pages//"),
	outDir: rootPath("/dist/"),
	headerImageURL: "/newyork.webp",
};

const WebsiteContext = React.createContext<WebsiteContext>(
	defaultWebsiteContext
);

export function useWebsiteContext() {
	return useContext(WebsiteContext);
}

export function WebsiteContextProvider(props: {
	value: WebsiteContext;
	children: React.ReactElement;
}) {
	return (
		<WebsiteContext.Provider value={props.value}>
			{props.children}
		</WebsiteContext.Provider>
	);
}
