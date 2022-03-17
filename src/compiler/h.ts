// import is from "@sindresorhus/is";

// declare global {
// 	namespace JSX {
// 		interface IntrinsicElements {
// 			[elemName: string]: any;
// 		}
// 	}
// }

// export type Element =
// 	| {
// 			type: ElementTag | FC;
// 			props: {
// 				[key: string]: any;
// 				children: Element[];
// 			};
// 	  }
// 	| {
// 			type: typeof TEXT_ELEMENT;
// 			text: string;
// 	  }
// 	| {
// 			type: typeof FRAGMENT_ELEMENT;
// 			content: Element[];
// 	  };

// export type FC = <P extends object>(
// 	props: P & {
// 		children: Element[];
// 	}
// ) => Element;

// type ElementTag =
// 	| "h1"
// 	| "h2"
// 	| "h3"
// 	| "p"
// 	| "pre"
// 	| "code"
// 	| "hr"
// 	| "ul"
// 	| "li";

// const TEXT_ELEMENT = Symbol();
// const FRAGMENT_ELEMENT = Symbol();

// type ElementType =
// 	| FC
// 	| ElementTag
// 	| typeof FRAGMENT_ELEMENT
// 	| typeof TEXT_ELEMENT;

// function isSelfClosing(tag: ElementTag) {
// 	return tag === "hr";
// }

// export function Fragment(content: { children: Element[] }) {
// 	return {
// 		type: FRAGMENT_ELEMENT,
// 		content: content.children,
// 	};
// }

// function createElement(
// 	type: ElementTag | FC,
// 	attrs?: object | null,
// 	...children: (Element | string)[]
// ): Element {
// 	return {
// 		type,
// 		props: {
// 			...attrs,
// 			children: children
// 				.map((child) => (is.object(child) ? child : createTextElement(child)))
// 				.flat(1),
// 		},
// 	};
// }

// function createTextElement(text: string): Element {
// 	return {
// 		type: TEXT_ELEMENT,
// 		text,
// 	};
// }

// export function render(element: Element): string {
// 	const { type } = element;
// 	if (type === TEXT_ELEMENT) {
// 		return element.text;
// 	} else if (type === FRAGMENT_ELEMENT) {
// 		return element.content.map(render).join("");
// 	} else if (is.string(type)) {
// 		const { props } = element;
// 		const isProperty = (key: string) => key !== "children";
// 		const attrStr = Object.keys(props)
// 			.filter(isProperty)
// 			.map((key) => {
// 				const value = props[key];
// 				return `${key}=${value}`;
// 			})
// 			.join(" ");

// 		if (isSelfClosing(type)) {
// 			return `<${type} ${attrStr}/>`;
// 		}

// 		const openingTag = `<${type} ${attrStr}>`;
// 		const content = props.children.map(render).join("");
// 		const closingTag = `</${type}>`;
// 		return [openingTag, content, closingTag].join("");
// 	} else if (is.function_(type)) {
// 		return render(type(element.props));
// 	} else {
// 		throw new Error(`Unknown type ${type}`);
// 	}
// }

// export const h = createElement;
