import { createRoot } from "react-dom/client";
import { HeaderShader } from "./HeaderShader";

function prefersReducedMotion() {
	return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function hasWebGL() {
	try {
		const canvas = document.createElement("canvas");
		return !!canvas.getContext("webgl2");
	} catch {
		return false;
	}
}

function revealHeaderImages() {
	const show = (img: HTMLImageElement) => img.classList.add("loaded");
	for (const img of document.querySelectorAll<HTMLImageElement>(".header-img")) {
		if (img.complete) show(img);
		else img.addEventListener("load", () => show(img), { once: true });
	}
}

function mountHeaderShaders() {
	if (prefersReducedMotion() || !hasWebGL()) return;

	for (const mountPoint of document.querySelectorAll<HTMLElement>(
		".header-shader-root"
	)) {
		const image = mountPoint.dataset.image;
		const container = mountPoint.closest<HTMLElement>(".header-image");
		if (!image || !container) continue;

		const root = createRoot(mountPoint);
		root.render(<HeaderShader image={image} />);
		container.classList.add("header-shader-active");
	}
}

revealHeaderImages();
mountHeaderShaders();
