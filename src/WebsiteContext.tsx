import React, { useContext } from "react";
import { defaultWebsiteContext } from "./config";

export type WebsiteContext = {
	headerImageURL: string;
	headerImageAlt: string;
	headerImageCredits: string;
	postsDir: string;
	outDir: string;
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
