import React from "react";
import { usePageContext } from "../server/PageContext";
import { useWebsiteContext } from "../server/WebsiteContext";
import { borderColor } from "../styles/vars";

export function Head() {
	const { headerImageURL, outClientJsPath } = useWebsiteContext();
	const { title, href } = usePageContext();

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

			{/* https://developer.twitter.com/en/docs/twitter-for-websites/webpage-properties */}
			<meta name="twitter:widgets:theme" content="dark"></meta>
			<meta name="twitter:widgets:border-color" content={borderColor}></meta>
			<meta name="twitter:dnt" content="on"></meta>

			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<meta httpEquiv="Content-Language" content="en" />

			<meta name="author" content="Tanishq Kancharla" />
			<meta name="og:url" content="https://tanishqkancharla.dev" />

			<script src={outClientJsPath} defer />
			<link rel="preconnect" href="https://fonts.googleapis.com" />
			<link
				rel="preconnect"
				href="https://fonts.gstatic.com"
				crossOrigin="anonymous"
			/>
			<link
				href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;600&display=swap"
				rel="stylesheet"
			/>

			{href === "index" && (
				<script src="https://app.embed.im/snow.js" defer></script>
			)}
		</head>
	);
}
