import React, { useContext } from "react";

export type PageContext = {
	href: string;
};

const PageContext = React.createContext<PageContext | undefined>(undefined);

export function usePageContext() {
	const context = useContext(PageContext);
	if (!context) {
		throw new Error("Page context not found");
	}
	return context;
}

export function PageContextProvider(props: {
	value: PageContext;
	children: React.ReactElement;
}) {
	return (
		<PageContext.Provider value={props.value}>
			{props.children}
		</PageContext.Provider>
	);
}
