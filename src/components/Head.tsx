import path from "path";
import { usePageContext } from "../server/PageContext";
import { useWebsiteContext } from "../server/WebsiteContext";
import { coreFontURLs, fontCSS } from "../styles/fonts";
import { resolutionFileName } from "../styles/resolutions";
import { borderColor } from "../styles/vars";

export function Head() {
	const { socialImageURL } = useWebsiteContext();
	const { title, href } = usePageContext();

	const { name } = path.parse(socialImageURL);
	const socialUrl = `/${resolutionFileName(name, 640)}`;

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
			<meta property="og:image" content={socialUrl} key="ogimage" />

			<meta name="twitter:card" content="summary_large_image" />
			<meta name="twitter:creator" content="@tanishqk" key="twhandle" />
			<meta name="twitter:title" content="Tanishq Kancharla" />
			<meta
				name="twitter:description"
				content="Tanishq Kancharla's personal website."
			/>
			<meta name="twitter:image" content={socialUrl} />

			{/* https://developer.twitter.com/en/docs/twitter-for-websites/webpage-properties */}
			<meta name="twitter:widgets:theme" content="dark"></meta>
			<meta name="twitter:widgets:border-color" content={borderColor}></meta>
			<meta name="twitter:dnt" content="on"></meta>

			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<meta httpEquiv="Content-Language" content="en" />

			<meta name="author" content="Tanishq Kancharla" />
			<meta name="og:url" content="https://tanishqkancharla.dev" />

			{coreFontURLs.map((url) => (
				<link
					key={url}
					rel="preload"
					href={url}
					as="font"
					type="font/woff2"
					crossOrigin="anonymous"
				/>
			))}
			<style dangerouslySetInnerHTML={{ __html: fontCSS }} />
		</head>
	);
}
