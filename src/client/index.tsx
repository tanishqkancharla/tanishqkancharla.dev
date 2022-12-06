import { animate, stagger } from "motion";
import { tsParticles } from "tsparticles-engine";
import { loadSnowPreset } from "tsparticles-preset-snow";
import { backgroundColor } from "../styles/vars";

async function loadSnow() {
	await loadSnowPreset(tsParticles);

	await tsParticles.load("snow", {
		preset: "snow",
		particles: {
			opacity: { value: { min: 0.2, max: 0.5 } },
			size: { value: { min: 2, max: 3 } },
			move: { speed: { min: 0.4, max: 1.2 } },
			number: {
				density: { enable: true },
			},
		},
		style: {
			position: "absolute",
			zIndex: "-1",
		},
		background: { color: backgroundColor },
	});
}

loadSnow();

const article = document.querySelector("article");

if (article) {
	const children = Array.from(article.children);

	animate(
		children,
		{
			transform: ["translate(0, 2rem) scale(0.8)", "none"],
			opacity: [null, 1],
		},
		{ delay: stagger(0.02, { easing: "ease-out" }), duration: 0.35 }
	);
}

const gallery = document.querySelector(".gallery");

if (gallery) {
	const children = Array.from(gallery.children);

	animate(
		children,
		{
			transform: ["translate(0, 2rem)", "none"],
			opacity: [null, 1],
		},
		{ delay: stagger(0.04, { easing: "ease-out" }), duration: 0.35 }
	);
}
