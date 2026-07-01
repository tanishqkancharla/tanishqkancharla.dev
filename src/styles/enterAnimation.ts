type EnterAnimationOptions = {
	name: string;
	fromTransform: string;
	staggerStep: number;
	maxChildren?: number;
};

export function enterAnimation({
	name,
	fromTransform,
	staggerStep,
	maxChildren = 40,
}: EnterAnimationOptions) {
	const staggerRules = Array.from({ length: maxChildren }, (_, i) => {
		const delay = (i * staggerStep).toFixed(2);
		return `
	& > *:nth-child(${i + 1}) {
		animation-delay: ${delay}s;
	}`;
	}).join("");

	return `
	& > * {
		animation: ${name} 0.35s ease-out backwards;
	}

	${staggerRules}

	@media (prefers-reduced-motion: reduce) {
		& > * {
			animation: none;
			opacity: 1;
			transform: none;
		}
	}

	@keyframes ${name} {
		from {
			opacity: 0;
			transform: ${fromTransform};
		}
		to {
			opacity: 1;
			transform: translate(0, 0) scale(1);
		}
	}
`;
}
