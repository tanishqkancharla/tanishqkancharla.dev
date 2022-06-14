import React, { useContext } from "react";
import { defaultWebsiteContext, WebsiteContext } from "../config";

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
