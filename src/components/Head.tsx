import React from "react";
import { usePageContext } from "../PageContext";
import { useWebsiteContext } from "../WebsiteContext";

export function Head() {
	const { headerImageURL } = useWebsiteContext();
	const { title } = usePageContext();
	return (
		<head>
			<title>{`${title}: TK's website`}</title>
			<meta charSet="UTF-8" />

			<meta name="og:title" content={`${title}: TK's website`} />
			<meta name="description" content="Tanishq Kancharla's personal website" />
			<meta
				name="og:description"
				content="Tanishq Kancharla's personal website"
			/>
			<meta property="og:image" content={headerImageURL} key="ogimage" />

			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:creator" content="@moonriseTK" key="twhandle" />
			<meta name="twitter:title" content="Tanishq Kancharla" />
			<meta
				name="twitter:description"
				content="Tanishq Kancharla's personal website."
			/>
			<meta name="twitter:image" content={headerImageURL} />

			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<meta httpEquiv="Content-Language" content="en" />

			<meta name="author" content="Tanishq Kancharla" />
			<meta name="og:url" content="https://tanishqkancharla.dev" />

			<link
				rel="preconnect"
				href="https://fonts.gstatic.com/"
				crossOrigin="anonymous"
			/>
		</head>
	);
}
