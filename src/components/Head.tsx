// import React, { useContext, useEffect } from "react";

import React from "react";

// type MetaAttrs = Record<string, string>;

// const MetaContext = React.createContext<MetaAttrs[]>([]);

// export const MetaContextProvider: React.FC = ({ children }) => {
// 	return <MetaContext.Provider value={}></MetaContext.Provider>;
// };

// export function useMeta(metaAttrs: MetaAttrs) {
// 	const metaValues = useContext(MetaContext);
// 	useEffect(() => {
// 		metaValues.push(metaAttrs);
// 		return () => {
// 			const index = metaValues.indexOf(metaAttrs);
// 			if (index < 0) return;
// 			metaValues.splice(index, 1);
// 		};
// 	}, []);
// }

export function Head() {
	return (
		<head>
			<title>Title</title>
			<meta charSet="UTF-8" />
			<link rel="stylesheet" type="text/css" href="/style.css" />

			<meta name="og:title" content="Title" />
			<meta name="description" content="Description" />
			<meta name="og:description" content="Description" />

			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:site" content="@moonriseTK" />

			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<meta httpEquiv="Content-Language" content="en" />

			<meta name="author" content="Tanishq Kancharla" />
			<meta name="og:url" content="https://moonrise.tk" />
		</head>
	);
}
