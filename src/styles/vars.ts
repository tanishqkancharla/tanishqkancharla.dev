export const accentColor = "var(--accent-color)";

export const backgroundColor = "rgba(32, 32, 32, 1)";
export const secondaryBackgroundColor = "rgba(57, 57, 57, 1)";
export const tertiateBackgroundColor = "rgba(25, 25, 25, 1)";
export const transparentBackground = "rgba(36, 36, 36, 0.15)";

export const headingTextColor = "rgba(250, 250, 250, 1)";
export const secondaryHeadingTextColor = "rgba(250, 250, 250, 1)";
export const bodyTextColor = "rgba(171, 171, 171, 1)";
export const secondaryBodyTextColor = "rgba(135, 135, 135, 1)";
export const tertiaryBodyTextColor = "rgba(89, 89, 89, 1)";

export const blockMargin = "0.3rem";
export const blockMarginLg = "0.5rem";

export const fontSm = "85%";

export const borderColor = "rgb(82, 82, 82)";
export const secondaryBorderColor = "white";

export const borderRadius = "0.25rem";

export const borderWidth = "2px";

export const articleWidth = "clamp(40%, 540px, 83.33333%)";

export const galleryWidth = "clamp(66.7%, 700px, 83.33333%)";

export const transitionDurationSm = "110ms";
export const transitionDurationLg = "270ms";

export const transitionSm = `
transition-property: background-color, border-color, color, fill, stroke,
opacity, box-shadow, transform;
transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
transition-duration: ${transitionDurationSm};`;

export const transitionLg = `
transition-property: background-color, border-color, color, fill, stroke,
opacity, box-shadow, transform;
transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
transition-duration: ${transitionDurationLg};`;

export const shadowMd = `
box-shadow: 0.4px 0.5px 0.6px hsl(0deg 0% 4% / 0.56),
    1px 1.2px 1.4px -1.3px hsl(0deg 0% 4% / 0.46),
    3.2px 3.6px 4.4px -2.6px hsl(0deg 0% 4% / 0.36),
    8.6px 9.8px 12px -3.8px hsl(0deg 0% 4% / 0.27);`;
