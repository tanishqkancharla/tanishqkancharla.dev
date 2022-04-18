export const accentColor = "#e68058";
export const backgroundColor = "rgba(32, 32, 32, 1)";
export const secondaryBackgroundColor = "rgba(57, 57, 57, 1)";
export const transparentBackground = "rgba(36, 36, 36, 0.15)";

export const headingTextColor = "rgba(250, 250, 250, 1)";
export const bodyTextColor = "rgba(171, 171, 171, 1)";
export const secondaryBodyTextColor = "rgba(135, 135, 135, 1)";

export const borderColor = "rgb(82, 82, 82)";
export const secondaryBorderColor = "white";

export const pageWidth = "clamp(40%, 540px, 83.33333%)";

// --sm-width: 83.33333%;
// --md-width: max(75%, 450px);
// --lg-width: 50%;
// --xl-width: max(40%, 450px);

export const transitionDurationSm = "110ms";
export const transitionDurationLg = "450ms";

export const transitionSm = `
transition-property: background-color, border-color, color, fill, stroke,
opacity, box-shadow, transform;
transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
transition-duration: ${transitionDurationSm};`;
