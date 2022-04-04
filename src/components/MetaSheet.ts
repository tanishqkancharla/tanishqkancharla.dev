// import React from "react";

// type MetaAttrs = Record<string, string>;

// class MetaSheetManager {
// 	private metaAttrs: Record<string, string>[];

// 	constructor() {
// 		this.metaAttrs = {};
// 	}

// 	// addMetaTag(record: Record<string, string>) {}
// }

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
