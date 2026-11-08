// Browser page that scripts/header/render.ts screenshots. Not part of the site.
import { FlutedGlass } from "@paper-design/shaders-react";
import { createRoot } from "react-dom/client";

// The look of the header. Edit these, then rerun the render script.
const glass = {
	colorBack: "#00000000",
	colorShadow: "#000000",
	colorHighlight: "#ffffff",
	size: 0.85,
	shadows: 0.25,
	highlights: 0.1,
	shape: "lines",
	angle: 13,
	distortionShape: "prism",
	distortion: 0.5,
	shift: 0,
	stretch: 0,
	blur: 0,
	edges: 0.25,
	margin: 0,
	grainMixer: 0,
	grainOverlay: 0,
	fit: "cover",
} as const;

async function main() {
	const params = new URLSearchParams(location.search);
	const width = Number(params.get("width"));
	const height = Number(params.get("height"));
	const pixelRatio = Number(params.get("pixelRatio"));

	const image = new Image();
	image.src = params.get("image")!;
	await image.decode();

	const root = document.getElementById("root")!;
	root.style.width = `${width}px`;
	root.style.height = `${height}px`;
	createRoot(root).render(
		<FlutedGlass
			{...glass}
			image={image}
			// Headless Chrome's emulated device scale does not reach the shader,
			// so the render scale comes from minPixelRatio instead.
			minPixelRatio={pixelRatio}
			maxPixelCount={width * height * pixelRatio ** 2}
			webGlContextAttributes={{ preserveDrawingBuffer: true }}
			style={{ width: "100%", height: "100%", display: "block" }}
		/>
	);

	// The shader sizes its canvas from a ResizeObserver, then draws on a frame.
	const frame = () => new Promise(requestAnimationFrame);
	let canvas: HTMLCanvasElement | null = null;
	while (canvas?.width !== width * pixelRatio) {
		await frame();
		canvas = root.querySelector("canvas");
	}
	await frame();
	await frame();
	document.body.dataset.ready = "true";
}

main().catch((error) => {
	document.body.dataset.error = String(error);
});
