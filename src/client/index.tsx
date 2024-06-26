import { animate, stagger } from "motion";

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
