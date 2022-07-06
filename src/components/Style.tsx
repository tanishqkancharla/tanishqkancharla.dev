import React from "react";
import { useWebsiteContext } from "../server/WebsiteContext";

export const Style = () => {
	const { accentColor } = useWebsiteContext();

	return (
		<style
			dangerouslySetInnerHTML={{
				__html: `
        *, *::after, *::before {
          box-sizing: border-box;
        }

        :root {
          --accent-color: ${accentColor}
        }`,
			}}
		/>
	);
};
